import { type Mobile, zUser } from '$modules/user/user.model';
import type { NextFunction, Response } from 'express';

import Controller from '$app/interfaces/controller.interface';
import type RequestWithBody from '$app/interfaces/requestWithBody.interface';
import httpStatus from 'http-status';
import authMessages from './auth.messages';
import AuthService from './auth.service';

class AuthController extends Controller {
  private service;

  constructor() {
    super();
    this.service = AuthService;
  }

  async sendOtp(req: RequestWithBody, res: Response, next: NextFunction) {
    try {
      const { mobile } = req.body;
      if (!mobile)
        return res.status(httpStatus.NOT_ACCEPTABLE).send({
          status: res.statusCode,
          error: {
            code: 'not acceptable',
            message: authMessages.dataNotProvided,
          },
        });

      zUser.shape.mobile.parse(mobile);

      await this.service.sendOtp(mobile as Mobile);
      return res.send({
        status: res.statusCode,
        code: 'OK',
        message: authMessages.otpSentSuccessfully,
      });
    } catch (error) {
      next(error);
    }
  }

  async checkOtp(req: RequestWithBody, res: Response, next: NextFunction) {
    try {
      const { mobile, code } = req.body;
      if (!mobile || !code)
        return res.status(httpStatus.NOT_ACCEPTABLE).send({
          status: res.statusCode,
          error: {
            code: 'not acceptable',
            message: authMessages.dataNotProvided,
          },
        });

      zUser.shape.mobile.parse(mobile as Mobile);
      zUser.shape.otp.partial({ expiresIn: true }).parse({ code });

      const token = await this.service.checkOtp(mobile, code as number);
      res.cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.APP_ENV == 'production',
        maxAge: 24 * 3600 * 1000,
        path: '/',
      });
      res.status(httpStatus.OK).send({
        status: res.statusCode,
        code: 'OK',
        message: authMessages.otpVerified,
      });
      return;
    } catch (error) {
      next(error);
    }
  }

  logout(req: RequestWithBody, res: Response, next: NextFunction) {
    try {
      res.clearCookie('access_token');
      delete req.user;
      return res.send({
        status: res.statusCode,
        code: 'OK',
        message: 'logout successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
