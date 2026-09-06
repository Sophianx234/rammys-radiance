import { NextResponse, NextRequest } from "next/server";
import crypto from "crypto";
import { connectToDatabase } from "@/lib/connectDB";
import { User } from "@/models/User";
import { signToken } from "@/lib/jwtConfig";
import { sendMail } from "@/lib/mail";
import { resetPasswordEmail } from "@/lib/email-templates";
import { forgotPasswordSchema } from "@/lib/validations";
import { passwordResetRateLimit } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  // Rate Limiting
  const ip = req.ip || req.headers.get("x-forwarded-for") || "127.0.0.1";
  const { success } = await passwordResetRateLimit.limit(ip);
  if (!success) {
    return NextResponse.json({ message: "Too many password reset requests." }, { status: 429 });
  }

  try {
    await connectToDatabase();

    const body = await req.json();
    const validatedData = forgotPasswordSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json({ message: validatedData.error.errors[0].message }, { status: 400 });
    }
    
    const { email } = validatedData.data;

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "No account found with this email." },
        { status: 404 }
      );
    }

    // Generate Reset Token (JWT + hash storage)
    const resetToken = await signToken(user);

    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // Save to user document
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 min
    await user.save();

    // Send Email
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

    const html = resetPasswordEmail({
      name: user.name,
      resetUrl,
    });

    await sendMail({
      to: email,
      subject: "Reset Your Password",
      html,
      text: `Reset your password using this link: ${resetUrl}`,
    });
    return NextResponse.json(
      { message: "Password reset link sent to your email." },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Server error. Try again later." },
      { status: 500 }
    );
  }
}
