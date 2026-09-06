import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/connectDB";
import { User } from "@/models/User";
import { encryptPassword } from "@/lib/bcrypt";
import { jwtVerify } from "jose";

export async function POST(req: NextRequest) {
  try {
    // 1. Verify User Role from Token
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const userRole = payload.role as string;
    
    if (!["admin", "manager"].includes(userRole)) {
      return NextResponse.json({ error: "Forbidden. Insufficient permissions." }, { status: 403 });
    }

    // 2. Parse Request
    await connectToDatabase();
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 3. Strict RBAC Enforcement
    // Manager cannot assign the 'admin' role
    if (userRole === "manager" && role === "admin") {
      return NextResponse.json(
        { error: "Forbidden. Managers cannot create Admin accounts." }, 
        { status: 403 }
      );
    }
    
    // Validate role string
    const validRoles = ["admin", "manager", "dispatch", "dispatcher", "user", "customer"];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role specified." }, { status: 400 });
    }

    // 4. Create User
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ error: "Email already in use." }, { status: 400 });
    }

    const hashedPassword = await encryptPassword(password);
    
    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role
    });

    const safeUser = newUser.toObject();
    delete safeUser.password;

    return NextResponse.json({ success: true, user: safeUser }, { status: 201 });

  } catch (err: any) {
    console.error("Team creation error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
