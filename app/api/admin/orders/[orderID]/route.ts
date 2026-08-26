import { NextRequest, NextResponse } from "next/server";
import { adminDb, adminAuth } from "@/lib/firebaseAdmin";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderID: string }> },
) {
  try {
    const { orderID } = await params;
    const orderId = orderID;

    // 1. 🛡️ SECURITY CHECK: VERIFY ADMIN
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access." },
        { status: 401 },
      );
    }
    const idToken = authHeader.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(idToken);

    const adminCheck = await adminDb
      .collection("admins")
      .where("email", "==", decodedToken.email?.toLowerCase())
      .get();
    if (adminCheck.empty)
      return NextResponse.json(
        { success: false, message: "Forbidden." },
        { status: 403 },
      );

    // 2. FETCH ORDER DETAILS
    const orderDoc = await adminDb.collection("orders").doc(orderId).get();

    if (!orderDoc.exists) {
      return NextResponse.json(
        { success: false, message: "Order not found." },
        { status: 404 },
      );
    }

    const data = orderDoc.data();

    // 3. FORMAT DATA
    const formattedOrder = {
      id: orderDoc.id,
      customerName: data?.customerName || data?.userName || "Unknown Customer",
      customerEmail: data?.customerEmail || data?.userEmail || "No Email",
      customerPhone: data?.customerPhone || data?.userPhone || "No Phone",
      amount: data?.amount || data?.totalAmount || 0,
      status: data?.status || data?.orderStatus || "pending",
      paymentStatus: data?.paymentStatus || "pending",
      paymentMethod: data?.paymentMethod || "Online Payment",
      items: data?.items || [],
      shippingAddress:
        data?.shippingAddress || data?.address || "No address provided",
      createdAt: data?.createdAt
        ? data.createdAt.toDate
          ? data.createdAt.toDate().toISOString()
          : new Date(data.createdAt).toISOString()
        : null,
    };

    return NextResponse.json({ success: true, order: formattedOrder });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("❌ Order Details API Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load order details." },
      { status: 500 },
    );
  }
}
