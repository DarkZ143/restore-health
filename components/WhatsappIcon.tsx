"use client";

import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";

export default function FloatingWhatsAppButton() {
  return (
    // 'bottom-6' and 'right-6' for mobile, slight adjustment for desktop
    <div className="fixed bottom-6 right-6 z-50 lg:bottom-10 lg:right-10">
      <Link
        href="https://wa.me/9289250468"
        target="_blank"
        rel="noopener noreferrer"
        className="
          flex 
          items-center 
          justify-center
          rounded-full 
          bg-[#25D366] 
          text-white 
          shadow-xl 
          shadow-[#25D366]/30 
          transition-all 
          duration-300 
          hover:scale-105 
          hover:bg-[#20bd5a]
          
          /* Phone & Tablet (Shrunk State): Sirf gol icon rahega taaki content hide na ho */
          h-14 w-14 gap-0 p-0
          
          /* Desktop (Expanded State): Poora text aur button dikhega */
          lg:h-auto lg:w-auto lg:gap-2.5 lg:px-6 lg:py-3
        "
        aria-label="Chat with us on WhatsApp"
      >
        <FaWhatsapp size={28} className="shrink-0" />

        {/* Text sirf Desktop (lg screens) par visible hoga */}
        <span className="hidden whitespace-nowrap text-[15px] font-extrabold lg:block">
          WhatsApp
        </span>
      </Link>
    </div>
  );
}
