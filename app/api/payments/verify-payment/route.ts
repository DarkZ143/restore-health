import { createHmac } from "crypto";
import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

type VerifyPaymentBody = {
  razorpay_payment_id?: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
  amount?: number | string;
  service?: string;
  phoneNumber?: string;
};

function createInvoiceNumber() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const random = Math.floor(1000 + Math.random() * 9000);

  return `INV-${year}${month}${day}-${random}`;
}

export async function POST(request: Request) {
  try {
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keySecret) {
      return NextResponse.json(
        { success: false, message: "Razorpay secret is not configured." },
        { status: 500 },
      );
    }

    const body = (await request.json()) as VerifyPaymentBody;

    const paymentId = String(body.razorpay_payment_id || "").trim();
    const orderId = String(body.razorpay_order_id || "").trim();
    const signature = String(body.razorpay_signature || "").trim();
    const phoneNumber = String(body.phoneNumber || "").trim();
    const amount = Number(body.amount);
    const service = String(body.service || "Restore Health payment").trim();

    if (!paymentId || !orderId || !signature) {
      return NextResponse.json(
        { success: false, message: "Missing payment verification details." },
        { status: 400 },
      );
    }

    if (!Number.isFinite(amount) || amount < 1) {
      return NextResponse.json(
        { success: false, message: "Invalid payment amount." },
        { status: 400 },
      );
    }

    const expectedSignature = createHmac("sha256", keySecret)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json(
        { success: false, message: "Payment signature verification failed." },
        { status: 400 },
      );
    }

    const paymentRef = adminDb.collection("payments").doc(paymentId);
    const existingPayment = await paymentRef.get();

    if (existingPayment.exists) {
      return NextResponse.json({
        success: true,
        message: "Payment already verified.",
        paymentId,
      });
    }

    let userId = "";

    if (phoneNumber) {
      const userSnapshot = await adminDb
        .collection("users")
        .where("phoneNumber", "==", phoneNumber)
        .limit(1)
        .get();

      if (!userSnapshot.empty) {
        userId = userSnapshot.docs[0].id;
      }
    }

    const createdAt = new Date();
    const invoiceNumber = createInvoiceNumber();

    await paymentRef.set({
      paymentId,
      orderId,
      signature,
      amount,
      service,
      status: "success",
      paymentMethod: "razorpay",
      userId,
      phoneNumber,
      createdAt,
      updatedAt: createdAt,
    });

    await adminDb.collection("transactions").add({
      paymentId,
      orderId,
      amount,
      status: "success",
      type: "payment",
      description: `${service} payment completed`,
      paymentMethod: "razorpay",
      userId,
      phoneNumber,
      createdAt,
      updatedAt: createdAt,
    });

    const invoiceRef = await adminDb.collection("invoices").add({
      invoiceNumber,
      paymentId,
      orderId,
      amount,
      status: "paid",
      description: `${service} invoice`,
      service,
      userId,
      phoneNumber,
      createdAt,
      updatedAt: createdAt,
      dueDate: createdAt,
      paidAt: createdAt,
    });

    return NextResponse.json({
      success: true,
      message: "Payment verified and invoice generated.",
      paymentId,
      invoiceId: invoiceRef.id,
      invoiceNumber,
    });
  } catch (error) {
    console.error("❌ Verify Payment Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to verify payment.",
      },
      { status: 500 },
    );
  }
}
