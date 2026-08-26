import { NextResponse } from "next/server";
import { adminDb, adminAuth } from "@/lib/firebaseAdmin";

/* =========================================================
   HELPERS
========================================================= */

function normalizeIndianPhone(value: unknown): string {
  let phone = String(value || "").trim();

  if (/^\d{10}$/.test(phone)) {
    phone = `+91${phone}`;
  }

  if (/^91\d{10}$/.test(phone)) {
    phone = `+${phone}`;
  }

  return phone;
}

function cleanString(value: unknown): string {
  return String(value || "").trim();
}

/* =========================================================
   POST
   USER SUBMITS PAYMENT / PAYMENT ID
========================================================= */

export async function POST(request: Request) {
  try {
    /* =======================================================
       1. AUTHENTICATION
    ======================================================= */

    const authHeader = request.headers.get("Authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication token missing.",
        },
        { status: 401 },
      );
    }

    const idToken = authHeader.substring(7);

    const decodedToken = await adminAuth.verifyIdToken(idToken);

    const userId = decodedToken.uid;

    /* =======================================================
       2. REQUEST BODY
    ======================================================= */

    const body = await request.json();

    const {
      customerName,
      phoneNumber,
      planId,
      planName,
      family,
      amount,
      paymentId,
      transactionId,
    } = body;

    /*
      paymentId preferred hai.

      transactionId bhi accept kar rahe hain
      taaki frontend naming mismatch ki wajah se
      API fail na ho.
    */

    const finalPaymentId = cleanString(paymentId || transactionId);

    const customerPhone = normalizeIndianPhone(phoneNumber);

    /* =======================================================
       3. VALIDATION
    ======================================================= */

    if (!cleanString(customerName)) {
      return NextResponse.json(
        {
          success: false,
          message: "Customer name is required.",
        },
        { status: 400 },
      );
    }

    if (!/^\+91\d{10}$/.test(customerPhone)) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid Indian mobile number is required.",
        },
        { status: 400 },
      );
    }

    if (!cleanString(planId) || !cleanString(planName)) {
      return NextResponse.json(
        {
          success: false,
          message: "Plan information is required.",
        },
        { status: 400 },
      );
    }

    if (!finalPaymentId) {
      return NextResponse.json(
        {
          success: false,
          message: "Payment ID / UTR number is required.",
        },
        { status: 400 },
      );
    }

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid payment amount is required.",
        },
        { status: 400 },
      );
    }

    /* =======================================================
       4. CHECK DUPLICATE PAYMENT ID
    ======================================================= */

    const duplicatePaymentSnapshot = await adminDb
      .collection("payments")
      .where("paymentId", "==", finalPaymentId)
      .limit(1)
      .get();

    if (!duplicatePaymentSnapshot.empty) {
      const duplicateDoc = duplicatePaymentSnapshot.docs[0];
      const duplicateData = duplicateDoc.data();

      /*
        Same user dobara submit kare to existing payment
        return kar denge.
      */

      if (duplicateData.userId === userId) {
        return NextResponse.json(
          {
            success: true,
            alreadySubmitted: true,
            paymentId: duplicateDoc.id,
            status: duplicateData.status || "pending",
            message: "This payment has already been submitted.",
          },
          { status: 200 },
        );
      }

      /*
        Kisi doosre user ne same UTR/payment ID use kiya.
      */

      return NextResponse.json(
        {
          success: false,
          message:
            "This Payment ID has already been submitted for another transaction.",
        },
        { status: 409 },
      );
    }

    /* =======================================================
       5. CHECK EXISTING PENDING PAYMENT
    ======================================================= */

    const existingPaymentSnapshot = await adminDb
      .collection("payments")
      .where("userId", "==", userId)
      .where("planId", "==", String(planId))
      .where("status", "==", "pending")
      .limit(1)
      .get();

    if (!existingPaymentSnapshot.empty) {
      const existingDoc = existingPaymentSnapshot.docs[0];
      const existingData = existingDoc.data();

      return NextResponse.json(
        {
          success: true,
          alreadySubmitted: true,
          paymentId: existingDoc.id,
          status: existingData.status || "pending",
          message: "You already have a payment verification request pending.",
        },
        { status: 200 },
      );
    }

    /* =======================================================
       6. CREATE PAYMENT DOCUMENT
    ======================================================= */

    const paymentRef = adminDb.collection("payments").doc();

    const now = new Date();

    const paymentData = {
      id: paymentRef.id,

      /* USER */

      userId,

      customerName: cleanString(customerName),

      customerPhone,

      customerEmail: decodedToken.email || null,

      /* PLAN */

      planId: String(planId),

      planName: cleanString(planName),

      family: family ? cleanString(family) : null,

      /* PAYMENT */

      amount: numericAmount,

      paymentId: finalPaymentId,

      transactionId: finalPaymentId,

      paymentMethod: "qr_code",

      paymentGateway: "manual_qr",

      /* STATUS */

      status: "pending",

      paymentStatus: "pending",

      adminApproved: false,

      adminRejected: false,

      /* ADMIN */

      approvedBy: null,

      approvedAt: null,

      rejectedBy: null,

      rejectedAt: null,

      rejectionReason: null,

      /* ORDER */

      orderId: null,

      invoiceId: null,

      invoiceUrl: null,

      /* SOURCE */

      source: "user_payment_page",

      /* TIMESTAMPS */

      createdAt: now,

      updatedAt: now,

      submittedAt: now,
    };

    await paymentRef.set(paymentData);

    /* =======================================================
       7. CREATE ADMIN NOTIFICATION
    ======================================================= */

    const notificationRef = adminDb.collection("notifications").doc();

    await notificationRef.set({
      id: notificationRef.id,

      type: "payment",

      title: "New Payment Verification",

      message: `${cleanString(customerName)} submitted a payment of ₹${numericAmount.toLocaleString(
        "en-IN",
      )} for ${cleanString(planName)}. Payment ID: ${finalPaymentId}`,

      userId,

      paymentId: paymentRef.id,

      transactionId: finalPaymentId,

      customerName: cleanString(customerName),

      customerPhone,

      planId: String(planId),

      planName: cleanString(planName),

      family: family ? cleanString(family) : null,

      amount: numericAmount,

      paymentMethod: "qr_code",

      status: "pending",

      read: false,

      createdAt: now,

      updatedAt: now,
    });

    /* =======================================================
       8. RESPONSE
    ======================================================= */

    return NextResponse.json(
      {
        success: true,

        alreadySubmitted: false,

        paymentId: paymentRef.id,

        transactionId: finalPaymentId,

        status: "pending",

        paymentStatus: "pending",

        message:
          "Payment submitted successfully. Your payment is pending admin verification.",
      },
      { status: 201 },
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("❌ Payment Submission API Error:", error);

    if (error?.code === "auth/id-token-expired") {
      return NextResponse.json(
        {
          success: false,
          message: "Session expired. Please login again.",
        },
        { status: 401 },
      );
    }

    if (error?.code === "auth/argument-error") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid authentication token.",
        },
        { status: 401 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to submit payment for verification.",
      },
      { status: 500 },
    );
  }
}