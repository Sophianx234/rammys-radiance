import { NextResponse, NextRequest } from "next/server";
import { User } from "@/models/User";
import { connectToDatabase } from "@/lib/connectDB";
import { encryptPassword } from "@/lib/bcrypt";
import { sendMail } from "@/lib/mail";
import { passwordResetConfirmationEmail } from "@/lib/email-templates";
import crypto from "crypto";
import { resetPasswordSchema } from "@/lib/validations";
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
    const validatedData = resetPasswordSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json({ message: validatedData.error.errors[0].message }, { status: 400 });
    }
    
    const { token, password } = validatedData.data;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    // Find user with valid token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }, // token not expired
    });

    if (!user) {
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
    }

    // Hash the new password
    const encryptedPassword = await encryptPassword(password);
    user.password = encryptedPassword;

    // Clear token and expiration
    user.resetPasswordToken = "";
    user.resetPasswordExpires = 0;

    await user.save();

    await sendMail({
      to: user.email,
      subject: "Your password has been reset",
      html: passwordResetConfirmationEmail(user.name),
    });

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Reset password error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
