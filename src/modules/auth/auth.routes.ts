import { Router } from 'express';
import authController from './auth.controller';
import { validateBody } from '$app/common/middlewares/validator.middleware';
import { zUser } from '../user/user.model';
import removeEmpty from '$app/common/middlewares/removeEmpty.middleware';

const router = Router();

router.post(
  '/send-otp',
  removeEmpty,
  validateBody(zUser.pick({ mobile: true })),
  authController.sendOtp,
);
/**
 ** ! currently we don't have a deep copy functionality in zod
 */
router.post(
  '/check-otp',
  removeEmpty,
  validateBody(zUser.pick({ mobile: true })),
  validateBody(zUser.shape.otp.pick({ code: true })),
  authController.checkOtp,
);
router.get('/logout', authController.logout);

export default router;
