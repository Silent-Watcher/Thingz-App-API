import removeEmpty from '$middlewares/removeEmpty.middleware';
import { Router } from 'express';
import optionController from './option.controller';
import {
  validateBody,
  validateParams,
} from '$middlewares/validator.middleware';
import { zOption } from './option.model';
import { zCategory } from '$modules/category/category.model';

const router = Router();

router
  .route('/')
  .get(optionController.getAll)
  .post(removeEmpty, validateBody(zOption), optionController.create);

router.get(
  '/for/:categoryId',
  validateParams(zOption.pick({ category: true })),
  optionController.findByCategoryId,
);
router.get(
  '/for/slug/:categorySlug',
  validateParams(zCategory.pick({ slug: true })),
  optionController.findByCategorySlug,
);

router
  .route('/:optionId')
  .get(validateParams(zOption.pick({ _id: true })), optionController.findById)
  .delete(
    validateParams(zOption.pick({ _id: true })),
    optionController.deleteById,
  )
  .put(
    validateParams(zOption.pick({ _id: true })),
    validateBody(zOption.partial()),
    optionController.update,
  );

export default router;
