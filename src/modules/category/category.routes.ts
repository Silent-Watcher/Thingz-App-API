import removeEmpty from '$middlewares/removeEmpty.middleware';
import { Router } from 'express';
import categoryController from './category.controller';
import {
  validateBody,
  validateParams,
} from '$app/common/middlewares/validator.middleware';
import { zCategory } from './category.model';

const router = Router();

router.get('/', categoryController.getAll);
router.post(
  '/',
  removeEmpty,
  validateBody(zCategory.partial()),
  categoryController.create,
);

router.delete(
  '/:categoryId',
  validateParams(zCategory.shape._id),
  categoryController.delete,
);

export default router;
