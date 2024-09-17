import authMessages from '$app/modules/auth/auth.messages';
import userModel from '$app/modules/user/user.model';
import type { NextFunction, Request, Response } from 'express';
import httpErrors from 'http-errors';
import { type UserPayload, verifyToken } from '../utils/token.utils';

export async function checkIfTheUserVerified(req: Request, _res: Response, next: NextFunction) {
  try {
    const accessToken = req.cookies.access_token;

    if (!accessToken) throw new httpErrors.Unauthorized(authMessages.unauthorizedUser);

    const payload = verifyToken(accessToken, process.env.JWT_SECRET as string) as UserPayload;

    if (!payload.id) throw new httpErrors.Unauthorized(authMessages.invalidCredentials);

    const authorizedUser = await userModel
      .findOne(
        {
          _id: payload.id,
          mobile: payload.mobile,
        },
        { mobile: 1, _id: 1 },
      )
      .lean();

    if (!authorizedUser) throw new httpErrors.Unauthorized(authMessages.invalidCredentials);

    req.user = authorizedUser;
    next();
  } catch (error) {
    next(error);
  }
}
