import { NextResponse } from "next/server";
import { twilioClient, twilioVerifyServiceSid } from "../../../config/twilio";
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
    const otp = String(body.otp || "").trim();

    // ------------------------------------------
    // VALIDATION
    // ------------------------------------------

    if (!phone || !otp) {
      return NextResponse.json(
        {
          success: false,
          message: "Phone number and OTP are required.",
        },
        { status: 400 },
      );
    }

    if (!/^\+91\d{10}$/.test(phone)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid Indian mobile number.",
        },
        { status: 400 },
      );
    }

    if (!/^\d{4,8}$/.test(otp)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid OTP.",
        },
        { status: 400 },
      );
    }

    console.log("🔐 Login OTP verification requested for:", phone);

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
          message: "No account found with this phone number.",
        },
        { status: 404 },
      );
    }

    // ------------------------------------------
    // VERIFY OTP THROUGH TWILIO
    // ------------------------------------------

    const verificationCheck = await twilioClient.verify.v2
      .services(twilioVerifyServiceSid)
      .verificationChecks.create({
        to: phone,
        code: otp,
      });

    console.log("🔐 Login OTP verification status:", verificationCheck.status);

    // ------------------------------------------
    // INVALID / EXPIRED OTP
    // ------------------------------------------

    if (verificationCheck.status !== "approved") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired OTP.",
        },
        { status: 400 },
      );
    }

    // ------------------------------------------
    // GET USER DATA
    // ------------------------------------------

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    // ------------------------------------------
    // MARK PHONE VERIFIED
    // ------------------------------------------

    await userDoc.ref.update({
      phoneVerified: true,
      updatedAt: new Date(),
    });

    // ------------------------------------------
    // SUCCESS
    // ------------------------------------------

    return NextResponse.json(
      {
        success: true,
        status: verificationCheck.status,
        message: "Login OTP verified successfully.",

        userId: userDoc.id,

        user: {
          id: userDoc.id,
          fullName: userData.fullName || "",
          email: userData.email || "",
          phoneNumber: userData.phoneNumber || phone,
          phoneVerified: true,
          role: userData.role || "agent",
          status: userData.status || "active",
        },
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error(" Login Verify OTP Error:", error);

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
        message: err?.message || "Failed to verify login OTP.",
        code: err?.code || null,
      },
      { status: 500 },
    );
  }
}
