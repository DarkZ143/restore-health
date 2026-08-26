"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  LogIn,
  MessageSquareText,
  Phone,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";

type ApiResponse = {
  success?: boolean;
  message?: string;
  status?: string;
  userId?: string;
  user?: {
    id?: string;
    fullName?: string;
    email?: string;
    phoneNumber?: string;
    phoneVerified?: boolean;
    role?: string;
    status?: string;
  };
};

async function parseApiResponse(response: Response): Promise<ApiResponse> {
  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    throw new Error(
      `API returned ${response.status} instead of JSON. Check the API route path.`,
    );
  }

  return response.json();
}

export default function LoginPage() {
  const router = useRouter();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [showOtp, setShowOtp] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // ==========================================================
  // REDIRECT IF ALREADY LOGGED IN
  // ==========================================================

  useEffect(() => {
    const loggedIn = localStorage.getItem("restorehealth_logged_in") === "true";
    const sessionExpiresAt = Number(
      localStorage.getItem("restorehealth_session_expires_at") || 0,
    );

    if (loggedIn && (!sessionExpiresAt || Date.now() < sessionExpiresAt)) {
      router.replace("/dashboard");
      return;
    }

    if (loggedIn && sessionExpiresAt && Date.now() >= sessionExpiresAt) {
      localStorage.removeItem("restorehealth_logged_in");
      localStorage.removeItem("restorehealth_session_expires_at");
      localStorage.removeItem("restorehealth_phone");
      localStorage.removeItem("restorehealth_user");
    }
  }, [router]);

  // ==========================================================
  // OTP COUNTDOWN
  // ==========================================================

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = window.setInterval(() => {
      setCountdown((previous) => (previous > 0 ? previous - 1 : 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [countdown]);

  // ==========================================================
  // NORMALIZE PHONE
  // ==========================================================

  function normalizePhone(value: string) {
    let phone = value.trim();

    phone = phone.replace(/\s+/g, "");

    if (/^\d{10}$/.test(phone)) {
      phone = `+91${phone}`;
    }

    if (/^91\d{10}$/.test(phone)) {
      phone = `+${phone}`;
    }

    return phone;
  }

  // ==========================================================
  // SEND LOGIN OTP
  // ==========================================================

  async function handleSendOtp(event?: FormEvent) {
    event?.preventDefault();

    setError("");
    setMessage("");

    const phone = normalizePhone(phoneNumber);

    if (!/^\+91\d{10}$/.test(phone)) {
      setError("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/auth/send-otp/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: phone,
        }),
      });

      const data = await parseApiResponse(response);

      if (!response.ok || !data?.success) {
        throw new Error(
          data?.message || "Failed to send OTP. Please try again.",
        );
      }

      setPhoneNumber(phone);
      setOtpSent(true);
      setOtp("");
      setCountdown(30);

      setMessage(data.message || "Login OTP sent successfully.");
    } catch (error) {
      console.error("❌ Login Send OTP Error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to send OTP. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  // ==========================================================
  // VERIFY LOGIN OTP
  // ==========================================================

  async function handleVerifyOtp(event: FormEvent) {
    event.preventDefault();

    setError("");
    setMessage("");

    const phone = normalizePhone(phoneNumber);
    const cleanOtp = otp.trim();

    if (!/^\+91\d{10}$/.test(phone)) {
      setError("Invalid phone number.");
      return;
    }

    if (!/^\d{4,8}$/.test(cleanOtp)) {
      setError("Please enter a valid OTP.");
      return;
    }

    try {
      setVerifying(true);

      const response = await fetch("/api/auth/login-verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: phone,
          otp: cleanOtp,
        }),
      });

      const data = await parseApiResponse(response);

      if (!response.ok || !data?.success) {
        throw new Error(data?.message || "Invalid OTP. Please try again.");
      }

      // ======================================================
      // SAVE LOGIN USER
      // ======================================================

      if (data.user) {
        localStorage.setItem("restorehealth_user", JSON.stringify(data.user));
      }

      localStorage.setItem("restorehealth_phone", phone);

      localStorage.setItem("restorehealth_logged_in", "true");
      localStorage.setItem(
        "restorehealth_session_expires_at",
        String(Date.now() + 12 * 60 * 60 * 1000),
      );

      setMessage(data.message || "Login successful.");
      toast.success("Login successful. Welcome back!");

      // ======================================================
      // DASHBOARD
      // ======================================================

      router.push("/dashboard");
    } catch (error) {
      console.error("❌ Login Verify OTP Error:", error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to verify OTP. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setVerifying(false);
    }
  }

  // ==========================================================
  // RESEND OTP
  // ==========================================================

  async function handleResendOtp() {
    if (countdown > 0 || loading) return;

    await handleSendOtp();
  }

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <main className="min-h-screen bg-linear-to-br from-[#f7fbf8] via-white to-[#eef8f2] px-4 py-10 text-[#173b25] transition-colors duration-300 dark:from-[#07130d] dark:via-[#0a1911] dark:to-[#07130d] dark:text-white sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md items-center justify-center">
        <div className="w-full">
          {/* ==================================================
              BRAND
          ================================================== */}

          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-[#0dce91] to-[#246b1c] shadow-lg shadow-[#0dce91]/20">
              <LogIn size={30} className="text-white" />
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-[#173b25] dark:text-white">
              Welcome Back
            </h1>

            <p className="mt-2 text-sm font-medium text-[#64776b] dark:text-emerald-100/60">
              Login to your RestoreHealth account
            </p>
          </div>

          {/* ==================================================
              LOGIN CARD
          ================================================== */}

          <div className="rounded-3xl border border-[#dce9df] bg-white p-6 shadow-xl shadow-[#173b25]/5 dark:border-white/10 dark:bg-[#0c1c13] sm:p-8">
            {/* =================================================
                PHONE
            ================================================= */}

            <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}>
              <label className="mb-2 block text-sm font-bold text-[#294b36] dark:text-emerald-100">
                Mobile Number
              </label>

              <div className="relative">
                <Phone
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#80988a]"
                />

                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(event) =>
                    setPhoneNumber(
                      event.target.value.replace(/\D/g, "").slice(0, 10),
                    )
                  }
                  disabled={otpSent || loading || verifying}
                  placeholder="Enter 10-digit mobile number"
                  className="w-full rounded-xl border border-[#d8e5dc] bg-[#f9fcfa] py-3.5 pl-11 pr-4 text-sm font-medium text-[#173b25] outline-none transition focus:border-[#0dce91] focus:ring-4 focus:ring-[#0dce91]/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-emerald-100/30"
                />
              </div>

              {/* =================================================
                  OTP
              ================================================= */}

              {otpSent && (
                <div className="mt-5">
                  <label className="mb-2 block text-sm font-bold text-[#294b36] dark:text-emerald-100">
                    Enter OTP
                  </label>

                  <div className="relative">
                    <MessageSquareText
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#80988a]"
                    />

                    <input
                      type={showOtp ? "text" : "password"}
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      value={otp}
                      onChange={(event) =>
                        setOtp(
                          event.target.value.replace(/\D/g, "").slice(0, 8),
                        )
                      }
                      placeholder="Enter OTP"
                      disabled={verifying}
                      className="w-full rounded-xl border border-[#d8e5dc] bg-[#f9fcfa] py-3.5 pl-11 pr-12 text-sm font-medium tracking-[0.25em] text-[#173b25] outline-none transition focus:border-[#0dce91] focus:ring-4 focus:ring-[#0dce91]/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-emerald-100/30"
                    />

                    <button
                      type="button"
                      onClick={() => setShowOtp((previous) => !previous)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#80988a] transition hover:text-[#0dce91]"
                      aria-label={showOtp ? "Hide OTP" : "Show OTP"}
                    >
                      {showOtp ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {/* =================================================
                      OTP SENT STATUS
                  ================================================= */}

                  <div className="mt-3 flex items-center gap-2 text-xs font-medium text-[#64776b] dark:text-emerald-100/60">
                    <CheckCircle2 size={15} className="text-[#0dce91]" />
                    OTP sent to{" "}
                    <span className="font-bold text-[#294b36] dark:text-white">
                      {phoneNumber}
                    </span>
                  </div>
                </div>
              )}

              {/* =================================================
                  ERROR
              ================================================= */}

              {error && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                  {error}
                </div>
              )}

              {/* =================================================
                  SUCCESS
              ================================================= */}

              {message && (
                <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
                  {message}
                </div>
              )}

              {/* =================================================
                  MAIN BUTTON
              ================================================= */}

              <button
                type="submit"
                disabled={
                  loading ||
                  verifying ||
                  !phoneNumber.trim() ||
                  (otpSent && !otp.trim())
                }
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#0dce91] to-[#246b1c] px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#0dce91]/15 transition-all duration-300 hover:scale-[1.01] hover:shadow-[#0dce91]/25 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
              >
                {loading || verifying ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />

                    {verifying ? "Verifying OTP..." : "Sending OTP..."}
                  </>
                ) : otpSent ? (
                  <>
                    <Lock size={18} />
                    Verify & Login
                    <ArrowRight size={17} />
                  </>
                ) : (
                  <>
                    Send OTP
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </form>

            {/* ==================================================
                RESEND / CHANGE NUMBER
            ================================================== */}

            {otpSent && (
              <div className="mt-4 flex items-center justify-between text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    setOtpSent(false);
                    setOtp("");
                    setError("");
                    setMessage("");
                    setCountdown(0);
                  }}
                  className="text-[#64776b] transition hover:text-[#246b1c] dark:text-emerald-100/60 dark:hover:text-emerald-300"
                >
                  Change Number
                </button>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={countdown > 0 || loading}
                  className="text-[#0dce91] transition hover:text-[#246b1c] disabled:cursor-not-allowed disabled:opacity-40 dark:hover:text-emerald-300"
                >
                  {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
                </button>
              </div>
            )}

            {/* ==================================================
                ADMIN LOGIN
            ================================================== */}

            <div className="mt-8">
              <Link
                href="/admin/auth/login"
                className="group flex w-full items-center justify-center gap-2 rounded-xl border border-[#c89416]/50 bg-linear-to-r from-[#b8860b] via-[#e6c66a] to-[#b8860b] px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#c89416]/15 transition-all duration-300 hover:scale-[1.01] hover:shadow-[#c89416]/30 dark:border-[#d5af45]/50"
              >
                <ShieldCheck
                  size={18}
                  className="text-white transition-transform duration-300 group-hover:scale-110"
                />
                Admin Login
                <ArrowRight
                  size={17}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>

            {/* ==================================================
                SIGNUP
            ================================================== */}

            <p className="mt-5 text-center text-sm font-medium text-[#54654f] dark:text-emerald-100/70">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/signup"
                className="font-bold text-[#0dce91] transition-colors hover:text-[#246b1c] dark:hover:text-[#6ee7b7]"
              >
                Create Account
              </Link>
            </p>
          </div>

          {/* ==================================================
              FOOTER TEXT
          ================================================== */}

          <div className="mt-6 flex items-center justify-center gap-2 text-xs font-medium text-[#80988a] dark:text-emerald-100/40">
            <ShieldCheck size={14} />
            Secure OTP based authentication
          </div>
        </div>
      </div>
    </main>
  );
}
