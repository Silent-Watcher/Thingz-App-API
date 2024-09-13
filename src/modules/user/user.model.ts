import { type Document, Schema, Types, model } from 'mongoose';
import { z } from 'zod';

export const zUser = z.object({
	_id: z.instanceof(Types.ObjectId),
	mobile: z
		.string({
			message: 'invalid data type for mobile number',
		})
		.regex(
			/^(\+98|0|98|0098)?([ ]|-|[()]){0,2}9[0-9]([ ]|-|[()]){0,2}(?:[0-9]([ ]|-|[()]){0,2}){8}$/gim,
			'invalid mobile format ',
		),
	otp: z.object({
		code: z.union([z.number().gte(10000).lte(99999), z.string()]),
		expiresIn: z.number().default(0),
	}),
	isMobileVerified: z.boolean().default(false),
	updatedAt: z.number().optional(),
	createdAt: z.number().optional(),
});

const otpSchema = new Schema({
	code: { type: Number, required: true },
	expiresIn: { type: Number, required: true, default: 0 },
});
const userSchema = new Schema(
	{
		mobile: { type: String, required: true, unique: true, trim: true },
		otp: { type: otpSchema, required: true },
	},
	{ timestamps: true },
);

const userModel = model('user', userSchema);

export type Mobile = z.infer<typeof zUser.shape.mobile>;
export type OTP = z.infer<typeof zUser.shape.otp>;

export type User = z.infer<typeof zUser> & Document;

export default userModel;