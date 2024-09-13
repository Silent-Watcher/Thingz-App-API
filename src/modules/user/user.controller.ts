import { type NextFunction, type Request, type Response } from 'express';
import Controller from '$app/interfaces/controller.interface';
import UserService from './user.service';
import httpStatus from 'http-status';

class UserContoller extends Controller {
	private userService;
	constructor() {
		super();
		this.userService = UserService;
	}

	whoami(req: Request, res: Response, next: NextFunction) {
		try {
			return res.status(httpStatus.OK).send({
				status: res.statusCode,
				message: 'hello!',
				user: req.user,
			});
		} catch (error) {
			next(error);
		}
	}
}

export default new UserContoller();
