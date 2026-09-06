import { NextResponse } from "next/server";
import { Newsletter } from "@/models/Newsletter";
import { connectToDatabase } from "@/lib/connectDB";

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const { newsletterSchema } = await import("@/lib/validations");
    const validatedData = newsletterSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        { type: 'error', text: validatedData.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email } = validatedData.data;

    // Prevent duplicates
    const existing = await Newsletter.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { type: 'error', text: "This email is already subscribed." }
      );
    }

    await Newsletter.create({ email });

    return NextResponse.json({
      type: 'success',
      text: "Subscribed successfully!",
    });
  } catch (error: any) {
    return NextResponse.json(
      { type: 'error', text: error.message },
      { status: 500 }
    );
  }
}
