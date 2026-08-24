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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  // Data formate karne ka function (Rupees ke liye)
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
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
