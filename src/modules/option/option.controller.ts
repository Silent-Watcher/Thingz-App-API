import type { NextFunction, Request, Response } from 'express';
import Controller from '$app/interfaces/controller.interface';
import optionService from './option.service';
import categoryService from '$app/modules/category/category.service';
import { zOption, type Option } from './option.model';
import httpStatus from 'http-status';
import optionMessages from './option.messages';

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
      if (!optionDto?.category || !optionDto?.key || !optionDto?.type || !optionDto?.title)
        return res.status(httpStatus.NOT_ACCEPTABLE).send({
          status: res.statusCode,
          error: {
            code: 'not acceptable',
            message: optionMessages.dataNotProvided,
          },
        });

      // new option data validation
      zOption.parse(optionDto);

      // check if the category exists with given id
      await this.categoryService.checkIfTheCategoryExists(optionDto.category);

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
}

export default new OptionController();
