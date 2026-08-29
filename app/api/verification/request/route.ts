import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

function cleanString(value: unknown): string {
  return String(value ?? "").trim();
}

// These values are FIXED on the backend — never accepted from client
const FIXED_COMPANY_NAME = "Resote Health Services";
const FIXED_MOBILE_NUMBER = "9205456671";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Authentication token missing." },
        { status: 401 },
      );
    }

    const idToken = authHeader.replace("Bearer ", "").trim();
    const decodedToken = await adminAuth.verifyIdToken(idToken);

    // -------------------------------------------------------
    // FETCH USER NAME FROM DATABASE
    // -------------------------------------------------------
    const body = await request.json().catch(() => ({}));
    const clientName = cleanString(body?.clientName);
    const clientPhone = cleanString(body?.clientPhone);
    const planName = cleanString(body?.planName);
    const planPrice = cleanString(body?.planPrice);
    const familyCoverage = cleanString(body?.familyCoverage);

    // -------------------------------------------------------
    // FETCH LOGGED-IN USER NAME & PHONE FROM DB / TOKEN / BODY
    // -------------------------------------------------------
    let resolvedName = clientName;
    let resolvedPhone = clientPhone;

    // If clientName or clientPhone missing, try Firestore lookup
    if (!resolvedName || !resolvedPhone) {
      let userData: any = null;

      try {
        const directDoc = await adminDb.collection("users").doc(decodedToken.uid).get();
        if (directDoc.exists) {
          userData = directDoc.data();
        }
      } catch {}

      if (!userData) {
        try {
          const byUid = await adminDb
            .collection("users")
            .where("uid", "==", decodedToken.uid)
            .limit(1)
            .get();
          if (!byUid.empty) userData = byUid.docs[0].data();
        } catch {}
      }

      if (!userData && decodedToken.email) {
        try {
          const byEmail = await adminDb
            .collection("users")
            .where("email", "==", decodedToken.email.toLowerCase())
            .limit(1)
            .get();
          if (!byEmail.empty) userData = byEmail.docs[0].data();
        } catch {}
      }

      if (userData) {
        if (!resolvedName) {
          resolvedName =
            userData.fullName ||
            userData.name ||
            userData.displayName ||
            userData.customerName ||
            "";
        }
        if (!resolvedPhone) {
          resolvedPhone =
            userData.phoneNumber ||
            userData.phone ||
            userData.mobile ||
            userData.userPhone ||
            "";
        }
      }
    }

    // Fallback to token if still empty
    if (!resolvedName) {
      resolvedName =
        decodedToken.name ||
        decodedToken.displayName ||
        decodedToken.email;
    }
    if (!resolvedPhone) {
      resolvedPhone =
        (decodedToken as any).phone_number ||
        (decodedToken as any).phoneNumber ||
        clientPhone;
    }

    // -------------------------------------------------------
    // CHECK EXISTING REQUESTS — PREVENT DUPLICATE PENDING
    // -------------------------------------------------------
    const existingSnapshot = await adminDb
      .collection("verificationRequests")
      .where("userId", "==", decodedToken.uid)
      .get();

    const allRequests = existingSnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .sort((a: any, b: any) => {
        const aTime = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : (a.createdAt ? new Date(a.createdAt).getTime() : 0);
        const bTime = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : (b.createdAt ? new Date(b.createdAt).getTime() : 0);
        return bTime - aTime;
      });

    const latestRequest = allRequests[0];

    if (latestRequest && (latestRequest as any).verificationStatus === "PENDING") {
      return NextResponse.json(
        {
          success: false,
          message: "Your verification request is already pending admin approval.",
          verificationStatus: "PENDING",
        },
        { status: 409 },
      );
    }

    // -------------------------------------------------------
    // CREATE NEW VERIFICATION REQUEST
    // -------------------------------------------------------
    const requestRef = adminDb.collection("verificationRequests").doc();
    const nowIso = new Date().toISOString();

    const requestData = {
      id: requestRef.id,
      requestId: requestRef.id,
      userId: decodedToken.uid,
      userName: resolvedName,
      clientName: resolvedName,
      userEmail: decodedToken.email || null,
      companyName: FIXED_COMPANY_NAME,
      mobileNumber: resolvedPhone,
      clientPhone: resolvedPhone,
      planName: planName || "Individual",
      planPrice: planPrice || "10000",
      familyCoverage: familyCoverage || "",
      videoVerificationStatus: "saved",
      verificationStatus: "PENDING",
      rejectionReason: null,
      paymentStatus: "PENDING",
      createdAt: nowIso,
      updatedAt: nowIso,
      approvedAt: null,
      approvedBy: null,
      rejectedAt: null,
      rejectedBy: null,
    };

    await requestRef.set(requestData);

    return NextResponse.json(
      {
        success: true,
        message: "Verification request submitted successfully.",
        requestId: requestRef.id,
        verificationStatus: "PENDING",
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Verification request creation error:", error);

    if (error?.code === "auth/id-token-expired") {
      return NextResponse.json(
        { success: false, message: "Session expired. Please login again." },
        { status: 401 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Unable to submit verification request.",
      },
      { status: 500 },
    );
  }
}
