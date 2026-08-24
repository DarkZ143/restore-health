"use client";

import Image from "next/image";

export default function WellnessHighlight() {
  return (
    <section className="w-full bg-white py-20 transition-colors duration-300 dark:bg-slate-950 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* =====================================================
            HEADER CONTENT
        ====================================================== */}
        <div className="text-center">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1de9b6] dark:text-emerald-400">
            Beyond Sick Care
          </span>

          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-extrabold tracking-tight text-[#0f2921] dark:text-white sm:text-4xl md:text-5xl leading-tight">
            Wellness Is Part Of
            <br className="hidden sm:block" /> The Plan, Not An Add-On
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-slate-500 dark:text-slate-400 sm:text-base">
            Restore Health isn&apos;t just there when something&apos;s wrong —
            it&apos;s built to help you stay well in the first place.
          </p>
        </div>

        {/* =====================================================
            HERO IMAGE
        ====================================================== */}
        <div className="relative mx-auto mt-12 h-70 w-full max-w-4xl overflow-hidden rounded-4xl shadow-xl dark:shadow-emerald-900/10 sm:h-100 md:h-125">
          <Image
            src="/yoga-girl.webp"
            alt="Person doing yoga outdoors"
            fill
            sizes="(max-width: 896px) 100vw, 896px"
            className="object-cover object-center transition-transform duration-700 hover:scale-105"
          />
        </div>
      </div>
    </section>
  );
}
