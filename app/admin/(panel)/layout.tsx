"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  Bell,
  LayoutDashboard,
  Users,
  ShoppingCart,
  ReceiptText,
  Megaphone,
  Headphones,
  LogOut,
  X,
  UserRound,
} from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

type AdminData = {
  email?: string;
  name?: string;
  role?: string;
};

export default function AdminPanelLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [admin, setAdmin] = useState<AdminData | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("restorehealth_admin_logged_in");
    const adminDataString = localStorage.getItem("restorehealth_admin");

    if (isLoggedIn !== "true" || !adminDataString) {
      router.replace("/admin/auth/login");
      return;
    }

    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAdmin(JSON.parse(adminDataString));
    } catch {
      handleLogout();
    }
  }, [router]);

  const menuItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Agents", href: "/admin/agents", icon: Users },
    {
      label: "Recent Orders",
      href: "/admin/orders/recent",
      icon: ShoppingCart,
    },
    { label: "Orders History", href: "/admin/orders", icon: ReceiptText },
    { label: "Broadcast System", href: "/admin/broadcast", icon: Megaphone },
    { label: "Support", href: "/admin/support", icon: Headphones },
    { label: "My Profile", href: "/admin/profile", icon: UserRound },
  ];

  function handleLogout() {
    localStorage.removeItem("restorehealth_admin");
    localStorage.removeItem("restorehealth_admin_logged_in");
    toast.success("You have been logged out.");
    router.replace("/admin/auth/login");
  }

  if (!admin) return null;

  return (
    <div className="min-h-screen bg-[#f6f8f4] text-[#1f2d24]">
      {/* =====================================================
          SIDEBAR
      ===================================================== */}
      <aside className="fixed left-0 top-0 z-40 flex h-screen w-[270px] flex-col border-r border-[#dfe7df] bg-white">
        {/* LOGO */}
        <div className="flex h-[82px] items-center border-b border-[#e5ebe5] px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl ">
                <Image
                  src="/logo2.png"
                  width={80}
                  height={80}
                  alt="Restore Logo"
                />
              </div>
            <div>
              <h1 className="text-[19px] font-extrabold tracking-tight">
                Restore<span className="text-[#b8860b]">Health</span>
              </h1>
              <p className="mt-0.5 text-[10px] font-bold tracking-[0.22em] text-[#b8860b]">
                ADMIN PANEL
              </p>
            </div>
          </div>
        </div>

        {/* ADMIN CARD */}
        <div className="px-4 pt-5">
          <div className="rounded-2xl border border-[#dfe8df] bg-[#f7faf7] p-4">
            <p className="text-[10px] font-bold tracking-wider text-[#8a958d] uppercase">
              {admin?.role || "ADMINISTRATOR"}
            </p>
            <p className="mt-1 truncate text-sm font-bold text-[#26352c]">
              {admin?.email || "Admin"}
            </p>
          </div>
        </div>

        {/* MENU */}
        <div className="px-7 pt-7">
          <p className="text-[11px] font-extrabold tracking-[0.16em] text-[#8c978f]">
            MAIN MENU
          </p>
        </div>

        <nav className="mt-3 flex-1 space-y-1.5 overflow-y-auto px-4 pb-4">
          {menuItems.map((item) => {
            const Icon = item.icon;

            // 🔥 YAHAN FIX KIYA HAI: Overlapping URL logic
            const isOrdersHistory = item.href === "/admin/orders";
            const active = isOrdersHistory
              ? pathname === item.href ||
                (pathname.startsWith(`${item.href}/`) &&
                  !pathname.startsWith("/admin/orders/recent"))
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <button
                key={item.href}
                type="button"
                onClick={() => router.push(item.href)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition-all duration-200 ${
                  active
                    ? "bg-[#087443] text-white shadow-lg shadow-green-900/15"
                    : "text-[#536057] hover:bg-[#f0f5f0] hover:text-[#087443]"
                }`}
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* LOGOUT */}
        <div className="border-t border-[#e5ebe5] p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-500 transition hover:bg-red-50"
          >
            <LogOut size={19} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* =====================================================
          MAIN AREA
      ===================================================== */}
      <div className="ml-[270px] min-h-screen">
        {/* ===================================================
            TOP HEADER
        =================================================== */}
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-[#dfe7df] bg-white/95 px-7 backdrop-blur-md">
          {/* HEADER TITLE */}
          <div>
            <p className="text-xs font-semibold text-[#8a958d]">
              RestoreHealth Administration
            </p>
            <h2 className="mt-1 text-xl font-extrabold text-[#1f2d24]">
              {menuItems.find(
                (item) =>
                  pathname === item.href ||
                  (item.href === "/admin/orders"
                    ? false
                    : pathname.startsWith(`${item.href}/`)),
              )?.label || "Dashboard"}
            </h2>
          </div>

          {/* NOTIFICATION COMPONENT */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications((prev) => !prev)}
              className={`relative flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-200 ${
                showNotifications
                  ? "border-[#b8860b] bg-[#fbf9f2] text-[#b8860b] shadow-md"
                  : "border-[#dfe7df] bg-white text-[#536057] hover:border-[#b8860b] hover:text-[#b8860b]"
              }`}
            >
              <Bell size={20} />

              {notifications.length > 0 && (
                <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
              )}
            </button>

            {/* NOTIFICATION DROPDOWN */}
            {showNotifications && (
              <div className="absolute right-0 top-14 z-50 w-[360px] overflow-hidden rounded-2xl border border-[#dfe7df] bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-[#e8ede8] px-5 py-4">
                  <div>
                    <h3 className="text-sm font-extrabold text-[#1f2d24]">
                      Notifications
                    </h3>
                    <p className="mt-0.5 text-[11px] text-[#8a958d]">
                      Recent activity
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowNotifications(false)}
                    className="rounded-lg p-1.5 text-[#8a958d] hover:bg-black/5 transition"
                  >
                    <X size={17} />
                  </button>
                </div>

                <div className="max-h-[360px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 px-6 text-center bg-[#fafcfb]">
                      <Bell size={32} className="text-[#c1cbc2] mb-3" />
                      <p className="text-sm font-bold text-[#455248]">
                        No new notifications
                      </p>
                      <p className="text-xs text-[#8a958d] mt-1">
                        You&apos;re all caught up! New alerts will appear here.
                      </p>
                    </div>
                  ) : (
                    notifications.map((notification, index) => {
                      const isFailed = notification.type === "failed";
                      const isSuccess = notification.type === "success";

                      return (
                        <div
                          key={index}
                          className="flex gap-4 border-b border-[#edf1ed] px-5 py-4 last:border-0 hover:bg-[#fafcfb] transition cursor-pointer"
                        >
                          <span
                            className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full shadow-sm ${
                              isFailed
                                ? "bg-red-500"
                                : isSuccess
                                  ? "bg-green-500"
                                  : "bg-yellow-500"
                            }`}
                          />
                          <div>
                            <p className="text-sm font-bold text-[#1f2d24]">
                              {notification.title}
                            </p>
                            <p className="mt-1 text-xs leading-relaxed text-[#7c887f]">
                              {notification.message}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="border-t border-[#e8ede8] p-3 text-center bg-[#fafcfb]">
                  <button className="text-xs font-bold text-[#087443] hover:text-[#b8860b] transition">
                    View All Notifications
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* ===================================================
            PAGE CONTENT
        =================================================== */}
        <main className="p-7">{children}</main>
      </div>
    </div>
  );
}
