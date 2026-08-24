import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

export const twilioVerifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

if (!accountSid) {
  console.error("❌ TWILIO_ACCOUNT_SID is missing.");
}

if (!authToken) {
  console.error("❌ TWILIO_AUTH_TOKEN is missing.");
}

if (!twilioVerifyServiceSid) {
  console.error("❌ TWILIO_VERIFY_SERVICE_SID is missing.");
}

export const twilioClient = twilio(accountSid, authToken);
