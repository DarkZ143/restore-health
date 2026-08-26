"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  Bell,
  Megaphone,
  Receipt,
  Headphones,
  History,
  LogOut,
  ShoppingCart,
  Users,
  ShieldCheck,
} from "lucide-react";

const menuItems = [
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
  {
    label: "Notifications",
    href: "/admin/notifications",
    icon: Bell,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem("restorehealth_admin");
    localStorage.removeItem("restorehealth_admin_logged_in");

    router.replace("/admin/auth/login");
  }

  let adminEmail = "";

  if (typeof window !== "undefined") {
    try {
      const admin = localStorage.getItem("restorehealth_admin");

      if (admin) {
        const parsed = JSON.parse(admin);
        adminEmail = parsed?.email || "";
      }
    } catch {
      adminEmail = "";
    }
  }

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-65 flex-col border-r border-[#e4dcc3] bg-white text-[#263326] shadow-sm dark:border-white/10 dark:bg-[#11130f] dark:text-white">
      {/* =====================================================
          BRAND
      ===================================================== */}

      <div className="border-b border-[#e8e1cf] px-5 py-5 dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-[#b8860b] via-[#e1c15a] to-[#a47508] shadow-md">
            <ShieldCheck size={23} className="text-white" />
          </div>

          <div>
            <h1 className="text-base font-extrabold">RestoreHealth</h1>

            <p className="text-xs font-semibold text-[#a47708]">
              Administration
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          ADMIN ACCOUNT
      ===================================================== */}

      <div className="mx-4 mt-5 rounded-xl border border-[#dfd3ad] bg-[#faf7eb] px-3 py-3 dark:border-[#d9bd63]/20 dark:bg-[#d9bd63]/5">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#9b8242]">
          Admin Account
        </p>

        <p className="mt-1 truncate text-xs font-semibold text-[#403b2b] dark:text-white/80">
          {adminEmail || "Authorized Administrator"}
        </p>
      </div>

      {/* =====================================================
          NAVIGATION
      ===================================================== */}

      <nav className="flex-1 space-y-1.5 overflow-y-auto px-3 py-5">
        <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-[#a49b85]">
          Management
        </p>

        {menuItems.map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.href ||
            (item.href !== "/admin/dashboard" &&
              pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition-all ${
                active
                  ? "bg-linear-to-r from-[#b8860b] to-[#d5b84f] text-white shadow-md shadow-[#b8860b]/20"
                  : "text-[#625d4e] hover:bg-[#faf6e8] hover:text-[#9b7208] dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-[#e6c66a]"
              }`}
            >
              <Icon
                size={19}
                className={
                  active
                    ? "text-white"
                    : "text-[#948b75] group-hover:text-[#b8860b]"
                }
              />

              <span>{item.label}</span>

              {item.label === "Notifications" && (
                <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                  0
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* =====================================================
          LOGOUT
      ===================================================== */}

      <div className="border-t border-[#e8e1cf] p-3 dark:border-white/10">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold text-red-500 transition hover:bg-red-50 dark:hover:bg-red-500/10 cursor-pointer"
        >
          <LogOut size={19} />
          Logout
        </button>
      </div>
    </aside>
  );
}
