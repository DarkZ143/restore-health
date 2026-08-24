/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ShoppingBag,
  CreditCard,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Package,
  User,
  Phone,
  Mail,
} from "lucide-react";

import { auth } from "@/lib/firebase";
import { getIdToken, onAuthStateChanged } from "firebase/auth";

type OrderDetails = {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  amount: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  items: any[];
  shippingAddress: string;
  createdAt: string | null;
};

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrderDetails = useCallback(async () => {
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

      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load order details.");
      }

      setOrder(data.order);
    } catch (err: any) {
      console.error("❌ Order Details Error:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (orderId) fetchOrderDetails();
  }, [fetchOrderDetails, orderId]);

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
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // ==========================================
  // LOADING & ERROR STATES
  // ==========================================
  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <Loader2 size={36} className="animate-spin text-[#d9bd63]" />
        <p className="mt-4 text-sm font-bold text-[#536057]">
          Loading Order Details...
        </p>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-bold text-[#8a958d] hover:text-[#b8860b] transition"
        >
          <ArrowLeft size={16} /> Back to Orders
        </button>
        <div className="flex flex-col items-center justify-center rounded-3xl border border-red-200 bg-red-50 p-10 text-center">
          <AlertCircle size={40} className="text-red-500 mb-4" />
          <h2 className="text-xl font-extrabold text-red-700">
            Order Not Found
          </h2>
          <p className="mt-2 text-sm text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN UI
  // ==========================================
  return (
    <div className="space-y-7 pb-10">
      {/* TOP BAR */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-bold text-[#536057] border border-[#dfe7df] shadow-sm transition hover:border-[#d9bd63]/50 hover:text-[#b8860b]"
        >
          <ArrowLeft
            size={16}
            className="transition group-hover:-translate-x-1"
          />{" "}
          Back to Orders
        </button>
        <OrderStatusBadge status={order?.status || "pending"} large />
      </div>

      {/* HERO BANNER */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#063d2a] via-[#087443] to-[#042a1d] p-7 text-white shadow-2xl shadow-[#087443]/20 sm:p-9 flex flex-col sm:flex-row gap-8 items-center sm:items-start">
        <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#d9bd63] to-[#a47508] shadow-lg shadow-black/20 z-10 border border-white/10">
          <ShoppingBag size={32} className="text-white" />
        </div>
        <div className="relative z-10 flex-1 text-center sm:text-left">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d9bd63]">
            Order Reference
          </p>
          <h1 className="mt-1 text-3xl font-black tracking-tight font-mono">
            #{order?.id.slice(0, 8).toUpperCase()}
          </h1>
          <p className="mt-2 text-sm font-medium text-white/80">
            Placed on {formatDate(order?.createdAt || null)}
          </p>
        </div>
        <div className="relative z-10 text-center sm:text-right">
          <p className="text-xs font-bold uppercase tracking-wider text-[#d9bd63]">
            Total Amount
          </p>
          <p className="mt-1 text-4xl font-black text-white">
            {formatCurrency(order?.amount || 0)}
          </p>
          <div className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold backdrop-blur-sm border border-white/10">
            <CreditCard size={14} className="text-[#d9bd63]" />
            {order?.paymentMethod} <span className="mx-1">•</span>{" "}
            <span className="uppercase text-[#d9bd63]">
              {order?.paymentStatus}
            </span>
          </div>
        </div>
        <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full border-[30px] border-[#d9bd63]/10" />
      </section>

      <div className="grid grid-cols-1 gap-7 lg:grid-cols-3">
        {/* CUSTOMER & SHIPPING INFO */}
        <div className="lg:col-span-1 space-y-7">
          <div className="rounded-3xl border border-[#e5ebe5] bg-white p-7 shadow-sm">
            <h3 className="text-sm font-extrabold text-[#1f2d24] mb-5 uppercase tracking-widest">
              Customer Details
            </h3>
            <div className="space-y-5">
              <InfoRow icon={User} label="Name" value={order?.customerName} />
              <InfoRow icon={Mail} label="Email" value={order?.customerEmail} />
              <InfoRow
                icon={Phone}
                label="Phone"
                value={order?.customerPhone}
              />
            </div>
          </div>

          <div className="rounded-3xl border border-[#e5ebe5] bg-white p-7 shadow-sm">
            <h3 className="text-sm font-extrabold text-[#1f2d24] mb-5 uppercase tracking-widest">
              Shipping Address
            </h3>
            <div className="flex gap-4 items-start">
              <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f6f8f4] text-[#8a958d]">
                <MapPin size={18} />
              </div>
              <p className="text-sm font-bold text-[#29372f] leading-relaxed">
                {order?.shippingAddress}
              </p>
            </div>
          </div>
        </div>

        {/* ORDER ITEMS */}
        <div className="lg:col-span-2 rounded-3xl border border-[#e5ebe5] bg-white shadow-sm overflow-hidden">
          <div className="p-7 border-b border-[#e5ebe5] bg-[#fafcfb]">
            <h3 className="text-lg font-extrabold text-[#1f2d24]">
              Purchased Items
            </h3>
            <p className="mt-1 text-xs font-medium text-[#8b968e]">
              Products or services included in this order.
            </p>
          </div>
          <div className="p-7">
            {!order?.items || order.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Package size={32} className="text-[#c1cbc2] mb-3" />
                <p className="text-sm font-bold text-[#455248]">
                  No items specified
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-2xl border border-[#f0f5f0] bg-[#fafcfb] p-4 transition hover:border-[#d9bd63]/30 hover:bg-white"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eaf5ef] text-[#087443]">
                        <Package size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#1f2d24]">
                          {item.name || "Item Name"}
                        </p>
                        <p className="text-xs font-medium text-[#8a958d]">
                          Qty: {item.quantity || 1}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-extrabold text-[#087443]">
                      {formatCurrency(item.price || 0)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// UTILITY COMPONENTS
// ==========================================
function InfoRow({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f6f8f4] text-[#8a958d]">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#a0aaa1]">
          {label}
        </p>
        <p className="text-sm font-bold text-[#1f2d24]">{value}</p>
      </div>
    </div>
  );
}

function OrderStatusBadge({
  status,
  large = false,
}: {
  status: string;
  large?: boolean;
}) {
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
    styles = "bg-[#eaf5ef] text-[#087443] border-[#087443]/30";
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
      className={`inline-flex items-center gap-2 rounded-full border font-extrabold uppercase tracking-widest ${large ? "px-4 py-2 text-xs shadow-sm" : "px-3 py-1 text-[10px]"} ${styles}`}
    >
      <Icon size={large ? 16 : 12} /> {status || "unknown"}
    </span>
  );
}
