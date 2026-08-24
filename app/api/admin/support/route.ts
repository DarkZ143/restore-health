/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { adminDb, adminAuth } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

// GET: Fetch all support tickets
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }
    const idToken = authHeader.split("Bearer ")[1];
    await adminAuth.verifyIdToken(idToken); // Basic admin verification

    const snapshot = await adminDb
      .collection("supportTickets")
      .orderBy("createdAt", "desc")
      .get();
    const tickets = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate
          ? data.createdAt.toDate().toISOString()
          : new Date().toISOString(),
      };
    });

    return NextResponse.json({ success: true, tickets });
  } catch (error: any) {
    console.error("Fetch Tickets Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch tickets." },
      { status: 500 },
    );
  }
}

// POST: Add a reply to a ticket
export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }
    const idToken = authHeader.split("Bearer ")[1];
    await adminAuth.verifyIdToken(idToken);

    const { ticketId, message } = await request.json();

    if (!ticketId || !message) {
      return NextResponse.json(
        { success: false, message: "Ticket ID and message are required." },
        { status: 400 },
      );
    }

    const ticketRef = adminDb.collection("supportTickets").doc(ticketId);

    // Add the new reply to the ticket's 'replies' array and update status
    const newReply = {
      sender: "admin",
      senderName: "RestoreHealth Support",
      message: message,
      createdAt: new Date().toISOString(),
    };

    await ticketRef.update({
      status: "answered", // Update status so user knows admin replied
      replies: FieldValue.arrayUnion(newReply),
    });

    return NextResponse.json({ success: true, reply: newReply });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Reply Ticket Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send reply." },
      { status: 500 },
    );
  }
}
