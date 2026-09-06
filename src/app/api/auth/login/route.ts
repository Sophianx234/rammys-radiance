import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/connectDB";
import { User } from "@/models/User";
import { signToken } from "@/lib/jwtConfig";
import { setAuthCookie } from "@/lib/setAuthCookie";
import { verifyPassword } from "@/lib/bcrypt";
import { loginSchema } from "@/lib/validations";
import { loginRateLimit } from "@/lib/rateLimit";
import { logActivity } from "@/lib/logger";

export async function POST(req: NextRequest) {
  // Rate Limiting
  const ip = req.ip || req.headers.get("x-forwarded-for") || "127.0.0.1";
  try {
    const { success, limit, reset, remaining } = await loginRateLimit.limit(ip);
    
    if (!success) {
      return NextResponse.json(
        { message: "Too many login attempts. Please try again later." },
        { 
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
          }
        }
      );
    }
  } catch (err) {
    console.error("Rate limiter failed, continuing without limits:", err);
  }

  await connectToDatabase();

  try {
    const body = await req.json();
    const validatedData = loginSchema.safeParse(body);

    
    if (!validatedData.success) {
      return NextResponse.json(
        { message: validatedData.error.errors[0].message },
        { status: 400 }
      );
    }
    
    const { email, password } = validatedData.data;

    // Find user by either email or phone
    const user = await User.findOne({ 
      $or: [{ email: email }, { phone: email }] 
    });
    
    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    if (user.isSuspended) {
      return NextResponse.json(
        { message: "Your account has been suspended. Please contact support." },
        { status: 403 }
      );
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // --- Admin 2FA Flow ---
    if (user.role === "admin") {
      // 1. Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      if (process.env.NODE_ENV === "development") {
        console.log(`[DEV MODE] Admin Login OTP for ${user.email}: ${otp}`);
      }

      // 2. Store OTP in DB
      const { Otp } = await import("@/models/Otp");
      await Otp.findOneAndUpdate(
        { email: user.email }, 
        { otp, createdAt: new Date() }, 
        { upsert: true }
      );

      // 3. Send Email
      const { sendMail } = await import("@/lib/mail");
      const { render } = await import("@react-email/render");
      const OtpEmail = (await import("@/components/mail/otp-email")).default;
      const React = await import("react");
      
      const emailHtml = await render(React.createElement(OtpEmail, { name: user.name, otp }));
      
      await sendMail({
        to: user.email,
        subject: "Admin Login Verification Code",
        html: emailHtml,
      });

      return NextResponse.json({ requiresOtp: true, email: user.email });
    }
    // --- End Admin 2FA Flow ---

    // Sign JWT token for normal users
    const token = await signToken(user);
    
    // Log Activity
    try {
      const { ActivityLog } = await import("@/models/ActivityLog");
      await ActivityLog.create({
        user: user._id,
        action: "Login",
        details: `User logged in from IP ${ip}`,
      });
    } catch (e) {
      console.error("Failed to log login activity", e);
    }

    // Optionally, set HttpOnly cookie
    return setAuthCookie(token);

  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
