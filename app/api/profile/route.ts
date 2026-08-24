import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

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
