"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function CoverageAndPricing() {
  const plans = [
    { name: "Personal", price: "From ₹499" },
    { name: "Family", price: "From ₹999" },
    { name: "Enterprise", price: "Custom Quote" },
  ];

  return (
    <section className="w-full bg-white py-20 transition-colors duration-300 dark:bg-slate-950 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* =====================================================
            SECTION 1: FAMILY COVERAGE
        ====================================================== */}
        <div className="text-center">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1de9b6] dark:text-emerald-400">
            Care For Every Generation
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl md:text-5xl">
            From Grandparents To Grandkids,
            <br className="hidden sm:block" />
            We&apos;ve Got Everyone Covered
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-[14.5px] leading-relaxed text-slate-500 dark:text-slate-400">
            Family memberships mean the people you care about most are never one
            click away from the help they need.
          </p>
        </div>

        {/* Hero Image - Grandmother */}
        <div className="relative mx-auto mt-12 h-55 w-full max-w-3xl overflow-hidden rounded-4xl shadow-lg sm:h-75 md:h-87.5">
          <Image
            src="/senior-care.webp"
            alt="Elderly woman reading newspaper"
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover object-center"
          />
        </div>

        {/* Space between sections */}
        <div className="my-24 h-px w-full bg-transparent" />

        {/* =====================================================
            SECTION 2: PRICING TEASER
        ====================================================== */}
        <div className="text-center">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1de9b6] dark:text-emerald-400">
            Simple, Transparent Pricing
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Plans Start At ₹10,000
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[14.5px] leading-relaxed text-slate-500 dark:text-slate-400">
            No hidden fees, no confusing add-ons. Pick a tier, see exactly
            what&apos;s included, and join in minutes.
          </p>
        </div>

        {/* Pricing Cards Row */}
        <div className="mx-auto mt-10 flex max-w-2xl flex-wrap justify-center gap-4 sm:gap-6">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="flex min-w-35 flex-col items-start justify-center rounded-2xl border border-slate-200 bg-slate-50 px-6 py-4 transition-colors hover:border-emerald-200 hover:bg-white dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-emerald-500/30 dark:hover:bg-slate-800"
            >
              <span className="text-[14px] font-extrabold text-slate-900 dark:text-white">
                {plan.name}
              </span>
              <span className="mt-1 text-[11px] font-bold uppercase tracking-wider text-[#1de9b6] dark:text-emerald-400">
                {plan.price}
              </span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="mt-10 flex justify-center">
          <button className="group flex items-center gap-2 rounded-full bg-[#1de9b6] px-8 py-3.5 text-[14px] font-bold text-emerald-950 transition-all hover:bg-[#64ffda] dark:bg-emerald-500 dark:text-white dark:hover:bg-emerald-400">
            See Full Pricing
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>
        </div>
      </div>
    </section>
  );
}
