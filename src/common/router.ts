import { type Request, type Response, Router } from 'express';
import authRouter from '$app/modules/auth/auth.routes';
import categoryRouter from '$app/modules/category/category.routes';
import userRouter from '$app/modules/user/user.routes';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
	res.send('hello world');
});

router.get('/health', async (_req: Request, res: Response) => {
	res.send({ msg: 'server is up and running ... ' });
});

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/category', categoryRouter);

export default router;