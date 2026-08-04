import mongoose, { Schema, Document, Model } from "mongoose";

export type OrderStatus =
  | "processing"
  | "packed"
  |'ready_for_pickup'
  | "ready_for_dispatch"
  | "dispatched"
  | "in_transit"
  | "arrived"
  | "delivery_attempted"
  | "delivered"
  | "cancelled";

export interface IOrderItem {
  image:string,
  product: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  user?: mongoose.Types.ObjectId;  
  items: IOrderItem[];
  totalAmount: number;

  // Paystack
  paymentStatus: "pending" | "paid" | "failed";
  paymentReference: string;

  // From your formData
  customer: {
    phone: string;
  };

  // Ghana address format
  deliveryAddress: {
    address: string;   // street
    city: string;
    region: string;    // Shadcn select
    lat?: number;
    lng?: number;
  };

  orderStatus: OrderStatus;

  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false, // allow guest checkout
    },

    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],

    totalAmount: { type: Number, required: true },

    // Payment
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    paymentReference: { type: String, required: true },

    // Customer info matching your formData
    customer: {
     
      phone: { type: String, required: true },
    },

    // Ghana structure
    deliveryAddress: {
      address: { type: String, required: true }, // street
      city: { type: String, required: true },
      region: { type: String, required: true },
      lat: { type: Number },
      lng: { type: Number },
    },

    orderStatus: {
      type: String,
      enum: [
        "processing",
        "ready_for_pickup",
        "packed",
        "ready_for_dispatch",
        "dispatched",
        "in_transit",
        "arrived",
        "delivery_attempted",
        "delivered",
        "cancelled",
      ],
      default: "processing",
    },
  },
  { timestamps: true }
);

export const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", orderSchema);
