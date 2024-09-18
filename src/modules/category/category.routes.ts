import removeEmpty from '$middlewares/removeEmpty.middleware';
import { Router } from 'express';
import categoryController from './category.controller';

const router = Router();

router.get('/', categoryController.getAll);
router.post('/', removeEmpty, categoryController.create);

export default router;
