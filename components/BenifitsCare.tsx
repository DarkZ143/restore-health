"use client";

import Image from "next/image";
import {
  Activity,
  Stethoscope,
  Users,
  HeartPulse,
  ShieldCheck,
  MessageCircle,
  ArrowRight,
  Search,
} from "lucide-react";

export default function BenefitsAndCare() {
  const benefits = [
    {
      icon: (
        <Activity
          className="text-emerald-500 dark:text-emerald-400"
          size={22}
        />
      ),
      iconBg: "bg-emerald-50 dark:bg-emerald-500/10",
      title: "Talk To A Doctor In Minutes",
      desc: "From wherever you are — online or in-clinic, across 40+ specialities.",
    },
    {
      icon: (
        <Stethoscope className="text-teal-500 dark:text-teal-400" size={22} />
      ),
      iconBg: "bg-teal-50 dark:bg-teal-500/10",
      title: "Skip The Clinic Queue",
      desc: "Book health tests with home collection — 1,000+ tests, reports in 24 hours.",
    },
    {
      icon: <Users className="text-amber-600 dark:text-amber-300" size={22} />,
      iconBg: "bg-amber-50 dark:bg-amber-500/10",
      title: "Cover Your Whole Team",
      desc: "Tailored employer plans with a live dashboard your HR team will actually enjoy.",
    },
    {
      icon: (
        <HeartPulse
          className="text-purple-500 dark:text-purple-400"
          size={22}
        />
      ),
      iconBg: "bg-purple-50 dark:bg-purple-500/10",
      title: "Feel Genuinely Well",
      desc: "Mental health support, fitness, and nutrition guidance built into every plan.",
    },
    {
      icon: (
        <ShieldCheck className="text-lime-600 dark:text-lime-300" size={22} />
      ),
      iconBg: "bg-lime-50 dark:bg-lime-500/10",
      title: "Catch Problems Early",
      desc: "Annual check-ups and screenings, so small things stay small — in 150+ cities.",
    },
    {
      icon: (
        <MessageCircle className="text-rose-500 dark:text-rose-400" size={22} />
      ),
      iconBg: "bg-rose-50 dark:bg-rose-500/10",
      title: "Someone's Always There",
      desc: "A real care coordinator, day or night — not a ticket number.",
    },
  ];

  return (
    <section className="w-full bg-white px-4 py-16 transition-colors duration-300 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* =====================================================
            TOP SECTION: HEADER & HERO IMAGE
        ====================================================== */}
        <div className="text-center">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#139a67] dark:text-emerald-400">
            How It Improves Your Life
          </span>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl md:text-5xl">
            Every Benefit,
            <br />
            Built Around You
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-slate-500 dark:text-slate-400 sm:text-base">
            One membership. Every healthcare moment covered — for you, your
            family, and your team.
          </p>
        </div>

        {/* Hero Image (Blood Pressure) */}
        <div className="mx-auto mt-12 relative h-75 w-full max-w-3xl overflow-hidden rounded-3xl shadow-lg sm:h-100">
          <Image
            src="/home-benefits.webp"
            alt="Patient getting blood pressure checked"
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
        </div>

        {/* =====================================================
            GRID SECTION: BENEFITS CARDS
        ====================================================== */}
        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="
                group
                flex
                flex-col
                justify-between
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-7
                transition-all
                duration-300
                hover:border-emerald-300
                hover:shadow-lg
                hover:shadow-emerald-500/5
                dark:border-slate-800
                dark:bg-slate-900/50
                dark:hover:border-emerald-500/40
                dark:hover:bg-slate-800/80
              "
            >
              <div>
                <div
                  className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${benefit.iconBg}`}
                >
                  {benefit.icon}
                </div>
                <h3 className="mb-3 text-[17px] font-bold text-slate-900 dark:text-slate-100">
                  {benefit.title}
                </h3>
                <p className="text-[14px] leading-relaxed text-slate-500 dark:text-slate-400">
                  {benefit.desc}
                </p>
              </div>

              <div className="mt-8">
                <ArrowRight
                  size={18}
                  className="text-emerald-400 transition-transform group-hover:translate-x-1 dark:text-emerald-500"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="my-24 h-px w-full bg-slate-100 dark:bg-slate-800/80" />

        {/* =====================================================
            FIND CARE SECTION
        ====================================================== */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          {/* Left Content */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#139a67] dark:text-emerald-400">
              Find Care Now
            </span>

            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Find The Right Doctor,
              <br /> Right For You
            </h2>

            <p className="mt-5 text-[15px] leading-relaxed text-slate-500 dark:text-slate-400">
              Connect with verified doctors across 40+ specialities — online or
              in-clinic, on your schedule.
            </p>

            {/* Search Input */}
            <div className="mt-8 relative flex w-full max-w-lg items-center overflow-hidden rounded-full border border-slate-200 bg-white shadow-sm transition-all focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100 dark:border-slate-700 dark:bg-slate-900 dark:focus-within:border-emerald-500 dark:focus-within:ring-emerald-500/20">
              <div className="pl-5 text-slate-400">
                <Search size={18} />
              </div>
              <input
                type="text"
                placeholder="Search doctors, specialities or symptoms..."
                className="w-full bg-transparent px-4 py-4 text-[14px] text-slate-800 placeholder-slate-400 outline-none dark:text-slate-100 dark:placeholder-slate-500"
              />
              <div className="pr-2">
                <button className="flex h-9.5 items-center justify-center rounded-full bg-[#1de9b6] px-6 text-[13px] font-bold text-emerald-950 transition-all hover:bg-[#64ffda] dark:bg-emerald-500 dark:text-white dark:hover:bg-emerald-400">
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Right Content / Image */}
          <div className="relative h-75 w-full overflow-hidden rounded-4xl shadow-xl sm:h-100">
            <Image
              src="/home-find-doctor.webp"
              alt="Doctor ready to help"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
