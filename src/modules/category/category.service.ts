import Service from '$app/interfaces/service.interface';
import httpErrors from 'http-errors';
import { Types, isValidObjectId } from 'mongoose';
import slugify from 'slugify';
import categoryModel, { type Category } from './category.model';

class CategoryService extends Service {
  private model;
  constructor() {
    super();
    this.model = categoryModel;
  }
  async create(categoryDto: Category) {
    // set the parent and parents value for category if the parent id is provided
    if (categoryDto?.parent && isValidObjectId(categoryDto.parent)) {
      const foundedParentCategory = await this.checkIfTheParentExists(categoryDto.parent);
      const parents = [
        ...new Set(
          [foundedParentCategory._id.toString()]
            .concat(foundedParentCategory.parents.map((id) => (id as Types.ObjectId).toString()))
            .map((id) => new Types.ObjectId(id)),
        ),
      ];
      categoryDto.parent = foundedParentCategory._id;
      categoryDto.parents = parents;
    }

    // slugify the given slug value
    if (!categoryDto?.slug) categoryDto.slug = slugify(categoryDto.name, { trim: true });
    else {
      await this.checkIfTheSlugIsAlreadyExists(categoryDto.slug);
      categoryDto.slug = slugify(categoryDto.slug);
    }

    return this.model.create(categoryDto);
  }

  async checkIfTheParentExists(id: Types.ObjectId | string): Promise<Category> {
    const parentCategory: Category | null = await categoryModel.findById(id);
    if (!parentCategory) throw new httpErrors.NotFound(`parent category with id ${id} not found`);
    return parentCategory;
  }

  async checkIfTheSlugIsAlreadyExists(slug: string) {
    const foundedCategory = await categoryModel.findOne({ slug });
    if (foundedCategory) throw new httpErrors.Conflict('the given slug is already defined!');
  }

  async checkIfTheCategoryExists(categoryId: string | Types.ObjectId) {
    const foundedCategory = await this.model.findById(categoryId, { _id: 1 }).lean();
    return foundedCategory ? true : false;
  }
}

export default new CategoryService();
