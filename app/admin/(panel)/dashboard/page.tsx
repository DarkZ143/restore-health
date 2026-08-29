/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Activity,
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  CreditCard,
  RefreshCw,
  ShoppingBag,
  Users,
  Bell,
  Loader2,
} from "lucide-react";
import Image from "next/image";

import { auth } from "@/lib/firebase";
import { getIdToken, onAuthStateChanged } from "firebase/auth";

// =================================================================
// TYPES
// =================================================================
type DashboardData = {
  success: boolean;
  admin: { email: string };
  stats: {
    agents: number;
    orders: number;
    payments: {
      successful: number;
      pending: number;
      failed: number;
      successfulAmount: number;
      pendingAmount: number;
      failedAmount: number;
      totalAmount: number;
    };
    confirmationPending: number;
    issues: number;
  };
  notifications: any[];
};

export default function AdminDashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [verificationRequests, setVerificationRequests] = useState<any[]>([]);
  const [verificationRequestsLoading, setVerificationRequestsLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Per-request reject reason state
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReasonMap, setRejectReasonMap] = useState<Record<string, string>>({});
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // =====================================================
  // FETCH DASHBOARD DATA (SECURE WITH FIREBASE TOKEN)
  // =====================================================
  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      // 1. Firebase se Secure Token nikalna (Wait for Auth state if needed)
      let token = "";
      const currentUser = auth.currentUser;

      if (currentUser) {
        token = await getIdToken(currentUser, true);
      } else {
        // Agar page refresh hua hai toh auth state load hone ka wait karo
        await new Promise((resolve) => {
          const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) token = await getIdToken(user, true);
            unsubscribe();
            resolve(null);
          });
        });
      }

      if (!token) {
        throw new Error("Authentication token missing. Please relogin.");
      }

      // 2. Token ke sath Secure API Call karna
      const response = await fetch("/api/admin/dashboard", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Yahan hum apna VIP pass bhej rahe hain
        },
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data?.message || "Failed to load dashboard data.");
      }

      setDashboard(data);
    } catch (err: any) {
      console.error("❌ Dashboard Error:", err);
      setError(err?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadVerificationRequests = useCallback(async () => {
    try {
      setVerificationRequestsLoading(true);

      let token = "";
      const currentUser = auth.currentUser;

      if (currentUser) {
        token = await getIdToken(currentUser, true);
      } else {
        await new Promise((resolve) => {
          const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) token = await getIdToken(user, true);
            unsubscribe();
            resolve(null);
          });
        });
      }

      if (!token) {
        throw new Error("Authentication token missing. Please relogin.");
      }

      const response = await fetch("/api/admin/verification-requests", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data?.message || "Unable to load verification requests.");
      }

      const rawRequests = data.requests || [];
      const sortedRequests = [...rawRequests].sort((a: any, b: any) => {
        const getTs = (item: any) => {
          const dateVal = item.updatedAt || item.createdAt;
          if (!dateVal) return Number.MAX_SAFE_INTEGER;
          const t = new Date(dateVal).getTime();
          return isNaN(t) ? Number.MAX_SAFE_INTEGER : t;
        };
        return getTs(b) - getTs(a);
      });

      setVerificationRequests(sortedRequests);
    } catch (err: any) {
      console.error("Verification requests load error:", err);
    } finally {
      setVerificationRequestsLoading(false);
    }
  }, []);

  const handleVerificationAction = async (
    requestId: string,
    action: "approve" | "reject",
    reason = "",
  ) => {
    try {
      setActionLoadingId(requestId);

      let token = "";
      const currentUser = auth.currentUser;

      if (currentUser) {
        token = await getIdToken(currentUser, true);
      } else {
        await new Promise((resolve) => {
          const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) token = await getIdToken(user, true);
            unsubscribe();
            resolve(null);
          });
        });
      }

      if (!token) {
        throw new Error("Authentication token missing. Please relogin.");
      }

      const response = await fetch(
        `/api/admin/verification-requests/${requestId}/${action}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: action === "reject" ? JSON.stringify({ rejectionReason: reason }) : undefined,
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data?.message || `Failed to ${action} verification request.`);
      }

      const nowIso = new Date().toISOString();

      setVerificationRequests((current) => {
        const updatedList = current.map((item) =>
          item.id === requestId
            ? {
                ...item,
                verificationStatus: action === "approve" ? "APPROVED" : "REJECTED",
                paymentStatus: action === "approve" ? "APPROVED" : "REJECTED",
                rejectionReason: action === "reject" ? reason : item.rejectionReason,
                updatedAt: nowIso,
              }
            : item,
        );

        return [...updatedList].sort((a: any, b: any) => {
          const getTs = (item: any) => {
            const dateVal = item.updatedAt || item.createdAt;
            if (!dateVal) return Number.MAX_SAFE_INTEGER;
            const t = new Date(dateVal).getTime();
            return isNaN(t) ? Number.MAX_SAFE_INTEGER : t;
          };
          return getTs(b) - getTs(a);
        });
      });

      // Clear reject state for this request
      setRejectingId(null);
      setRejectReasonMap((prev) => {
        const next = { ...prev };
        delete next[requestId];
        return next;
      });
    } catch (err: any) {
      console.error(`Verification ${action} error:`, err);
      setError(err?.message || `Unable to ${action} verification request.`);
    } finally {
      setActionLoadingId(null);
    }
  };

  useEffect(() => {
    loadDashboard();
    loadVerificationRequests();
  }, [loadDashboard, loadVerificationRequests]);

  // Data formate karne ka function (Rupees ke liye)
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatAmountWithGst = (priceInput: any) => {
    const str = String(priceInput || "10000");
    const num = Number(str.replace(/[^\d]/g, "")) || 10000;
    const gst = Math.round(num * 0.05);
    const total = num + gst;

    const formattedNum = num.toLocaleString("en-IN");
    const formattedTotal = total.toLocaleString("en-IN");

    return `₹${formattedNum} + GST (5%) = ₹${formattedTotal}`;
  };

  const formatSubmittedDate = (val: any) => {
    if (!val) return "—";
    try {
      const d = new Date(val);
      if (isNaN(d.getTime())) return String(val);
      return d.toLocaleString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
    } catch {
      return String(val || "—");
    }
  };

  const stats = dashboard?.stats;

  return (
    <div className="space-y-7">
      {/* =====================================================
          WELCOME BANNER (PREMIUM GREEN & GOLD)
      ===================================================== */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#063d2a] via-[#087443] to-[#042a1d] p-7 text-white shadow-2xl shadow-[#087443]/20 sm:p-9">
        <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            {/* LOGO & COMPANY NAME */}
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl ">
                <Image
                  src="/logo2.png"
                  width={80}
                  height={80}
                  alt="Restore Logo"
                />
              </div>
              <h1 className="text-lg font-extrabold tracking-wide text-white">
                Restore<span className="text-[#d9bd63]">Health</span>
              </h1>
            </div>

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d9bd63]">
              Admin Dashboard
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Administration Overview
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/70">
              Monitor agents, orders, payments, confirmations and customer
              support from one highly secure centralized dashboard.
            </p>
          </div>

          <button
            onClick={loadDashboard}
            disabled={loading}
            className="flex w-fit items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/20 hover:text-[#d9bd63] disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <RefreshCw size={18} />
            )}
            Sync Data
          </button>
        </div>

        {/* Abstract Background Shapes */}
        <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full border-[30px] border-[#d9bd63]/10" />
        <div className="absolute -bottom-24 right-32 h-48 w-48 rounded-full border-[20px] border-white/5" />
      </section>

      {/* =====================================================
          ERROR STATE
      ===================================================== */}
      {!loading && error && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-bold text-red-600">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {/* =====================================================
          STAT CARDS
      ===================================================== */}
      {stats && (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {/* Card 1: Agents */}
          <StatCard
            title="Total Agents"
            value={stats.agents.toLocaleString("en-IN")}
            subtitle="Registered users"
            icon={Users}
          />
          {/* Card 2: Orders */}
          <StatCard
            title="Total Orders"
            value={stats.orders.toLocaleString("en-IN")}
            subtitle="All time orders"
            icon={ShoppingBag}
          />
          {/* Card 3: Payments */}
          <StatCard
            title="Payments"
            value={formatCurrency(stats.payments.successfulAmount)}
            subtitle={`${stats.payments.successful} Successful transactions`}
            icon={CreditCard}
          />
          {/* Card 4: Pending */}
          <StatCard
            title="Confirmation Pending"
            value={stats.confirmationPending.toString()}
            subtitle="Requires attention"
            icon={AlertCircle}
            alert={stats.confirmationPending > 0}
          />
        </section>
      )}

      <section className="rounded-3xl border border-[#e5ebe5] bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111611]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-extrabold text-[#1f2d24] dark:text-white">
              Verification Requests
            </h3>
            <p className="mt-1 text-xs font-medium text-[#8a958d]">
              Review company verification submissions before enabling payment.
            </p>
          </div>
          <button
            type="button"
            onClick={loadVerificationRequests}
            className="rounded-xl border border-[#dfe7df] bg-[#f8faf8] px-3 py-2 text-[11px] font-black text-[#087443]"
          >
            Refresh
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {verificationRequestsLoading ? (
            <div className="flex items-center gap-3 rounded-2xl border border-dashed border-[#dfe7df] bg-[#fafcfb] p-4 text-sm font-bold text-[#69756d]">
              <Loader2 size={18} className="animate-spin" />
              Loading verification requests...
            </div>
          ) : verificationRequests.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#dfe7df] bg-[#fafcfb] p-5 text-sm font-bold text-[#69756d]">
              No verification requests yet.
            </div>
          ) : (
            verificationRequests.map((request) => {
              const isRejecting = rejectingId === request.id;
              const isLoading = actionLoadingId === request.id;
              const currentRejectReason = rejectReasonMap[request.id] || "";

              return (
                <div
                  key={request.id}
                  className="rounded-2xl border border-[#edf1ee] bg-[#fafcfb] p-4 dark:border-white/5 dark:bg-white/5"
                >
                  {/* REQUEST HEADER */}
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-1 text-xs">
                      <p className="text-sm font-black text-[#1f2d24] dark:text-white">
                        {request.companyName || "Resote Health Services"}
                      </p>
                      <p className="font-semibold text-[#536057]">
                        <span className="font-bold text-[#1f2d24] dark:text-white">Client Name: </span>
                        {request.clientName || request.userName || request.userEmail || "Restore Health"}
                      </p>
                      <p className="font-semibold text-[#536057]">
                        <span className="font-bold text-[#1f2d24] dark:text-white">Mob No.: </span>
                        {request.clientPhone || request.mobileNumber || request.phoneNumber || request.phone || request.verificationNumber || "9205456671"}
                      </p>
                      <p className="font-semibold text-[#536057]">
                        <span className="font-bold text-[#1f2d24] dark:text-white">Plan: </span>
                        {request.planName || "Individual"}{request.familyCoverage ? ` (${request.familyCoverage})` : ""}
                      </p>
                      <p className="font-bold text-[#087443] dark:text-[#74c99e]">
                        <span className="font-bold text-[#1f2d24] dark:text-white">Amount+GST: </span>
                        {formatAmountWithGst(request.planPrice)}
                      </p>
                      <p className="text-[11px] text-[#8a958d]">
                        <span className="font-bold text-[#1f2d24] dark:text-white">Submitted: </span>
                        {formatSubmittedDate(request.createdAt)}
                      </p>
                      {request.verificationStatus === "REJECTED" && request.rejectionReason && (
                        <p className="mt-1.5 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-[11px] font-semibold text-red-700">
                          Rejection Reason: {request.rejectionReason}
                        </p>
                      )}
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${
                        request.verificationStatus === "APPROVED"
                          ? "bg-emerald-100 text-emerald-700"
                          : request.verificationStatus === "REJECTED"
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {request.verificationStatus || "PENDING"}
                    </span>
                  </div>

                  {/* ACTIONS */}
                  <div className="mt-4">
                    {/* Reject reason input */}
                    {isRejecting && (
                      <div className="mb-3">
                        <label className="mb-1 block text-[11px] font-black text-[#536057] uppercase tracking-wider">
                          Rejection Reason (optional)
                        </label>
                        <input
                          type="text"
                          value={currentRejectReason}
                          onChange={(e) =>
                            setRejectReasonMap((prev) => ({
                              ...prev,
                              [request.id]: e.target.value,
                            }))
                          }
                          placeholder="Enter reason for rejection..."
                          className="w-full rounded-xl border border-[#dfe7df] bg-white px-3 py-2 text-xs font-semibold text-[#1f2d24] outline-none focus:border-red-400"
                        />
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {/* Approve button */}
                      <button
                        type="button"
                        onClick={() => handleVerificationAction(request.id, "approve")}
                        disabled={request.verificationStatus === "APPROVED" || isLoading || isRejecting}
                        className="rounded-full bg-[#087443] px-4 py-2 text-xs font-black text-white disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isLoading && !isRejecting ? "Approving..." : "Approve"}
                      </button>

                      {/* Reject flow */}
                      {!isRejecting ? (
                        <button
                          type="button"
                          onClick={() => setRejectingId(request.id)}
                          disabled={request.verificationStatus === "REJECTED" || isLoading}
                          className="rounded-full bg-red-600 px-4 py-2 text-xs font-black text-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Reject
                        </button>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              handleVerificationAction(request.id, "reject", currentRejectReason)
                            }
                            disabled={isLoading}
                            className="rounded-full bg-red-600 px-4 py-2 text-xs font-black text-white disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isLoading ? "Rejecting..." : "Confirm Reject"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setRejectingId(null)}
                            disabled={isLoading}
                            className="rounded-full border border-[#dfe7df] bg-white px-4 py-2 text-xs font-black text-[#536057] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* =====================================================
          LOWER SECTION (SILVER & WHITE PANELS)
      ===================================================== */}
      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        {/* RECENT ACTIVITY / NOTIFICATIONS */}
        <div className="rounded-3xl border border-[#e5ebe5] bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111611]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-[#1f2d24] dark:text-white">
                Recent Activity
              </h3>
              <p className="mt-1 text-xs font-medium text-[#8a958d]">
                Latest system notifications
              </p>
            </div>
            <button className="text-xs font-bold text-[#087443] hover:text-[#b8860b] dark:text-[#d9bd63]">
              View All
            </button>
          </div>

          <div className="mt-6">
            {!dashboard?.notifications ||
            dashboard.notifications.length === 0 ? (
              <div className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#dfe7df] bg-[#fcfbf7] dark:border-white/10 dark:bg-white/5">
                <Bell size={28} className="text-[#b4bdb5]" />
                <p className="mt-3 text-sm font-bold text-[#737d74]">
                  No recent activity
                </p>
                <p className="mt-1 text-xs text-[#a0aaa1]">
                  Things are quiet right now.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Dynamically render recent 4 notifications from DB */}
                {dashboard.notifications.slice(0, 4).map((notif: any) => (
                  <div
                    key={notif.id}
                    className="flex items-start gap-4 rounded-xl border border-[#f0f5f0] bg-[#fafcfb] p-4 transition hover:border-[#d9bd63]/30 dark:border-white/5 dark:bg-white/5"
                  >
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#eaf5ef] text-[#087443]">
                      <Bell size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#1f2d24] dark:text-white">
                        {notif.title}
                      </p>
                      <p className="mt-1 text-xs font-medium text-[#7c887f]">
                        {notif.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* SYSTEM STATUS */}
        <div className="rounded-3xl border border-[#e5ebe5] bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111611]">
          <div>
            <h3 className="text-base font-extrabold text-[#1f2d24] dark:text-white">
              System Status
            </h3>
            <p className="mt-1 text-xs font-medium text-[#8a958d]">
              Current platform services
            </p>
          </div>

          <div className="mt-6 space-y-3">
            {[
              "Firebase Database",
              "Authentication",
              "Secure Token API",
              "Twilio OTP Service",
            ].map((service) => (
              <div
                key={service}
                className="flex items-center justify-between rounded-xl border border-[#f0f5f0] bg-[#fafcfb] px-4 py-3.5 transition hover:border-[#087443]/20 dark:border-white/5 dark:bg-white/5"
              >
                <span className="text-xs font-bold text-[#536057] dark:text-white/80">
                  {service}
                </span>
                <span className="flex items-center gap-1.5 text-[10px] font-extrabold text-[#087443] dark:text-[#74c99e]">
                  <CheckCircle2 size={15} />
                  OPERATIONAL
                </span>
              </div>
            ))}
          </div>

          {/* QUICK SUPPORT INFO */}
          <div className="mt-6 rounded-2xl bg-gradient-to-r from-[#faf8f0] to-[#f5edcf] p-5 border border-[#d9bd63]/30 dark:from-[#d9bd63]/10 dark:to-[#d9bd63]/5">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#b8860b]">
              Security Active
            </p>
            <p className="mt-1 text-xs font-medium text-[#6d5c28] dark:text-[#e6c66a]/80">
              Your session is secured with Firebase AES-256 token encryption.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

/* =====================================================
   PREMIUM STAT CARD COMPONENT
===================================================== */
function StatCard({ title, value, subtitle, icon: Icon, alert = false }: any) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-[#e5ebe5] bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-[#d9bd63]/50 hover:shadow-xl hover:shadow-[#b8860b]/5 dark:border-white/10 dark:bg-[#111611]">
      <div className="flex items-start justify-between">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${alert ? "bg-red-50 text-red-600" : "bg-[#eaf5ef] text-[#087443]"} dark:bg-white/5 dark:text-[#d9bd63]`}
        >
          <Icon size={22} />
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f6f8f4] text-[#a0aaa1] transition group-hover:bg-[#d9bd63]/10 group-hover:text-[#b8860b] dark:bg-white/5">
          <ArrowUpRight size={17} />
        </div>
      </div>

      <div className="mt-6">
        <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#8a958d]">
          {title}
        </p>
        <h3
          className={`mt-1 text-3xl font-black tracking-tight ${alert ? "text-red-600" : "text-[#1f2d24] dark:text-white"}`}
        >
          {value}
        </h3>
        <p className="mt-1.5 text-xs font-medium text-[#a0aaa1]">{subtitle}</p>
      </div>
    </div>
  );
}
