import { NextResponse } from "next/server";
import { twilioClient, twilioVerifyServiceSid } from "../../../config/twilio";

export async function POST(request: Request) {
  try {
    const { phoneNumber, otp } = await request.json();

    if (!phoneNumber || !otp) {
      return NextResponse.json(
        { success: false, message: "Phone number and OTP are required." },
        { status: 400 },
      );
    }

    if (!twilioVerifyServiceSid) {
      return NextResponse.json(
        { success: false, message: "Twilio Verify service is not configured." },
        { status: 500 },
      );
    }

    const verificationCheck = await twilioClient.verify.v2
      .services(twilioVerifyServiceSid)
      .verificationChecks.create({
        to: String(phoneNumber).trim(),
        code: String(otp).trim(),
      });

    if (verificationCheck.status !== "approved") {
      return NextResponse.json(
        { success: false, message: "Invalid OTP." },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      status: verificationCheck.status,
      message: "Signup OTP verified successfully.",
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("❌ Signup Verify OTP Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to verify signup OTP.",
        code: error?.code || null,
      },
      { status: 500 },
    );
  }
}
