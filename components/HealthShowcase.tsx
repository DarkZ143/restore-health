"use client";

import Image from "next/image";
import {
  Activity,
  BriefcaseBusiness,
  Home,
  ShieldCheck,
  Users,
} from "lucide-react";

const quickServices = [
  {
    title: "Talk to Doctor",
    icon: Activity,
    iconBg: "bg-emerald-50 dark:bg-emerald-500/10",
    iconColor: "text-emerald-500 dark:text-emerald-400",
  },
  {
    title: "Lab Tests",
    icon: BriefcaseBusiness,
    iconBg: "bg-green-50 dark:bg-green-500/10",
    iconColor: "text-green-600 dark:text-green-400",
  },
  {
    title: "Book Appointment",
    icon: Home,
    iconBg: "bg-amber-50 dark:bg-amber-500/10",
    iconColor: "text-amber-700 dark:text-amber-300",
  },
  {
    title: "Corporate Plans",
    icon: BriefcaseBusiness,
    iconBg: "bg-purple-50 dark:bg-purple-500/10",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
  {
    title: "Preventive Care",
    icon: ShieldCheck,
    iconBg: "bg-lime-50 dark:bg-lime-500/10",
    iconColor: "text-lime-700 dark:text-lime-300",
  },
  {
    title: "Employee Wellness",
    icon: Users,
    iconBg: "bg-red-50 dark:bg-red-500/10",
    iconColor: "text-red-500 dark:text-red-400",
  },
];

const careImages = [
  { image: "/care1.webp", title: "Child healthcare" },
  { image: "/care2.webp", title: "Health tracking" },
  { image: "/care3.webp", title: "Patient care" },
  { image: "/care4.webp", title: "24/7 support" },
  { image: "/care5.webp", title: "Digital consultations" },
  { image: "/care6.webp", title: "Preventive care" },
  { image: "/care7.webp", title: "Health awareness" },
  { image: "/care8.webp", title: "Community care" },
];

export default function HealthShowcase() {
  /*
   * Duplicate images are intentional.
   * This creates a seamless infinite marquee.
   */
  const marqueeImages = [...careImages, ...careImages];

  return (
    <section className="w-full bg-white transition-colors duration-300 dark:bg-slate-950">
      {/* =====================================================
          QUICK SERVICES
      ====================================================== */}
      <div className="mx-auto flex w-full max-w-5xl justify-center px-4">
        <div
          className="
            grid
            w-full
            grid-cols-2
            overflow-hidden
            rounded-b-3xl
            border
            border-slate-200
            bg-[#f8f8ef]
            dark:border-slate-800
            dark:bg-slate-900/50
            sm:grid-cols-3
            lg:grid-cols-6
          "
        >
          {quickServices.map((service) => {
            const Icon = service.icon;

            return (
              <div
                key={service.title}
                className="
                  group
                  relative
                  flex
                  min-h-37.5
                  cursor-pointer
                  flex-col
                  items-center
                  justify-center
                  px-3
                  py-5
                  text-center
                  transition-all
                  duration-300
                  hover:z-10
                  hover:-translate-y-1
                  hover:bg-white
                  hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]
                  dark:hover:bg-slate-800/80
                "
              >
                <div
                  className={`
                    mb-3
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    transition-transform
                    duration-300
                    group-hover:scale-110
                    ${service.iconBg}
                  `}
                >
                  <Icon
                    size={27}
                    strokeWidth={1.8}
                    className={service.iconColor}
                  />
                </div>

                <span className="max-w-27.5 text-[14px] font-medium leading-6 text-slate-700 transition-colors group-hover:text-emerald-700 dark:text-slate-300 dark:group-hover:text-emerald-400">
                  {service.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* =====================================================
          REAL CARE - INFINITE MARQUEE
      ====================================================== */}
      <div className="relative mt-14 border-y border-slate-200 dark:border-slate-800">
        <div className="flex h-36.25 items-center">
          {/* Fixed Label (Desktop) */}
          <div
            className="
              z-20
              hidden
              h-full
              w-75
              shrink-0
              items-center
              justify-center
              border-r
              border-slate-200
              bg-white/80
              backdrop-blur-md
              dark:border-slate-800
              dark:bg-slate-950/80
              lg:flex
            "
          >
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500"></span>
              </span>
              <ShieldCheck
                size={20}
                className="text-emerald-500 dark:text-emerald-400"
                strokeWidth={2}
              />
              <span className="text-[14px] font-bold tracking-wide text-emerald-600 dark:text-emerald-400">
                REAL CARE, REAL INDIA
              </span>
            </div>
          </div>

          {/* Mobile Label */}
          <div className="absolute z-20 -mt-28.75 ml-5 flex items-center gap-2 lg:hidden">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
            </span>
            <ShieldCheck
              size={17}
              className="text-emerald-500 dark:text-emerald-400"
            />
            <span className="text-[13px] font-bold tracking-wide text-emerald-600 dark:text-emerald-400">
              REAL CARE, REAL INDIA
            </span>
          </div>

          {/* MARQUEE VIEWPORT */}
          <div className="relative flex h-full min-w-0 flex-1 items-center overflow-hidden">
            {/* Gradient Fades */}
            <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-linear-to-r from-white to-transparent dark:from-slate-950" />
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-linear-to-l from-white to-transparent dark:from-slate-950" />

            {/* Moving Track */}
            <div className="health-marquee flex w-max items-center gap-4 py-4">
              {marqueeImages.map((item, index) => (
                <div
                  key={`${item.title}-${index}`}
                  className="
                    group
                    relative
                    h-31.25
                    w-36.25
                    shrink-0
                    cursor-pointer
                    overflow-hidden
                    rounded-2xl
                    bg-slate-100
                    shadow-sm
                    transition-all
                    duration-300
                    hover:shadow-lg
                    hover:ring-2
                    hover:ring-emerald-400/50
                    dark:bg-slate-800
                  "
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={145}
                    height={125}
                    className="
                      h-full
                      w-full
                      object-cover
                      transition-transform
                      duration-700
                      group-hover:scale-110
                    "
                  />

                  {/* Image Overlay */}
                  <div
                    className="
                      absolute
                      inset-x-0
                      bottom-0
                      translate-y-1
                      bg-linear-to-t
                      from-black/80
                      via-black/30
                      to-transparent
                      px-3
                      pb-2.5
                      pt-10
                      transition-transform
                      duration-300
                      group-hover:translate-y-0
                    "
                  >
                    <span className="text-[12px] font-semibold text-white">
                      {item.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          MARQUEE ANIMATION
      ====================================================== */}
      <style>{`
        .health-marquee {
          animation: healthMarquee 35s linear infinite;
        }

        .health-marquee:hover {
          animation-play-state: paused;
        }

        @keyframes healthMarquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}
