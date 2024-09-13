import { Router } from 'express';
import { checkIfTheUserVerified } from '$app/common/guards/auth.gaurd';
import userController from './user.controller';

const router = Router();

router.get('/whoami', checkIfTheUserVerified, userController.whoami);

export default router;
