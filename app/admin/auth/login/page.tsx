/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { signInWithEmailAndPassword, getIdToken } from "firebase/auth";
import { auth } from "@/lib/firebase";
import toast from "react-hot-toast";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================================================
  // ADMIN LOGIN
  // ==========================================================

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const cleanEmail = email.trim().toLowerCase();

    // ========================================================
    // VALIDATION
    // ========================================================

    if (!cleanEmail) {
      setError("Please enter your admin email.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      console.log("========================================");
      console.log("🔐 ADMIN FIREBASE LOGIN");
      console.log("Email:", cleanEmail);
      console.log("========================================");

      // ======================================================
      // STEP 1: FIREBASE EMAIL + PASSWORD LOGIN
      // ======================================================

      const credential = await signInWithEmailAndPassword(
        auth,
        cleanEmail,
        password,
      );

      const firebaseUser = credential.user;

      console.log("✅ Firebase Authentication successful.");
      console.log("UID:", firebaseUser.uid);
      console.log("Firebase Email:", firebaseUser.email);

      // ======================================================
      // STEP 2: GET FIREBASE ID TOKEN
      // ======================================================

      const idToken = await getIdToken(firebaseUser, true);

      if (!idToken) {
        throw new Error("Failed to generate Firebase authentication token.");
      }

      console.log("✅ Firebase ID Token received.");

      // ======================================================
      // STEP 3: SEND TOKEN TO ADMIN API
      // ======================================================

      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",

          // IMPORTANT:
          // Admin API verifies this Firebase ID Token.
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          email: cleanEmail,
        }),
      });

      // ======================================================
      // PARSE API RESPONSE
      // ======================================================

      const contentType = response.headers.get("content-type") || "";
      let data: any = null;

      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const responseText = await response.text();

        console.error("❌ Admin API returned non-JSON:", responseText);

        throw new Error(`API returned ${response.status} instead of JSON.`);
      }

      console.log("📥 Admin API Response:", data);

      // ======================================================
      // CHECK ADMIN API RESPONSE
      // ======================================================

      if (!response.ok || !data?.success) {
        throw new Error(data?.message || "Invalid admin credentials.");
      }

      // ======================================================
      // ADMIN LOGIN SUCCESS
      // ======================================================

      console.log("========================================");
      console.log("✅ ADMIN LOGIN SUCCESS");
      console.log("Admin:", data.admin?.email);
      console.log("========================================");

      // ======================================================
      // STORE ADMIN SESSION DATA
      // ======================================================

      if (data.admin) {
        localStorage.setItem("restorehealth_admin", JSON.stringify(data.admin));
      }

      localStorage.setItem("restorehealth_admin_logged_in", "true");

      // ======================================================
      // REDIRECT TO ADMIN DASHBOARD
      // ======================================================

      toast.success("Admin login successful.");
      router.push("/admin/dashboard");
      router.refresh();
    } catch (error: any) {
      console.error("❌ Admin Login Error:", error);

      let message = "Unable to login. Please try again.";

      // ======================================================
      // FIREBASE AUTH ERRORS
      // ======================================================

      switch (error?.code) {
        case "auth/invalid-credential":
          message = "Invalid admin email or password.";
          break;

        case "auth/user-not-found":
          message = "Admin account not found.";
          break;

        case "auth/wrong-password":
          message = "Incorrect password.";
          break;

        case "auth/invalid-email":
          message = "Please enter a valid email address.";
          break;

        case "auth/user-disabled":
          message = "This admin account has been disabled.";
          break;

        case "auth/too-many-requests":
          message = "Too many login attempts. Please try again later.";
          break;


      toast.error(message);
        default:
          if (error instanceof Error) {
            message = error.message;
          } else if (error?.message) {
            message = error.message;
          }
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-[#faf8f0] via-white to-[#f5edcf] px-4 py-10 text-[#263326] transition-colors duration-300 dark:from-[#090a08] dark:via-[#11130f] dark:to-[#0d0e0a] dark:text-white sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md items-center justify-center">
        <div className="w-full">
          {/* ==================================================
              LOGO / ADMIN ICON
          ================================================== */}

          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-[#b8860b] via-[#e6c66a] to-[#a47508] shadow-lg shadow-[#b8860b]/20">
              <ShieldCheck size={32} className="text-white" />
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-[#302a16] dark:text-white">
              Admin Login
            </h1>

            <p className="mt-2 text-sm font-medium text-[#766f5a] dark:text-white/50">
              RestoreHealth Administration Panel
            </p>
          </div>

          {/* ==================================================
              LOGIN CARD
          ================================================== */}

          <div className="rounded-3xl border border-[#e5dcc1] bg-white p-6 shadow-xl shadow-[#5b4a19]/10 dark:border-white/10 dark:bg-[#151711] sm:p-8">
            {/* ==================================================
                ADMIN ACCESS NOTICE
            ================================================== */}

            <div className="mb-6 flex items-center gap-3 rounded-xl border border-[#d9bd63]/40 bg-[#faf6e7] px-4 py-3 dark:border-[#d9bd63]/20 dark:bg-[#d9bd63]/5">
              <ShieldCheck size={19} className="shrink-0 text-[#b8860b]" />

              <p className="text-xs font-semibold leading-relaxed text-[#6d5c28] dark:text-[#e6c66a]">
                Authorized administrators only. Please use your registered admin
                credentials.
              </p>
            </div>

            <form onSubmit={handleLogin}>
              {/* ==================================================
                  EMAIL
              ================================================== */}

              <label className="mb-2 block text-sm font-bold text-[#403b2b] dark:text-white/80">
                Admin Email
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9a927c]"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter admin email"
                  autoComplete="email"
                  disabled={loading}
                  className="w-full rounded-xl border border-[#ddd7c7] bg-[#fcfbf7] py-3.5 pl-11 pr-4 text-sm font-medium text-[#302d24] outline-none transition focus:border-[#c89416] focus:ring-4 focus:ring-[#c89416]/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/30"
                />
              </div>

              {/* ==================================================
                  PASSWORD
              ================================================== */}

              <label className="mb-2 mt-5 block text-sm font-bold text-[#403b2b] dark:text-white/80">
                Password
              </label>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9a927c]"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  disabled={loading}
                  className="w-full rounded-xl border border-[#ddd7c7] bg-[#fcfbf7] py-3.5 pl-11 pr-12 text-sm font-medium text-[#302d24] outline-none transition focus:border-[#c89416] focus:ring-4 focus:ring-[#c89416]/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/30"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((previous) => !previous)}
                  disabled={loading}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9a927c] transition hover:text-[#b8860b] disabled:cursor-not-allowed"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* ==================================================
                  ERROR
              ================================================== */}

              {error && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                  {error}
                </div>
              )}

              {/* ==================================================
                  ADMIN LOGIN BUTTON
              ================================================== */}

              <button
                type="submit"
                disabled={loading || !email.trim() || !password}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#b8860b] via-[#d6b84f] to-[#a47508] px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#b8860b]/20 transition-all duration-300 hover:scale-[1.01] hover:shadow-[#b8860b]/30 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={18} />
                    Admin Login
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </form>

            {/* ==================================================
                Client LOGIN
            ================================================== */}

            <div className="mt-5">
              {/* DIVIDER */}

              <div className="relative mb-4 flex items-center">
                <div className="flex-1 border-t border-[#e5dcc1] dark:border-white/10" />

                <span className="px-3 text-xs font-semibold text-[#918a77] dark:text-white/35">
                  OR
                </span>

                <div className="flex-1 border-t border-[#e5dcc1] dark:border-white/10" />
              </div>

              {/* Client LOGIN BUTTON */}

              <button
                type="button"
                onClick={() => router.push("/auth/login")}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#b7d9bd] bg-[#e8f5ea] px-4 py-3.5 text-sm font-bold text-[#2f6b3a] shadow-sm transition-all duration-300 hover:scale-[1.01] hover:bg-[#dff0e2] hover:shadow-md dark:border-[#4d8056]/40 dark:bg-[#1b2d1f] dark:text-[#9ed5a7] dark:hover:bg-[#223b27]"
              >
                <UserRound size={18} />
                Client Login
                <ArrowRight size={17} />
              </button>
            </div>
          </div>

          {/* ==================================================
              SECURITY TEXT
          ================================================== */}

          <div className="mt-6 flex items-center justify-center gap-2 text-xs font-medium text-[#918a77] dark:text-white/35">
            <Lock size={13} />
            Secure Administrator Access
          </div>
        </div>
      </div>
    </main>
  );
}
