"use server";

import { Newsletter } from "@/models/Newsletter";
import { connectToDatabase } from "@/lib/connectDB";

export async function subscribeToNewsletter(prevState: any, formData: FormData) {
  try {
    await connectToDatabase();

    const email = formData.get("email")?.toString();

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
