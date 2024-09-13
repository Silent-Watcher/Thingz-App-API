import { type NextFunction, type Request, type Response } from 'express';

import categoryModel, { type Category, zCategory } from './category.model';
import Controller from '$app/interfaces/controller.interface';
import categoryMessages from './category.messages';
import categoryService from './category.service';
import httpStatus from 'http-status';

class CategoryContoller extends Controller {
	private service;
	constructor() {
		super();
		this.service = categoryService;
	}

	async getAll(_req: Request, res: Response, next: NextFunction) {
		try {
			const categories: Category[] = await categoryModel.find({});
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
			zCategory.parse(req.body);

			await this.service.create(req.body);

			return res.status(httpStatus.CREATED).send({
				status: res.statusCode,
				code: 'created',
				message: `category ${req.body.name} created successfully!`,
			});
		} catch (error) {
			next(error);
		}
	}
}

export default new CategoryContoller();
