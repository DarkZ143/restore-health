/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  Phone,
  ShieldCheck,
  ShoppingBag,
  CreditCard,
  Calendar,
  AlertCircle,
  Loader2,
  Clock,
  CheckCircle2,
  XCircle,
  Activity,
  MapPin,
  User,
} from "lucide-react";

import { auth } from "@/lib/firebase";
import { getIdToken, onAuthStateChanged } from "firebase/auth";

// ==========================================================
// TYPES
// ==========================================================
type AgentDetails = {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
  status: string;
  phoneVerified: boolean;
  createdAt: string | null;
  address?: string;
  totalOrders: number;
  totalSpent: number;
  recentOrders: any[];
};

export default function AgentDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const agentId = params.agentId as string;

  const [agent, setAgent] = useState<AgentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  // ==========================================================
  // FETCH AGENT DETAILS
  // ==========================================================
  const fetchAgentDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

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

      if (!token) throw new Error("Authentication token missing.");

      // Yeh API hum next step mein banayenge!
      const response = await fetch(`/api/admin/agents/${agentId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load agent details.");
      }

      setAgent(data.agent);
    } catch (err: any) {
      console.error("❌ Agent Details Error:", err);
      // Fallback for UI testing before API is ready
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [agentId]);

  useEffect(() => {
    if (agentId) {
      fetchAgentDetails();
    }
  }, [fetchAgentDetails, agentId]);

  // ==========================================================
  // UTILS
  // ==========================================================
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  function formatDate(date: string | null) {
    if (!date) return "—";
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return "—";
    return parsed.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  // ==========================================================
  // LOADING STATE
  // ==========================================================
  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <Loader2 size={36} className="animate-spin text-[#d9bd63]" />
        <p className="mt-4 text-sm font-bold text-[#536057]">
          Loading Client Profile...
        </p>
      </div>
    );
  }

  // ==========================================================
  // ERROR STATE (When API is not yet built)
  // ==========================================================
  if (error && !agent) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-bold text-[#8a958d] hover:text-[#b8860b] transition"
        >
          <ArrowLeft size={16} /> Back to Clients
        </button>
        <div className="flex flex-col items-center justify-center rounded-3xl border border-red-200 bg-red-50 p-10 text-center">
          <AlertCircle size={40} className="text-red-500 mb-4" />
          <h2 className="text-xl font-extrabold text-red-700">
            Oops! Profile Not Found
          </h2>
          <p className="mt-2 text-sm text-red-600">{error}</p>
          <p className="mt-4 text-xs font-bold text-red-500 uppercase tracking-widest">
            (Backend API missing for this route)
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7 pb-10">
      {/* ======================================================
          HEADER & BACK BUTTON
      ====================================================== */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-bold text-[#536057] border border-[#dfe7df] shadow-sm transition hover:border-[#d9bd63]/50 hover:text-[#b8860b]"
        >
          <ArrowLeft
            size={16}
            className="transition group-hover:-translate-x-1"
          />
          Back to List
        </button>

        <div className="flex items-center gap-2">
          <StatusBadge status={agent?.status || "active"} />
        </div>
      </div>

      {/* ======================================================
          AGENT PROFILE HERO (PREMIUM GREEN & GOLD)
      ====================================================== */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#063d2a] via-[#087443] to-[#042a1d] p-7 text-white shadow-2xl shadow-[#087443]/20 sm:p-9 flex flex-col sm:flex-row gap-8 items-center sm:items-start">
        {/* Avatar */}
        <div className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#d9bd63] to-[#a47508] text-4xl font-black text-white shadow-lg shadow-black/20 z-10 border-4 border-white/10">
          {agent?.fullName ? agent.fullName.charAt(0).toUpperCase() : "A"}

          {agent?.phoneVerified && (
            <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#087443] shadow-md">
              <ShieldCheck size={18} />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="relative z-10 flex-1 text-center sm:text-left">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d9bd63]">
            Agent Profile ID: {agent?.id.slice(0, 8).toUpperCase()}
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            {agent?.fullName || "Unnamed Agent"}
          </h1>

          <div className="mt-5 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm font-medium text-white/80">
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/10">
              <Mail size={15} className="text-[#d9bd63]" />{" "}
              {agent?.email || "No Email"}
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/10">
              <Phone size={15} className="text-[#d9bd63]" />{" "}
              {agent?.phoneNumber || "No Phone"}
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/10">
              <Calendar size={15} className="text-[#d9bd63]" /> Joined{" "}
              {formatDate(agent?.createdAt || null)}
            </div>
          </div>
        </div>

        {/* Decorative Background */}
        <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full border-[30px] border-[#d9bd63]/10" />
      </section>

      {/* ======================================================
          STATS ROW
      ====================================================== */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Total Orders"
          value={agent?.totalOrders || 0}
          icon={ShoppingBag}
          color="green"
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(agent?.totalSpent || 0)}
          icon={CreditCard}
          color="gold"
        />
        <StatCard
          title="Account Status"
          value={agent?.status.toUpperCase() || "ACTIVE"}
          icon={Activity}
          color="default"
        />
      </section>

      {/* ======================================================
          TABS (OVERVIEW vs TRANSACTIONS)
      ====================================================== */}
      <div className="border-b border-[#dfe7df] flex gap-8">
        <button
          onClick={() => setActiveTab("overview")}
          className={`pb-4 text-sm font-extrabold transition-all ${activeTab === "overview" ? "border-b-2 border-[#b8860b] text-[#b8860b]" : "text-[#8a958d] hover:text-[#536057]"}`}
        >
          Overview & Info
        </button>
        <button
          onClick={() => setActiveTab("transactions")}
          className={`pb-4 text-sm font-extrabold transition-all ${activeTab === "transactions" ? "border-b-2 border-[#b8860b] text-[#b8860b]" : "text-[#8a958d] hover:text-[#536057]"}`}
        >
          Recent Transactions
        </button>
      </div>

      {/* ======================================================
          TAB CONTENT
      ====================================================== */}
      {activeTab === "overview" && (
        <section className="rounded-3xl border border-[#e5ebe5] bg-white p-7 shadow-sm">
          <h3 className="text-lg font-extrabold text-[#1f2d24] mb-6">
            Personal Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <InfoRow
                icon={User}
                label="Full Name"
                value={agent?.fullName || "—"}
              />
              <InfoRow
                icon={Mail}
                label="Email Address"
                value={agent?.email || "—"}
              />
              <InfoRow
                icon={Phone}
                label="Phone Number"
                value={agent?.phoneNumber || "—"}
              />
            </div>
            <div className="space-y-6">
              <InfoRow
                icon={MapPin}
                label="Primary Address"
                value={agent?.address || "Address not provided by agent."}
              />
              <InfoRow
                icon={Calendar}
                label="Registration Date"
                value={formatDate(agent?.createdAt || null)}
              />
            </div>
          </div>
        </section>
      )}

      {activeTab === "transactions" && (
        <section className="overflow-hidden rounded-3xl border border-[#e5ebe5] bg-white shadow-sm">
          <div className="p-6 border-b border-[#e5ebe5] bg-[#fafcfb]">
            <h3 className="text-lg font-extrabold text-[#1f2d24]">
              Order History
            </h3>
            <p className="mt-1 text-xs font-medium text-[#8b968e]">
              All purchases and transactions made by this agent.
            </p>
          </div>

          {!agent?.recentOrders || agent.recentOrders.length === 0 ? (
            <div className="flex min-h-[250px] flex-col items-center justify-center p-6 text-center">
              <ShoppingBag size={32} className="text-[#c1cbc2] mb-3" />
              <p className="text-sm font-bold text-[#455248]">
                No transactions yet
              </p>
              <p className="text-xs text-[#8a958d] mt-1">
                This agent hasn&apos;t made any orders.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-[#e5ebe5] bg-[#f8faf8]">
                    <th className="px-6 py-4 text-left text-[10px] font-extrabold uppercase tracking-wider text-[#87928a]">
                      Order ID
                    </th>
                    <th className="px-6 py-4 text-left text-[10px] font-extrabold uppercase tracking-wider text-[#87928a]">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-[10px] font-extrabold uppercase tracking-wider text-[#87928a]">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-[10px] font-extrabold uppercase tracking-wider text-[#87928a]">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {agent.recentOrders.map((order: any) => (
                    <tr
                      key={order.id}
                      className="border-b border-[#edf1ed] hover:bg-[#fbf9f2] transition cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <span className="rounded-lg bg-[#f3f6f3] px-2.5 py-1.5 text-xs font-bold text-[#68736c] font-mono">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-[#59645d]">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-sm font-extrabold text-[#087443]">
                        {formatCurrency(order.amount)}
                      </td>
                      <td className="px-6 py-4">
                        <OrderStatusBadge status={order.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

// ==========================================================
// UTILITY COMPONENTS
// ==========================================================
function InfoRow({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-start gap-4">
      <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f6f8f4] text-[#8a958d]">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-[#a0aaa1]">
          {label}
        </p>
        <p className="mt-1 text-sm font-bold text-[#1f2d24]">{value}</p>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, title, value, color = "default" }: any) {
  const colorStyles: Record<string, string> = {
    default: "text-[#087443] bg-[#eaf5ef]",
    green: "text-[#087443] bg-green-100",
    gold: "text-[#b8860b] bg-[#fbf9f2]",
  };

  return (
    <div className="rounded-3xl border border-[#dfe7df] bg-white p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${colorStyles[color]}`}
        >
          <Icon size={22} />
        </div>
        <div>
          <p className="text-xs font-bold text-[#7f8a83] uppercase tracking-wider">
            {title}
          </p>
          <p className="mt-1 text-2xl font-black text-[#1f2d24]">{value}</p>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase();
  let className = "bg-gray-100 text-gray-600 border-gray-200";

  if (normalized === "active")
    className = "bg-[#eaf5ef] text-[#087443] border-[#087443]/20";
  if (normalized === "inactive")
    className = "bg-yellow-50 text-yellow-700 border-yellow-200";
  if (normalized === "blocked")
    className = "bg-red-50 text-red-700 border-red-200";

  return (
    <span
      className={`rounded-full border px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-widest shadow-sm ${className}`}
    >
      {status || "unknown"}
    </span>
  );
}

function OrderStatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase();
  let styles = "bg-gray-100 text-gray-600 border-gray-200";
  let Icon = Clock;

  if (normalized.includes("pending") || normalized.includes("processing")) {
    styles = "bg-yellow-50 text-yellow-700 border-yellow-200";
    Icon = Clock;
  } else if (
    normalized.includes("success") ||
    normalized.includes("delivered") ||
    normalized.includes("completed")
  ) {
    styles = "bg-[#eaf5ef] text-[#087443] border-[#087443]/20";
    Icon = CheckCircle2;
  } else if (
    normalized.includes("failed") ||
    normalized.includes("cancelled")
  ) {
    styles = "bg-red-50 text-red-700 border-red-200";
    Icon = XCircle;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide ${styles}`}
    >
      <Icon size={12} />
      {status || "unknown"}
    </span>
  );
}
