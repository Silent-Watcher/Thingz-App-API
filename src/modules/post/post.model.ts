import { model, Schema, Types } from 'mongoose';
// import { z } from 'zod';

// const zPost = z.object({});

const coordinateSchema = new Schema({
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
});

const postSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: Types.ObjectId, required: true, ref: 'categories' },
    slug: { type: String, required: true, trim: true, unique: true },
    province: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    district: { type: String, required: true, trim: true },
    coordinate: { type: coordinateSchema, required: true },
    images: { type: [String], required: false, default: [] },
  },
  { timestamps: true },
);

const postModel = model('post', postSchema);
export default postModel;
