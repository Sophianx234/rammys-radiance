import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/connectDB";
import { User } from "@/models/User";
import jwt from "jsonwebtoken";
import { DecodedToken } from "@/lib/jwtConfig";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const token = req.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized", wishlist: [] }, { status: 401 });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
      return NextResponse.json({ message: "Invalid token", wishlist: [] }, { status: 401 });
    }

    const user = await User.findById((decoded as DecodedToken).userId);
    if (!user) return NextResponse.json({ message: "User not found", wishlist: [] }, { status: 404 });

    return NextResponse.json({ wishlist: user.wishlist });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error", wishlist: [] }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const { productId } = await req.json();
    const token = req.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const user = await User.findById((decoded as DecodedToken).userId);
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    const alreadyInWishlist = user.wishlist.some((id: any) => id.toString() === productId.toString());
    if (alreadyInWishlist) {
      user.wishlist = user.wishlist.filter((id: any) => id.toString() !== productId.toString());
    } else {
      user.wishlist.push(productId);
    }

    await user.save();

    return NextResponse.json({
      message: "Wishlist updated",
      wishlist: user.wishlist,
      isFavorite: !alreadyInWishlist,
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
