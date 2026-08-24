"use client";

import { CalendarDays } from "lucide-react";

export default function FloatingBookDemoButton() {
  // Smooth scroll logic
  const scrollToDemo = () => {
    // Ye ID us section se match honi chahiye jahan form hai
    const demoSection = document.getElementById("book-demo-section");
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    // 'bottom-6' ensures it stays directly below the WhatsApp button
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={scrollToDemo}
        className="
          flex 
          items-center 
          gap-2.5 
          rounded-full 
          bg-[#139a67] 
          px-6 
          py-3 
          text-[15px] 
          font-extrabold 
          text-white 
          shadow-xl 
          shadow-[#139a67]/30 
          transition-all 
          duration-300 
          hover:scale-105 
          hover:bg-[#0f8255]
        "
        aria-label="Scroll to Book Demo form"
      >
        <CalendarDays size={22} strokeWidth={2.5} />
        Book Demo
      </button>
    </div>
  );
}
