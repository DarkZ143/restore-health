/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

function convertDate(value: any) {
  if (!value) return null;

  // Firestore Timestamp
  if (typeof value.toDate === "function") {
    return value.toDate().toISOString();
  }

  // JS Date
  if (value instanceof Date) {
    return value.toISOString();
  }

  // Already string / other value
  if (typeof value === "string") {
    return value;
  }

  return null;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const phoneNumber = String(searchParams.get("phoneNumber") || "").trim();

    if (!phoneNumber) {
      return NextResponse.json(
        {
          success: false,
          message: "Phone number is required.",
        },
        { status: 400 },
      );
    }

    console.log("📊 Dashboard request:", phoneNumber);

    // ==========================================================
    // FIND USER
    // ==========================================================

    const db = adminDb;

    const userSnapshot = await db
      .collection("users")
      .where("phoneNumber", "==", phoneNumber)
      .limit(1)
      .get();

    if (userSnapshot.empty) {
      return NextResponse.json(
        {
          success: false,
          message: "User account not found.",
        },
        { status: 404 },
      );
    }

    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();

    // ==========================================================
    // USER
    // ==========================================================

    const user = {
      id: userDoc.id,
      fullName: userData.fullName || "",
      email: userData.email || "",
      phoneNumber: userData.phoneNumber || phoneNumber,
      phoneVerified: userData.phoneVerified ?? false,
      role: userData.role || "agent",
      status: userData.status || "active",
      createdAt: convertDate(userData.createdAt),
    };

    // ==========================================================
    // TRANSACTIONS
    // ==========================================================

    let transactions: any[] = [];

    try {
      const transactionSnapshot = await db
        .collection("transactions")
        .where("userId", "==", userDoc.id)
        .get();

      transactions = transactionSnapshot.docs
        .map((doc: FirebaseFirestore.QueryDocumentSnapshot) => {
          const data = doc.data();

          return {
            id: doc.id,
            amount: data.amount ?? 0,
            status: data.status || "pending",
            type: data.type || "",
            description: data.description || "",
            createdAt: convertDate(data.createdAt),
          };
        })
        .sort((a: any, b: any) => {
          if (!a.createdAt) return 1;
          if (!b.createdAt) return -1;

          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });
    } catch (error) {
      console.error("⚠️ Transactions fetch error:", error);

      // Dashboard should still load
      transactions = [];
    }

    // ==========================================================
    // INVOICES
    // ==========================================================

    let invoices: any[] = [];

    try {
      const invoiceSnapshot = await db
        .collection("invoices")
        .where("userId", "==", userDoc.id)
        .get();

      invoices = invoiceSnapshot.docs
        .map((doc: FirebaseFirestore.QueryDocumentSnapshot) => {
          const data = doc.data();

          return {
            id: doc.id,
            invoiceNumber: data.invoiceNumber || doc.id,
            amount: data.amount ?? 0,
            status: data.status || "pending",
            description: data.description || "",
            createdAt: convertDate(data.createdAt),
            dueDate: convertDate(data.dueDate),
          };
        })
        .sort((a: any, b: any) => {
          if (!a.createdAt) return 1;
          if (!b.createdAt) return -1;

          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });
    } catch (error) {
      console.error("⚠️ Invoices fetch error:", error);

      // Dashboard should still load
      invoices = [];
    }

    // ==========================================================
    // SUMMARY
    // ==========================================================

    const totalTransactions = transactions.length;
    const totalInvoices = invoices.length;

    const totalTransactionAmount = transactions.reduce(
      (total, transaction) => total + Number(transaction.amount || 0),
      0,
    );

    const totalInvoiceAmount = invoices.reduce(
      (total, invoice) => total + Number(invoice.amount || 0),
      0,
    );

    // ==========================================================
    // RESPONSE
    // ==========================================================

    return NextResponse.json({
      success: true,

      user,

      transactions,

      invoices,

      summary: {
        totalTransactions,
        totalInvoices,
        totalTransactionAmount,
        totalInvoiceAmount,
      },
    });
  } catch (error: any) {
    console.error("❌ Dashboard API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to load dashboard data.",
      },
      { status: 500 },
    );
  }
}
