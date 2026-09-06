import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/connectDB";
import { User } from "@/models/User";
import { Otp } from "@/models/Otp";
import { signToken } from "@/lib/jwtConfig";
import { setAuthCookie } from "@/lib/setAuthCookie";
import { ActivityLog } from "@/models/ActivityLog";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ message: "Email and OTP are required" }, { status: 400 });
    }

    const existingOtp = await Otp.findOne({ email, otp });
    if (!existingOtp) {
      return NextResponse.json({ message: "Invalid or expired verification code" }, { status: 401 });
    }

    const user = await User.findOne({ email });
    if (!user || user.role !== "admin") {
      return NextResponse.json({ message: "Invalid admin user" }, { status: 401 });
    }

    if (user.isSuspended) {
      return NextResponse.json({ message: "Your account has been suspended." }, { status: 403 });
    }

    // OTP is valid, issue token
    const token = await signToken(user);

    // Delete OTP so it cannot be reused
    await Otp.deleteOne({ _id: existingOtp._id });

    // Log activity
    const ip = req.ip || req.headers.get("x-forwarded-for") || "127.0.0.1";
    try {
      await ActivityLog.create({
        user: user._id,
        action: "Login",
        details: `Admin logged in with 2FA from IP ${ip}`,
      });
    } catch (e) {
      console.error("Failed to log activity", e);
    }

    return setAuthCookie(token, "Admin login successful");
  } catch (err) {
    console.error("Admin OTP verification error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
