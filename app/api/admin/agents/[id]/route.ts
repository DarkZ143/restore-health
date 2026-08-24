import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function serializeDate(value: unknown): string | null {
  if (!value) return null;

  try {
    if (
      typeof value === "object" &&
      value !== null &&
      "toDate" in value &&
      typeof (value as { toDate?: unknown }).toDate === "function"
    ) {
      return (value as { toDate: () => Date }).toDate().toISOString();
    }

    if (value instanceof Date) {
      return value.toISOString();
    }

    if (typeof value === "string") {
      return value;
    }

    return null;
  } catch {
    return null;
  }
}

function serializeDocument(id: string, data: FirebaseFirestore.DocumentData) {
  const result: Record<string, unknown> = {
    id,
    ...data,
  };

  // Convert Firebase Timestamp fields to JSON-safe strings.
  for (const key of Object.keys(result)) {
    const value = result[key];

    if (
      value instanceof Date ||
      (typeof value === "object" &&
        value !== null &&
        "toDate" in value &&
        typeof (value as { toDate?: unknown }).toDate === "function")
    ) {
      result[key] = serializeDate(value);
    }
  }

  return result;
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    console.log("========================================");
    console.log("👤 ADMIN AGENT DETAILS REQUEST");
    console.log("========================================");

    const { id: agentId } = await context.params;

    if (!agentId) {
      return NextResponse.json(
        {
          success: false,
          message: "Agent ID is required.",
        },
        { status: 400 },
      );
    }

    console.log("🔎 Agent ID:", agentId);

    // ==========================================================
    // GET AGENT
    // ==========================================================

    const agentRef = adminDb.collection("users").doc(agentId);

    const agentSnapshot = await agentRef.get();

    if (!agentSnapshot.exists) {
      console.log("❌ Agent not found:", agentId);

      return NextResponse.json(
        {
          success: false,
          message: "Agent not found.",
        },
        { status: 404 },
      );
    }

    const agentData = agentSnapshot.data() || {};

    const agent = {
      id: agentSnapshot.id,
      fullName: agentData.fullName || "",
      email: agentData.email || "",
      phoneNumber: agentData.phoneNumber || "",
      role: agentData.role || "agent",
      status: agentData.status || "active",
      phoneVerified: agentData.phoneVerified ?? false,
      createdAt: serializeDate(agentData.createdAt),
    };

    console.log("✅ Agent found:", agent.email);

    // ==========================================================
    // ORDERS
    // ==========================================================

    console.log("🛒 Fetching agent orders...");

    const ordersSnapshot = await adminDb
      .collection("orders")
      .where("userId", "==", agentId)
      .get();

    const orders = ordersSnapshot.docs
      .map((doc) => serializeDocument(doc.id, doc.data()))
      .sort((a, b) => {
        const dateA = String(a.createdAt || "");
        const dateB = String(b.createdAt || "");

        return dateB.localeCompare(dateA);
      });

    console.log(`✅ Orders found: ${orders.length}`);

    // ==========================================================
    // TRANSACTIONS
    // ==========================================================

    console.log("💳 Fetching agent transactions...");

    const transactionsSnapshot = await adminDb
      .collection("transactions")
      .where("userId", "==", agentId)
      .get();

    const transactions = transactionsSnapshot.docs
      .map((doc) => serializeDocument(doc.id, doc.data()))
      .sort((a, b) => {
        const dateA = String(a.createdAt || "");
        const dateB = String(b.createdAt || "");

        return dateB.localeCompare(dateA);
      });

    console.log(`✅ Transactions found: ${transactions.length}`);

    // ==========================================================
    // INVOICES
    // ==========================================================

    console.log("🧾 Fetching agent invoices...");

    const invoicesSnapshot = await adminDb
      .collection("invoices")
      .where("userId", "==", agentId)
      .get();

    const invoices = invoicesSnapshot.docs
      .map((doc) => {
        const data = doc.data();

        return {
          ...serializeDocument(doc.id, data),

          invoiceNumber: data.invoiceNumber || data.invoiceId || doc.id,

          amount: Number(data.amount || 0),

          description: data.description || data.orderDescription || "",

          status: data.status || "pending",

          createdAt: serializeDate(data.createdAt),

          dueDate: serializeDate(data.dueDate),
        };
      })
      .sort((a, b) => {
        const dateA = String(a.createdAt || "");
        const dateB = String(b.createdAt || "");

        return dateB.localeCompare(dateA);
      });

    console.log(`✅ Invoices found: ${invoices.length}`);

    // ==========================================================
    // RESPONSE
    // ==========================================================

    return NextResponse.json(
      {
        success: true,

        agent,

        orders,

        transactions,

        invoices,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("❌ Admin Agent Details API Error:", error);

    const err = error as {
      message?: string;
      code?: string | number;
    };

    return NextResponse.json(
      {
        success: false,
        message: err?.message || "Failed to fetch agent details.",
        code: err?.code || null,
      },
      { status: 500 },
    );
  }
}
