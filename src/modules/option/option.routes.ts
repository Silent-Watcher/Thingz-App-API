import { Router } from 'express';
import optionController from './option.controller';
import removeEmpty from '$app/common/middlewares/removeEmpty.middleware';

const router = Router();

router.post('/', removeEmpty, optionController.create);
router.get('/for/:categoryId', optionController.findByCategoryId);
router.get('/:optionId', optionController.findById);

export default router;
