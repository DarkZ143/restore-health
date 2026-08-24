"use client";

import { Receipt, Clock } from "lucide-react";
import { useTheme } from "@/app/providers/ThemeProvider";

export default function InvoicesPage() {
  const { theme } = useTheme();

  const isDark = theme === "dark";

  return (
    <main
      className={`min-h-screen p-6 transition-colors duration-300 ${
        isDark ? "bg-[#0b1220] text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                isDark
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-emerald-50 text-emerald-600"
              }`}
            >
              <Receipt size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-bold">Invoices</h1>

              <p
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                View and manage your invoices
              </p>
            </div>
          </div>
        </div>

        {/* Upcoming Card */}
        <div
          className={`flex min-h-105 flex-col items-center justify-center rounded-2xl border text-center shadow-sm ${
            isDark ? "border-gray-800 bg-[#111827]" : "border-gray-200 bg-white"
          }`}
        >
          <div
            className={`mb-5 flex h-20 w-20 items-center justify-center rounded-full ${
              isDark
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-emerald-50 text-emerald-600"
            }`}
          >
            <Clock size={38} />
          </div>

          <h2 className="mb-2 text-2xl font-bold">Upcoming</h2>

          <p
            className={`max-w-md text-sm leading-6 ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Invoice generation and invoice history will be available here soon.
          </p>
        </div>
      </div>
    </main>
  );
}
