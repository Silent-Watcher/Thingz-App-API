import type { NextFunction, Request, Response } from 'express';

import Controller from '$app/interfaces/controller.interface';
import httpStatus from 'http-status';
import categoryMessages from './category.messages';
import categoryModel, { zCategory } from './category.model';
import categoryService from './category.service';

class CategoryController extends Controller {
  private service;
  constructor() {
    super();
    this.service = categoryService;
  }

  async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await categoryModel
        .find(
          { parent: { $exists: false } },
          { parents: 0, updatedAt: 0, createdAt: 0 },
        )
        .lean()
        .populate('children')
        .exec();
      res.status(httpStatus.OK).send({
        status: res.statusCode,
        code: 'OK',
        categories,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const categoryDto = req.body;

      // check for minimum requirements
      if (!categoryDto?.name)
        return res.status(httpStatus.NOT_ACCEPTABLE).send({
          status: res.statusCode,
          error: {
            code: 'not acceptable',
            message: categoryMessages.dataNotProvided,
          },
        });

      // new category data validation
      zCategory.partial().parse(req.body);

      await this.service.create(req.body);

      return res.status(httpStatus.CREATED).send({
        status: res.statusCode,
        code: 'created',
        message: categoryMessages.created,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new CategoryController();
