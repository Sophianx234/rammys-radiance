export const dynamic = "force-dynamic";
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const reference = request.nextUrl.searchParams.get("reference")

    if (!reference) {
      return NextResponse.json({ error: "Reference is required" }, { status: 400 })
    }

    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY

   const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_PAYSTACK_LIVE_KEY}` },
    });

    const data = await response.json();

    if (!data.status || data.data.status !== "success") {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
    }

    if (!response.ok) {
      console.error("[v0] Paystack verification error:", data)
      return NextResponse.json({ error: "Failed to verify payment" }, { status: response.status })
    }

    return NextResponse.json({
      status: data.data.status,
      amount: data.data.amount / 100, // Convert back from kobo to naira
      reference: data.data.reference,
      customer: data.data.customer,
      authorization: data.data.authorization,
    })
  } catch (error) {
    console.error("[v0] Payment verification error:", error)
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 })
  }
}

