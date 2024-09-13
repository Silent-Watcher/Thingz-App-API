import { Router } from 'express';
import categoryController from './category.controller';
import removeEmpty from '$app/common/middlewares/removeEmpty.middleware';

const router = Router();

router.get('/', categoryController.getAll);
router.post('/', removeEmpty, categoryController.create);

export default router;
