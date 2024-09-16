import { checkIfTheUserVerified } from '$app/common/guards/auth.gaurd';
import { Router } from 'express';
import userController from './user.controller';

const router = Router();

router.get('/whoami', checkIfTheUserVerified, userController.whoami);

export default router;
