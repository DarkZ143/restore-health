"use client";

import Image from "next/image";
import {
  Briefcase,
  UserPlus,
  Activity,
  BarChart3,
} from "lucide-react";

export default function OnboardingAndMembership() {
  const steps = [
    {
      num: "01",
      icon: <Briefcase size={20} className="text-white" />,
      iconBg: "bg-emerald-500 dark:bg-emerald-600",
      title: "Choose Plan",
      desc: "Flexible pricing for individuals, families, or enterprise teams.",
    },
    {
      num: "02",
      icon: <UserPlus size={20} className="text-white" />,
      iconBg: "bg-[#c89416] dark:bg-amber-600",
      title: "Onboard Team",
      desc: "KYC-verified digital enrollment for all employees in minutes.",
    },
    {
      num: "03",
      icon: <Activity size={20} className="text-white" />,
      iconBg: "bg-emerald-500 dark:bg-emerald-600",
      title: "Access Care",
      desc: "10,000+ providers, teleconsults, diagnostics — instantly activated.",
    },
    {
      num: "04",
      icon: <BarChart3 size={20} className="text-white" />,
      iconBg: "bg-[#c89416] dark:bg-amber-600",
      title: "Track & Report",
      desc: "Live analytics, automated claims, HR-ready reports — zero burden.",
    },
  ];

  return (
    <section className="w-full bg-white transition-colors duration-300 dark:bg-slate-950">
      {/* =====================================================
          SECTION 1: ONBOARDING STEPS
      ====================================================== */}
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#139a67] dark:text-emerald-400">
            Effortless Onboarding
          </span>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Up & Running In 4 Steps
          </h2>

          <p className="mt-4 text-[15px] text-slate-500 dark:text-slate-400">
            From sign-up to your first health consultation — in under 24 hours.
          </p>
        </div>

        {/* Hero Image - Staff */}
        <div className="relative mx-auto mt-12 h-55 w-full max-w-5xl overflow-hidden rounded-4xl shadow-sm sm:h-80 lg:h-100">
          <Image
            src="/doctors.webp"
            alt="Medical staff walking in hospital corridor"
            fill
            className="object-cover object-center"
          />
        </div>

        {/* Steps Timeline */}
        <div className="mx-auto mt-16 max-w-5xl">
          <div className="relative flex flex-col justify-between gap-10 sm:flex-row sm:gap-4">
            {/* Horizontal Connecting Line */}
            <div className="absolute left-[10%] right-[10%] top-3.5 hidden h-[1.5px] bg-emerald-100 dark:bg-emerald-900/40 sm:block" />

            {steps.map((step, index) => (
              <div
                key={index}
                className="relative z-10 flex flex-1 flex-col items-center text-center"
              >
                {/* Step Number Pill */}
                <div className="flex h-7 w-7 items-center justify-center rounded-full border border-emerald-200 bg-white text-[10px] font-bold text-[#139a67] dark:border-emerald-800 dark:bg-slate-900 dark:text-emerald-400">
                  {step.num}
                </div>

                {/* Step Icon */}
                <div
                  className={`mt-4 flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm ${step.iconBg}`}
                >
                  {step.icon}
                </div>

                {/* Step Content */}
                <h3 className="mt-5 text-[15px] font-bold text-slate-900 dark:text-slate-100">
                  {step.title}
                </h3>

                <p className="mt-2 max-w-50 text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-auto max-w-6xl px-4">
        <div className="h-px w-full bg-slate-100 dark:bg-slate-800/80" />
      </div>

      {/* =====================================================
          SECTION 2: MEMBERSHIP
      ====================================================== */}
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#139a67] dark:text-emerald-400">
            One Membership
          </span>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Membership, Not Paperwork
          </h2>

          <p className="mt-4 text-[15px] text-slate-500 dark:text-slate-400">
            Every tier unlocks the same promise: whatever happens, you&apos;re
            covered.
            <br className="hidden sm:block" />
            Choose who it&apos;s for.
          </p>
        </div>

        {/* Hero Image - Family */}
        <div className="relative mx-auto mt-12 h-62.5 w-full max-w-4xl overflow-hidden rounded-3xl shadow-sm sm:h-87.5">
          <Image
            src="/memberships.webp"
            alt="Happy family outdoors"
            fill
            className="object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
}
