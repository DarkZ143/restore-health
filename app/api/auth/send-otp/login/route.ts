import { NextResponse } from "next/server";
import {
  twilioClient,
  twilioVerifyServiceSid,
} from "../../../../config/twilio";
import { adminDb } from "@/lib/firebaseAdmin";

function normalizeIndianPhone(value: unknown): string {
  let phone = String(value || "").trim();

  // 9876543210 → +919876543210
  if (/^\d{10}$/.test(phone)) {
    phone = `+91${phone}`;
  }

  // 919876543210 → +919876543210
  if (/^91\d{10}$/.test(phone)) {
    phone = `+${phone}`;
  }

  return phone;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const phone = normalizeIndianPhone(body.phoneNumber);

    // ------------------------------------------
    // VALIDATE PHONE NUMBER
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

    console.log("📱 Login OTP requested for:", phone);

    // ------------------------------------------
    // CHECK TWILIO CONFIG
    // ------------------------------------------

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

    // ------------------------------------------
    // CHECK USER IN FIRESTORE
    // ------------------------------------------

    const snapshot = await adminDb
      .collection("users")
      .where("phoneNumber", "==", phone)
      .limit(1)
      .get();

    // ------------------------------------------
    // USER NOT FOUND
    // ------------------------------------------

    if (snapshot.empty) {
      console.log("❌ Login user not found:", phone);

      return NextResponse.json(
        {
          success: false,
          message:
            "No account found with this phone number. Please create an account first.",
        },
        { status: 404 },
      );
    }

    // ------------------------------------------
    // USER FOUND
    // ------------------------------------------

    const userDoc = snapshot.docs[0];

    console.log("✅ Login user found:", userDoc.id);

    // ------------------------------------------
    // SEND LOGIN OTP
    // ------------------------------------------

    const verification = await twilioClient.verify.v2
      .services(twilioVerifyServiceSid)
      .verifications.create({
        to: phone,
        channel: "sms",
      });

    console.log("✅ Login OTP status:", verification.status);

    // ------------------------------------------
    // SUCCESS
    // ------------------------------------------

    return NextResponse.json(
      {
        success: true,
        status: verification.status,
        message: "Login OTP sent successfully.",
        userId: userDoc.id,
        phoneNumber: phone,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("❌ Login Send OTP Error:", error);

    const err = error as {
      message?: string;
      code?: string | number;
      moreInfo?: string;
    };

    console.error("Error code:", err?.code);
    console.error("Error message:", err?.message);
    console.error("More info:", err?.moreInfo);

    return NextResponse.json(
      {
        success: false,
        message: err?.message || "Failed to send login OTP.",
        code: err?.code || null,
      },
      { status: 500 },
    );
  }
}
