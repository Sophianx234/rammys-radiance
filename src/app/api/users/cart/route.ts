import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/connectDB";
import { User } from "@/models/User";
import jwt from "jsonwebtoken";
import { DecodedToken } from "@/lib/jwtConfig";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();

    const token = req.cookies.get("token")?.value;
    // Get JWT from cookies
    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    // Directly verify JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
    const user = await User.findById((decoded as DecodedToken).userId);
    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    if (Array.isArray(body)) {
      for (const item of body) {
        const cartItem = user.cart.find(
          (c) => c.product.toString() === item.productId
        );
        if (cartItem) {
          cartItem.quantity = item.quantity;
        } else {
          user.cart.push({ product: item.productId, quantity: item.quantity });
        }
      }
    } else {
      const { productId, quantity } = body;
      const cartItem = user.cart.find(
        (item) => item.product.toString() === productId
      );

      if (cartItem) {
        cartItem.quantity = quantity;
      } else {
        user.cart.push({ product: productId, quantity });
      }
    }

    await user.save();

    return NextResponse.json({ message: "Cart updated", cart: user.cart });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
