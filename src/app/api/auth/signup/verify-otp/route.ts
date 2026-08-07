import { connectToDatabase } from "@/lib/connectDB";
import { Otp } from "@/models/Otp";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await connectToDatabase();
  try {
    const { email, otp } = await req.json();
    if (!email || !otp) {
      return NextResponse.json({ message: "Email and OTP are required" }, { status: 400 });
    }

    const existingOtp = await Otp.findOne({ email, otp });
    if (!existingOtp) {
      return NextResponse.json({ message: "Invalid or expired verification code" }, { status: 400 });
    }

    // Do not delete OTP here yet; delete it in the final signup step.
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error verifying OTP:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
