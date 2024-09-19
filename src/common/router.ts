import authRouter from '$modules/auth/auth.routes';
import categoryRouter from '$modules/category/category.routes';
import optionRouter from '$modules/option/option.routes';
import userRouter from '$modules/user/user.routes';
import { type Request, type Response, Router } from 'express';
import { checkIfTheUserVerified } from './guards/auth.gaurd';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.send('hello world');
});

router.get('/health', async (_req: Request, res: Response) => {
  res.send({
    status: res.statusCode,
    code: 'OK',
    msg: 'server is up and running ... ',
  });
});

router.use('/auth', authRouter);
router.use('/user', checkIfTheUserVerified, userRouter);

router.use('/category', checkIfTheUserVerified, categoryRouter);
router.use('/option', checkIfTheUserVerified, optionRouter);

export default router;
