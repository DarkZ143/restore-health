import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const fullName = String(body.fullName || "").trim();
    const email = String(body.email || "")
      .trim()
      .toLowerCase();
    const phoneNumber = String(body.phoneNumber || "").trim();

    if (!fullName || !email || !phoneNumber) {
      return NextResponse.json(
        {
          success: false,
          message: "Full name, email and phone number are required.",
        },
        { status: 400 },
      );
    }

    console.log("📝 Registering user:", {
      fullName,
      email,
      phoneNumber,
    });

    // Check existing user
    const existingUser = await adminDb
      .collection("users")
      .where("phoneNumber", "==", phoneNumber)
      .limit(1)
      .get();

    if (!existingUser.empty) {
      return NextResponse.json(
        {
          success: false,
          message:
            "An account already exists with this phone number. Please login instead.",
        },
        { status: 409 },
      );
    }

    // Create user
    const userRef = await adminDb.collection("users").add({
      fullName,
      email,
      phoneNumber,
      phoneVerified: true,
      role: "user",
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log("✅ User created:", userRef.id);

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully.",
        userId: userRef.id,
        user: {
          id: userRef.id,
          fullName,
          email,
          phoneNumber,
          phoneVerified: true,
          role: "user",
          status: "active",
        },
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error("❌ Register API Error:", error);

    const err = error as {
      message?: string;
      code?: string | number;
    };

    return NextResponse.json(
      {
        success: false,
        message: err?.message || "Failed to create account.",
        code: err?.code || null,
      },
      { status: 500 },
    );
  }
}