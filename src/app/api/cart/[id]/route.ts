import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/connectDB";
import { User } from "@/models/User";
import jwt from "jsonwebtoken";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectToDatabase();

  const token = req.cookies.get("token")?.value;
  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = (decoded as any).userId;
    const { id: productId } = await params;

    // Remove product from user's cart
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { cart: { product: productId } },
      },
      { new: true }
    ).populate("cart.product");

    return NextResponse.json({
      message: "Item removed successfully",
      cart: updatedUser?.cart,
    });
  } catch (error) {
    console.error("Delete cart item error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
