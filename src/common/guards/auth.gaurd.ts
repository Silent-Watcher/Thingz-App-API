import { type NextFunction, type Request, type Response } from 'express';
import { type UserPayload, verifyToken } from '../utils/token.utils';
import authMessages from '$app/modules/auth/auth.messages';
import httpErrors from 'http-errors';
import userModel from '$app/modules/user/user.model';

export async function checkIfTheUserVerified(
	req: Request,
	_res: Response,
	next: NextFunction,
) {
	try {
		const accessToken = req.cookies.access_token;

		if (!accessToken)
			throw new httpErrors.Unauthorized(authMessages.unauthorizedUser);

		const payload = verifyToken(
			accessToken,
			process.env.JWT_SECRET as string,
		) as UserPayload;

		if (!payload.id)
			throw new httpErrors.Unauthorized(authMessages.invalidCredentials);

		const authorizedUser = await userModel
			.findOne(
				{
					_id: payload.id,
					mobile: payload.mobile,
				},
				{ mobile: 1, _id: 1 },
			)
			.lean();

		if (!authorizedUser)
			throw new httpErrors.Unauthorized(authMessages.invalidCredentials);

		req.user = authorizedUser;
		next();
	} catch (error) {
		next(error);
	}
}
