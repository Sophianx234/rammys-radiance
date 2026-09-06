import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email/Phone is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")).or(z.undefined()),
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(15, "Phone number is too long").optional().or(z.literal("")).or(z.undefined()),
  password: z.string().min(6, "Password must be at least 6 characters"),
}).refine(data => data.email || data.phone, {
  message: "Either email or phone is required",
  path: ["email"],
});

// Adding extra schemas for potential future use or API enhancements
export const orderStatusSchema = z.object({
  status: z.enum([
    "processing",
    "awaiting_payment",
    "paid",
    "awaiting_pickup",
    "packed",
    "ready_for_dispatch",
    "dispatched",
    "in_transit",
    "arrived",
    "delivery_attempted",
    "delivered",
    "cancelled",
    "failed",
  ]),
});

export const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  slug: z.string().min(2, "Slug must be at least 2 characters").max(100),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

export const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  slug: z.string().optional().or(z.literal("")),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  stock: z.coerce.number().min(0, "Stock cannot be negative"),
  isFeatured: z.coerce.boolean().optional(),
  rating: z.coerce.number().min(0).max(5).optional(),
  reviewsCount: z.coerce.number().min(0).optional(),
  discountPrice: z.coerce.number().min(0).optional(),
  discountBadge: z.string().optional().or(z.literal("")),
});

export const newsletterSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const reviewSchema = z.object({
  rating: z.coerce.number().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5"),
  comment: z.string().min(3, "Comment is too short").max(500, "Comment is too long"),
});

export const updateProfileSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  name: z.string().min(2, "Name must be at least 2 characters").optional().nullable(),
  email: z.string().email("Invalid email address").optional().nullable().or(z.literal("")),
  phone: z.string().min(10, "Phone number must be at least 10 digits").optional().nullable().or(z.literal("")),
  password: z.string().min(6, "Password must be at least 6 characters").optional().nullable().or(z.literal("")),
});

export const updateEmailSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  email: z.string().email("Invalid email address"),
});

export const updatePasswordSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  current: z.string().min(6, "Current password must be at least 6 characters"),
  newPass: z.string().min(6, "New password must be at least 6 characters"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const addToCartSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
});

export const createOrderSchema = z.object({
  customerName: z.string().min(2, "Name is required"),
  customerEmail: z.string().email("Invalid email address"),
  customerPhone: z.string().min(10, "Phone number is required"),
  deliveryAddress: z.string().min(5, "Delivery address is required"),
  items: z.array(z.object({
    product: z.string().min(1, "Product ID is required"),
    quantity: z.coerce.number().min(1),
    price: z.coerce.number().min(0)
  })).min(1, "Order must have at least one item"),
  totalAmount: z.coerce.number().min(0),
});
