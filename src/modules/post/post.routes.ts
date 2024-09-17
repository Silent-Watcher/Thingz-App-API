import { Router } from 'express';
import postController from './post.controller';

const router = Router();

router.get('/', postController.index);

export default router;
