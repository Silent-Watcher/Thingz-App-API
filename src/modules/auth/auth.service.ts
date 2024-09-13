import userModel, { type Mobile, type OTP, type User } from '$app/modules/user/user.model';
import Controller from '$app/interfaces/controller.interface';
import authMessages from './auth.messages';
import httpErrors from 'http-errors';
import { randomInt } from "node:crypto";

import { signToken } from '$app/common/utils/token.utils';

class AuthService extends Controller {
	private userModel;
	constructor() {
		super();
		this.userModel = userModel;
	}
	async sendOtp(mobile: Mobile): Promise<void> {
		const user: User | null = await this.userModel.findOne({
			mobile,
		});
		const now = new Date().getTime();
		const _30s = 30e3; // ms
		const otp: OTP = {
			code: randomInt(10000,99999),
			expiresIn: now + _30s,
		};

		if (!user) {
			// register a new user
			await this.userModel.create({
				mobile: mobile,
				otp,
			});
			return;
		}
		if (user.otp.expiresIn > now) {
			throw new httpErrors.BadRequest(authMessages.otpNotExpired);
		}

		user.otp = otp;
		user.save().catch((error: Error) => {
			throw error;
		});
		return;
	}

	async checkOtp(mobile: Mobile, code: number): Promise<string> {
		const foundedUser: User | null = await this.userModel.findOne({
			mobile,
		});
		const now = new Date().getTime();

		if (!foundedUser)
			throw new httpErrors.NotFound(authMessages.userNotFound);

		if (foundedUser?.otp && foundedUser.otp.expiresIn < now)
			throw new httpErrors.NotAcceptable(authMessages.otpExpired);

		if (code != foundedUser.otp.code)
			throw new httpErrors.Unauthorized(authMessages.invalidOtpValue);

		return this.verifyUser(foundedUser);
	}

	async verifyUser(user: User): Promise<string> {
		if (!user.isMobileVerified) user.isMobileVerified = true;

		await user.save();

		const accessToken = signToken(
			{ id: user._id, mobile: user.mobile },
			process.env.JWT_SECRET as string,
		);

		return accessToken;
	}
}

export default new AuthService();
