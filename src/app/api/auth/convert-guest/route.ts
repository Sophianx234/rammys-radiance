import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/connectDB";
import { User } from "@/models/User";
import { Order } from "@/models/Order";
import { encryptPassword } from "@/lib/bcrypt";
import { signToken } from "@/lib/jwtConfig";
import { setAuthCookie } from "@/lib/setAuthCookie";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const data = await req.json();

    const { email, name, phone, password, orderId } = data;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    
    if (user) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await encryptPassword(password);

    // Create user
    user = await User.create({
      name: name || "Customer",
      email: email,
      phone: phone || undefined,
      password: hashedPassword,
    });

    // Update the order to link to the new user
    if (orderId) {
      await Order.findByIdAndUpdate(orderId, { user: user._id });
    }

    // Log them in
    const token = await signToken(user);
    return setAuthCookie(token);

  } catch (error: any) {
    console.error("Guest conversion error:", error);
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }
}
