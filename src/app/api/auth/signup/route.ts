import { encryptPassword } from "@/lib/bcrypt";
import { connectToDatabase } from "@/lib/connectDB";
import { welcomeEmail } from "@/lib/email-templates";
import { signToken } from "@/lib/jwtConfig";
import { sendMail } from "@/lib/mail";
import { setAuthCookie } from "@/lib/setAuthCookie";
import { User } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import * as React from "react";
import { signupSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  await connectToDatabase();

  try {
    // Parse FormData from the request
    const formData = await req.formData();

    const rawData = {
      name: formData.get("name")?.toString(),
      email: formData.get("email")?.toString(),
      phone: formData.get("phone")?.toString(),
      password: formData.get("password")?.toString(),
    };
    
    const validatedData = signupSchema.safeParse(rawData);
    if (!validatedData.success) {
      return NextResponse.json(
        { message: validatedData.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, email, phone, password } = validatedData.data;
    const otp = formData.get("otp")?.toString();

    if (email) {
      if (!otp) {
        return NextResponse.json(
          { message: "Verification code is required for email signup" },
          { status: 400 }
        );
      }
      const { Otp } = await import("@/models/Otp");
      const existingOtp = await Otp.findOne({ email, otp });
      if (!existingOtp) {
        return NextResponse.json(
          { message: "Invalid or expired verification code" },
          { status: 400 }
        );
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return NextResponse.json(
          { message: "Email already in use" },
          { status: 400 }
        );
      }
      // Clean up OTP
      await Otp.deleteOne({ _id: existingOtp._id });
    }

    if (phone) {
      const existingUser = await User.findOne({ phone });
      if (existingUser) {
        return NextResponse.json(
          { message: "Phone number already in use" },
          { status: 400 }
        );
      }
    }

    // Hash password
    const hashedPassword = await encryptPassword(password);

    // Create user
    const user = await User.create({
      name,
      email: email || undefined,
      phone: phone || undefined,
      password: hashedPassword,
    });

    if (email) {
      const { render } = await import("@react-email/render");
      const WelcomeEmail = (await import("@/components/mail/welcome-email")).default;
      const emailHtml = await render(React.createElement(WelcomeEmail, { name: name as string }));

      await sendMail({
        to: email,
        subject: "Welcome to Rammy's Radiance!",
        html: emailHtml,
      });
    }

    const token = await signToken(user);
    return setAuthCookie(token);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
