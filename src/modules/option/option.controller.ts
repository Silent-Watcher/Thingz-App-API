import { isFalse, isTrue } from '$app/common/utils/boolean.utils';
import Controller from '$app/interfaces/controller.interface';
import categoryService from '$modules/category/category.service';
import type { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import categoryMessages from '../category/category.messages';
import { zCategory } from '../category/category.model';
import optionMessages from './option.messages';
import { type Option, zOption } from './option.model';
import optionService from './option.service';

class OptionController extends Controller {
  private service;
  private categoryService: typeof categoryService;

  constructor() {
    super();
    this.service = optionService;
    this.categoryService = categoryService;
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const optionDto: Option = req.body;

      // check for minimum requirements
      if (
        !optionDto?.category ||
        !optionDto?.key ||
        !optionDto?.type ||
        !optionDto?.title
      )
        return res.status(httpStatus.NOT_ACCEPTABLE).send({
          status: res.statusCode,
          error: {
            code: 'not acceptable',
            message: optionMessages.dataNotProvided,
          },
        });

      if (isTrue(optionDto.isRequired as string | boolean))
        optionDto.isRequired = true;
      if (isFalse(optionDto.isRequired as string | boolean))
        optionDto.isRequired = false;

      // new option data validation
      zOption.parse(optionDto);

      // check if the category exists with given id
      const isCategoryExists =
        await this.categoryService.checkIfTheCategoryExists(optionDto.category);
      if (!isCategoryExists)
        return res.status(httpStatus.NOT_FOUND).send({
          status: res.statusCode,
          code: 'NOT FOUND',
          error: {
            message: `category with given id not found!`,
          },
        });

      await this.service.create(optionDto);

      return res.status(httpStatus.CREATED).send({
        status: res.statusCode,
        code: 'created',
        message: `option ${req.body.key} created successfully!`,
      });
    } catch (error) {
      next(error);
    }
  }

  async findByCategoryId(req: Request, res: Response, next: NextFunction) {
    try {
      const { categoryId } = req.params;

      //category id data validation
      zOption.shape.category.parse(categoryId);

      const options = await this.service.findByCategoryId(categoryId as string);

      if (!options) {
        return res.status(httpStatus.NOT_FOUND).send({
          status: res.statusCode,
          code: 'NOT FOUND',
          error: {
            message: `options for category with id ${categoryId} not defined`,
          },
        });
      }

      return res.status(httpStatus.OK).send({
        status: res.statusCode,
        code: 'OK',
        options,
      });
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const { optionId } = req.params;

      // option id data validation
      zOption.shape._id.parse(optionId);

      const option = await this.service.find(optionId);

      if (!option) {
        return res.status(httpStatus.NOT_FOUND).send({
          status: res.statusCode,
          code: 'NOT FOUND',
          error: {
            message: `option with id ${optionId} not found`,
          },
        });
      }

      return res.status(httpStatus.OK).send({
        status: res.statusCode,
        code: 'OK',
        option,
      });
    } catch (error) {
      next(error);
    }
  }

  async findByCategorySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { categorySlug } = req.params;

      // categorySlug data validation
      zCategory.shape.slug.parse(categorySlug);

      const options = await this.service.findByCategorySlug(categorySlug);

      return res.status(httpStatus.OK).send({
        status: res.statusCode,
        code: 'OK',
        options,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const options = await this.service.getAll();
      return res.status(httpStatus.OK).send({
        status: res.statusCode,
        code: 'OK',
        options,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteById(req: Request, res: Response, next: NextFunction) {
    try {
      const { optionId } = req.params;

      // categorySlug data validation
      zOption.shape._id.parse(optionId);

      const result = await this.service.deleteById(optionId);
      if (!result.deletedCount)
        return res.status(httpStatus.NOT_FOUND).send({
          status: res.statusCode,
          code: 'NOT FOUND',
          error: {
            message: optionMessages.notFound,
          },
        });

      return res.status(httpStatus.OK).send({
        status: res.statusCode,
        code: 'OK',
        message: optionMessages.deleted,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { optionId: id } = req.params;
      const optionDto: Option = req.body;

      // check for minimum requirements
      if (! optionDto?.category || !id)
        return res.status(httpStatus.NOT_ACCEPTABLE).send({
          status: res.statusCode,
          error: {
            code: 'not acceptable',
            message: optionMessages.dataNotProvided,
          },
        });

      // optimize the isRequired option if it was sent
      if (optionDto?.isRequired) {
        if (isTrue(optionDto.isRequired as string | boolean))
          optionDto.isRequired = true;
        if (isFalse(optionDto.isRequired as string | boolean))
          optionDto.isRequired = false;
      }

      // input data validation
      zOption.shape._id.parse(id);
      zOption.partial().parse(optionDto);

      // check if the category exists with given id
      const isCategoryExists =
        await this.categoryService.checkIfTheCategoryExists(optionDto.category);
      if (!isCategoryExists)
        return res.status(httpStatus.NOT_FOUND).send({
          status: res.statusCode,
          code: 'NOT FOUND',
          error: {
            message: categoryMessages.notFoundWithId,
          },
        });

      // check if the option exists within the category
      const isOptionExists =
        await this.service.checkIfTheOptionExistsWithinACategory(
          id,
          optionDto.category,
        );
      if (!isOptionExists)
        return res.status(httpStatus.NOT_FOUND).send({
          status: res.statusCode,
          code: 'NOT FOUND',
          error: {
            message: optionMessages.notFoundWithinCategory,
          },
        });

      const { matchedCount } = await this.service.update(id, optionDto);
      if (!matchedCount)
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
          status: res.statusCode,
          error: {
            code: 'Internal Server Error',
            message: 'failed to update the option please try again',
          },
        });

      return res.status(httpStatus.OK).send({
        status: res.statusCode,
        code: 'OK',
        message: optionMessages.updated(id),
      });
    } catch (error) {
      next(error);
    }
  }
}
export default new OptionController();
