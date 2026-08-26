/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

/* =========================================================
   HELPERS
========================================================= */

function cleanString(value: unknown): string {
  return String(value || "").trim();
}

function generateId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase()}`;
}

function getIndianDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
  }).format(new Date());
}

/* =========================================================
   POST
========================================================= */

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      userId,
      customerName,
      phoneNumber,
      planId,
      planName,
      family,
      membershipAmount,
      gstAmount,
      totalAmount,
      paymentMethod,
    } = body;

    /* =====================================================
       VALIDATION
    ===================================================== */

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID is required.",
        },
        { status: 400 },
      );
    }

    if (!customerName) {
      return NextResponse.json(
        {
          success: false,
          message: "Customer name is required.",
        },
        { status: 400 },
      );
    }

    if (!phoneNumber) {
      return NextResponse.json(
        {
          success: false,
          message: "Customer phone number is required.",
        },
        { status: 400 },
      );
    }

    if (!planId || !planName) {
      return NextResponse.json(
        {
          success: false,
          message: "Plan information is required.",
        },
        { status: 400 },
      );
    }

    const membership = Number(membershipAmount || 0);
    const gst = Number(gstAmount || 0);
    const total = Number(totalAmount || 0);

    if (!Number.isFinite(total) || total <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid payment amount.",
        },
        { status: 400 },
      );
    }

    /* =====================================================
       ONLY QR FOR NOW
    ===================================================== */

    const method = cleanString(paymentMethod).toLowerCase();

    if (method !== "qr") {
      return NextResponse.json(
        {
          success: false,
          message: "Only QR payment is currently enabled.",
        },
        { status: 400 },
      );
    }

    /* =====================================================
       CUSTOMER DATA
    ===================================================== */

    const normalizedUserId = cleanString(userId);
    const normalizedName = cleanString(customerName);
    const normalizedPhone = cleanString(phoneNumber);
    const normalizedPlanId = cleanString(planId);
    const normalizedPlanName = cleanString(planName);

    /* =====================================================
       CHECK USER
    ===================================================== */

    const userRef = adminDb.collection("users").doc(normalizedUserId);
    const userSnapshot = await userRef.get();

    if (!userSnapshot.exists) {
      return NextResponse.json(
        {
          success: false,
          message: "User account could not be found.",
        },
        { status: 404 },
      );
    }

    /* =====================================================
       DUPLICATE PAYMENT PROTECTION
    ===================================================== */

    const existingPaymentSnapshot = await adminDb
      .collection("payments")
      .where("userId", "==", normalizedUserId)
      .where("planId", "==", normalizedPlanId)
      .where("status", "==", "pending")
      .limit(1)
      .get();

    if (!existingPaymentSnapshot.empty) {
      const existingPayment = existingPaymentSnapshot.docs[0].data();

      return NextResponse.json(
        {
          success: true,
          alreadySubmitted: true,
          paymentId:
            existingPayment.paymentId || existingPaymentSnapshot.docs[0].id,
          orderId: existingPayment.orderId || null,
          status: "pending",
          paymentVerified: false,
          message: "A payment for this plan is already pending verification.",
        },
        { status: 200 },
      );
    }

    /* =====================================================
       GENERATE IDS
    ===================================================== */

    const paymentRef = adminDb.collection("payments").doc();

    const orderRef = adminDb.collection("orders").doc();

    const paymentId = generateId("PAY");

    const orderId = generateId("ORD");

    const requestedDate = getIndianDate();

    const now = new Date();

    /* =====================================================
       PAYMENT DOCUMENT
    ===================================================== */

    const paymentData = {
      id: paymentRef.id,

      paymentId,

      orderId,

      /* Customer */

      userId: normalizedUserId,

      customerName: normalizedName,

      phoneNumber: normalizedPhone,

      /* Plan */

      planId: normalizedPlanId,

      planName: normalizedPlanName,

      family: family ? cleanString(family) : null,

      /* Amount */

      membershipAmount: membership,

      gstAmount: gst,

      amount: total,

      totalAmount: total,

      /* Payment */

      paymentMethod: "qr",

      status: "pending",

      paymentVerified: false,

      verificationStatus: "pending",

      /* Admin */

      approvedBy: null,

      approvedByEmail: null,

      approvedAt: null,

      rejectedBy: null,

      rejectedByEmail: null,

      rejectedAt: null,

      rejectionReason: null,

      /* Invoice */

      invoiceGenerated: false,

      invoiceId: null,

      invoiceUrl: null,

      /* Dates */

      transactionDate: requestedDate,

      createdAt: now,

      updatedAt: now,
    };

    /* =====================================================
       ORDER DOCUMENT
    ===================================================== */

    const orderData = {
      id: orderRef.id,

      orderId,

      /* Customer */

      userId: normalizedUserId,

      customerName: normalizedName,

      phoneNumber: normalizedPhone,

      /* Plan */

      planId: normalizedPlanId,

      planName: normalizedPlanName,

      family: family ? cleanString(family) : null,

      /* Payment */

      paymentId,

      paymentMethod: "qr",

      amount: total,

      membershipAmount: membership,

      gstAmount: gst,

      paymentStatus: "pending",

      paymentVerified: false,

      orderStatus: "payment_pending",

      confirmationStatus: "pending",

      /* Verification */

      verificationRequired: true,

      verificationStatus: "pending",

      /* Invoice */

      invoiceGenerated: false,

      invoiceId: null,

      invoiceUrl: null,

      /* Date */

      orderDate: requestedDate,

      createdAt: now,

      updatedAt: now,
    };

    /* =====================================================
       USER TRANSACTION RECORD
    ===================================================== */

    const transactionRef = userRef.collection("transactions").doc(paymentId);

    const transactionData = {
      transactionId: paymentId,

      orderId,

      paymentId,

      userId: normalizedUserId,

      customerName: normalizedName,

      planId: normalizedPlanId,

      planName: normalizedPlanName,

      family: family ? cleanString(family) : null,

      amount: total,

      membershipAmount: membership,

      gstAmount: gst,

      paymentMethod: "qr",

      status: "pending",

      verificationStatus: "pending",

      paymentVerified: false,

      transactionDate: requestedDate,

      createdAt: now,

      updatedAt: now,
    };

    /* =====================================================
       ADMIN NOTIFICATION
    ===================================================== */

    const notificationRef = adminDb.collection("notifications").doc();

    const notificationData = {
      id: notificationRef.id,

      type: "payment_pending",

      title: "Payment Verification Required",

      message: `${normalizedName} has submitted a QR payment of ₹${total.toLocaleString(
        "en-IN",
      )} for ${normalizedPlanName}.`,

      userId: normalizedUserId,

      orderId,

      paymentId,

      customerName: normalizedName,

      customerPhone: normalizedPhone,

      planId: normalizedPlanId,

      planName: normalizedPlanName,

      family: family ? cleanString(family) : null,

      amount: total,

      method: "qr",

      status: "pending",

      read: false,

      createdAt: now,

      updatedAt: now,
    };

    /* =====================================================
       USER ACTIVITY
    ===================================================== */

    const userActivityRef = userRef.collection("activity").doc();

    const userActivityData = {
      type: "payment_submitted",

      title: "Payment Submitted",

      message: `Your QR payment of ₹${total.toLocaleString(
        "en-IN",
      )} for ${normalizedPlanName} has been submitted and is awaiting verification.`,

      paymentId,

      orderId,

      amount: total,

      paymentMethod: "qr",

      status: "pending",

      createdAt: now,
    };

    /* =====================================================
       BATCH WRITE
    ===================================================== */

    const batch = adminDb.batch();

    batch.set(paymentRef, paymentData);

    batch.set(orderRef, orderData);

    batch.set(transactionRef, transactionData);

    batch.set(notificationRef, notificationData);

    batch.set(userActivityRef, userActivityData);

    /* Update user payment state */

    batch.set(
      userRef,
      {
        lastPaymentId: paymentId,

        lastOrderId: orderId,

        lastPaymentStatus: "pending",

        lastPaymentMethod: "qr",

        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

    await batch.commit();

    /* =====================================================
       SUCCESS
    ===================================================== */

    console.log("========================================");
    console.log("✅ PAYMENT SUBMITTED");
    console.log("User:", normalizedUserId);
    console.log("Payment:", paymentId);
    console.log("Order:", orderId);
    console.log("Amount:", total);
    console.log("Method:", "qr");
    console.log("Status:", "pending");
    console.log("========================================");

    return NextResponse.json(
      {
        success: true,

        alreadySubmitted: false,

        paymentId,

        orderId,

        transactionId: paymentId,

        status: "pending",

        paymentVerified: false,

        paymentMethod: "qr",

        amount: total,

        message:
          "Payment submitted successfully. Your transaction is now pending verification by our team.",
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("❌ Payment Confirmation API Error:", error);

    return NextResponse.json(
      {
        success: false,

        message: error?.message || "Unable to submit payment for verification.",

        code: error?.code || null,
      },
      { status: 500 },
    );
  }
}