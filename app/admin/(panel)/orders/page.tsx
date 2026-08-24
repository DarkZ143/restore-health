/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  ShoppingCart,
  RefreshCw,
  ChevronRight,
  Package,
  AlertCircle,
  Loader2,
  Clock,
  CheckCircle2,
  XCircle,
  CreditCard,
  Truck,
} from "lucide-react";

import { auth } from "@/lib/firebase";
import { getIdToken, onAuthStateChanged } from "firebase/auth";

type Order = {
  id: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  status: string;
  paymentStatus: string;
  createdAt: string | null;
};

export default function OrdersHistoryPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================================
  // FETCH ORDERS API
  // ==========================================================
  const fetchOrders = useCallback(async () => {
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

      const response = await fetch("/api/admin/orders", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load orders history.");
      }

      setOrders(data.orders || []);
    } catch (err: any) {
      console.error("❌ Admin Orders Error:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // ==========================================================
  // SEARCH & FILTER
  // ==========================================================
  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return orders.filter((order) => {
      // Search Logic
      const matchesSearch =
        !query ||
        order.id.toLowerCase().includes(query) ||
        order.customerName.toLowerCase().includes(query) ||
        order.customerEmail.toLowerCase().includes(query);

      // Status Logic
      const orderStatus = order.status.toLowerCase();
      let matchesStatus = true;

      if (statusFilter !== "all") {
        if (
          statusFilter === "pending" &&
          !orderStatus.includes("pending") &&
          !orderStatus.includes("processing")
        )
          matchesStatus = false;
        if (
          statusFilter === "completed" &&
          !orderStatus.includes("success") &&
          !orderStatus.includes("completed") &&
          !orderStatus.includes("delivered")
        )
          matchesStatus = false;
        if (
          statusFilter === "failed" &&
          !orderStatus.includes("fail") &&
          !orderStatus.includes("cancel")
        )
          matchesStatus = false;
      }

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  // ==========================================================
  // STATS CALCULATION
  // ==========================================================
  const pendingCount = orders.filter(
    (o) =>
      o.status.toLowerCase().includes("pending") ||
      o.status.toLowerCase().includes("processing"),
  ).length;
  const completedCount = orders.filter(
    (o) =>
      o.status.toLowerCase().includes("success") ||
      o.status.toLowerCase().includes("complete") ||
      o.status.toLowerCase().includes("deliver"),
  ).length;
  const failedCount = orders.filter(
    (o) =>
      o.status.toLowerCase().includes("fail") ||
      o.status.toLowerCase().includes("cancel"),
  ).length;

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
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="space-y-7">
      {/* ======================================================
          HEADER
      ====================================================== */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#1f2d24]">
            Orders History
          </h1>
          <p className="mt-1 text-sm font-medium text-[#87928a]">
            Complete log of all purchases, transactions, and order statuses.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchOrders}
          disabled={loading}
          className="flex w-fit items-center gap-2 rounded-xl border border-[#d9bd63]/50 bg-white px-5 py-2.5 text-sm font-bold text-[#b8860b] shadow-sm transition hover:bg-[#faf9f2] disabled:opacity-50"
        >
          {loading ? (
            <Loader2 size={17} className="animate-spin" />
          ) : (
            <RefreshCw size={17} />
          )}
          Refresh History
        </button>
      </div>

      {/* ======================================================
          STAT CARDS
      ====================================================== */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Package}
          title="Total Orders"
          value={orders.length}
          color="default"
        />
        <StatCard
          icon={Clock}
          title="Processing"
          value={pendingCount}
          color="gold"
        />
        <StatCard
          icon={Truck}
          title="Completed"
          value={completedCount}
          color="green"
        />
        <StatCard
          icon={XCircle}
          title="Failed / Cancelled"
          value={failedCount}
          color="red"
        />
      </div>

      {/* ======================================================
          ERROR STATE
      ====================================================== */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
          <AlertCircle size={19} />
          <span>{error}</span>
        </div>
      )}

      {/* ======================================================
          SEARCH & FILTERS
      ====================================================== */}
      <section className="rounded-2xl border border-[#dfe7df] bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-xl">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#929d95]"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Order ID, Customer Name or Email..."
              className="w-full rounded-xl border border-[#dfe6df] bg-[#fbfcfb] py-3 pl-11 pr-4 text-sm font-medium text-[#26352c] outline-none transition focus:border-[#d9bd63] focus:ring-4 focus:ring-[#d9bd63]/10"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-[#dfe6df] bg-[#fbfcfb] px-4 py-3 text-sm font-bold text-[#536057] outline-none focus:border-[#d9bd63]"
          >
            <option value="all">All Orders</option>
            <option value="pending">Processing / Pending</option>
            <option value="completed">Completed / Delivered</option>
            <option value="failed">Failed / Cancelled</option>
          </select>
        </div>
      </section>

      {/* ======================================================
          ORDERS TABLE
      ====================================================== */}
      <section className="overflow-hidden rounded-2xl border border-[#dfe7df] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[#e5ebe5] px-6 py-5 bg-[#fafcfb]">
          <div>
            <h2 className="text-lg font-extrabold text-[#1f2d24]">
              All Transactions
            </h2>
            <p className="mt-1 text-xs font-medium text-[#8b968e]">
              Showing {filteredOrders.length} matching records
            </p>
          </div>
        </div>

        {loading && orders.length === 0 ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <Loader2 size={30} className="animate-spin text-[#d9bd63]" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex min-h-[300px] items-center justify-center px-6 text-center">
            <div>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f1f4f1] text-[#8d9890]">
                <Package size={24} />
              </div>
              <h3 className="mt-4 text-sm font-extrabold text-[#4d5951]">
                No orders found
              </h3>
              <p className="mt-1 text-xs font-medium text-[#939d96]">
                Try adjusting your search or filters.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead>
                <tr className="border-b border-[#e5ebe5] bg-[#f8faf8]">
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment & Status</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead />
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => router.push(`/admin/orders/${order.id}`)}
                    className="group cursor-pointer border-b border-[#edf1ed] transition hover:bg-[#fbf9f2]"
                  >
                    {/* ID */}
                    <td className="px-6 py-4">
                      <span className="rounded-lg bg-[#f3f6f3] px-2.5 py-1.5 text-xs font-bold text-[#68736c] font-mono group-hover:text-[#b8860b] group-hover:bg-[#d9bd63]/10 transition">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </span>
                    </td>

                    {/* CUSTOMER */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eaf5ef] text-[#087443] group-hover:bg-gradient-to-br group-hover:from-[#d9bd63] group-hover:to-[#a47508] group-hover:text-white transition shadow-sm">
                          <ShoppingCart size={16} />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-extrabold text-[#29372f]">
                            {order.customerName}
                          </p>
                          <p className="truncate text-xs font-medium text-[#919b94]">
                            {order.customerEmail}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* AMOUNT */}
                    <td className="px-6 py-4">
                      <p className="text-sm font-extrabold text-[#087443]">
                        {formatCurrency(order.amount)}
                      </p>
                    </td>

                    {/* STATUS */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5 items-start">
                        <span
                          className={`inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest ${order.paymentStatus.toLowerCase().includes("success") || order.paymentStatus.toLowerCase().includes("paid") ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}
                        >
                          <CreditCard size={10} /> {order.paymentStatus}
                        </span>
                        <OrderStatusBadge status={order.status} />
                      </div>
                    </td>

                    {/* DATE */}
                    <td className="px-6 py-4 text-xs font-semibold text-[#68736c]">
                      {formatDate(order.createdAt)}
                    </td>

                    {/* ACTION */}
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white border border-[#e5ebe5] text-[#68736c] transition group-hover:bg-[#d9bd63] group-hover:text-white group-hover:border-[#d9bd63] shadow-sm">
                        <ChevronRight size={17} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

// ==========================================================
// UTILITY COMPONENTS
// ==========================================================

function StatCard({ icon: Icon, title, value, color = "default" }: any) {
  const colorStyles: Record<string, string> = {
    default: "text-[#087443] bg-[#eaf5ef]",
    green: "text-[#087443] bg-green-100",
    gold: "text-[#b8860b] bg-[#fbf9f2]",
    red: "text-red-600 bg-red-50",
  };

  return (
    <div className="rounded-2xl border border-[#dfe7df] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold text-[#7f8a83] uppercase tracking-wider">
            {title}
          </p>
          <p className="mt-2 text-3xl font-black text-[#1f2d24]">{value}</p>
        </div>
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${colorStyles[color]}`}
        >
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

function TableHead({ children }: { children?: React.ReactNode }) {
  return (
    <th className="px-6 py-4 text-left text-[10px] font-extrabold uppercase tracking-wider text-[#87928a]">
      {children}
    </th>
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
