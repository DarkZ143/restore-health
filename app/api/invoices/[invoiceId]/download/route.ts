import PDFDocument from "pdfkit";
import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ invoiceId: string }> },
) {
  try {
    const authorization = request.headers.get("Authorization");
    if (!authorization?.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Authentication required." }, { status: 401 });
    }

    const token = await adminAuth.verifyIdToken(authorization.slice(7));
    const { invoiceId } = await params;
    const invoiceSnapshot = await adminDb.collection("invoices").doc(invoiceId).get();

    if (!invoiceSnapshot.exists) {
      return NextResponse.json({ message: "Invoice not found." }, { status: 404 });
    }

    const invoice = invoiceSnapshot.data() || {};
    if (invoice.userId !== token.uid) {
      return NextResponse.json({ message: "You cannot access this invoice." }, { status: 403 });
    }
    if (invoice.status !== "approved" && invoice.status !== "paid") {
      return NextResponse.json({ message: "This invoice is not approved yet." }, { status: 403 });
    }

    const document = new PDFDocument({ margin: 50 });
    const chunks: Buffer[] = [];
    document.on("data", (chunk: Buffer) => chunks.push(chunk));
    const completed = new Promise<Buffer>((resolve) =>
      document.on("end", () => resolve(Buffer.concat(chunks))),
    );

    document.fontSize(24).fillColor("#087443").text("RestoreHealth", { align: "center" });
    document.moveDown();
    document.fontSize(18).fillColor("#1f2d24").text("INVOICE", { align: "center" });
    document.moveDown(2);
    document.fontSize(11).text(`Invoice Number: ${invoice.invoiceNumber || invoiceId}`);
    document.text(`Invoice Date: ${formatDate(invoice.approvedAt || invoice.createdAt)}`);
    document.text(`Status: ${invoice.status}`);
    document.moveDown();
    document.text(`Customer: ${invoice.customerName || "Customer"}`);
    document.text(`Mobile: ${invoice.customerPhone || "-"}`);
    document.moveDown();
    document.text(`Plan: ${invoice.planName || invoice.service || "RestoreHealth Plan"}`);
    document.text(`Payment ID: ${invoice.razorpayPaymentId || invoice.paymentId || "-"}`);
    document.text(`Order ID: ${invoice.orderId || "-"}`);
    document.text(`Payment Method: ${invoice.paymentMethod || "razorpay"}`);
    document.moveDown();
    document.fontSize(16).text(`Amount Paid: INR ${Number(invoice.amount || 0).toLocaleString("en-IN")}`);
    document.end();

    const pdf = await completed;
    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${safeFileName(invoice.invoiceNumber || invoiceId)}.pdf"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("Invoice download error:", error);
    return NextResponse.json({ message: "Unable to download invoice." }, { status: 500 });
  }
}

function formatDate(value: unknown) {
  if (!value) return new Date().toLocaleDateString("en-IN");
  const date =
    value instanceof Date
      ? value
      : typeof value === "object" && value !== null && "toDate" in value && typeof value.toDate === "function"
        ? value.toDate()
        : new Date(String(value));
  return Number.isNaN(date.getTime()) ? new Date().toLocaleDateString("en-IN") : date.toLocaleDateString("en-IN");
}

function safeFileName(value: unknown) {
  return String(value).replace(/[\\/:*?"<>|\r\n]+/g, "-");
}