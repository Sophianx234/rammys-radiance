// models/User.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICartItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
}

export interface IUser extends Document {
  name: string;
  email?: string;
  password: string;
  profile?: string;
  role: "admin" | "manager" | "dispatch" | "user" | "customer" | "dispatcher";
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  phone?: string;
  wishlist: mongoose.Types.ObjectId[];
  cart: ICartItem[];
  isSuspended?: boolean;
  resetPasswordToken: string,
    resetPasswordExpires: number,
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, sparse: true },
    password: { type: String, required: true },
    profile: String,
    role: {
      type: String,
      enum: ["customer", "admin", "dispatcher", "manager", "dispatch", "user"],
      default: "user",
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      postalCode: String,
    },
    phone: { type: String, unique: true, sparse: true },
    wishlist: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    cart: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1 },
      },
    ],
    isSuspended: { type: Boolean, default: false },
    resetPasswordToken: String,
    resetPasswordExpires: Number,
  },
  { timestamps: true }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);
