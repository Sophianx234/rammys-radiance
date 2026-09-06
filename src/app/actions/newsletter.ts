"use server";

import { Newsletter } from "@/models/Newsletter";
import { connectToDatabase } from "@/lib/connectDB";
import { newsletterSchema } from "@/lib/validations";

export async function subscribeToNewsletter(prevState: any, formData: FormData) {
  try {
    await connectToDatabase();

    const email = formData.get("email")?.toString();

    const validatedData = newsletterSchema.safeParse({ email });
    if (!validatedData.success) {
      return { type: "error", text: validatedData.error.errors[0].message };
    }

    if (!email) {
      return { type: "error", text: "Email is required" };
    }

    const existing = await Newsletter.findOne({ email });
    if (existing) {
      return { type: "error", text: "This email is already subscribed." };
    }

    await Newsletter.create({ email });

    return { type: "success", text: "Subscribed successfully!" };
  } catch (error: any) {
    return { type: "error", text: error.message || "Something went wrong" };
  }
}
