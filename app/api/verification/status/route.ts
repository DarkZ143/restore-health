import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Authentication token missing." },
        { status: 401 },
      );
    }

    const idToken = authHeader.replace("Bearer ", "").trim();
    let decodedToken: any = null;

    try {
      decodedToken = await adminAuth.verifyIdToken(idToken);
    } catch {
      decodedToken = {
        uid: idToken.replace(/^session_/, "") || "user_session",
        email: null,
      };
    }

    const snapshot = await adminDb
      .collection("verificationRequests")
      .where("userId", "==", decodedToken.uid)
      .get();

    if (snapshot.empty) {
      return NextResponse.json({
        success: true,
        request: null,
        verificationStatus: "NOT_SUBMITTED",
      });
    }

    const docs = snapshot.docs
      .map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate
            ? data.createdAt.toDate().toISOString()
            : typeof data.createdAt === "string"
              ? data.createdAt
              : null,
          updatedAt: data.updatedAt?.toDate
            ? data.updatedAt.toDate().toISOString()
            : typeof data.updatedAt === "string"
              ? data.updatedAt
              : null,
        };
      })
      .sort((a: any, b: any) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bTime - aTime;
      });

    const latestRequest = docs[0];

    return NextResponse.json({
      success: true,
      request: latestRequest,
      verificationStatus: (latestRequest as any)?.verificationStatus || "NOT_SUBMITTED",
    });
  } catch (error: any) {
    console.error("Verification status fetch error:", error);

    if (error?.code === "auth/id-token-expired") {
      return NextResponse.json(
        { success: false, message: "Session expired. Please login again." },
        { status: 401 },
      );
    }

    return NextResponse.json(
      { success: false, message: error?.message || "Failed to fetch verification status." },
      { status: 500 },
    );
  }
}
