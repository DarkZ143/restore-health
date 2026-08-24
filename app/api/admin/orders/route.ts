import { NextResponse } from "next/server";
import { adminDb, adminAuth } from "@/lib/firebaseAdmin";

export async function GET(request: Request) {
  try {
    // 1. 🛡️ SECURITY CHECK: VERIFY ADMIN TOKEN
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access. Token missing." },
        { status: 401 },
      );
    }

    const idToken = authHeader.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(idToken);

    if (!decodedToken.email) {
      return NextResponse.json(
        { success: false, message: "Invalid token payload." },
        { status: 401 },
      );
    }

    // 2. VERIFY ADMIN IN DATABASE
    const adminCheck = await adminDb
      .collection("admins")
      .where("email", "==", decodedToken.email.toLowerCase())
      .get();

    if (adminCheck.empty) {
      return NextResponse.json(
        { success: false, message: "Forbidden. Admin access only." },
        { status: 403 },
      );
    }

    // 3. FETCH ORDERS HISTORY (Fetching up to 500 for history, can be adjusted)
    const ordersSnapshot = await adminDb
      .collection("orders")
      .orderBy("createdAt", "desc")
      .limit(500)
      .get();

    const orders = ordersSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        customerName: data.customerName || data.userName || "Guest User",
        customerEmail: data.customerEmail || data.userEmail || "No Email",
        amount: data.amount || data.totalAmount || 0,
        status: data.status || data.orderStatus || "pending",
        paymentStatus: data.paymentStatus || "pending",
        createdAt: data.createdAt
          ? data.createdAt.toDate
            ? data.createdAt.toDate().toISOString()
            : new Date(data.createdAt).toISOString()
          : null,
      };
    });

    return NextResponse.json({
      success: true,
      orders: orders,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("❌ Admin Orders History API Error:", error);

    if (error.code === "auth/id-token-expired") {
      return NextResponse.json(
        { success: false, message: "Session expired. Please login again." },
        { status: 401 },
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to load orders history." },
      { status: 500 },
    );
  }
}
