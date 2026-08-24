import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import bcrypt from "bcryptjs";

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const phoneNumber = String(body.phoneNumber || "").trim();
    const currentPassword = String(body.currentPassword || "");
    const newPassword = String(body.newPassword || "");

    if (!currentPassword) {
      return NextResponse.json(
        { success: false, message: "Current password is required." },
        { status: 400 },
      );
    }

    const snapshot = await adminDb.collection("users").where("phoneNumber", "==", phoneNumber).limit(1).get();
    if (snapshot.empty) return NextResponse.json({ success: false, message: "User account not found." }, { status: 404 });

    const doc = snapshot.docs[0];
    const data = doc.data();
    const updates: Record<string, unknown> = { updatedAt: new Date() };

    if (!data.passwordHash || !(await bcrypt.compare(currentPassword, data.passwordHash))) {
      return NextResponse.json({ success: false, message: "Current password is incorrect." }, { status: 400 });
    }

    if (newPassword) {
      if (newPassword.length < 6) return NextResponse.json({ success: false, message: "New password must be at least 6 characters." }, { status: 400 });
      updates.passwordHash = await bcrypt.hash(newPassword, 12);
    }

    await doc.ref.update(updates);
    return NextResponse.json({ success: true, message: "Password updated successfully." });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ success: false, message: "Failed to update profile." }, { status: 500 });
  }
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

    const snapshot = await adminDb
      .collection("users")
      .where("phoneNumber", "==", phoneNumber)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return NextResponse.json(
        {
          success: false,
          message: "User account not found.",
        },
        { status: 404 },
      );
    }

    const doc = snapshot.docs[0];
    const data = doc.data();

    const createdAt =
      data.createdAt?.toDate?.() instanceof Date
        ? data.createdAt.toDate().toISOString()
        : data.createdAt instanceof Date
          ? data.createdAt.toISOString()
          : null;

    const updatedAt =
      data.updatedAt?.toDate?.() instanceof Date
        ? data.updatedAt.toDate().toISOString()
        : data.updatedAt instanceof Date
          ? data.updatedAt.toISOString()
          : null;

    return NextResponse.json({
      success: true,
      user: {
        id: doc.id,
        fullName: data.fullName || "",
        email: data.email || "",
        phoneNumber: data.phoneNumber || phoneNumber,
        phoneVerified: data.phoneVerified ?? false,
        role: data.role || "user",
        status: data.status || "active",
        createdAt,
        updatedAt,
      },
    });
  } catch (error) {
    console.error("❌ Profile API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load profile.",
      },
      { status: 500 },
    );
  }
}
