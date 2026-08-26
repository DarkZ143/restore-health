import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { amount, service } = await request.json();
    const numericAmount = Number(amount);
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { message: "Razorpay credentials are not configured." },
        { status: 500 },
      );
    }

    if (!Number.isFinite(numericAmount) || numericAmount < 1) {
      return NextResponse.json({ message: "Enter a valid payment amount." }, { status: 400 });
    }

    const razorpayResponse = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: Math.round(numericAmount * 100),
        currency: "INR",
        receipt: `rhs_${Date.now()}`,
        notes: { service: String(service || "Restore Health payment") },
      }),
    });

    const order = await razorpayResponse.json();

    if (!razorpayResponse.ok) {
      return NextResponse.json(
        { message: order.error?.description || "Razorpay could not create the order." },
        { status: razorpayResponse.status },
      );
    }

    return NextResponse.json({ id: order.id, amount: order.amount, currency: order.currency, keyId });
  } catch {
    return NextResponse.json({ message: "Unable to create payment order." }, { status: 500 });
  }
}