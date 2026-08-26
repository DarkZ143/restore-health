/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Copy,
  CreditCard,
  Loader2,
  ShieldCheck,
  XCircle,
  PhoneCall,
  Phone,
  PhoneIncoming,
} from "lucide-react";

import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

/* =========================================================
   TYPES
========================================================= */
type PaymentStatus =
  | "idle"
  | "creating"
  | "pending"
  | "pending_verification"
  | "success"
  | "failed"
  | "rejected";

type PaymentData = {
  paymentId: string;
  orderId?: string;
  razorpayKeyId?: string;
  userId?: string;
  customerName?: string;
  planId?: string;
  planName?: string;
  amount?: number;
  paymentMethod?: string;
  status?: PaymentStatus;
};

/* =========================================================
   HELPERS
========================================================= */
function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/* =========================================================
   PAGE
========================================================= */
function PaymentPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  /* =======================================================
     AUTH STATES
  ======================================================= */
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  /* =======================================================
     PAYMENT DATA STATES
  ======================================================= */
  const [payment, setPayment] = useState<PaymentData | null>(null);
  const [status, setStatus] = useState<PaymentStatus>("idle");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const planId = searchParams.get("planId") || "";
  const planName = searchParams.get("planName") || "RestoreHealth Plan";
  const amount = Number(
    searchParams.get("amount") || searchParams.get("total") || 0,
  );

  /* =======================================================
     SUPPORT CALL STATES (THE FIX IS HERE)
  ======================================================= */
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isCallRequested, setIsCallRequested] = useState(false);
  const [callError, setCallError] = useState("");
  const [isCallSubmitting, setIsCallSubmitting] = useState(false);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  /* =======================================================
     AUTH LISTENER & DATA FETCH
  ======================================================= */
  useEffect(() => {
    // 1. Listen to Auth State
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);

      // Auto-fill from Firebase Auth if empty
      if (currentUser) {
        if (!customerName && currentUser.displayName)
          setCustomerName(currentUser.displayName);
        if (!phoneNumber && currentUser.phoneNumber)
          setPhoneNumber(currentUser.phoneNumber.replace("+91", ""));
      }
    });

    // 2. Fetch from Local Storage for Fallback
    const storedUser =
      localStorage.getItem("restorehealth_user") ||
      localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed?.name || parsed?.fullName)
          setCustomerName(parsed.name || parsed.fullName);
        if (parsed?.phoneNumber || parsed?.phone)
          setPhoneNumber(parsed.phoneNumber || parsed.phone);
      } catch (e) {
        console.error("Local storage parse error", e);
      }
    }

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* =======================================================
     CREATE PAYMENT
  ======================================================= */
  const createPayment = async () => {
    try {
      setStatus("creating");
      setError("");

      if (!planId) throw new Error("Plan information is missing.");
      if (!amount || amount <= 0) throw new Error("Invalid payment amount.");

      // Using the state variables so we don't depend on missing profile names
      const finalName = customerName || "RestoreHealth Customer";
      const finalPhone = phoneNumber || "0000000000";

      const response = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.uid,
          customerName: finalName,
          phoneNumber: finalPhone,
          planId,
          planName,
          amount,
          paymentMethod: "razorpay",
        }),
      });

      const data = await response.json();

      if (!response.ok || !data?.success) {
        throw new Error(data?.message || "Unable to create payment request.");
      }

      setPayment({
        paymentId: data.paymentId,
        orderId: data.orderId,
        razorpayKeyId: data.razorpayKeyId,
        userId: data.userId,
        customerName: data.customerName || finalName,
        planId: data.planId || planId,
        planName: data.planName || planName,
        amount: Number(data.amount || amount),
        paymentMethod: "razorpay",
        status: "pending",
      });

      setStatus("pending");
    } catch (err) {
      console.error("❌ Payment creation error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create payment request.",
      );
      setStatus("failed");
    }
  };

  useEffect(() => {
    if (!isAuthLoading && user) createPayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthLoading, user]);

  const openRazorpayCheckout = async () => {
    if (!payment?.orderId || !payment.razorpayKeyId || !user) return;

    setIsCheckoutLoading(true);
    setError("");

    try {
      if (!window.Razorpay) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Unable to load Razorpay Checkout."));
          document.body.appendChild(script);
        });
      }

      const razorpay = new window.Razorpay({
        key: payment.razorpayKeyId,
        amount: Math.round(Number(payment.amount || amount) * 100),
        currency: "INR",
        name: "RestoreHealth",
        description: payment.planName || planName,
        order_id: payment.orderId,
        prefill: { name: customerName, contact: phoneNumber, email: user.email || "" },
        handler: async (result: Record<string, string>) => {
          const verifyResponse = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paymentId: payment.paymentId, ...result }),
          });
          const verifyData = await verifyResponse.json();
          if (!verifyResponse.ok || !verifyData.success) {
            throw new Error(verifyData.message || "Payment verification failed.");
          }
          setStatus("pending_verification");
          setPayment((previous) =>
            previous ? { ...previous, status: "pending_verification" } : previous,
          );
        },
        modal: { ondismiss: () => setIsCheckoutLoading(false) },
      });
      razorpay.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to start Razorpay Checkout.");
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  /* =======================================================
     SUPPORT CALL HANDLER
  ======================================================= */
  const handleRequestCall = async () => {
    setCallError("");

    if (!customerName.trim()) {
      setCallError("Customer name is required. Please type your name.");
      return;
    }
    if (!phoneNumber.trim() || phoneNumber.length < 10) {
      setCallError("Please enter a valid 10-digit phone number.");
      return;
    }

    try {
      setIsCallSubmitting(true);

      // API call to save support call request (Simulated here)
      await new Promise((res) => setTimeout(res, 1500));

      setIsCallRequested(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setCallError(err.message || "Failed to request call. Try again.");
    } finally {
      setIsCallSubmitting(false);
    }
  };

  const copyPaymentId = async () => {
    if (!payment?.paymentId) return;
    try {
      await navigator.clipboard.writeText(payment.paymentId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error("Unable to copy Payment ID.");
    }
  };

  /* =======================================================
     LOADING / CREATING UI
  ======================================================= */
  if (status === "creating" && !payment) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6f8f4] px-5">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eaf5ef] text-[#087443]">
            <Loader2 size={30} className="animate-spin" />
          </div>
          <h2 className="mt-5 text-lg font-black text-[#1f2d24]">
            Preparing your payment
          </h2>
          <p className="mt-2 text-sm text-[#7c887f]">
            Please wait while we create your secure payment request.
          </p>
        </div>
      </main>
    );
  }

  /* =======================================================
     ERROR UI
  ======================================================= */
  if (status === "failed" && !payment) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6f8f4] px-5">
        <div className="w-full max-w-md rounded-3xl border border-red-200 bg-white p-7 text-center shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
            <XCircle size={30} />
          </div>
          <h2 className="mt-5 text-xl font-black text-[#1f2d24]">
            Payment Request Failed
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#7c887f]">
            {error || "Unable to create your payment request."}
          </p>
          <button
            onClick={createPayment}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#087443] px-5 py-3.5 text-sm font-black text-white transition hover:bg-[#075f37]"
          >
            <Loader2 size={17} /> Try Again
          </button>
          <button
            onClick={() => router.back()}
            className="mt-2 w-full rounded-full px-5 py-3 text-xs font-bold text-[#8a958d] hover:bg-[#f4f7f4]"
          >
            Go Back
          </button>
        </div>
      </main>
    );
  }

  /* =======================================================
     PAYMENT SUBMITTED UI
  ======================================================= */
  if (status === "pending_verification" || status === "success") {
    return (
      <main className="min-h-screen bg-[#f6f8f4] px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-xl">
          <div className="overflow-hidden rounded-[28px] border border-[#dfe7df] bg-white shadow-xl">
            <div className="bg-[#087443] px-6 py-7 text-white sm:px-8">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                  <Clock3 size={25} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-100">
                    Payment Submitted
                  </p>
                  <h1 className="mt-1 text-xl font-black">
                    Verification Pending
                  </h1>
                </div>
              </div>
            </div>
            <div className="p-6 sm:p-8">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                  <Clock3 size={38} />
                </div>
                <h2 className="mt-5 text-2xl font-black text-[#1f2d24]">
                  Payment Submitted
                </h2>
                <p className="mt-2 max-w-md text-sm leading-6 text-[#7c887f]">
                  Your payment has been submitted for verification. The admin
                  will verify the transaction before your order is confirmed.
                </p>
              </div>
              <button
                onClick={() => router.push("/dashboard")}
                className="mt-6 w-full rounded-full bg-[#087443] px-5 py-3.5 text-sm font-black text-white transition hover:bg-[#075f37]"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* =======================================================
     MAIN PAGE UI
  ======================================================= */
  return (
    <main className="min-h-screen bg-[#f6f8f4] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-sm font-bold text-[#536057] transition hover:text-[#087443]"
        >
          <ArrowLeft size={18} /> Back
        </button>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          {/* LEFT SIDE: QR PAYMENT & SUPPORT CALL */}
          <section className="space-y-6">
            {/* QR CODE BLOCK */}
            <div className="rounded-[28px] border border-[#dfe7df] bg-white p-6 shadow-xl sm:p-8">
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eaf5ef] text-[#087443]">
                  <CreditCard size={28} />
                </div>
                <p className="mt-5 text-[10px] font-black uppercase tracking-[0.2em] text-[#b8860b]">
                  Razorpay Checkout
                </p>
                <h1 className="mt-2 text-2xl font-black text-[#1f2d24] sm:text-3xl">
                  Complete Your Payment Securely
                </h1>
                <p className="mt-2 text-sm text-[#7c887f]">
                  Pay securely with UPI, cards, net banking, or wallets.
                </p>
              </div>

              <div className="mx-auto mt-7 max-w-sm rounded-3xl border border-[#dfe7df] bg-[#fafcfb] p-6 text-center">
                <ShieldCheck size={42} className="mx-auto text-[#087443]" />
                <p className="mt-4 text-sm font-bold text-[#536057]">
                  Your order is ready. Razorpay will open a secure payment window.
                </p>
                <button
                  onClick={openRazorpayCheckout}
                  disabled={isCheckoutLoading || !payment?.orderId}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#087443] px-5 py-4 text-sm font-black text-white transition hover:bg-[#075f37] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isCheckoutLoading ? <Loader2 size={18} className="animate-spin" /> : <CreditCard size={18} />}
                  Pay {formatCurrency(Number(payment?.amount || amount))}
                </button>
              </div>
            </div>

            {/* NEW SUPPORT CALL BLOCK (REPLACES OLD ERROR-PRONE BLOCK) */}
            <div className="rounded-[2rem] border border-[#dfe7df] bg-white p-6 sm:p-8 shadow-xl">
              {!isCallRequested ? (
                <>
                  <div className="flex flex-col items-center text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#c89416] text-white shadow-lg shadow-[#c89416]/30">
                      <PhoneCall size={28} />
                    </div>
                    <h2 className="mt-5 text-2xl font-black text-[#1f2d24]">
                      Verify by Support Call
                    </h2>
                    <p className="mt-2 text-sm font-medium text-[#7c887f]">
                      Enter your details below. Our support team will call you
                      to verify the terms.
                    </p>
                  </div>

                  <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border border-[#dfe7df] p-4 text-center">
                      <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-[#063d2a] text-white">
                        <Phone size={18} />
                      </div>
                      <h3 className="text-sm font-black text-[#1f2d24]">
                        Enter Info
                      </h3>
                    </div>
                    <div className="rounded-xl border border-[#dfe7df] p-4 text-center">
                      <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-[#063d2a] text-white">
                        <PhoneIncoming size={18} />
                      </div>
                      <h3 className="text-sm font-black text-[#1f2d24]">
                        Confirm Terms
                      </h3>
                    </div>
                    <div className="rounded-xl border border-[#dfe7df] p-4 text-center">
                      <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-[#063d2a] text-white">
                        <CheckCircle2 size={18} />
                      </div>
                      <h3 className="text-sm font-black text-[#1f2d24]">
                        Team Approval
                      </h3>
                    </div>
                  </div>

                  <div className="mt-8 rounded-2xl border border-[#f0e6cf] bg-[#fffcf5] p-5">
                    {/* CUSTOMER NAME FIELD (FIX FOR THE MISSING PROFILE NAME ERROR) */}
                    <div className="mb-4">
                      <label className="mb-2 block text-xs font-black text-[#1f2d24]">
                        Customer Name
                      </label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Enter your full name"
                        disabled={isCallSubmitting}
                        className="w-full rounded-xl border border-[#e5dfd3] bg-white px-4 py-3 text-sm font-bold text-[#1f2d24] outline-none transition focus:border-[#c89416]"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="mb-2 block text-xs font-black text-[#1f2d24]">
                        Phone Number
                      </label>
                      <div className="flex overflow-hidden rounded-xl border border-[#e5dfd3] bg-white transition focus-within:border-[#c89416]">
                        <div className="flex items-center justify-center border-r border-[#e5dfd3] bg-[#faf8f2] px-4 text-sm font-black text-[#536057]">
                          +91
                        </div>
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) =>
                            setPhoneNumber(
                              e.target.value.replace(/\D/g, "").slice(0, 10),
                            )
                          }
                          placeholder="Enter 10-digit number"
                          disabled={isCallSubmitting}
                          className="w-full bg-white px-4 py-3 text-sm font-bold text-[#1f2d24] outline-none disabled:opacity-60"
                        />
                      </div>
                    </div>

                    {callError && (
                      <div className="mb-4 text-sm font-bold text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                        {callError}
                      </div>
                    )}

                    <button
                      onClick={handleRequestCall}
                      disabled={
                        isCallSubmitting ||
                        !customerName.trim() ||
                        phoneNumber.length < 10
                      }
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#c89416] px-5 py-4 text-sm font-black text-white transition-all hover:bg-[#b58310] disabled:opacity-50"
                    >
                      {isCallSubmitting ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <PhoneCall size={18} />
                      )}{" "}
                      Request Support Call
                    </button>
                  </div>
                </>
              ) : (
                <div className="py-10 text-center">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-600 mb-4">
                    <CheckCircle2 size={40} />
                  </div>
                  <h2 className="text-2xl font-black text-[#1f2d24]">
                    Call Requested!
                  </h2>
                  <p className="mt-2 text-sm font-medium text-[#7c887f]">
                    Our team will call you shortly on +91 {phoneNumber}.
                  </p>
                </div>
              )}
            </div>

            {/* PAYMENT ACTION */}
            <button
              onClick={openRazorpayCheckout}
              disabled={
                ["creating", "pending_verification"].includes(status) ||
                !payment?.orderId ||
                isCheckoutLoading
              }
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#087443] px-5 py-4 text-sm font-black text-white shadow-lg shadow-[#087443]/20 transition hover:-translate-y-0.5 hover:bg-[#075f37] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {status === "creating" ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Submitting...
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} />{" "}
                  Open Razorpay Checkout
                </>
              )}
            </button>
          </section>

          {/* RIGHT SIDE: ORDER SUMMARY */}
          <section className="h-fit rounded-[28px] border border-[#dfe7df] bg-white p-6 shadow-xl sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eaf5ef] text-[#087443]">
                <CreditCard size={21} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#8a958d]">
                  Order Summary
                </p>
                <h2 className="mt-1 text-lg font-black text-[#1f2d24]">
                  Payment Details
                </h2>
              </div>
            </div>

            <div className="mt-7 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-semibold text-[#8a958d]">
                  Plan
                </span>
                <span className="text-right text-sm font-black text-[#1f2d24]">
                  {payment?.planName || planName}
                </span>
              </div>
              <div className="h-px bg-[#edf1ed]" />
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-semibold text-[#8a958d]">
                  Payment Method
                </span>
                <span className="flex items-center gap-1.5 text-sm font-black text-[#087443]">
                  <CreditCard size={15} /> Razorpay
                </span>
              </div>
              <div className="h-px bg-[#edf1ed]" />
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-semibold text-[#8a958d]">
                  Amount
                </span>
                <span className="text-xl font-black text-[#9a6d00]">
                  {formatCurrency(Number(payment?.amount || amount))}
                </span>
              </div>
            </div>

            <div className="mt-7 rounded-2xl border border-[#dfe8df] bg-[#f7faf7] p-4">
              <p className="text-[9px] font-black uppercase tracking-wider text-[#8a958d]">
                Payment ID
              </p>
              <div className="mt-2 flex items-center justify-between gap-3">
                <p className="break-all text-sm font-black text-[#1f2d24]">
                  {payment?.paymentId}
                </p>
                <button
                  onClick={copyPaymentId}
                  className="shrink-0 rounded-xl border border-[#dfe7df] bg-white p-2.5 text-[#087443] transition hover:bg-[#f0f5f0]"
                >
                  {copied ? <CheckCircle2 size={17} /> : <Copy size={17} />}
                </button>
              </div>
            </div>

            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-[#dce9cf] bg-[#f4faf1] p-4">
              <ShieldCheck
                size={20}
                className="mt-0.5 shrink-0 text-[#087443]"
              />
              <div>
                <p className="text-xs font-black text-[#1f2d24]">
                  Secure Verification
                </p>
                <p className="mt-1 text-[10px] leading-5 text-[#69756d]">
                  Your payment will remain pending until it is verified by our
                  admin team over a support call.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#f6f8f4] px-5">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eaf5ef] text-[#087443]">
              <Loader2 size={30} className="animate-spin" />
            </div>
            <h2 className="mt-5 text-lg font-black text-[#1f2d24]">
              Loading payment details
            </h2>
            <p className="mt-2 text-sm text-[#7c887f]">
              Please wait while we prepare your secure payment page.
            </p>
          </div>
        </main>
      }
    >
      <PaymentPageContent />
    </Suspense>
  );
}
