"use server";

import { connectToDatabase } from "@/lib/connectDB";
import { User } from "@/models/User";
import { encryptPassword, verifyPassword } from "@/lib/bcrypt";
import { uploadBufferToCloudinary } from "@/lib/cloudinary";

export async function updateProfileAction(form: FormData) {
  try {
    await connectToDatabase();

    const userId = form.get("userId") as string | null;
    const name = form.get("name") as string | null;
    const file = form.get("profile") as File | null;

    if (!userId) {
      return { success: false, message: "User ID is required" };
    }

    const user = await User.findById(userId);

    if (!user) {
      return { success: false, message: "User not found" };
    }

    if (name) user.name = name;

    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const result = await uploadBufferToCloudinary(buffer, undefined, "users");
      user.profile = result.secure_url;
    }

    await user.save();
    
    // Return safe user object
    const safeUser = user.toObject();
    delete safeUser.password;
    safeUser._id = safeUser._id.toString();

    return { success: true, message: "Profile updated successfully", user: safeUser };
  } catch (err: any) {
    return { success: false, message: err.message || "Server error" };
  }
}

export async function updateEmailAction(form: FormData) {
  try {
    await connectToDatabase();

    const userId = form.get("userId") as string | null;
    const email = form.get("email") as string | null;

    if (!userId || !email) {
      return { success: false, message: "User ID and Email are required" };
    }

    const user = await User.findById(userId);
    if (!user) {
      return { success: false, message: "Unauthorized" };
    }

    user.email = email;
    await user.save();

    // Return safe user object
    const safeUser = user.toObject();
    delete safeUser.password;
    safeUser._id = safeUser._id.toString();

    return { success: true, message: "Email updated successfully", user: safeUser };
  } catch (err: any) {
    return { success: false, message: err.message || "Server error" };
  }
}

export async function updatePasswordAction(form: FormData) {
  try {
    await connectToDatabase();

    const userId = form.get("userId") as string | null;
    const current = form.get("current") as string | null;
    const newPass = form.get("newPass") as string | null;

    if (!userId || !current || !newPass) {
      return { success: false, message: "All fields are required" };
    }

    const user = await User.findById(userId);
    if (!user) {
      return { success: false, message: "Unauthorized" };
    }

    const match = await verifyPassword(current, user.password);
    if (!match) {
      return { success: false, message: "Current password is incorrect" };
    }

    user.password = await encryptPassword(newPass);
    await user.save();

    return { success: true, message: "Password updated successfully" };
  } catch (err: any) {
    return { success: false, message: err.message || "Server error" };
  }
}
