import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/connectDB";
import { User } from "@/models/User";
import { signToken } from "@/lib/jwtConfig";
import { setAuthCookie } from "@/lib/setAuthCookie";
import { verifyPassword } from "@/lib/bcrypt";
import { loginSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
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

    // Sign JWT token
    const token = await signToken(user);

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
