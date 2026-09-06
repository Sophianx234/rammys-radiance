import { encryptPassword, verifyPassword } from "@/lib/bcrypt";
import { connectToDatabase } from "@/lib/connectDB";
import { User } from "@/models/User";
import { NextResponse } from "next/server";

import { updatePasswordSchema } from "@/lib/validations";

export async function PATCH(req: Request) {
  try {
    await connectToDatabase();

    const form = await req.formData();
    const rawData = Object.fromEntries(form.entries());
    const validatedData = updatePasswordSchema.safeParse(rawData);
    
    if (!validatedData.success) {
      return NextResponse.json(
        { message: validatedData.error.errors[0].message },
        { status: 400 }
      );
    }
    const { userId, current, newPass } = validatedData.data;

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    if (!current || !newPass) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const match = await verifyPassword(current, user.password);
    if (!match) {
      return NextResponse.json(
        { message: "Current password is incorrect" },
        { status: 400 }
      );
    }

    user.password = await encryptPassword(newPass);
    await user.save();

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Password update error:", e);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
