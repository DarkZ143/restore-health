"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingWhatsAppButton from "@/components/WhatsappIcon";

export default function LayoutContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // ============================================================
  // PRIVATE / DASHBOARD PAGES
  // ============================================================

  const isDashboard = pathname.startsWith("/dashboard");
  const isProfile = pathname.startsWith("/profile");

  const isPrivatePage =
    isDashboard ||
    isProfile ||
    pathname.startsWith("/transactions") ||
    pathname.startsWith("/invoices") ||
    pathname.startsWith("/admin");

  // ============================================================
  // WHATSAPP VISIBILITY
  // ============================================================

  // Ab yeh true hai, toh har page par dikhega.
  // (Agar Admin panel pe nahi dikhana, toh isko aise likhein: const showWhatsApp = !pathname.startsWith("/admin"); )
  const showWhatsApp = true;

  return (
    <>
      {/* ======================================================
          NAVBAR
      ====================================================== */}

      {!isPrivatePage && <Navbar />}

      {/* ======================================================
          PAGE CONTENT
      ====================================================== */}

      {children}

      {/* ======================================================
          WHATSAPP
      ====================================================== */}

      {showWhatsApp && <FloatingWhatsAppButton />}

      {/* ======================================================
          FOOTER
      ====================================================== */}

      {!isPrivatePage && <Footer />}
    </>
  );
}