import { connectToDatabase } from "@/lib/connectDB";
import { IReview, Review } from "@/models/Review";
import "@/models/User";
import "@/models/Product";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";
import { sendMail } from "@/lib/mail";
import { reviewThankYouEmail } from "@/lib/email-templates";



export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  await connectToDatabase();

  const { productId } = await params;

  // Validate productId
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
  }

  try {
    // Fetch all reviews for this product, populate user info if needed
    const reviews = await Review.find({ product: productId })
      .sort({ createdAt: -1 }) // newest first
      .populate("user"); // optional: populate user's name/email

    return NextResponse.json(reviews, { status: 200 });
  } catch (err) {
    console.error("Failed to fetch reviews", err);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}



export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    await connectToDatabase();

    // ✅ Authenticate user
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = (decoded as any).userId;

    // ✅ Extract review data
    const { rating, comment } = await req.json();

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // ✅ Check if user has already reviewed in the past year
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const { productId } = await params;

    const existingReview = await Review.findOne({
      user: userId,
      product: productId,
      createdAt: { $gte: oneYearAgo }, // reviews in the last year
    });

    if (existingReview) {
      return NextResponse.json(
        { error: "You can only review this product once per year" },
        { status: 409 }
      );
    }

    // ✅ Create review
    const review = await Review.create({
      user: userId,
      product: productId,
      rating,
      comment,
    });
    
const populatedReview = await Review.findById(review._id)
  .populate("user", "-password")
  .populate("product");
  if(!populatedReview){
    return NextResponse.json(
      { error: "Failed to populate review data" },
      { status: 500 }
    );
  }
     await sendMail({
      to: populatedReview.user.email,
      subject: `Thank you for reviewing ${populatedReview.product.name}!`,
      html: reviewThankYouEmail(
        populatedReview.user.name,
        populatedReview.product.name,
        rating
      ),
    });

    return NextResponse.json(populatedReview, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}

  

