/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { adminDb, adminAuth } from "@/lib/firebaseAdmin";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    // 1. 🛡️ SECURITY CHECK: VERIFY ADMIN TOKEN
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access." },
        { status: 401 },
      );
    }

    const idToken = authHeader.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(idToken);

    // Check if the user is in the admins list
    const adminCheck = await adminDb
      .collection("admins")
      .where("email", "==", decodedToken.email?.toLowerCase())
      .get();

    if (adminCheck.empty) {
      return NextResponse.json(
        { success: false, message: "Forbidden. Admin access only." },
        { status: 403 },
      );
    }

    // 2. PARSE REQUEST DATA
    const body = await request.json();
    const { subject, message, sendToAll, selectedEmails, adminEmail } = body;

    if (!subject || !message) {
      return NextResponse.json(
        { success: false, message: "Subject and Message are required." },
        { status: 400 },
      );
    }

    let targetEmails: string[] = [];

    // 3. FETCH EMAILS FROM DATABASE
    if (sendToAll) {
      const usersSnapshot = await adminDb.collection("users").get();
      usersSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.email) {
          targetEmails.push(data.email);
        }
      });
    } else {
      targetEmails = selectedEmails || [];
    }

    if (targetEmails.length === 0) {
      return NextResponse.json(
        { success: false, message: "No target emails found." },
        { status: 404 },
      );
    }

    // =========================================================================
    // 4. SEND EMAILS LOGIC (SECURE .ENV APPROACH)
    // =========================================================================

    // Ab credentials seedha tumhari .env.local file se aayenge
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 465,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Format newlines into HTML breaks
    const formattedMessage = message.replace(/\n/g, "<br>");

    // 🌟 PREMIUM HTML EMAIL TEMPLATE 🌟
    const htmlEmail = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f4; margin: 0; padding: 40px 20px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
        
        <!-- HEADER SECTION -->
        <tr>
          <td style="background-color: #063d2a; padding: 40px 30px; text-align: center; border-bottom: 4px solid #b8860b;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 900; letter-spacing: 0.5px;">
              Restore<span style="color: #d9bd63;">Health</span>
            </h1>
            <p style="color: #a0aaa1; margin: 8px 0 0 0; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px;">
              Official Agent Communication
            </p>
          </td>
        </tr>
        
        <!-- MESSAGE BODY SECTION -->
        <tr>
          <td style="padding: 40px 30px; color: #1f2d24; font-size: 15px; line-height: 1.7;">
            ${formattedMessage}
          </td>
        </tr>

        <!-- FOOTER SECTION -->
        <tr>
          <td style="background-color: #fafcfb; padding: 30px; text-align: center; border-top: 1px solid #dfe7df;">
            <p style="margin: 0; font-size: 13px; color: #536057; font-weight: bold;">
              Sent by RestoreHealth Administration
            </p>
            <p style="margin: 8px 0 0 0; font-size: 12px; color: #8a958d;">
              Replies to this email will be directed to <br>
              <span style="color: #b8860b; font-weight: bold;">${adminEmail}</span>
            </p>
            <p style="margin: 25px 0 0 0; font-size: 11px; color: #a0aaa1;">
              &copy; ${new Date().getFullYear()} RestoreHealth Services. All rights reserved.
            </p>
          </td>
        </tr>

      </table>
    </body>
    </html>
    `;

    // Mail Options
    const mailOptions = {
      from:
        process.env.SMTP_FROM_EMAIL ||
        '"RestoreHealth Support" <support@restorehealthservices.in>',
      replyTo: adminEmail,
      to: process.env.SMTP_USER, // To me khud ko bhejo, baaki sab BCC me
      bcc: targetEmails,
      subject: subject,
      html: htmlEmail,
    };

    // Trigger the email sending process
    await transporter.sendMail(mailOptions);

    console.log("==========================================");
    console.log("✅ BROADCAST SENT SUCCESSFULLY (via Secure .ENV)");
    console.log("Admin Sender (Reply-To):", adminEmail);
    console.log("Subject:", subject);
    console.log("Target Audience Count:", targetEmails.length);
    console.log("==========================================");

    // 5. SUCCESS RESPONSE
    return NextResponse.json({
      success: true,
      message: `Broadcast successfully initiated for ${targetEmails.length} agents.`,
      targetCount: targetEmails.length,
    });
  } catch (error: any) {
    console.error("❌ Broadcast API Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to send broadcast." },
      { status: 500 },
    );
  }
}
