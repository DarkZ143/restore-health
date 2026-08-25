"use client";

import { useState } from "react";
import Script from "next/script";
import {
  ArrowRight,
  Check,
  CreditCard,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";
import { useTheme } from "@/app/providers/ThemeProvider";

type RazorpaySuccessPayload = {
  razorpay_payment_id?: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
};

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

const paymentOptions = [
  { label: "Health plan", amount: 1, description: "Annual preventive care" },
  { label: "Family cover", amount: 2, description: "Annual family protection" },
  { label: "Custom amount", amount: 0, description: "Enter an amount" },
];

export default function TransactionsPage() {
  const { theme } = useTheme();
  const [selectedOption, setSelectedOption] = useState(0);
  const [customAmount, setCustomAmount] = useState(1500);
  const [isPaying, setIsPaying] = useState(false);

  const isDark = theme === "dark";
  const selectedPayment = paymentOptions[selectedOption];
  const amount = selectedPayment.amount || customAmount;

  const startPayment = async () => {
    if (amount < 1 || isPaying) return;

    if (!window.Razorpay) {
      toast.error("Payment gateway is still loading. Please try again.");
      return;
    }

    setIsPaying(true);

    try {
      const response = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, service: selectedPayment.label }),
      });
      const order = await response.json();

      if (!response.ok) {
        throw new Error(order.message || "Unable to start payment");
      }

      const razorpay = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: "Restore Health Services",
        description: selectedPayment.label,
        handler: async (paymentResponse: RazorpaySuccessPayload) => {
          try {
            const phoneNumber =
              localStorage.getItem("userPhone") ||
              localStorage.getItem("restorehealth_phone") ||
              sessionStorage.getItem("loginPhoneNumber") ||
              "";

            const verifyResponse = await fetch("/api/payments/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...paymentResponse,
                amount,
                service: selectedPayment.label,
                phoneNumber,
              }),
            });

            const verifyResult = await verifyResponse.json();

            if (!verifyResponse.ok || !verifyResult.success) {
              throw new Error(verifyResult.message || "Payment verification failed.");
            }

            toast.success("Payment successful. Invoice generated.");
          } catch (verifyError) {
            toast.error(
              verifyError instanceof Error
                ? verifyError.message
                : "Payment succeeded, but invoice generation failed.",
            );
          } finally {
            setIsPaying(false);
          }
        },
        theme: { color: "#246b1c" },
        config: {
          display: {
            blocks: {
              upi: {
                name: "Pay with UPI",
                instruments: [{ method: "upi" }],
              },
            },
            sequence: ["block.upi"],
            preferences: { show_default_blocks: true },
          },
        },
        modal: { ondismiss: () => setIsPaying(false) },
      });

      razorpay.open();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Payment could not be started.");
      setIsPaying(false);
    }
  };

  const formatAmount = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      <main
      className={`min-h-screen px-4 py-8 transition-colors duration-300 sm:px-6 lg:py-12 ${
        isDark
          ? "bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.12),_transparent_32rem)] bg-[#081610] text-white"
          : "bg-[radial-gradient(circle_at_top_right,_rgba(200,148,22,0.16),_transparent_32rem)] bg-[#f8f8f3] text-gray-900"
      }`}
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <div className={`mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] ${isDark ? "text-emerald-300" : "text-[#246b1c]"}`}>
              <Sparkles size={14} />
              Restore Health checkout
            </div>
            <div className="flex items-center gap-3">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                isDark
                  ? "bg-emerald-400/15 text-emerald-300"
                  : "bg-[#e4f2e1] text-[#246b1c]"
              }`}
            >
              <CreditCard size={22} />
            </div>

            <div>
              <h1 className="text-3xl font-black tracking-tight">Make a payment</h1>

              <p
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Choose a care plan and complete your payment in seconds.
              </p>
            </div>
          </div>
          </div>
          <div className={`flex items-center gap-2 text-xs font-semibold ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            <LockKeyhole size={15} />
            100% secure payments
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <section
            className={`rounded-[1.75rem] border p-5 shadow-[0_18px_60px_rgba(23,63,21,0.08)] sm:p-8 ${
              isDark ? "border-white/10 bg-[#10251c]" : "border-[#e2e8de] bg-white/90"
            }`}
          >
            <div className={`mb-7 flex items-start justify-between gap-4 border-b pb-6 ${isDark ? "border-white/10" : "border-[#edf0e9]"}`}>
              <div>
                <h2 className="text-xl font-bold">Make a payment</h2>
                <p className={`mt-1 text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  Choose a plan or enter a custom amount.
                </p>
              </div>
              <div className="rounded-xl border border-[#d8e8d3] bg-[#f4faf2] px-3 py-2 text-[10px] font-black tracking-widest text-[#246b1c] dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300">
                POWERED BY<br />RAZORPAY
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {paymentOptions.map((option, index) => {
                const active = selectedOption === index;

                return (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => setSelectedOption(index)}
                    className={`relative rounded-2xl border p-4 text-left transition-all hover:-translate-y-0.5 ${
                      active
                        ? "border-[#246b1c] bg-[#f1f8ef] dark:border-emerald-400 dark:bg-emerald-500/10"
                        : isDark
                          ? "border-white/10 bg-white/[0.02] hover:border-emerald-300/50"
                          : "border-gray-200 bg-white/60 hover:border-[#9fc49a] hover:shadow-md"
                    }`}
                  >
                    <span className="flex items-center justify-between gap-2 text-sm font-bold">
                      {option.label}
                      {active && <Check size={16} className="text-[#246b1c] dark:text-emerald-300" />}
                    </span>
                    <span className={`mt-2 block text-lg font-bold ${active ? "text-[#246b1c] dark:text-emerald-300" : ""}`}>
                      {option.amount ? formatAmount(option.amount) : "Flexible"}
                    </span>
                    <span className={`mt-1 block text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      {option.description}
                    </span>
                  </button>
                );
              })}
            </div>

            {selectedOption === 2 && (
              <label className="mt-5 block text-sm font-semibold">
                Amount in INR
                <div className="relative mt-2">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                  <input
                    type="number"
                    min="1"
                    value={customAmount}
                    onChange={(event) => setCustomAmount(Number(event.target.value))}
                    className={`w-full rounded-xl border py-3 pl-9 pr-4 outline-none focus:border-[#246b1c] focus:ring-2 focus:ring-[#246b1c]/15 ${
                      isDark ? "border-gray-700 bg-gray-900 text-white" : "border-gray-200 bg-gray-50"
                    }`}
                  />
                </div>
              </label>
            )}

            <div className={`mt-7 flex items-center gap-3 rounded-xl border px-4 py-3 text-xs ${isDark ? "border-white/10 bg-white/[0.03] text-gray-300" : "border-[#e3eadf] bg-[#f8fbf7] text-gray-600"}`}>
              <ShieldCheck size={18} className="shrink-0 text-[#246b1c] dark:text-emerald-300" />
              <span>Cards, UPI, net banking and wallets accepted</span>
            </div>

            <button
              type="button"
              onClick={startPayment}
              disabled={amount < 1}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#246b1c] px-5 py-4 text-sm font-bold text-white shadow-[0_10px_24px_rgba(36,107,28,0.25)] transition hover:bg-[#173f15] hover:shadow-[0_12px_28px_rgba(36,107,28,0.35)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPaying ? "Opening secure checkout..." : `Pay ${formatAmount(amount)} securely`}
              {!isPaying && <ArrowRight size={18} />}
            </button>
          </section>

          <aside className={`relative overflow-hidden rounded-[1.75rem] border p-6 shadow-[0_18px_60px_rgba(23,63,21,0.08)] sm:p-8 ${isDark ? "border-white/10 bg-[#12382f]" : "border-[#e7dfc8] bg-[#fbf8ec]"}`}>
            <div className="absolute -right-14 -top-14 h-36 w-36 rounded-full border-[18px] border-[#c89416]/10" />
            <div className="relative mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#246b1c] text-white shadow-lg shadow-[#246b1c]/20">
              <ShieldCheck size={23} />
            </div>
            <h2 className="relative text-2xl font-black tracking-tight">Your payment, protected.</h2>
            <p className={`mt-2 text-sm leading-6 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Complete your payment securely through Razorpay. Your card details are never stored by us.
            </p>
            <div className={`mt-7 space-y-4 border-t pt-5 text-sm ${isDark ? "border-gray-700" : "border-[#e3ddc8]"}`}>
              <div className="flex justify-between gap-4">
                <span className={isDark ? "text-gray-400" : "text-gray-600"}>Selected service</span>
                <span className="font-semibold">{selectedPayment.label}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className={isDark ? "text-gray-400" : "text-gray-600"}>Total payable</span>
                <span className="text-lg font-bold text-[#246b1c] dark:text-emerald-300">{formatAmount(amount)}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
      </main>
    </>
  );
}
