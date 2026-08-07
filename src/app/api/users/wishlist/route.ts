import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/connectDB";
import { User } from "@/models/User";
import jwt from "jsonwebtoken";
import { DecodedToken } from "@/lib/jwtConfig";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

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

    const user = await User.findById((decoded as DecodedToken).userId).populate("wishlist");
    if (!user) return NextResponse.json({ message: "User not found", wishlist: [] }, { status: 404 });

    const wishlistIds = user.wishlist.map((item: any) => item._id ? item._id.toString() : item.toString());

    return NextResponse.json({ 
      wishlist: wishlistIds,
      wishlistProducts: user.wishlist 
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error", wishlist: [] }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const { productId } = await req.json();
    if (!productId) return NextResponse.json({ message: "Product ID is required" }, { status: 400 });
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

    const objId = new mongoose.Types.ObjectId(productId);
    const currentWishlist = user.wishlist || [];

    const alreadyInWishlist = currentWishlist.some((id: any) => id.toString() === productId.toString());
    console.log(`[Wishlist POST] User: ${user._id}, Product: ${productId}, Already in wishlist: ${alreadyInWishlist}`);
    
    const updateOp = alreadyInWishlist 
      ? { $pull: { wishlist: objId } }
      : { $push: { wishlist: objId } };
      
    const updatedUser = await User.findByIdAndUpdate(user._id, updateOp, { new: true });

    console.log(`[Wishlist POST] Updated array length: ${updatedUser?.wishlist.length}`);

    return NextResponse.json({
      message: "Wishlist updated",
      wishlist: updatedUser?.wishlist || [],
      isFavorite: !alreadyInWishlist,
    });

  } catch (err: any) {
    console.error("Wishlist POST error:", err);
    return NextResponse.json({ message: "Server error", error: err.message }, { status: 500 });
  }
}
