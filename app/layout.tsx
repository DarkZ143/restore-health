import type { Metadata } from "next";
import type { ReactNode } from "react";

import {
  Geist,
  Geist_Mono,
} from "next/font/google";

import "./globals.css";

import { ThemeProvider } from "./providers/ThemeProvider";
import LayoutContent from "@/components/LayoutContent";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Restore Health Services - Your Partner in Better Health",
  description:
    "Restore Health Services provides doorstep pharmacy delivery, blood diagnostics, online doctor consultations, personal accident coverage, and hospicash support across India.",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`
        ${geistSans.variable}
        ${geistMono.variable}
        h-full
        antialiased
      `}
    >
      <body
        className="
          min-h-full
          bg-white
          text-[#303238]
          transition-colors
          duration-300
          dark:bg-[#0b1220]
          dark:text-white
        "
      >
        <ThemeProvider>
          <LayoutContent>{children}</LayoutContent>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                border: "1px solid #dfe7df",
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: 600,
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}