import { uploadBufferToCloudinary } from "@/lib/cloudinary";
import { connectToDatabase } from "@/lib/connectDB";
import { User } from "@/models/User";
import { NextResponse } from "next/server";
import { encryptPassword } from "@/lib/bcrypt";

import { updateProfileSchema } from "@/lib/validations";

export async function PATCH(req: Request) {
  try {
    await connectToDatabase();

    const form = await req.formData();
    const rawData = Object.fromEntries(form.entries());
    const validatedData = updateProfileSchema.safeParse(rawData);
    
    if (!validatedData.success) {
      return NextResponse.json(
        { message: validatedData.error.errors[0].message },
        { status: 400 }
      );
    }

    const { userId, name, email, phone, password } = validatedData.data;
    const file = form.get("profile") as File | null;

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Update text fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone !== null) user.phone = phone; // Allow clearing phone if needed, but usually just updates

    if (password) {
      user.password = await encryptPassword(password);
    }

    // Handle optional image update
    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const result = await uploadBufferToCloudinary(buffer, userId, "profiles");
      user.profile = result.secure_url;
    }

    await user.save();

    return NextResponse.json(
      { message: "User updated", user },
      { status: 200 }
    );

  } catch (err) {
    console.error("Update error:", err);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
