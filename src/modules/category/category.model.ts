import {
  type CallbackWithoutResultAndOptionalError,
  type Document,
  Schema,
  Types,
  model,
} from 'mongoose';
import { z } from 'zod';

export const zCategory = z.object({
  _id: z.union([z.instanceof(Types.ObjectId), z.string()]),
  name: z.string().trim(),
  icon: z.string().optional(),
  slug: z.string().trim().optional(),
  parent: z.union([z.instanceof(Types.ObjectId).optional(), z.string()]),
  parents: z.array(
    z.union([z.instanceof(Types.ObjectId).optional(), z.string()]),
  ),
  updatedAt: z.number().optional(),
  createdAt: z.number().optional(),
});

const categorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    icon: { type: String, required: false },
    slug: { type: String, required: false },
    parent: { type: Types.ObjectId, required: false, ref: 'categories' },
    parents: {
      type: [Types.ObjectId],
      required: false,
      default: [],
      ref: 'categories',
    },
  },
  {
    timestamps: true,
    id: false,
    toJSON: { virtuals: true },
    versionKey: false,
  },
);

categorySchema.virtual('children', {
  ref: 'category',
  localField: '_id',
  foreignField: 'parent',
});

categorySchema.virtual('options', {
  ref: 'options',
  localField: '_id',
  foreignField: 'category',
});

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function autoPopulate(this: any, next: CallbackWithoutResultAndOptionalError) {
  this.populate([{ path: 'children', select: 'name slug children' }]);
  next();
}
categorySchema.pre('find', autoPopulate).pre('findOne', autoPopulate);

const categoryModel = model('category', categorySchema);

export type Category = z.infer<typeof zCategory> & Document;

export default categoryModel;
