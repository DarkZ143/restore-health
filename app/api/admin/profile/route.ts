import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

export async function PATCH(request: Request) {
  try {
    const authorization = request.headers.get("authorization");

    if (!authorization?.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Authentication is required." },
        { status: 401 },
      );
    }

    const token = authorization.slice("Bearer ".length);
    const decodedToken = await adminAuth.verifyIdToken(token);
    const email = decodedToken.email?.toLowerCase();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "The authenticated admin has no email." },
        { status: 401 },
      );
    }

    const body = await request.json();
    const name = String(body.name || "").trim();

    if (name.length < 2 || name.length > 80) {
      return NextResponse.json(
        { success: false, message: "Name must be between 2 and 80 characters." },
        { status: 400 },
      );
    }

    const snapshot = await adminDb
      .collection("admins")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return NextResponse.json(
        { success: false, message: "Admin account not found." },
        { status: 404 },
      );
    }

    await snapshot.docs[0].ref.update({ name, updatedAt: new Date() });
    await adminAuth.updateUser(decodedToken.uid, { displayName: name });

    return NextResponse.json({ success: true, name });
  } catch (error: unknown) {
    console.error("Admin profile update error:", error);

    return NextResponse.json(
      { success: false, message: "Unable to update the admin profile." },
      { status: 500 },
    );
  }
}