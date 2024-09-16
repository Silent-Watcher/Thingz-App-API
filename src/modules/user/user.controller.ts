import Controller from '$app/interfaces/controller.interface';
import type { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import UserService from './user.service';

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
