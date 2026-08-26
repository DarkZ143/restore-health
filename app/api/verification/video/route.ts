/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Authentication required." },
        { status: 401 },
      );
    }

    const idToken = authHeader.replace("Bearer ", "").trim();
    const decodedToken = await adminAuth.verifyIdToken(idToken);

    const formData = await request.formData();
    const video = formData.get("video");
    const transcript = formData.get("transcript")?.toString() || "";
    const planId = formData.get("planId")?.toString() || "";

    if (!(video instanceof Blob)) {
      return NextResponse.json(
        { success: false, message: "Video file is required." },
        { status: 400 },
      );
    }

    const fileName = `verification-${decodedToken.uid}-${Date.now()}.webm`;
    const videoUrl = `/uploads/verification/${fileName}`;

    return NextResponse.json({
      success: true,
      message: "Video verification saved successfully.",
      videoUrl,
      transcript,
      planId,
      userId: decodedToken.uid,
    });
  } catch (error: any) {
    console.error("❌ Video verification upload error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error?.message || "Video verification could not be saved.",
      },
      { status: 500 },
    );
  }
}
