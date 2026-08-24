"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Ambulance,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ClipboardCheck,
  Clock3,
  Crown,
  Dumbbell,
  FileSearch,
  HeartPulse,
  Home,
  Info,
  Pill,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  TestTube2,
  UserRound,
  Users,
  Video,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

type Benefit = {
  label: string;
  value: string;
  icon: LucideIcon;
  important?: boolean;
};

type BenefitSection = {
  title: string;
  benefits: Benefit[];
};

type Plan = {
  id: string;
  name: string;
  family: string;
  price: string;
  badge?: string;
  minAge: string;
  maxAge: string;
  validity: string;
  sections: BenefitSection[];
};

/* =========================================================
   COMMON DISCOUNTS
========================================================= */

const commonDiscounts: Benefit[] = [
  {
    label: "Upto 40% Discount on Fitness Management Programme",
    value: "Yes",
    icon: Dumbbell,
  },
  {
    label: "Upto 20% Discount on Home Care Management (Nurse at Home)",
    value: "Yes",
    icon: Home,
  },
  {
    label: "Emergency Ambulance with upto 20% Discount",
    value: "Yes",
    icon: Ambulance,
  },
  {
    label: "Upto 40% Discount on Tests and Scans",
    value: "Yes",
    icon: ScanLine,
  },
  {
    label: "Upto 15% Discount on Medicines",
    value: "Yes",
    icon: Pill,
  },
  {
    label: "10% Off on OPD Consultations",
    value: "Yes",
    icon: Stethoscope,
  },
];

/* =========================================================
   PLAN DATA
========================================================= */

const plans: Plan[] = [
  /* ===================== INDIVIDUAL ===================== */

  {
    id: "individual",
    name: "Individual",
    family: "1A",
    price: "₹10,000",
    minAge: "18 Years",
    maxAge: "60 Years",
    validity: "1 Year",

    sections: [
      {
        title: "Health & Wellness Services",
        benefits: [
          {
            label: "Health Risk Assessment Digital",
            value: "2 Credit",
            icon: ClipboardCheck,
          },
          {
            label: "Tele DM Consultation GP + SP",
            value: "1 Credit",
            icon: Video,
          },
          {
            label: "CBC Test",
            value: "1 Credit",
            icon: TestTube2,
          },
          {
            label: "CBC Report Review",
            value: "1 Credit",
            icon: FileSearch,
          },
          {
            label: "Executive Centre Visit Health Check-up @500",
            value: "—",
            icon: Activity,
          },
        ],
      },

      {
        title: "Discounts & Benefits",
        benefits: commonDiscounts,
      },

      {
        title: "Additional Services",
        benefits: [
          {
            label: "Health Coach",
            value: "Yes",
            icon: HeartPulse,
          },
          {
            label: "Diabetologist-60C",
            value: "—",
            icon: Stethoscope,
          },
          {
            label: "Disease Management",
            value: "—",
            icon: Activity,
          },
          {
            label: "Tele Cardio Consultation",
            value: "—",
            icon: HeartPulse,
          },
          {
            label: "HA Exclusive Gold Membership",
            value: "Free",
            icon: Crown,
          },
          {
            label: "Online Fitness and Zumba Session",
            value: "—",
            icon: Dumbbell,
          },
          {
            label: "Personal Accident Covered - 5 Lacs",
            value: "Yes",
            icon: ShieldCheck,
            important: true,
          },
          {
            label: "Hospicash",
            value: "Yes",
            icon: Building2,
            important: true,
          },
        ],
      },
    ],
  },

  /* ===================== FLOATER 20K ===================== */

  {
    id: "floater-20000",
    name: "Floater",
    family: "2A",
    price: "₹20,000",
    minAge: "18 Years",
    maxAge: "60 Years",
    validity: "1 Year",

    sections: [
      {
        title: "Health & Wellness Services",
        benefits: [
          {
            label: "Health Risk Assessment Digital",
            value: "2 Credit",
            icon: ClipboardCheck,
          },
          {
            label: "Tele DM Consultation GP + SP",
            value: "4 Credit",
            icon: Video,
          },
          {
            label: "CBC Test",
            value: "2 Credit",
            icon: TestTube2,
          },
          {
            label: "CBC Report Review",
            value: "2 Credit",
            icon: FileSearch,
          },
          {
            label: "Executive Centre Visit Health Check-up @500",
            value: "—",
            icon: Activity,
          },
        ],
      },

      {
        title: "Discounts & Benefits",
        benefits: commonDiscounts,
      },

      {
        title: "Additional Services",
        benefits: [
          {
            label: "Health Coach",
            value: "—",
            icon: HeartPulse,
          },
          {
            label: "Diabetologist-60C",
            value: "—",
            icon: Stethoscope,
          },
          {
            label: "Disease Management",
            value: "—",
            icon: Activity,
          },
          {
            label: "Tele Cardio Consultation",
            value: "1 Credit",
            icon: HeartPulse,
          },
          {
            label: "HA Exclusive Gold Membership",
            value: "—",
            icon: Crown,
          },
          {
            label: "Online Fitness and Zumba Session",
            value: "Yes",
            icon: Dumbbell,
          },
          {
            label: "Personal Accident Covered - 5 Lacs",
            value: "Yes",
            icon: ShieldCheck,
            important: true,
          },
          {
            label: "Hospicash",
            value: "Yes",
            icon: Building2,
            important: true,
          },
        ],
      },
    ],
  },

  /* ===================== FLOATER 30K ===================== */

  {
    id: "floater-30000",
    name: "Floater",
    family: "2A",
    price: "₹30,000",
    minAge: "18 Years",
    maxAge: "60 Years",
    validity: "1 Year",

    sections: [
      {
        title: "Health & Wellness Services",
        benefits: [
          {
            label: "Health Risk Assessment Digital",
            value: "2 Credit",
            icon: ClipboardCheck,
          },
          {
            label: "Tele DM Consultation GP + SP",
            value: "4 Credit",
            icon: Video,
          },
          {
            label: "CBC Test",
            value: "2 Credit",
            icon: TestTube2,
          },
          {
            label: "CBC Report Review",
            value: "2 Credit",
            icon: FileSearch,
          },
          {
            label: "Executive Centre Visit Health Check-up @500",
            value: "—",
            icon: Activity,
          },
        ],
      },

      {
        title: "Discounts & Benefits",
        benefits: commonDiscounts,
      },

      {
        title: "Additional Services",
        benefits: [
          {
            label: "Health Coach",
            value: "—",
            icon: HeartPulse,
          },
          {
            label: "Diabetologist-60C",
            value: "—",
            icon: Stethoscope,
          },
          {
            label: "Disease Management",
            value: "—",
            icon: Activity,
          },
          {
            label: "Tele Cardio Consultation",
            value: "1 Credit",
            icon: HeartPulse,
          },
          {
            label: "HA Exclusive Gold Membership",
            value: "—",
            icon: Crown,
          },
          {
            label: "Online Fitness and Zumba Session",
            value: "Yes",
            icon: Dumbbell,
          },
          {
            label: "Personal Accident Covered - 5 Lacs",
            value: "Yes",
            icon: ShieldCheck,
            important: true,
          },
          {
            label: "Hospicash",
            value: "Yes",
            icon: Building2,
            important: true,
          },
        ],
      },
    ],
  },

  /* ===================== FLOATER 50K ===================== */

  {
    id: "floater-50000",
    name: "Floater",
    family: "2A + 2C",
    price: "₹50,000",
    minAge: "18 Years",
    maxAge: "60 Years",
    validity: "1 Year",

    sections: [
      {
        title: "Health & Wellness Services",
        benefits: [
          {
            label: "Health Risk Assessment Digital",
            value: "2 Credit",
            icon: ClipboardCheck,
          },
          {
            label: "Tele DM Consultation GP + SP",
            value: "10 Credit",
            icon: Video,
          },
          {
            label: "CBC Test",
            value: "4 Credit",
            icon: TestTube2,
          },
          {
            label: "CBC Report Review",
            value: "4 Credit",
            icon: FileSearch,
          },
          {
            label: "Executive Centre Visit Health Check-up @500",
            value: "—",
            icon: Activity,
          },
        ],
      },

      {
        title: "Discounts & Benefits",
        benefits: commonDiscounts,
      },

      {
        title: "Additional Services",
        benefits: [
          {
            label: "Health Coach",
            value: "2 Credit",
            icon: HeartPulse,
          },
          {
            label: "Diabetologist-60C",
            value: "1 Credit",
            icon: Stethoscope,
          },
          {
            label: "Disease Management",
            value: "1 Credit",
            icon: Activity,
          },
          {
            label: "Tele Cardio Consultation",
            value: "1 Credit",
            icon: HeartPulse,
          },
          {
            label: "HA Exclusive Gold Membership",
            value: "—",
            icon: Crown,
          },
          {
            label: "Online Fitness and Zumba Session",
            value: "Yes",
            icon: Dumbbell,
          },
          {
            label: "Personal Accident Covered - 5 Lacs",
            value: "Yes",
            icon: ShieldCheck,
            important: true,
          },
          {
            label: "Hospicash",
            value: "Yes",
            icon: Building2,
            important: true,
          },
        ],
      },
    ],
  },

  /* ===================== EXEC FLOATER ===================== */

  {
    id: "exec-floater",
    name: "Exec Floater",
    family: "2A + 2C",
    price: "₹1,00,000",
    badge: "Executive",
    minAge: "18 Years",
    maxAge: "60 Years",
    validity: "1 Year",

    sections: [
      {
        title: "Health & Wellness Services",
        benefits: [
          {
            label: "Health Risk Assessment Digital",
            value: "Unlimited",
            icon: ClipboardCheck,
          },
          {
            label: "Tele DM Consultation GP + SP",
            value: "12 Credit",
            icon: Video,
          },
          {
            label: "CBC Test",
            value: "4 Credit",
            icon: TestTube2,
          },
          {
            label: "CBC Report Review",
            value: "4 Credit",
            icon: FileSearch,
          },
          {
            label: "Executive Centre Visit Health Check-up @500",
            value: "1 Credit",
            icon: Activity,
          },
        ],
      },

      {
        title: "Discounts & Benefits",
        benefits: commonDiscounts,
      },

      {
        title: "Additional Services",
        benefits: [
          {
            label: "Health Coach",
            value: "2 Credit",
            icon: HeartPulse,
          },
          {
            label: "Diabetologist-60C",
            value: "1 Credit",
            icon: Stethoscope,
          },
          {
            label: "Disease Management",
            value: "2 Credit",
            icon: Activity,
          },
          {
            label: "Tele Cardio Consultation",
            value: "1 Credit",
            icon: HeartPulse,
          },
          {
            label: "HA Exclusive Gold Membership",
            value: "—",
            icon: Crown,
          },
          {
            label: "Online Fitness and Zumba Session",
            value: "Yes",
            icon: Dumbbell,
          },
          {
            label: "Personal Accident Covered - 5 Lacs",
            value: "Yes",
            icon: ShieldCheck,
            important: true,
          },
          {
            label: "Hospicash",
            value: "Yes",
            icon: Building2,
            important: true,
          },
        ],
      },
    ],
  },

  /* ===================== SENIOR ===================== */
];

/* =========================================================
   BENEFIT VALUE
========================================================= */

function BenefitValue({ value }: { value: string }) {
  if (value === "Yes") {
    return (
      <div className="flex items-center gap-1 font-bold text-emerald-700 dark:text-emerald-400">
        <CheckCircle2 className="h-4 w-4" />
        <span>Yes</span>
      </div>
    );
  }

  if (value === "—") {
    return <span className="font-bold text-slate-400">—</span>;
  }

  return (
    <span className="whitespace-nowrap font-bold text-slate-800 dark:text-white">
      {value}
    </span>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function PlansPage() {
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null);

  const togglePlan = (id: string) => {
    setExpandedPlan((previous) => (previous === id ? null : id));
  };

  return (
    <main className="min-h-screen bg-[#f7faf7] px-3 py-8 dark:bg-[#07140e] sm:px-6 sm:py-12">
      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="mx-auto mb-8 max-w-5xl text-center sm:mb-10">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#d8e8c3] bg-[#eef6e4] px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#145233] dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
          <Sparkles className="h-4 w-4" />
          Annual Membership Plans
        </div>

        <h1 className="text-3xl font-black tracking-tight text-[#064627] dark:text-emerald-300 sm:text-4xl lg:text-5xl">
          Comprehensive Health & Wellness Plans
        </h1>

        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-300 sm:text-base">
          Choose a package to view complete health, wellness and protection
          benefits.
        </p>
      </div>

      {/* =====================================================
          PLANS
      ===================================================== */}

      <div className="mx-auto max-w-5xl space-y-4">
        {plans.map((plan) => {
          const isOpen = expandedPlan === plan.id;

          return (
            <div
              key={plan.id}
              className={`overflow-hidden rounded-2xl border bg-white transition-all duration-300 dark:bg-[#0d1d14] sm:rounded-3xl ${
                isOpen
                  ? "border-[#9dbc79] shadow-[0_16px_45px_rgba(6,70,39,0.13)]"
                  : "border-slate-200 shadow-sm hover:border-[#bed4a5] hover:shadow-md dark:border-slate-800"
              }`}
            >
              {/* =================================================
                  PACKAGE BAR
              ================================================= */}

              <button
                type="button"
                onClick={() => togglePlan(plan.id)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-3 px-4 py-5 text-left sm:px-7 sm:py-6"
              >
                <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                  {/* ICON */}

                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl sm:h-13 sm:w-13 sm:rounded-2xl ${
                      plan.id === "exec-floater"
                        ? "bg-orange-100 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400"
                        : "bg-[#edf5e5] text-[#145233] dark:bg-emerald-950 dark:text-emerald-300"
                    }`}
                  >
                    {plan.id === "individual" ? (
                      <UserRound className="h-5 w-5 sm:h-6 sm:w-6" />
                    ) : plan.id === "senior-plan" ? (
                      <HeartPulse className="h-5 w-5 sm:h-6 sm:w-6" />
                    ) : plan.id === "exec-floater" ? (
                      <Crown className="h-5 w-5 sm:h-6 sm:w-6" />
                    ) : (
                      <Users className="h-5 w-5 sm:h-6 sm:w-6" />
                    )}
                  </div>

                  {/* NAME */}

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-base font-black text-slate-900 dark:text-white sm:text-xl">
                        {plan.name}
                      </h2>

                      {plan.badge && (
                        <span className="rounded-full bg-[#d98205] px-2 py-1 text-[8px] font-black uppercase tracking-wider text-white sm:px-2.5 sm:text-[9px]">
                          {plan.badge}
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400 sm:text-sm">
                      Family Coverage: {plan.family}
                    </p>
                  </div>
                </div>

                {/* PRICE */}

                <div className="flex shrink-0 items-center gap-2 sm:gap-5">
                  <div className="text-right">
                    <p
                      className={`text-base font-black sm:text-2xl ${
                        plan.id === "exec-floater"
                          ? "text-[#d98205]"
                          : "text-[#064627] dark:text-emerald-300"
                      }`}
                    >
                      {plan.price}
                    </p>

                    <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400 sm:text-[10px]">
                      + GST / Year
                    </p>
                  </div>

                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all sm:h-10 sm:w-10 ${
                      isOpen
                        ? "bg-[#064627] text-white"
                        : "bg-[#edf5e5] text-[#064627] dark:bg-emerald-950 dark:text-emerald-300"
                    }`}
                  >
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5" />
                    ) : (
                      <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />
                    )}
                  </span>
                </div>
              </button>

              {/* =================================================
                  EXPANDED AREA
              ================================================= */}

              {isOpen && (
                <div className="border-t border-slate-100 bg-[#fbfdf9] px-4 pb-6 pt-5 dark:border-slate-800 dark:bg-[#09170f] sm:px-7">
                  {/* =============================================
                      COVERAGE
                  ============================================= */}

                  <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
                    <div className="rounded-xl border border-emerald-100 bg-white p-3 dark:border-emerald-900 dark:bg-[#102218] sm:p-4">
                      <Users className="mb-2 h-5 w-5 text-[#17643d] dark:text-emerald-400" />

                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                        Family
                      </p>

                      <p className="mt-1 text-sm font-black text-slate-900 dark:text-white">
                        {plan.family}
                      </p>
                    </div>

                    <div className="rounded-xl border border-emerald-100 bg-white p-3 dark:border-emerald-900 dark:bg-[#102218] sm:p-4">
                      <UserRound className="mb-2 h-5 w-5 text-[#17643d] dark:text-emerald-400" />

                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                        Minimum Age
                      </p>

                      <p className="mt-1 text-sm font-black text-slate-900 dark:text-white">
                        {plan.minAge}
                      </p>
                    </div>

                    <div className="rounded-xl border border-emerald-100 bg-white p-3 dark:border-emerald-900 dark:bg-[#102218] sm:p-4">
                      <CalendarDays className="mb-2 h-5 w-5 text-[#17643d] dark:text-emerald-400" />

                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                        Maximum Age
                      </p>

                      <p className="mt-1 text-sm font-black text-slate-900 dark:text-white">
                        {plan.maxAge}
                      </p>
                    </div>

                    <div className="rounded-xl border border-emerald-100 bg-white p-3 dark:border-emerald-900 dark:bg-[#102218] sm:p-4">
                      <Clock3 className="mb-2 h-5 w-5 text-[#17643d] dark:text-emerald-400" />

                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                        Validity
                      </p>

                      <p className="mt-1 text-sm font-black text-slate-900 dark:text-white">
                        {plan.validity}
                      </p>
                    </div>
                  </div>

                  {/* =============================================
                      BENEFITS
                  ============================================= */}

                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    {plan.sections.map((section) => (
                      <div
                        key={section.title}
                        className="overflow-hidden rounded-2xl border border-[#dce9cf] bg-white dark:border-emerald-900 dark:bg-[#102218]"
                      >
                        {/* SECTION TITLE */}

                        <div className="bg-[#eaf3d9] px-4 py-3 dark:bg-[#173923]">
                          <h3 className="text-xs font-black uppercase tracking-wide text-[#174c31] dark:text-emerald-200 sm:text-sm">
                            {section.title}
                          </h3>
                        </div>

                        {/* BENEFIT ROWS */}

                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                          {section.benefits.map((benefit) => {
                            const Icon = benefit.icon;

                            return (
                              <div
                                key={`${section.title}-${benefit.label}`}
                                className={`flex items-start justify-between gap-3 px-4 py-3 ${
                                  benefit.important
                                    ? "bg-emerald-50/60 dark:bg-emerald-950/20"
                                    : ""
                                }`}
                              >
                                <div className="flex min-w-0 items-start gap-2">
                                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#17643d] dark:text-emerald-400" />

                                  <p
                                    className={`text-[11px] leading-5 sm:text-xs ${
                                      benefit.important
                                        ? "font-black text-slate-800 dark:text-white"
                                        : "font-semibold text-slate-600 dark:text-slate-300"
                                    }`}
                                  >
                                    {benefit.label}
                                  </p>
                                </div>

                                <div className="shrink-0 text-right text-[11px] sm:text-xs">
                                  <BenefitValue value={benefit.value} />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* =============================================
                      HOSPICASH EXPLANATION
                  ============================================= */}

                  <div className="mt-5 overflow-hidden rounded-2xl border border-[#cbdcaf] bg-white dark:border-emerald-900 dark:bg-[#102218]">
                    {/* HEADER */}

                    <div className="flex items-center gap-3 bg-[#064627] px-4 py-4 text-white sm:px-5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                        <Building2 className="h-5 w-5" />
                      </div>

                      <div>
                        <p className="text-[8px] font-black uppercase tracking-[0.18em] text-emerald-200 sm:text-[9px]">
                          Included Protection Benefit
                        </p>

                        <h3 className="text-sm font-black sm:text-base">
                          Hospicash Benefit
                        </h3>
                      </div>
                    </div>

                    <div className="p-4 sm:p-5">
                      {/* AMOUNT */}

                      <div className="mb-4 flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
                        <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

                        <p className="text-xs font-semibold leading-6 text-slate-700 dark:text-slate-200 sm:text-sm">
                          Covered Amount –{" "}
                          <strong className="font-black">
                            INR 500 / INR 1000 per day
                          </strong>{" "}
                          hospitalization.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {/* NORMAL */}

                        <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 dark:border-emerald-900 dark:bg-emerald-950/20">
                          <div className="mb-2 flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-[#17643d] dark:text-emerald-400" />

                            <h4 className="text-sm font-black text-[#174c31] dark:text-emerald-300">
                              Normal Hospitalization
                            </h4>
                          </div>

                          <p className="text-xs leading-6 text-slate-600 dark:text-slate-300 sm:text-sm">
                            Covered Amount – INR 500 / INR 1000 per day
                            hospitalization with maximum limit upto{" "}
                            <strong className="font-black text-slate-900 dark:text-white">
                              30 days in a year
                            </strong>{" "}
                            with{" "}
                            <strong className="font-black text-slate-900 dark:text-white">
                              1 day deductible per claim.
                            </strong>
                          </p>
                        </div>

                        {/* ICU */}

                        <div className="rounded-xl border border-orange-100 bg-orange-50/60 p-4 dark:border-orange-900 dark:bg-orange-950/20">
                          <div className="mb-2 flex items-center gap-2">
                            <HeartPulse className="h-5 w-5 text-orange-600 dark:text-orange-400" />

                            <h4 className="text-sm font-black text-orange-700 dark:text-orange-300">
                              ICU Hospitalization
                            </h4>
                          </div>

                          <p className="text-xs leading-6 text-slate-600 dark:text-slate-300 sm:text-sm">
                            Payout will be{" "}
                            <strong className="font-black text-orange-700 dark:text-orange-300">
                              double
                            </strong>{" "}
                            in case of ICU hospitalization with maximum limit
                            upto{" "}
                            <strong className="font-black text-slate-900 dark:text-white">
                              15 days in a year
                            </strong>{" "}
                            with{" "}
                            <strong className="font-black text-slate-900 dark:text-white">
                              1 day deductible per claim.
                            </strong>
                          </p>
                        </div>
                      </div>

                      {/* POLICY LIMIT */}

                      <div className="mt-4 flex items-start gap-3 rounded-xl bg-[#f2f7e9] p-4 dark:bg-[#173321]">
                        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#17643d] dark:text-emerald-400" />

                        <div>
                          <h4 className="mb-1 text-xs font-black text-[#174c31] dark:text-emerald-300 sm:text-sm">
                            Maximum Policy Year Limit
                          </h4>

                          <p className="text-xs leading-6 text-slate-600 dark:text-slate-300 sm:text-sm">
                            Customers can avail this benefit only for{" "}
                            <strong className="font-black text-slate-900 dark:text-white">
                              30 days in a policy year collectively for normal
                              hospitalization
                            </strong>{" "}
                            and{" "}
                            <strong className="font-black text-slate-900 dark:text-white">
                              15 days in a policy year collectively for ICU
                              hospitalization.
                            </strong>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* =============================================
                      BOTTOM
                  ============================================= */}

                  <div className="mt-5 flex flex-col gap-4 border-t border-slate-200 pt-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Annual Membership
                      </p>

                      <p className="mt-1 text-xl font-black text-[#064627] dark:text-emerald-300 sm:text-2xl">
                        {plan.price}

                        <span className="ml-2 text-xs font-bold text-slate-400">
                          + GST
                        </span>
                      </p>
                    </div>

                    <button
                      type="button"
                      className="w-full rounded-full bg-[#064627] px-7 py-3 text-sm font-black text-white transition hover:bg-[#095936] sm:w-auto"
                    >
                      Choose {plan.name}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* =====================================================
          FOOTER NOTE
      ===================================================== */}

      <div className="mx-auto mt-6 flex max-w-5xl items-center justify-center gap-2 rounded-2xl border border-emerald-100 bg-white px-4 py-4 text-center text-xs font-semibold text-slate-500 dark:border-emerald-900 dark:bg-[#0d1d14] dark:text-slate-300 sm:text-sm">
        <CheckCircle2 className="h-5 w-5 shrink-0 text-[#4da428]" />

        <span>
          All plans are annual membership based. Terms &amp; conditions apply.
        </span>
      </div>
    </main>
  );
}
