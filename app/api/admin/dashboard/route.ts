/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { adminDb, adminAuth } from "@/lib/firebaseAdmin"; // adminAuth add kiya token verify karne ke liye

function getDateRange(searchParams: URLSearchParams) {
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  let fromDate: Date;
  let toDate: Date;

  if (from) {
    fromDate = new Date(`${from}T00:00:00.000Z`);
  } else {
    fromDate = new Date();
    fromDate.setUTCHours(0, 0, 0, 0);
  }

  if (to) {
    toDate = new Date(`${to}T23:59:59.999Z`);
  } else {
    toDate = new Date();
    toDate.setUTCHours(23, 59, 59, 999);
  }

  return { fromDate, toDate };
}

function timestampToISO(value: any) {
  if (!value) return null;
  if (typeof value.toDate === "function") {
    return value.toDate().toISOString();
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  return null;
}

export async function GET(request: Request) {
  try {
    // ==========================================================
    // 🛡️ SECURITY CHECK: VERIFY ADMIN TOKEN
    // ==========================================================
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access. Token missing." },
        { status: 401 },
      );
    }

    const idToken = authHeader.split("Bearer ")[1];

    // Token verify karo Firebase Admin se
    const decodedToken = await adminAuth.verifyIdToken(idToken);

    if (!decodedToken.email) {
      return NextResponse.json(
        { success: false, message: "Invalid token payload." },
        { status: 401 },
      );
    }

    // Ek final check ki yeh user sach mein admin list mein hai ya nahi
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

    // ==========================================================
    // DATA FETCHING LOGIC STARTS HERE
    // ==========================================================
    const { searchParams } = new URL(request.url);
    const { fromDate, toDate } = getDateRange(searchParams);

    console.log("========================================");
    console.log("📊 ADMIN DASHBOARD REQUEST");
    console.log("Admin Email:", decodedToken.email);
    console.log("From:", fromDate.toISOString());
    console.log("To:", toDate.toISOString());
    console.log("========================================");

    // 1. AGENTS / USERS
    const usersSnapshot = await adminDb.collection("users").get();
    const agentCount = usersSnapshot.size;

    // 2. ORDERS
    const ordersSnapshot = await adminDb
      .collection("orders")
      .where("createdAt", ">=", fromDate)
      .where("createdAt", "<=", toDate)
      .get();
    const orderCount = ordersSnapshot.size;

    // 3. PAYMENT DATA
    const paymentsSnapshot = await adminDb.collection("payments").get();
    let successfulPayments = 0;
    let pendingPayments = 0;
    let failedPayments = 0;
    let successfulAmount = 0;
    let pendingAmount = 0;
    let failedAmount = 0;

    paymentsSnapshot.forEach((doc) => {
      const data = doc.data();
      const amount = Number(data.amount || 0);
      const status = String(data.status || "").toLowerCase();

      if (
        status === "success" ||
        status === "successful" ||
        status === "paid" ||
        status === "completed"
      ) {
        successfulPayments += 1;
        successfulAmount += amount;
      } else if (status === "pending" || status === "processing") {
        pendingPayments += 1;
        pendingAmount += amount;
      } else if (status === "failed" || status === "failure") {
        failedPayments += 1;
        failedAmount += amount;
      }
    });

    // 4. CONFIRMATION PENDING
    const pendingConfirmationSnapshot = await adminDb
      .collection("orders")
      .where("confirmationStatus", "==", "pending")
      .get();
    const confirmationPending = pendingConfirmationSnapshot.size;

    // 5. OPEN SUPPORT ISSUES
    const issuesSnapshot = await adminDb
      .collection("supportTickets")
      .where("status", "==", "open")
      .get();
    const openIssues = issuesSnapshot.size;

    // 6. RECENT NOTIFICATIONS
    const notificationsSnapshot = await adminDb
      .collection("notifications")
      .orderBy("createdAt", "desc")
      .limit(10)
      .get();

    const notifications = notificationsSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        type: data.type || "info",
        title: data.title || "",
        message: data.message || "",
        orderId: data.orderId || null,
        userId: data.userId || null,
        read: data.read ?? false,
        createdAt: timestampToISO(data.createdAt),
      };
    });

    // 7. RESPONSE
    return NextResponse.json({
      success: true,
      // Ab hume DB me search karne ki zarurat nahi, token me admin ka email already hai
      admin: {
        email: decodedToken.email,
      },
      filters: {
        from: fromDate.toISOString(),
        to: toDate.toISOString(),
      },
      stats: {
        agents: agentCount,
        orders: orderCount,
        payments: {
          successful: successfulPayments,
          pending: pendingPayments,
          failed: failedPayments,
          successfulAmount,
          pendingAmount,
          failedAmount,
          totalAmount: successfulAmount + pendingAmount + failedAmount,
        },
        confirmationPending,
        issues: openIssues,
      },
      notifications,
    });
  } catch (error: any) {
    console.error("❌ Admin Dashboard API Error:", error);

    if (error.code === "auth/id-token-expired") {
      return NextResponse.json(
        { success: false, message: "Session expired. Please login again." },
        { status: 401 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to load admin dashboard.",
      },
      { status: 500 },
    );
  }
}
