import Service from '$app/interfaces/service.interface';
import httpErrors from 'http-errors';
import type { Types } from 'mongoose';

import slugify from 'slugify';
import optionMessages from './option.messages';
import optionModel, { type Option } from './option.model';

class OptionService extends Service {
  private model;

  constructor() {
    super();
    this.model = optionModel;
  }

  async create(optionDto: Option) {
    // slugify the key value
    optionDto.key = slugify(optionDto.key, {
      trim: true,
      replacement: '_',
      lower: true,
    });
    // check for duplicate key value
    const isKeyDuplicate =
      await this.checkIfTheKeyValueRelatedToCategoryIsDuplicated(
        optionDto.key,
        optionDto.category,
      );

    if (isKeyDuplicate)
      throw new httpErrors.Conflict(
        optionMessages.duplicateKeyValue(optionDto.key),
      );

    // optimize enum given value
    if (optionDto?.enum && typeof optionDto.enum == 'string') {
      optionDto.enum = optionDto.enum.split(',');
    } else if (
      !Array.isArray(optionDto.enum) &&
      typeof optionDto.enum != 'string'
    ) {
      optionDto.enum = [];
    }

    return this.model.create(optionDto);
  }

  async findByCategoryId(categoryId: string | Types.ObjectId) {
    return this.model
      .find({ category: categoryId })
      .populate([{ path: 'category', select: { name: 1, slug: 1 } }])
      .lean()
      .exec();
  }

  async find(optionId: string | Types.ObjectId) {
    return await this.model
      .findById(optionId)
      .populate([{ path: 'category', select: { name: 1, slug: 1 } }])
      .lean()
      .exec();
  }

  async findByCategorySlug(slug: string) {
    return this.model.aggregate([
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'category',
        },
      },
      {
        $unwind: '$category',
      },
      {
        $addFields: {
          categorySlug: '$category.slug',
          categoryName: '$category.name',
          categoryIcon: '$category.icon',
        },
      },
      {
        $match: {
          categorySlug: slug,
        },
      },
      {
        $project: {
          category: 0,
        },
      },
    ]);
  }

  async getAll() {
    return await this.model.find({});
  }

  async checkIfTheKeyValueRelatedToCategoryIsDuplicated(
    key: string,
    categoryId: string | Types.ObjectId,
  ) {
    const foundedOption = await this.model.findOne({
      key,
      category: categoryId,
    });
    return foundedOption ? true : false;
  }
  async checkIfTheUpdatedKeyValueRelatedToCategoryIsDuplicated(
    key: string,
    categoryId: string | Types.ObjectId,
  ) {
    const foundedOption = await this.model.findOne({
      key: { $ne: key },
      category: categoryId,
    });
    return foundedOption ? true : false;
  }

  async deleteById(id: string | Types.ObjectId) {
    return this.model.deleteOne({ _id: id });
  }

  async update(id: string | Types.ObjectId, optionDto: Option) {
    // key title type enum guide isRequired
    // check if the new key value would perform conflict and if not slugify
    if (optionDto?.key) {
      optionDto.key = slugify(optionDto.key, {
        trim: true,
        replacement: '_',
        lower: true,
      });
      // check for duplicate key value
      const isKeyDuplicate =
        await this.checkIfTheUpdatedKeyValueRelatedToCategoryIsDuplicated(
          optionDto.key,
          optionDto.category,
        );

      if (isKeyDuplicate)
        throw new httpErrors.Conflict(
          optionMessages.duplicateKeyValue(optionDto.key),
        );
    }
    // optimize the enum value
    if (optionDto?.enum && typeof optionDto.enum == 'string') {
      optionDto.enum = optionDto.enum.split(',');
    } else if (
      !Array.isArray(optionDto.enum) &&
      typeof optionDto.enum != 'string'
    ) {
      optionDto.enum = [];
    }

    return this.model.updateOne(
      { _id: id, category: optionDto.category },
      { $set: { ...optionDto } },
    );
  }

  async checkIfTheOptionExistsWithGivenId(id: string | Types.ObjectId) {
    const foundedOption = await this.model.findById(id, { _id: 1 }).lean();
    return foundedOption ? true : false;
  }

  async checkIfTheOptionExistsWithinACategory(
    optionID: string | Types.ObjectId,
    categoryId: string | Types.ObjectId,
  ) {
    const foundedOption = await this.model.find({
      _id: optionID,
      category: categoryId,
    });
    return foundedOption ? true : false;
  }
}

export default new OptionService();
