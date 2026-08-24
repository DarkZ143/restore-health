import { NextResponse } from "next/server";
import {
  twilioClient,
  twilioVerifyServiceSid,
} from "../../../../config/twilio";
import { adminDb } from "@/lib/firebaseAdmin";

function normalizeIndianPhone(value: unknown): string {
  let phone = String(value || "").trim();

  // 9876543210 -> +919876543210
  if (/^\d{10}$/.test(phone)) {
    phone = `+91${phone}`;
  }

  // 919876543210 -> +919876543210
  if (/^91\d{10}$/.test(phone)) {
    phone = `+${phone}`;
  }

  return phone;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const phone = normalizeIndianPhone(body.phoneNumber);

    console.log("========================================");
    console.log("📱 SIGNUP OTP REQUEST");
    console.log("Phone:", phone);
    console.log("========================================");

    // ------------------------------------------
    // VALIDATE PHONE
    // ------------------------------------------

    if (!/^\+91\d{10}$/.test(phone)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid Indian mobile number.",
        },
        { status: 400 },
      );
    }

    // ------------------------------------------
    // CHECK TWILIO CONFIG
    // ------------------------------------------

    console.log("🔍 Checking Twilio configuration...");

    if (!twilioVerifyServiceSid) {
      console.error("❌ TWILIO_VERIFY_SERVICE_SID is missing.");

      return NextResponse.json(
        {
          success: false,
          message: "Twilio Verify service is not configured.",
        },
        { status: 500 },
      );
    }

    console.log("✅ Twilio Verify Service SID exists.");

    // ------------------------------------------
    // FIREBASE ADMIN
    // ------------------------------------------

    console.log("🔥 Checking Firebase Admin...");

    if (!adminDb) {
      console.error("❌ Firebase Admin DB is not initialized.");

      return NextResponse.json(
        {
          success: false,
          message: "Firebase Admin is not initialized.",
        },
        { status: 500 },
      );
    }

    console.log("✅ Firebase Admin DB initialized.");

    // ------------------------------------------
    // CHECK EXISTING USER
    // ------------------------------------------

    console.log("🔎 Checking whether user already exists...");

    const userSnapshot = await adminDb
      .collection("users")
      .where("phoneNumber", "==", phone)
      .limit(1)
      .get();

    console.log("👤 Existing user found:", !userSnapshot.empty);

    // ------------------------------------------
    // USER ALREADY EXISTS
    // ------------------------------------------

    if (!userSnapshot.empty) {
      return NextResponse.json(
        {
          success: false,
          message:
            "An account already exists with this phone number. Please login instead.",
        },
        { status: 409 },
      );
    }

    // ------------------------------------------
    // SEND OTP THROUGH TWILIO
    // ------------------------------------------

    console.log("📨 Sending OTP through Twilio...");

    const verification = await twilioClient.verify.v2
      .services(twilioVerifyServiceSid)
      .verifications.create({
        to: phone,
        channel: "sms",
      });

    console.log("✅ Twilio OTP response:", verification.status);

    // ------------------------------------------
    // SUCCESS
    // ------------------------------------------

    return NextResponse.json(
      {
        success: true,
        status: verification.status,
        message: "OTP sent successfully.",
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("========================================");
    console.error("❌ SIGNUP OTP API ERROR");
    console.error(error);
    console.error("========================================");

    const err = error as {
      message?: string;
      code?: string | number;
      moreInfo?: string;
      status?: number;
    };

    return NextResponse.json(
      {
        success: false,
        message: err?.message || "Failed to send OTP.",
        code: err?.code || null,
        moreInfo: err?.moreInfo || null,
      },
      { status: 500 },
    );
  }
}
