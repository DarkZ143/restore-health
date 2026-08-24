"use client";

import React from "react";
import { motion } from "framer-motion";
import { Clock, HeartPulse, ShieldCheck, Sparkles } from "lucide-react";

/**
 * RESTORE — Healthcare Hero & Comparison Section
 * -------------------------------------------------------------
 * LOGO COLORS:
 * Green: #1A4D00
 * Gold:  #DDA105
 *
 * - Green heading
 * - Green icon background
 * - White icons
 * - Black comparison text
 * - Logo Green + Gold rotating outer border
 * - Scroll-triggered stagger animation
 */

interface CardItem {
  icon: React.ReactNode;
  beforeTitle: string;
  beforeDesc: string;
  afterTitle: string;
  afterDesc: string;
}

const cards: CardItem[] = [
  {
    icon: <Clock className="h-6 w-6 text-white" />,
    beforeTitle: "Weeks of Waiting",
    beforeDesc:
      "On hold for 20 minutes, stuck in phone tag, only to get an appointment scheduled a month out.",
    afterTitle: "Instant Booking",
    afterDesc:
      "Book a same-week visit in under two minutes directly online — no hold music, no delay.",
  },
  {
    icon: <HeartPulse className="h-6 w-6 text-white" />,
    beforeTitle: "Scattered Records",
    beforeDesc:
      "History split across three different patient portals, two separate clinics, and paper printouts.",
    afterTitle: "Unified Health Profile",
    afterDesc:
      "Every visit note, lab test, and active prescription synchronized in one single dashboard.",
  },
  {
    icon: <ShieldCheck className="h-6 w-6 text-white" />,
    beforeTitle: "Surprise Billing",
    beforeDesc:
      "Finding out true medical costs weeks after care arrives in a confusing paper statement.",
    afterTitle: "Transparent Pricing",
    afterDesc:
      "Clear, upfront costs broken down before you confirm your visit with insurance applied.",
  },
  {
    icon: <Sparkles className="h-6 w-6 text-white" />,
    beforeTitle: "Impersonal Care",
    beforeDesc:
      "Rushed 5-minute doctor visits where you feel like just another appointment slot.",
    afterTitle: "Dedicated Attention",
    afterDesc:
      "Unrushed, tailored consultation time with follow-up messaging directly to your team.",
  },
];

export default function RestoreHero() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-amber-50/50 via-emerald-50/60 to-amber-100/40 px-4 py-10 text-slate-900 sm:px-6 sm:py-14 lg:px-8 dark:from-[#041a10] dark:via-[#092c1c] dark:to-[#041a10] dark:text-white">
      {/* =====================================================
          ROTATING OUTER BORDER ANIMATION
          LOGO GREEN + LOGO GOLD
      ====================================================== */}

      <div className="mx-auto max-w-7xl">
        {/* =====================================================
            TOP / HERO HEADER SECTION
        ====================================================== */}
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-block rounded-full border border-amber-500/40 bg-amber-400/20 px-5 py-1 text-xs font-extrabold uppercase tracking-widest text-amber-800 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-300">
            Before &amp; After RESTORE
          </span>

          {/* LOGO GREEN HEADING */}
          <h1
            className="mt-4 text-3xl font-black leading-tight tracking-tight sm:text-5xl"
            style={{ color: "#1A4D00" }}
          >
            Healthcare Is Hard. It Shouldn&apos;t Be.
          </h1>

          <p className="mt-4 text-lg font-medium leading-relaxed text-slate-700 sm:text-xl dark:text-emerald-100/80">
            You don&apos;t wake up wanting healthcare — you wake up wanting
            peace of mind. Here is the gap between how care usually feels, and
            how RESTORE changes it.
          </p>
        </div>

        {/* =====================================================
            4 CARDS GRID
        ====================================================== */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{
                duration: 0.6,
                delay: index * 0.15,
                ease: [0.21, 0.47, 0.32, 0.98],
              }}
              className="relative overflow-hidden rounded-2xl p-[2px] shadow-xl shadow-emerald-900/10 dark:shadow-emerald-950/40"
            >
              {/* =====================================================
                  ROTATING OUTER GLOW
                  LOGO GREEN + GOLD
              ====================================================== */}
              <div className="pointer-events-none absolute inset-[-100%] flex items-center justify-center">
                <div
                  className="rotating-glow-layer h-[400%] w-[400%] blur-sm"
                  style={{
                    background:
                      "conic-gradient(from 0deg, #1A4D00, #DDA105, #1A4D00, #DDA105, #1A4D00)",
                    opacity: 0.95,
                  }}
                />
              </div>

              {/* =====================================================
                  CARD INNER CONTAINER
              ====================================================== */}
              <div className="relative flex h-full flex-col justify-between rounded-[14px] bg-gradient-to-br from-white via-amber-50/80 to-emerald-50/90 p-5 backdrop-blur-md sm:p-6 dark:from-[#0c2a1c]/95 dark:via-[#133d2a]/95 dark:to-[#1d220b]/95">
                
                {/* =====================================================
                    HEADER ICON + LABEL
                ====================================================== */}
                <div className="flex items-center justify-between border-b border-amber-300/50 pb-3 dark:border-amber-400/20">
                  <div className="flex items-center gap-3">

                    {/* =================================================
                        LOGO GREEN BACKGROUND
                        WHITE ICON
                    ================================================== */}
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl shadow-sm"
                      style={{
                        backgroundColor: "#1A4D00",
                      }}
                    >
                      {card.icon}
                    </div>

                    {/* =================================================
                        BLACK COMPARISON TEXT
                    ================================================== */}
                    <span
                      className="text-xs font-black uppercase tracking-wider"
                      style={{ color: "#000000" }}
                    >
                      Comparison 0{index + 1}
                    </span>

                  </div>
                </div>

                {/* =====================================================
                    BEFORE VS AFTER CONTENT GRID
                ====================================================== */}
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">

                  {/* =================================================
                      BEFORE SECTION
                  ================================================== */}
                  <div className="flex flex-col justify-start">
                    <span className="mb-2 inline-block w-max rounded-md border border-rose-300/60 bg-rose-100/80 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-rose-900 dark:border-amber-400/20 dark:bg-black/40 dark:text-amber-200/90">
                      Before
                    </span>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {card.beforeTitle}
                    </h3>

                    <p className="mt-1.5 text-xs font-normal leading-relaxed text-slate-600 dark:text-emerald-100/75">
                      {card.beforeDesc}
                    </p>
                  </div>

                  {/* =================================================
                      WITH RESTORE SECTION
                  ================================================== */}
                  <div className="flex flex-col justify-start border-t border-amber-300/50 pt-3 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0 dark:border-amber-400/20">
                    <span className="mb-2 inline-block w-max rounded-md bg-emerald-700 px-2.5 py-1 text-[11px] font-black uppercase tracking-wider text-amber-300 shadow-sm dark:bg-amber-400 dark:text-black">
                      With RESTORE
                    </span>

                    <h3 className="text-lg font-bold text-emerald-950 dark:text-amber-300">
                      {card.afterTitle}
                    </h3>

                    <p className="mt-1.5 text-xs font-medium leading-relaxed text-slate-800 dark:text-white/90">
                      {card.afterDesc}
                    </p>
                  </div>

                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}