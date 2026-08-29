import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

export async function GET(request: Request) {
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

    const snapshot = await adminDb.collection("verificationRequests").get();

    const formatDateValue = (val: any) => {
      if (!val) return null;
      if (val.toDate && typeof val.toDate === "function") return val.toDate().toISOString();
      if (val instanceof Date) return val.toISOString();
      if (typeof val === "string") return val;
      return null;
    };

    const getDocTimestamp = (item: any) => {
      const dateVal = item.updatedAt || item.createdAt;
      if (!dateVal) return Number.MAX_SAFE_INTEGER;
      if (typeof dateVal === "object" && dateVal !== null) {
        if (typeof dateVal.toDate === "function") return dateVal.toDate().getTime();
        if (typeof dateVal.seconds === "number") return dateVal.seconds * 1000;
      }
      const time = new Date(dateVal).getTime();
      return isNaN(time) ? Number.MAX_SAFE_INTEGER : time;
    };

    const requests = snapshot.docs
      .map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: formatDateValue(data.createdAt),
          updatedAt: formatDateValue(data.updatedAt),
          approvedAt: formatDateValue(data.approvedAt),
          rejectedAt: formatDateValue(data.rejectedAt),
        };
      })
      .sort((a: any, b: any) => {
        return getDocTimestamp(b) - getDocTimestamp(a);
      });

    return NextResponse.json({ success: true, requests });
  } catch (error: any) {
    console.error("Admin verification requests fetch error:", error);

    if (error?.code === "auth/id-token-expired") {
      return NextResponse.json(
        { success: false, message: "Session expired. Please login again." },
        { status: 401 },
      );
    }

    return NextResponse.json(
      { success: false, message: error?.message || "Failed to fetch verification requests." },
      { status: 500 },
    );
  }
}
