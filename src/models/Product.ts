// models/Product.ts
import mongoose, { Schema, Document, Model } from "mongoose";
import "./Category"; // Ensure Category schema is registered before Product populates it

export interface IVariant {
  name: string;        // e.g. "shade" or "size"
  options: string[];   // e.g. ["Crimson", "Porcelain", "Caramel"]
}

export interface IProduct extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  category: mongoose.Types.ObjectId;
  price: number;
  discountPrice?: number;
  discountBadge?: string;
  images: string[];
  features: string[];
  rating: number;
  reviewsCount: number;
  quantity: number;
  stock: number;
  inStock: boolean;
  variants: IVariant[];
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true, index: true },
    description: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    discountBadge: { type: String },
    images: [{ type: String, required: true }],
    features: [String],
    rating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    inStock: { type: Boolean, default: true },
    quantity: { type: Number, default: undefined },
    variants: [
      {
        name: String,
        options: [String],
      },
    ],
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", productSchema);
