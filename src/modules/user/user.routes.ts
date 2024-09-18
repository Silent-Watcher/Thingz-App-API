import { Router } from 'express';
import userController from './user.controller';

const router = Router();

router.get('/whoami', userController.whoami);

export default router;
