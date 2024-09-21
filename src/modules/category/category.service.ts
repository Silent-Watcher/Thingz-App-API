import Service from '$app/interfaces/service.interface';
import httpErrors from 'http-errors';
import { Types, isValidObjectId } from 'mongoose';
import slugify from 'slugify';
import categoryModel, { type Category } from './category.model';
import categoryMessages from './category.messages';
import optionModel from '$modules/option/option.model';

class CategoryService extends Service {
  private model;
  private optionModel;
  constructor() {
    super();
    this.model = categoryModel;
    this.optionModel = optionModel;
  }
  async create(categoryDto: Category) {
    // set the parent and parents value for category if the parent id is provided
    if (categoryDto?.parent && isValidObjectId(categoryDto.parent)) {
      const foundedParentCategory = await this.checkIfTheParentExists(
        categoryDto.parent,
      );
      const parents = [
        ...new Set(
          [(foundedParentCategory._id as Types.ObjectId).toString()]
            .concat(
              (foundedParentCategory.parents as Types.ObjectId[]).map((id) =>
                (id as Types.ObjectId).toString(),
              ),
            )
            .map((id) => new Types.ObjectId(id)),
        ),
      ];
      categoryDto.parent = foundedParentCategory._id;
      categoryDto.parents = parents;
    }

    // slugify the given slug value
    if (!categoryDto?.slug)
      categoryDto.slug = slugify(categoryDto.name, { trim: true });
    else {
      await this.checkIfTheSlugIsAlreadyExists(categoryDto.slug);
      categoryDto.slug = slugify(categoryDto.slug);
    }

    return this.model.create(categoryDto);
  }

  async checkIfTheParentExists(id: Types.ObjectId | string): Promise<Category> {
    const parentCategory: Category | null = await categoryModel.findById(id, {
      _id: 1,
      parents: 1,
    });
    if (!parentCategory)
      throw new httpErrors.NotFound(`parent category with id ${id} not found`);
    return parentCategory;
  }

  async checkIfTheSlugIsAlreadyExists(slug: string) {
    const foundedCategory = await categoryModel
      .findOne({ slug }, { slug: 1 })
      .lean();
    if (foundedCategory)
      throw new httpErrors.Conflict('the given slug is already defined!');
  }

  async checkIfTheCategoryExists(categoryId: string | Types.ObjectId) {
    const foundedCategory = await this.model
      .findById(categoryId, { _id: 1, parents: 0, parent: 0, children: 0 })
      .lean();
    return foundedCategory ? true : false;
  }

  async delete(id: string | Types.ObjectId) {
    // check if the category exists
    const foundedCategory = await this.checkIfTheCategoryExists(id);
    if (!foundedCategory)
      throw new httpErrors.NotFound(categoryMessages.notFoundWithId);

    // remove all related children options
    const childrenCategories = await this.model
      .find({ parents: { $in: [id] } }, { _id: 1 })
      .lean();

    // biome-ignore lint/style/useConst: <explanation>
    let childrenCategoriesID: (string | Types.ObjectId)[] = [id];

    childrenCategories.forEach((document) => {
      return childrenCategoriesID.push(document._id);
    });

    // remove all related options include the target category option
    await this.optionModel.deleteMany({
      category: { $in: childrenCategoriesID },
    });

    // remove all related children
    await this.model.deleteMany({ parents: { $in: [id] } });

    return this.model.deleteOne({ _id: id }).exec();
  }
}

export default new CategoryService();
