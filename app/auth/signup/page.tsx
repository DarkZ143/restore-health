"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  ArrowRight,
  ArrowLeft,
  Loader2,
  ShieldCheck,
  CheckCircle2,
  Activity,
} from "lucide-react";
import Link from "next/link";

type SignupStep = 1 | 2 | 3;

export default function SignupPage() {
  const router = useRouter();

  const [step, setStep] = useState<SignupStep>(1);

  // ============================================================
  // USER DETAILS
  // ============================================================

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // ============================================================
  // OTP
  // ============================================================

  const [otp, setOtp] = useState("");

  // ============================================================
  // UI STATE
  // ============================================================

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const parseApiResponse = async (response: Response) => {
    const contentType = response.headers.get("content-type") || "";
    const text = await response.text();

    if (!contentType.includes("application/json")) {
      throw new Error(
        `API returned ${response.status} instead of JSON. Check the API route path.`,
      );
    }

    try {
      return JSON.parse(text);
    } catch {
      throw new Error("API returned an invalid JSON response.");
    }
  };

  // ============================================================
  // STEP 1
  // PERSONAL DETAILS
  // ============================================================

  const handlePersonalDetails = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName) {
      setError("Please enter your full name.");
      return;
    }

    if (trimmedName.length < 2) {
      setError("Please enter a valid full name.");
      return;
    }

    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setFullName(trimmedName);
    setEmail(trimmedEmail);

    setStep(2);
  };

  // ============================================================
  // STEP 2
  // SEND SIGNUP OTP
  // ============================================================

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (phoneNumber.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setIsLoading(true);

    try {
      const formattedPhone = `+91${phoneNumber}`;

      console.log("📱 Sending Signup OTP to:", formattedPhone);

      // ========================================================
      // IMPORTANT:
      // SIGNUP HAS ITS OWN SEND OTP API
      // ========================================================

      const response = await fetch("/api/auth/send-otp/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: formattedPhone,
        }),
      });

      const data = await parseApiResponse(response);

      console.log("📩 Signup Send OTP Response:", data);

      if (!response.ok || !data?.success) {
        throw new Error(
          data?.message || "Failed to send OTP. Please try again.",
        );
      }

      // Save temporarily for the OTP step
      sessionStorage.setItem("signupPhoneNumber", formattedPhone);

      console.log("✅ Signup OTP sent successfully.");

      setStep(3);
    } catch (err: unknown) {
      console.error("❌ Signup Send OTP Error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to send OTP. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================
  // STEP 3
  // VERIFY SIGNUP OTP
  // THEN CREATE FIRESTORE USER
  // ============================================================

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (otp.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    setIsLoading(true);

    try {
      const formattedPhone = `+91${phoneNumber}`;

      // ========================================================
      // 1. VERIFY SIGNUP OTP
      // ========================================================

      console.log("🔐 Verifying Signup OTP for:", formattedPhone);

      const verifyResponse = await fetch("/api/auth/signup-verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          phoneNumber: formattedPhone,
          otp: otp,
        }),
      });

      const verifyData = await parseApiResponse(verifyResponse);

      console.log("🔐 Signup Verify Response:", verifyData);

      if (!verifyResponse.ok || !verifyData?.success) {
        throw new Error(
          verifyData?.message || "Invalid OTP. Please try again.",
        );
      }

      console.log("✅ Signup OTP verified successfully.");

      // ========================================================
      // 2. CREATE USER IN FIRESTORE
      // ========================================================

      console.log("🔥 Creating user in Firestore...");

      const registerResponse = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          phoneNumber: formattedPhone,
        }),
      });

      const registerData = await parseApiResponse(registerResponse);

      console.log("🔥 Register Response:", registerData);

      if (!registerResponse.ok || !registerData?.success) {
        throw new Error(registerData?.message || "Failed to create account.");
      }

      // ========================================================
      // 3. CLEAR TEMP SIGNUP DATA
      // ========================================================

      sessionStorage.removeItem("signupPhoneNumber");

      setOtp("");

      console.log("🎉 Account created successfully:", registerData.userId);

      // ========================================================
      // 4. REDIRECT TO LOGIN
      // ========================================================

      router.push("/auth/login");
    } catch (err: unknown) {
      console.error("❌ Signup Error:", err);

      setError(
        err instanceof Error ? err.message : "Signup failed. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================
  // BACK
  // ============================================================

  const handleBack = () => {
    if (isLoading) return;

    setError("");

    if (step === 2) {
      setStep(1);
      return;
    }

    if (step === 3) {
      setStep(2);
      setOtp("");
    }
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-b from-[#ffffff] via-[#f4faf7] to-[#eaf5ef] px-4 py-10 text-[#092d28] transition-colors duration-500 dark:from-[#041611] dark:via-[#072018] dark:to-[#0a2c22] dark:text-white">
      {/* ======================================================
          BACKGROUND LEFT
      ====================================================== */}

      <motion.div
        animate={{
          x: [0, 20, 0],
          y: [0, -15, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute -left-20 top-20 h-100 w-100 rounded-full bg-linear-to-br from-[#0dce91]/20 to-[#246b1c]/10 blur-[100px] dark:from-[#0dce91]/15 dark:to-transparent"
      />

      {/* ======================================================
          BACKGROUND RIGHT
      ====================================================== */}

      <motion.div
        animate={{
          x: [0, -20, 0],
          y: [0, 20, 0],
          scale: [1.1, 1, 1.1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute -right-20 bottom-10 h-100 w-100 rounded-full bg-linear-to-bl from-[#c89416]/15 to-[#0dce91]/10 blur-[120px] dark:from-[#c89416]/10 dark:to-transparent"
      />

      {/* ======================================================
          MAIN CARD
      ====================================================== */}

      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-white/80 bg-white/70 p-8 shadow-2xl shadow-emerald-950/10 backdrop-blur-2xl dark:border-white/10 dark:bg-[#072018]/60 sm:p-10">
        {/* ====================================================
            HEADER
        ==================================================== */}

        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-[#0dce91] to-[#246b1c] text-white shadow-lg shadow-emerald-500/20">
            <Activity size={28} strokeWidth={2.5} />
          </div>

          <h1 className="text-3xl font-black tracking-tight text-[#092d28] dark:text-white">
            {step === 1
              ? "Create Account"
              : step === 2
                ? "Verify Phone"
                : "Verify OTP"}
          </h1>

          <p className="mt-2 text-sm font-medium text-[#54654f] dark:text-emerald-100/70">
            {step === 1
              ? "Enter your personal details to get started."
              : step === 2
                ? "Enter your mobile number to receive an OTP."
                : `We've sent a code to +91 ${phoneNumber}`}
          </p>
        </div>

        {/* ====================================================
            PROGRESS
        ==================================================== */}

        <div className="mb-8 flex items-center justify-center gap-2">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                item <= step
                  ? "w-12 bg-[#0dce91]"
                  : "w-8 bg-black/10 dark:bg-white/10"
              }`}
            />
          ))}
        </div>

        {/* ====================================================
            ERROR
        ==================================================== */}

        {error && (
          <motion.div
            initial={{
              opacity: 0,
              height: 0,
            }}
            animate={{
              opacity: 1,
              height: "auto",
            }}
            className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50/50 p-3 text-sm text-red-600 dark:border-red-900/30 dark:bg-red-900/10 dark:text-red-400"
          >
            <ShieldCheck size={18} className="shrink-0" />

            <p>{error}</p>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {/* ====================================================
              STEP 1
              PERSONAL DETAILS
          ==================================================== */}

          {step === 1 && (
            <motion.form
              key="step-one"
              initial={{
                opacity: 0,
                x: -20,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x: 20,
              }}
              onSubmit={handlePersonalDetails}
              className="space-y-5"
            >
              {/* FULL NAME */}

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#0c302b] dark:text-emerald-100/80">
                  Full Name
                </label>

                <div className="relative">
                  <User
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#54654f] dark:text-emerald-100/50"
                  />

                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    className="w-full rounded-xl border border-black/10 bg-white/50 py-3.5 pl-11 pr-4 text-sm text-[#092d28] outline-none transition-all focus:border-[#0dce91] focus:bg-white focus:ring-4 focus:ring-[#0dce91]/10 dark:border-white/10 dark:bg-black/20 dark:text-white dark:focus:border-[#0dce91] dark:focus:bg-black/40"
                  />
                </div>
              </div>

              {/* EMAIL */}

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#0c302b] dark:text-emerald-100/80">
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#54654f] dark:text-emerald-100/50"
                  />

                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full rounded-xl border border-black/10 bg-white/50 py-3.5 pl-11 pr-4 text-sm text-[#092d28] outline-none transition-all focus:border-[#0dce91] focus:bg-white focus:ring-4 focus:ring-[#0dce91]/10 dark:border-white/10 dark:bg-black/20 dark:text-white dark:focus:border-[#0dce91] dark:focus:bg-black/40"
                  />
                </div>
              </div>

              {/* CONTINUE */}

              <motion.button
                whileHover={{
                  scale: 1.01,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                type="submit"
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#246b1c] via-[#0dce91] to-[#0dce91] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#0dce91]/25"
              >
                Continue
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </motion.button>
            </motion.form>
          )}

          {/* ====================================================
              STEP 2
              PHONE
          ==================================================== */}

          {step === 2 && (
            <motion.form
              key="step-two"
              initial={{
                opacity: 0,
                x: -20,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x: 20,
              }}
              onSubmit={handleSendOtp}
              className="space-y-5"
            >
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#0c302b] dark:text-emerald-100/80">
                  Mobile Number
                </label>

                <div className="relative flex">
                  {/* COUNTRY CODE */}

                  <div className="flex items-center justify-center rounded-l-xl border border-r-0 border-black/10 bg-white/30 px-4 text-sm font-bold text-[#092d28] dark:border-white/10 dark:bg-black/10 dark:text-white">
                    +91
                  </div>

                  {/* PHONE */}

                  <div className="relative w-full">
                    <Phone
                      size={18}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#54654f] dark:text-emerald-100/50"
                    />

                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) =>
                        setPhoneNumber(
                          e.target.value.replace(/\D/g, "").slice(0, 10),
                        )
                      }
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      inputMode="numeric"
                      autoComplete="tel"
                      autoFocus
                      className="w-full rounded-r-xl border border-black/10 bg-white/50 py-3.5 pl-10 pr-4 text-sm text-[#092d28] outline-none transition-all focus:border-[#0dce91] focus:bg-white focus:ring-4 focus:ring-[#0dce91]/10 dark:border-white/10 dark:bg-black/20 dark:text-white dark:focus:border-[#0dce91] dark:focus:bg-black/40"
                    />
                  </div>
                </div>
              </div>

              {/* SEND OTP */}

              <motion.button
                whileHover={{
                  scale: 1.01,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                disabled={isLoading || phoneNumber.length !== 10}
                type="submit"
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#246b1c] via-[#0dce91] to-[#0dce91] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#0dce91]/25 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    Send OTP
                    <ArrowRight
                      size={18}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </>
                )}
              </motion.button>

              {/* BACK */}

              <button
                type="button"
                onClick={handleBack}
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 text-sm font-semibold text-[#54654f] hover:text-[#092d28] dark:text-emerald-100/70 dark:hover:text-white"
              >
                <ArrowLeft size={16} />
                Back
              </button>
            </motion.form>
          )}

          {/* ====================================================
              STEP 3
              OTP
          ==================================================== */}

          {step === 3 && (
            <motion.form
              key="step-three"
              initial={{
                opacity: 0,
                x: -20,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x: 20,
              }}
              onSubmit={handleSignup}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#0c302b] dark:text-emerald-100/80">
                  Enter OTP
                </label>

                <div className="relative">
                  <ShieldCheck
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#54654f] dark:text-emerald-100/50"
                  />

                  <input
                    type="text"
                    required
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="6-digit OTP"
                    maxLength={6}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    autoFocus
                    className="w-full rounded-xl border border-black/10 bg-white/50 py-3.5 pl-11 pr-4 text-center text-lg tracking-[0.5em] text-[#092d28] outline-none transition-all focus:border-[#0dce91] focus:bg-white focus:ring-4 focus:ring-[#0dce91]/10 dark:border-white/10 dark:bg-black/20 dark:text-white dark:focus:border-[#0dce91] dark:focus:bg-black/40"
                  />
                </div>
              </div>

              {/* COMPLETE SIGNUP */}

              <motion.button
                whileHover={{
                  scale: 1.01,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                disabled={isLoading || otp.length !== 6}
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#246b1c] via-[#0dce91] to-[#0dce91] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#0dce91]/25 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Complete Signup
                    <CheckCircle2 size={18} />
                  </>
                )}
              </motion.button>

              {/* BACK */}

              <button
                type="button"
                onClick={handleBack}
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 text-sm font-semibold text-[#54654f] hover:text-[#092d28] dark:text-emerald-100/70 dark:hover:text-white"
              >
                <ArrowLeft size={16} />
                Change Number
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* ====================================================
            LOGIN LINK
        ==================================================== */}

        <p className="mt-8 text-center text-sm font-medium text-[#54654f] dark:text-emerald-100/70">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="font-bold text-[#0dce91] transition-colors hover:text-[#246b1c] dark:hover:text-[#6ee7b7]"
          >
            Login
          </Link>
        </p>
      </div>
    </section>
  );
}