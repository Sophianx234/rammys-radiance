import { connectToDatabase } from "@/lib/connectDB";
import { User } from "@/models/User";
import { Otp } from "@/models/Otp";
import { sendMail } from "@/lib/mail";
import { NextRequest, NextResponse } from "next/server";
import * as React from "react";

export async function POST(req: NextRequest) {
  await connectToDatabase();
  try {
    const { email, name } = await req.json();
    if (!email || !name) {
      return NextResponse.json({ message: "Name and email are required" }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "Email already in use" }, { status: 400 });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // DEV MODE: Log the OTP to the console so you can test locally even if emails fail
    if (process.env.NODE_ENV === "development") {
      console.log("-----------------------------------------");
      console.log(`[DEV MODE] OTP generated for ${email}: ${otp}`);
      console.log("-----------------------------------------");
    }

    // Store/Upsert OTP in the database
    await Otp.findOneAndUpdate({ email }, { otp, createdAt: new Date() }, { upsert: true });

    const { render } = await import("@react-email/render");
    const OtpEmail = (await import("@/components/mail/otp-email")).default;
    const emailHtml = await render(React.createElement(OtpEmail, { name, otp }));

    // Send the OTP email
    await sendMail({
      to: email,
      subject: "Your Signup Verification Code",
      html: emailHtml,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error sending OTP:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
