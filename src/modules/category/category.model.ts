import { type Document, Schema, Types, model } from 'mongoose';
import { z } from 'zod';

export const zCategory = z.object({
	_id: z.instanceof(Types.ObjectId),
	name: z.string().trim(),
	icon: z.string().optional(),
	slug: z.string().trim().optional(),
	parent: z.instanceof(Types.ObjectId).optional(),
	parents: z.array(z.instanceof(Types.ObjectId).optional()),
	updatedAt: z.number().optional(),
	createdAt: z.number().optional(),
});

const categorySchema = new Schema(
	{
		name: { type: String, required: true, unique: true, trim: true },
		icon: { type: String, required: false },
		slug: { type: String, required: false },
		parent: { type: Types.ObjectId, required: false, ref: 'category' },
		parents: {
			type: [Types.ObjectId],
			required: false,
			default: [],
			ref: 'category',
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		id: false,
		versionKey: false,
	},
);

categorySchema.virtual('children', {
	ref: 'category',
	localField: '_id',
	foreignField: 'parent',
});

const categoryModel = model('category', categorySchema);

export type Category = z.infer<typeof zCategory> & Document;

export default categoryModel;
