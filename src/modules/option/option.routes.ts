import { Router } from 'express';
import optionController from './option.controller';
import removeEmpty from '$middlewares/removeEmpty.middleware';

const router = Router();

router.post('/', removeEmpty, optionController.create);
router.get('/', optionController.getAll);
router.get('/for/:categoryId', optionController.findByCategoryId);
router.get('/for/slug/:categorySlug', optionController.findByCategorySlug);
router.get('/:optionId', optionController.findById);
router.delete('/:optionId', optionController.deleteById);

export default router;
