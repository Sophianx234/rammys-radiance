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
