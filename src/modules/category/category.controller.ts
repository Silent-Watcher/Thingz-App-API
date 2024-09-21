import type { NextFunction, Request, Response } from 'express';

import Controller from '$app/interfaces/controller.interface';
import httpStatus from 'http-status';
import categoryMessages from './category.messages';
import categoryModel from './category.model';
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

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { categoryId } = req.params;

      const { deletedCount } = await this.service.delete(categoryId);

      if (!deletedCount)
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
          status: res.statusCode,
          code: 'INTERNAL SERVER ERROR',
          error: {
            message: categoryMessages.failedToDelete,
          },
        });

      return res.status(httpStatus.OK).send({
        status: res.statusCode,
        code: 'OK',
        message: categoryMessages.deleted,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new CategoryController();
