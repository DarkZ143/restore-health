"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingWhatsAppButton from "@/components/WhatsappIcon";

export default function LayoutContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Pages where Navbar / Footer / WhatsApp should NOT appear
  const isDashboard = pathname.startsWith("/dashboard");
  const isProfile = pathname.startsWith("/profile");

  // Private/Admin pages where public layout elements are hidden
  const isPrivatePage =
    isDashboard ||
    isProfile ||
    pathname.startsWith("/transactions") ||
    pathname.startsWith("/invoices") ||
    pathname.startsWith("/admin"); // YAHAN FIX KIYA HAI: Ab koi bhi /admin page ho, navbar hide ho jayega!

  return (
    <>
      {/* Navbar */}
      {!isPrivatePage && <Navbar />}

      {/* Page Content */}
      {children}

      {/* WhatsApp */}
      {!isPrivatePage && <FloatingWhatsAppButton />}

      {/* Footer */}
      {!isPrivatePage && <Footer />}
    </>
  );
}
