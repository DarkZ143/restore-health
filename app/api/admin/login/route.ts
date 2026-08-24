import { NextResponse } from "next/server";
// Make sure adminAuth and adminDb are exported from your firebaseAdmin file
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

export async function POST(request: Request) {
  try {
    // 1. Get the Authorization header from the frontend request
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Missing or invalid authorization token." },
        { status: 401 },
      );
    }

    const idToken = authHeader.split("Bearer ")[1];

    // 2. Verify the Firebase ID Token using Firebase Admin
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const { uid, email } = decodedToken;

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Invalid token payload." },
        { status: 401 },
      );
    }

    // 3. Verify if this user actually exists in the 'admins' Firestore collection
    const adminsRef = adminDb.collection("admins");
    const snapshot = await adminsRef
      .where("email", "==", email.toLowerCase())
      .get();

    if (snapshot.empty) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Admin access only." },
        { status: 403 },
      );
    }

    // 4. Extract Admin Data
    let adminData = null;
    snapshot.forEach((doc) => {
      const data = doc.data();
      adminData = {
        uid: uid,
        email: data.email,
        name: data.name || "Administrator",
        role: data.role || "admin",
      };
    });

    // 5. Return Success Response
    return NextResponse.json({
      success: true,
      message: "Login successful",
      admin: adminData,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("❌ Admin API Login Error:", error);

    // Handle expired tokens gracefully
    if (error.code === "auth/id-token-expired") {
      return NextResponse.json(
        { success: false, message: "Session expired. Please login again." },
        { status: 401 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error during authentication.",
      },
      { status: 500 },
    );
  }
}
