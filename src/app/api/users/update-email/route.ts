import { connectToDatabase } from "@/lib/connectDB";
import { User } from "@/models/User";
import { NextResponse } from "next/server";

import { updateEmailSchema } from "@/lib/validations";

export async function PATCH(req: Request) {
  try {
    await connectToDatabase();

    const form = await req.formData();
    const rawData = Object.fromEntries(form.entries());
    const validatedData = updateEmailSchema.safeParse(rawData);
    
    if (!validatedData.success) {
      return NextResponse.json(
        { message: validatedData.error.errors[0].message },
        { status: 400 }
      );
    }
    const { userId, email } = validatedData.data;

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    // Fetch user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Update email
    user.email = email;
    await user.save();

    return NextResponse.json(
        { message: "Email updated successfully", user },
        { status: 200 }
    );

  } catch (e) {
    console.error("Email update error:", e);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
