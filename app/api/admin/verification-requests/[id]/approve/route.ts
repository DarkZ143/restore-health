import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

export async function PATCH(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access. Token missing." },
        { status: 401 },
      );
    }

    const idToken = authHeader.replace("Bearer ", "").trim();
    const decodedToken = await adminAuth.verifyIdToken(idToken);

    if (!decodedToken.email) {
      return NextResponse.json(
        { success: false, message: "Invalid token payload." },
        { status: 401 },
      );
    }

    const adminSnapshot = await adminDb
      .collection("admins")
      .where("email", "==", decodedToken.email.toLowerCase())
      .limit(1)
      .get();

    if (adminSnapshot.empty) {
      return NextResponse.json(
        { success: false, message: "Forbidden. Admin access only." },
        { status: 403 },
      );
    }

    const { pathname } = new URL(request.url);
    const requestId = pathname.split("/").filter(Boolean).at(-2) || "";

    const ref = adminDb.collection("verificationRequests").doc(requestId);
    const snapshot = await ref.get();

    if (!snapshot.exists) {
      return NextResponse.json(
        { success: false, message: "Verification request not found." },
        { status: 404 },
      );
    }

    const data = snapshot.data();

    await ref.update({
      verificationStatus: "APPROVED",
      paymentStatus: "APPROVED",
      approvedBy: decodedToken.email,
      approvedAt: new Date(),
      rejectedAt: null,
      rejectionReason: null,
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: "Verification request approved.",
      verificationStatus: "APPROVED",
      requestId,
      data: {
        ...data,
        verificationStatus: "APPROVED",
      },
    });
  } catch (error: any) {
    console.error("Admin verification approval error:", error);

    return NextResponse.json(
      { success: false, message: error?.message || "Failed to approve verification request." },
      { status: 500 },
    );
  }
}
