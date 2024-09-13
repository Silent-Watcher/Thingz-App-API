import { Router } from 'express';
import authController from './auth.controller';

const router = Router();

router.post('/send-otp', authController.sendOtp);
router.post('/check-otp', authController.checkOtp);
router.get('/logout', authController.logout);

export default router;
