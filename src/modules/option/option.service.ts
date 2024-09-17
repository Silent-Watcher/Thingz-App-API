import Service from '$app/interfaces/service.interface';
import type { Types } from 'mongoose';
import httpErrors from 'http-errors';

import optionModel, { type Option } from './option.model';
import slugify from 'slugify';
import optionMessages from './option.messages';

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
    if (
      await this.checkIfTheKeyValueRelatedToCategoryIsDuplicated(optionDto.key, optionDto.category)
    )
      throw new httpErrors.Conflict(optionMessages.duplicateKeyValue(optionDto.key));

    // optimize enum given value
    if (optionDto?.enum && typeof optionDto.enum == 'string') {
      optionDto.enum = optionDto.enum.split(',');
    } else if (!Array.isArray(optionDto.enum) && typeof optionDto.enum != 'string') {
      optionDto.enum = [];
    }

    return this.model.create(optionDto);
  }

  async findByCategoryId(categoryId: string | Types.ObjectId) {
    return this.model.find({ category: categoryId });
  }

  async find(optionId: string | Types.ObjectId) {
    return this.model.findById(optionId);
  }

  async checkIfTheKeyValueRelatedToCategoryIsDuplicated(
    key: string,
    categoryId: string | Types.ObjectId,
  ) {
    const foundedOption = await this.model.find({ key, category: categoryId });
    return foundedOption ? true : false;
  }
}

export default new OptionService();
