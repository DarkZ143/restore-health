/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  Activity,
  FileText,
  Receipt,
  CreditCard,
  User,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Clock3,
  CheckCircle2,
  Moon,
  Sun,
} from "lucide-react";

// ============================================================
// TYPES
// ============================================================

type UserProfile = {
  id?: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  phoneVerified?: boolean;
  role?: string;
  status?: string;
};

type Transaction = {
  id: string;
  description?: string;
  date?: string;
  amount?: string | number;
  status?: string;
};

type Invoice = {
  id: string;
  invoiceNumber?: string;
  number?: string;
  date?: string;
  amount?: string | number;
  status?: string;
};

type DashboardResponse = {
  success: boolean;
  message?: string;
  user?: UserProfile;
  transactions?: Transaction[];
  invoices?: Invoice[];
};

// ============================================================
// DASHBOARD
// ============================================================

export default function DashboardPage() {
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const [user, setUser] = useState<UserProfile | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============================================================
  // DARK MODE
  // ============================================================

  useEffect(() => {
    const savedTheme = localStorage.getItem("dashboardTheme");

    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("dashboardTheme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("dashboardTheme", "light");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((current) => !current);
  };

  // ============================================================
  // FETCH DASHBOARD DATA
  // ============================================================

  useEffect(() => {
    let mounted = true;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        // ------------------------------------------------------
        // GET LOGGED-IN USER PHONE
        // ------------------------------------------------------

        const phoneNumber =
          localStorage.getItem("userPhone") ||
          localStorage.getItem("restorehealth_phone") ||
          sessionStorage.getItem("loginPhoneNumber");

        if (phoneNumber) {
          localStorage.setItem("userPhone", phoneNumber);
        }

        if (!phoneNumber) {
          router.replace("/auth/login");
          return;
        }

        // ------------------------------------------------------
        // CALL SERVER API
        // ------------------------------------------------------

        const response = await fetch(
          `/api/dashboard?phoneNumber=${encodeURIComponent(phoneNumber)}`,
          {
            method: "GET",
            cache: "no-store",
          },
        );

        const data: DashboardResponse = await response.json();

        console.log("📊 Dashboard API Response:", data);

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to load dashboard data.");
        }

        if (!mounted) return;

        // ------------------------------------------------------
        // USER
        // ------------------------------------------------------

        setUser(data.user || null);

        // ------------------------------------------------------
        // TRANSACTIONS
        // ------------------------------------------------------

        setTransactions(data.transactions || []);

        // ------------------------------------------------------
        // INVOICES
        // ------------------------------------------------------

        setInvoices(data.invoices || []);
      } catch (err: unknown) {
        console.error("❌ Dashboard API Error:", err);

        if (!mounted) return;

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load dashboard data. Please try again.",
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchDashboardData();

    return () => {
      mounted = false;
    };
  }, [router]);

  // ============================================================
  // LOGOUT
  // ============================================================

  const handleLogout = () => {
    localStorage.removeItem("userPhone");
    localStorage.removeItem("restorehealth_phone");
    localStorage.removeItem("user");
    localStorage.removeItem("restorehealth_user");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("restorehealth_logged_in");
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");

    sessionStorage.removeItem("loginPhoneNumber");
    sessionStorage.removeItem("userId");

    toast.success("You have been logged out.");
    router.replace("/auth/login");
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5faf7] dark:bg-[#041611]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#0dce91]/20 border-t-[#0dce91]" />

          <p className="text-sm font-semibold text-[#71827c] dark:text-emerald-100/60">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5faf7] px-4 dark:bg-[#041611]">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg dark:bg-[#072018]">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-500 dark:bg-red-500/10">
            <ShieldCheck size={25} />
          </div>

          <h2 className="text-xl font-black text-[#092d28] dark:text-white">
            Unable to Load Dashboard
          </h2>

          <p className="mt-2 text-sm text-[#71827c] dark:text-emerald-100/50">
            {error}
          </p>

          <button
            onClick={handleLogout}
            className="mt-6 rounded-xl bg-[#0d9f72] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0b8c65]"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  // ============================================================
  // COUNTS
  // ============================================================

  const completedTransactions = transactions.filter(
    (item) =>
      String(item.status || "").toLowerCase() === "completed" ||
      String(item.status || "").toLowerCase() === "success",
  ).length;

  const pendingTransactions = transactions.filter(
    (item) => String(item.status || "").toLowerCase() === "pending",
  ).length;

  // ============================================================
  // MAIN DASHBOARD
  // ============================================================

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-[#041611] text-white" : "bg-[#f5faf7] text-[#092d28]"
      }`}
    >
      {/* =====================================================
          MOBILE OVERLAY
      ====================================================== */}

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-black/5 bg-white shadow-xl transition-transform duration-300 dark:border-white/10 dark:bg-[#072018] ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* LOGO */}

        <div className="flex h-20 items-center justify-between border-b border-black/5 px-6 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl ">
              <Image src="/logo2.png" width={60} height={60} alt="Logo" />
            </div>

            <div>
              <h1 className="font-black tracking-tight text-[#092d28] dark:text-white">
                Restore Health Services
              </h1>

              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6b8079] dark:text-emerald-100/50">
                Portal
              </p>
            </div>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 text-[#092d28] dark:text-white lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* =====================================================
            NAVIGATION
        ====================================================== */}

        <nav className="flex-1 space-y-2 p-4">
          <SidebarItem
            icon={<Activity size={19} />}
            label="Dashboard"
            href="/dashboard"
            active
            onClick={() => setSidebarOpen(false)}
          />

          <SidebarItem
            icon={<CreditCard size={19} />}
            label="Transactions"
            href="/transactions"
            onClick={() => setSidebarOpen(false)}
          />

          <SidebarItem
            icon={<Receipt size={19} />}
            label="Invoices"
            href="/invoices"
            onClick={() => setSidebarOpen(false)}
          />

          <SidebarItem
            icon={<User size={19} />}
            label="My Profile"
            href="/profile"
            onClick={() => setSidebarOpen(false)}
          />
        </nav>

        {/* =====================================================
            ACCOUNT
        ====================================================== */}

        <div className="border-t border-black/5 p-4 dark:border-white/10">
          <div className="mb-3 rounded-xl bg-[#f1f8f4] p-3 dark:bg-white/5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0dce91]/15 font-bold text-[#0d9f72]">
                {getInitial(user?.fullName)}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-[#092d28] dark:text-white">
                  {user?.fullName || "User"}
                </p>

                <p className="truncate text-xs text-[#71827c] dark:text-emerald-100/50">
                  {user?.phoneNumber || "—"}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* =====================================================
          MAIN
      ====================================================== */}

      <main className="lg:ml-72">
        {/* TOP BAR */}

        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-black/5 bg-white/80 px-4 backdrop-blur-xl dark:border-white/10 dark:bg-[#041611]/80 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl border border-black/5 p-2.5 text-[#092d28] lg:hidden dark:border-white/10 dark:text-white"
            >
              <Menu size={20} />
            </button>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#71827c] dark:text-emerald-100/50">
                Agent Portal
              </p>

              <h2 className="text-lg font-black sm:text-xl">Dashboard</h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* DARK MODE */}

            <button
              onClick={toggleDarkMode}
              aria-label="Toggle dark mode"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/5 bg-white transition hover:bg-black/5 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
            >
              {darkMode ? (
                <Sun size={19} className="text-yellow-400" />
              ) : (
                <Moon size={19} className="text-[#092d28]" />
              )}
            </button>

            <div className="hidden text-right sm:block">
              <p className="text-sm font-bold">{user?.fullName || "User"}</p>

              <p className="text-xs text-[#71827c] dark:text-emerald-100/50">
                {user?.phoneVerified ? "Verified Account" : "Account"}
              </p>
            </div>

            <Link
              href="/profile"
              aria-label="Open My Profile"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-[#0dce91] to-[#246b1c] font-bold text-white transition hover:scale-105"
            >
              {getInitial(user?.fullName)}
            </Link>
          </div>
        </header>

        {/* CONTENT */}

        <div className="space-y-8 p-4 sm:p-6 lg:p-8">
          {/* =================================================
              WELCOME
          ================================================== */}

          <section className="relative overflow-hidden rounded-3xl bg-linear-to-r from-[#092d28] via-[#0c493b] to-[#0d795d] p-6 text-white shadow-xl sm:p-8">
            <div className="relative z-10">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold backdrop-blur">
                <ShieldCheck size={14} />
                Verified Account
              </div>

              <h1 className="text-2xl font-black sm:text-3xl">
                Welcome back, {user?.fullName || "User"}!
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-white/70">
                Manage your account, transactions and invoices from your
                RestoreHealth dashboard.
              </p>
            </div>

            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#0dce91]/20 blur-3xl" />

            <div className="absolute -bottom-24 right-20 h-52 w-52 rounded-full bg-[#c89416]/10 blur-3xl" />
          </section>

          {/* =================================================
              ACCOUNT OVERVIEW
          ================================================== */}

          <section>
            <div className="mb-4">
              <h2 className="text-xl font-black">Account Overview</h2>

              <p className="mt-1 text-sm text-[#71827c] dark:text-emerald-100/50">
                Your registered account information
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <InfoCard
                icon={<User size={20} />}
                title="Full Name"
                value={user?.fullName || "—"}
              />

              <InfoCard
                icon={<FileText size={20} />}
                title="Email Address"
                value={user?.email || "—"}
              />

              <InfoCard
                icon={<ShieldCheck size={20} />}
                title="Mobile Number"
                value={user?.phoneNumber || "—"}
                verified={user?.phoneVerified}
              />
            </div>
          </section>

          {/* =================================================
              STATS
          ================================================== */}

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={<CreditCard size={21} />}
              title="Transactions"
              value={transactions.length.toString()}
              subtitle="Total transactions"
            />

            <StatCard
              icon={<Receipt size={21} />}
              title="Invoices"
              value={invoices.length.toString()}
              subtitle="Total invoices"
            />

            <StatCard
              icon={<CheckCircle2 size={21} />}
              title="Completed"
              value={completedTransactions.toString()}
              subtitle="Successful transactions"
            />

            <StatCard
              icon={<Clock3 size={21} />}
              title="Pending"
              value={pendingTransactions.toString()}
              subtitle="Awaiting completion"
            />
          </section>

          {/* =================================================
              TRANSACTIONS
          ================================================== */}

          <section className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm dark:border-white/10 dark:bg-[#072018]">
            <div className="border-b border-black/5 p-5 dark:border-white/10">
              <h2 className="font-black">Recent Transactions</h2>

              <p className="mt-1 text-xs text-[#71827c] dark:text-emerald-100/50">
                Your latest transaction activity
              </p>
            </div>

            {transactions.length === 0 ? (
              <EmptyState
                icon={<CreditCard size={25} />}
                title="No transactions yet"
                description="Your transaction history will appear here."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#f7fbf9] text-xs uppercase tracking-wider dark:bg-white/5">
                    <tr>
                      <th className="px-5 py-4">Transaction</th>
                      <th className="px-5 py-4">Date</th>
                      <th className="px-5 py-4">Amount</th>
                      <th className="px-5 py-4">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {transactions.map((transaction) => (
                      <tr
                        key={transaction.id}
                        className="border-t border-black/5 dark:border-white/10"
                      >
                        <td className="px-5 py-4 font-semibold">
                          {transaction.description || "Transaction"}
                        </td>

                        <td className="px-5 py-4 text-[#71827c] dark:text-emerald-100/50">
                          {formatDate(transaction.date)}
                        </td>

                        <td className="px-5 py-4 font-bold">
                          ₹{formatAmount(transaction.amount)}
                        </td>

                        <td className="px-5 py-4">
                          <StatusBadge
                            status={transaction.status || "Pending"}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* =================================================
              INVOICES
          ================================================== */}

          <section className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm dark:border-white/10 dark:bg-[#072018]">
            <div className="border-b border-black/5 p-5 dark:border-white/10">
              <h2 className="font-black">Invoices</h2>

              <p className="mt-1 text-xs text-[#71827c] dark:text-emerald-100/50">
                Your invoices and billing records
              </p>
            </div>

            {invoices.length === 0 ? (
              <EmptyState
                icon={<Receipt size={25} />}
                title="No invoices available"
                description="Your invoices will appear here when they are generated."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#f7fbf9] text-xs uppercase tracking-wider dark:bg-white/5">
                    <tr>
                      <th className="px-5 py-4">Invoice</th>
                      <th className="px-5 py-4">Date</th>
                      <th className="px-5 py-4">Amount</th>
                      <th className="px-5 py-4">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {invoices.map((invoice) => (
                      <tr
                        key={invoice.id}
                        className="border-t border-black/5 dark:border-white/10"
                      >
                        <td className="px-5 py-4 font-bold">
                          {invoice.invoiceNumber ||
                            invoice.number ||
                            `INV-${invoice.id.slice(0, 6)}`}
                        </td>

                        <td className="px-5 py-4 text-[#71827c] dark:text-emerald-100/50">
                          {formatDate(invoice.date)}
                        </td>

                        <td className="px-5 py-4 font-bold">
                          ₹{formatAmount(invoice.amount)}
                        </td>

                        <td className="px-5 py-4">
                          <StatusBadge status={invoice.status || "Pending"} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* FOOTER */}

          <div className="pb-4 text-center text-xs text-[#71827c] dark:text-emerald-100/40">
            © {new Date().getFullYear()} RestoreHealth. All rights reserved.
          </div>
        </div>
      </main>
    </div>
  );
}

// ============================================================
// HELPERS
// ============================================================

function formatDate(value: unknown): string {
  if (!value) {
    return "—";
  }

  try {
    if (typeof value === "string") {
      const date = new Date(value);

      if (!Number.isNaN(date.getTime())) {
        return date.toLocaleDateString("en-IN");
      }

      return value;
    }

    if (typeof value === "number") {
      const date = new Date(value);

      if (!Number.isNaN(date.getTime())) {
        return date.toLocaleDateString("en-IN");
      }
    }

    if (typeof value === "object" && value !== null && "seconds" in value) {
      const timestamp = value as {
        seconds?: number;
        nanoseconds?: number;
      };

      if (typeof timestamp.seconds === "number") {
        const date = new Date(
          timestamp.seconds * 1000 +
            Math.floor((timestamp.nanoseconds || 0) / 1000000),
        );

        return date.toLocaleDateString("en-IN");
      }
    }

    return String(value);
  } catch {
    return "—";
  }
}

function formatAmount(value: string | number | undefined) {
  if (value === undefined || value === null || value === "") {
    return "0";
  }

  const numberValue = Number(value);

  if (Number.isNaN(numberValue)) {
    return String(value);
  }

  return numberValue.toLocaleString("en-IN");
}

function getInitial(name?: string) {
  return (name?.trim()?.charAt(0) || "U").toUpperCase();
}

// ============================================================
// SIDEBAR ITEM
// ============================================================

function SidebarItem({
  icon,
  label,
  href,
  active = false,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all ${
        active
          ? "bg-[#0dce91]/10 text-[#0d9f72] shadow-sm"
          : "text-[#71827c] hover:bg-black/5 hover:text-[#092d28] dark:text-emerald-100/60 dark:hover:bg-white/5 dark:hover:text-white"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}

// ============================================================
// INFO CARD
// ============================================================

function InfoCard({
  icon,
  title,
  value,
  verified = false,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  verified?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#072018]">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#0dce91]/10 text-[#0d9f72]">
        {icon}
      </div>

      <p className="text-xs font-bold uppercase tracking-wider text-[#71827c] dark:text-emerald-100/50">
        {title}
      </p>

      <div className="mt-1 flex items-center gap-2">
        <p className="truncate text-sm font-black">{value}</p>

        {verified && (
          <ShieldCheck size={15} className="shrink-0 text-[#0dce91]" />
        )}
      </div>
    </div>
  );
}

// ============================================================
// STAT CARD
// ============================================================

function StatCard({
  icon,
  title,
  value,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
}) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#072018]">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0dce91]/10 text-[#0d9f72]">
          {icon}
        </div>

        <span className="text-2xl font-black">{value}</span>
      </div>

      <p className="font-bold">{title}</p>

      <p className="mt-1 text-xs text-[#71827c] dark:text-emerald-100/50">
        {subtitle}
      </p>
    </div>
  );
}

// ============================================================
// EMPTY STATE
// ============================================================

function EmptyState({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0dce91]/10 text-[#0d9f72]">
        {icon}
      </div>

      <h3 className="font-black">{title}</h3>

      <p className="mt-1 max-w-sm text-sm text-[#71827c] dark:text-emerald-100/50">
        {description}
      </p>
    </div>
  );
}

// ============================================================
// STATUS BADGE
// ============================================================

function StatusBadge({ status }: { status: string }) {
  const normalizedStatus = status.toLowerCase().trim();

  const isSuccess =
    normalizedStatus === "completed" ||
    normalizedStatus === "paid" ||
    normalizedStatus === "success";

  const isPending = normalizedStatus === "pending";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${
        isSuccess
          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
          : isPending
            ? "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
            : "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400"
      }`}
    >
      {status}
    </span>
  );
}
