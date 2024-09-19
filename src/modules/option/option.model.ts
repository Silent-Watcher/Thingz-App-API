import { type Document, Schema, Types, model } from 'mongoose';
import { z } from 'zod';

export const zOption = z.object({
  _id: z.union([z.string(), z.instanceof(Types.ObjectId)]).optional(),
  key: z.string().trim().min(3),
  title: z.string().trim().min(3),
  type: z.enum(['string', 'boolean', 'array', 'number']),
  enum: z.union([z.array(z.any()), z.string()]).optional(),
  guide: z.string().trim().min(3).optional(),
  category: z.union([z.string(), z.instanceof(Types.ObjectId)]),
  isRequired: z.boolean().default(false).optional(),
});

export const optionSchema = new Schema(
  {
    key: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['string', 'boolean', 'array', 'number'],
      required: true,
    },
    enum: { type: Array, required: false },
    guide: { type: String, required: false, trim: true },
    isRequired: { type: Boolean, required: false, default: false },
    category: { type: Types.ObjectId, ref: 'category', required: true },
  },
  { versionKey: false, toJSON: { virtuals: true }, id: false },
);

export type Option = z.infer<typeof zOption> & Document;

const optionModel = model('option', optionSchema);
export default optionModel;
