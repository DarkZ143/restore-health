/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  Bell,
  ChevronRight,
  CircleAlert,
  CreditCard,
  Headphones,
  History,
  LogOut,
  Megaphone,
  Menu,
  Receipt,
  ShoppingCart,
  ShieldCheck,
  UserRound,
  Users,
  X,
} from "lucide-react";

type Notification = {
  id: number;
  type: "pending" | "failed" | "success";
  title: string;
  description: string;
  time: string;
};

const demoNotifications: Notification[] = [
  {
    id: 1,
    type: "pending",
    title: "Confirmation Pending",
    description: "A recent order requires admin confirmation.",
    time: "2 min ago",
  },
  {
    id: 2,
    type: "failed",
    title: "Payment Failed",
    description: "Payment failed for a recent order.",
    time: "12 min ago",
  },
  {
    id: 3,
    type: "success",
    title: "Invoice Confirmed",
    description: "Customer has received invoice & confirmation.",
    time: "28 min ago",
  },
];

const navigation = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: Activity,
  },
  {
    label: "Agents",
    href: "/admin/agents",
    icon: Users,
  },
  {
    label: "Recent Orders",
    href: "/admin/orders/recent",
    icon: ShoppingCart,
  },
  {
    label: "Orders History",
    href: "/admin/orders",
    icon: History,
  },
  {
    label: "Broadcast System",
    href: "/admin/broadcast",
    icon: Megaphone,
  },
  {
    label: "Support",
    href: "/admin/support",
    icon: Headphones,
  },
];

export default function AdminLayoutShell({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");

  useEffect(() => {
    try {
      const storedAdmin = localStorage.getItem("restorehealth_admin");

      if (storedAdmin) {
        const admin = JSON.parse(storedAdmin);
        setAdminEmail(admin?.email || "");
      }
    } catch {
      setAdminEmail("");
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem("restorehealth_admin");
    localStorage.removeItem("restorehealth_admin_logged_in");

    router.replace("/admin/auth/login");
  }

  function getPageName() {
    if (pathname === "/admin/dashboard") return "Dashboard";
    if (pathname.startsWith("/admin/agents")) return "Agents";
    if (pathname.startsWith("/admin/orders/recent")) return "Recent Orders";
    if (pathname.startsWith("/admin/orders")) return "Orders History";
    if (pathname.startsWith("/admin/broadcast")) return "Broadcast System";
    if (pathname.startsWith("/admin/support")) return "Support";

    return "Administration";
  }

  return (
    <div className="min-h-screen bg-[#f5f7f3] text-[#1f2b23] dark:bg-[#090d0a] dark:text-white">
      {/* =====================================================
          MOBILE OVERLAY
      ===================================================== */}

      {mobileOpen && (
        <button
          aria-label="Close sidebar"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-68.75 flex-col border-r border-[#dfe6dc] bg-white transition-transform duration-300 dark:border-white/10 dark:bg-[#0f1511] ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand */}

        <div className="flex h-20.5 items-center justify-between border-b border-[#e8eee5] px-6 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-[#0d6845] via-[#16845a] to-[#095637] shadow-lg shadow-[#0d6845]/20">
              <ShieldCheck size={23} className="text-[#e4c96a]" />
            </div>

            <div>
              <p className="text-[17px] font-extrabold tracking-tight">
                RestoreHealth
              </p>

              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#b38a18]">
                Admin Panel
              </p>
            </div>
          </div>

          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-2 text-[#687268] hover:bg-[#f2f5f1] lg:hidden dark:hover:bg-white/5"
          >
            <X size={20} />
          </button>
        </div>

        {/* Admin profile */}

        <div className="mx-4 mt-5 rounded-2xl border border-[#e1e7de] bg-linear-to-br from-[#f8faf7] to-[#f1f5ef] p-4 dark:border-white/10 dark:from-white/5 dark:to-white/2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0d6845] text-white">
              <UserRound size={19} />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#8a9489]">
                Administrator
              </p>

              <p className="mt-1 truncate text-xs font-bold">
                {adminEmail || "Authorized Admin"}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}

        <div className="px-5 pb-2 pt-7">
          <p className="px-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#9aa39a]">
            Main Menu
          </p>
        </div>

        <nav className="flex-1 space-y-1.5 overflow-y-auto px-4">
          {navigation.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href ||
              (item.href !== "/admin/dashboard" &&
                pathname.startsWith(item.href));

            return (
              <button
                key={item.href}
                onClick={() => {
                  router.push(item.href);
                  setMobileOpen(false);
                }}
                className={`group flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left text-sm font-semibold transition-all ${
                  active
                    ? "bg-linear-to-r from-[#0c6845] to-[#15865a] text-white shadow-lg shadow-[#0c6845]/20"
                    : "text-[#626c63] hover:bg-[#f1f5f0] hover:text-[#0d6845] dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-[#8ed1b3]"
                }`}
              >
                <Icon size={18} />

                <span className="flex-1">{item.label}</span>

                {active && <ChevronRight size={15} />}
              </button>
            );
          })}
        </nav>

        {/* Logout */}

        <div className="border-t border-[#e8eee5] p-4 dark:border-white/10">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold text-red-500 transition hover:bg-red-50 dark:hover:bg-red-500/10"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* =====================================================
          MAIN AREA
      ===================================================== */}

      <div className="lg:pl-68.75">
        {/* ===================================================
            HEADER
        =================================================== */}

        <header className="sticky top-0 z-30 flex h-20.5 items-center justify-between border-b border-[#dfe6dc]/80 bg-white/90 px-5 backdrop-blur-xl dark:border-white/10 dark:bg-[#0b100d]/90 sm:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-xl border border-[#e0e6dd] p-2.5 lg:hidden dark:border-white/10"
            >
              <Menu size={20} />
            </button>

            <div>
              <p className="text-xs font-semibold text-[#89938a]">
                RestoreHealth Administration
              </p>

              <h1 className="mt-0.5 text-xl font-extrabold tracking-tight sm:text-2xl">
                {getPageName()}
              </h1>
            </div>
          </div>

          {/* Header Right */}

          <div className="flex items-center gap-3">
            {/* Notification */}

            <div className="relative">
              <button
                onClick={() => setNotificationOpen((previous) => !previous)}
                className={`relative flex h-11 w-11 items-center justify-center rounded-xl border transition ${
                  notificationOpen
                    ? "border-[#0d6845] bg-[#0d6845] text-white"
                    : "border-[#dfe6dc] bg-white text-[#536057] hover:border-[#0d6845] hover:text-[#0d6845] dark:border-white/10 dark:bg-white/5 dark:text-white/70"
                }`}
              >
                <Bell size={19} />

                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-[#0b100d]" />
              </button>

              {/* Notification popup */}

              {notificationOpen && (
                <>
                  <button
                    className="fixed inset-0 cursor-default"
                    onClick={() => setNotificationOpen(false)}
                    aria-label="Close notifications"
                  />

                  <div className="absolute right-0 top-14 z-50 w-87.5 overflow-hidden rounded-2xl border border-[#dfe6dc] bg-white shadow-2xl shadow-black/10 dark:border-white/10 dark:bg-[#141b16]">
                    <div className="flex items-center justify-between border-b border-[#e8eee5] px-5 py-4 dark:border-white/10">
                      <div>
                        <h3 className="text-sm font-extrabold">
                          Notifications
                        </h3>

                        <p className="mt-0.5 text-[11px] text-[#89938a]">
                          Recent system activity
                        </p>
                      </div>

                      <span className="rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-bold text-red-500 dark:bg-red-500/10">
                        3 New
                      </span>
                    </div>

                    <div className="max-h-82.5 overflow-y-auto">
                      {demoNotifications.map((notification) => {
                        const isPending = notification.type === "pending";

                        const isFailed = notification.type === "failed";

                        return (
                          <div
                            key={notification.id}
                            className="flex gap-3 border-b border-[#eef1ed] px-5 py-4 transition hover:bg-[#f8faf7] dark:border-white/5 dark:hover:bg-white/3"
                          >
                            <div
                              className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                                isPending
                                  ? "bg-yellow-50 text-yellow-600 dark:bg-yellow-500/10"
                                  : isFailed
                                    ? "bg-red-50 text-red-500 dark:bg-red-500/10"
                                    : "bg-green-50 text-green-600 dark:bg-green-500/10"
                              }`}
                            >
                              {isPending ? (
                                <CircleAlert size={17} />
                              ) : isFailed ? (
                                <CreditCard size={17} />
                              ) : (
                                <Receipt size={17} />
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <p className="text-xs font-bold">
                                  {notification.title}
                                </p>

                                <span className="shrink-0 text-[9px] text-[#9aa39a]">
                                  {notification.time}
                                </span>
                              </div>

                              <p className="mt-1 text-[11px] leading-relaxed text-[#7b857c] dark:text-white/45">
                                {notification.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => {
                        setNotificationOpen(false);
                        router.push("/admin/notifications");
                      }}
                      className="w-full px-5 py-3.5 text-center text-xs font-bold text-[#0d6845] transition hover:bg-[#f4f8f5] dark:hover:bg-white/5"
                    >
                      View All Notifications
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Admin badge */}

            <div className="hidden items-center gap-2 rounded-xl border border-[#dfe6dc] bg-[#f8faf7] px-3 py-2 sm:flex dark:border-white/10 dark:bg-white/5">
              <div className="h-7 w-7 rounded-full bg-[#0d6845] flex items-center justify-center">
                <ShieldCheck size={14} className="text-[#e5c968]" />
              </div>

              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-[#929b92]">
                  Role
                </p>

                <p className="text-[11px] font-extrabold">Administrator</p>
              </div>
            </div>
          </div>
        </header>

        {/* ===================================================
            PAGE CONTENT
        =================================================== */}

        <main className="min-h-[calc(100vh-82px)] p-5 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
