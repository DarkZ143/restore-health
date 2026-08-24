/* eslint-disable @typescript-eslint/no-explicit-any */
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

    // Check if user is actually an admin
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

    // 2. FETCH AGENTS DATA
    // Hum 'users' collection se data fetch kar rahe hain
    const usersSnapshot = await adminDb.collection("users").get();

    const agents = usersSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        fullName: data.fullName || data.name || "",
        email: data.email || "",
        phoneNumber: data.phoneNumber || data.phone || "",
        role: data.role || "agent",
        status: data.status || "active",
        phoneVerified: data.phoneVerified || false,
        createdAt: data.createdAt
          ? data.createdAt.toDate
            ? data.createdAt.toDate().toISOString()
            : new Date(data.createdAt).toISOString()
          : null,
      };
    });

    // Baad me agar filter karna ho (sirf agents chahiye), toh yahan filter laga sakte ho
    // const filteredAgents = agents.filter(a => a.role === 'agent');

    return NextResponse.json({
      success: true,
      agents: agents,
    });
  } catch (error: any) {
    console.error("❌ Admin Agents API Error:", error);

    if (error.code === "auth/id-token-expired") {
      return NextResponse.json(
        { success: false, message: "Session expired. Please login again." },
        { status: 401 },
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to load agents." },
      { status: 500 },
    );
  }
}
