"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Heart,
  Activity,
  UserRound,
  ShieldCheck,
  MapPin,
  BadgeCheck,
  ClipboardCheck,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

/**
 * RESTORE — Hero Section (Modern Bento & Floating Depth Architecture)
 * Fully animated with Framer Motion, dynamic auto-advancing visual portal,
 * interactive floating benefit capsules, and responsive luxury stats ribbon.
 */

const heroImages = [
  {
    src: "/family1.webp",
    label: "Family Wellness",
    tag: "Comprehensive Care",
  },
  {
    src: "/family2.webp",
    label: "Preventive Health",
    tag: "Proactive Tracking",
  },
  {
    src: "/family3.webp",
    label: "Specialist Support",
    tag: "24/7 Virtual Access",
  },
];

const benefits = [
  {
    title: "Expert Doctors",
    description: "Consult specialists anytime",
    icon: UserRound,
    accentGlow: "rgba(13, 206, 145, 0.25)",
    iconBg: "bg-emerald-500/15 text-emerald-600 dark:bg-emerald-400/20 dark:text-emerald-300",
    badge: "Top 1% MDs",
  },
  {
    title: "Personalized Care",
    description: "Tailored to your needs",
    icon: Heart,
    accentGlow: "rgba(200, 148, 22, 0.25)",
    iconBg: "bg-amber-500/15 text-amber-600 dark:bg-amber-400/20 dark:text-amber-300",
    badge: "Custom Plans",
  },
  {
    title: "Secure & Private",
    description: "Your data, always protected",
    icon: ShieldCheck,
    accentGlow: "rgba(20, 184, 166, 0.25)",
    iconBg: "bg-teal-500/15 text-teal-600 dark:bg-teal-400/20 dark:text-teal-300",
    badge: "HIPAA Certified",
  },
];

const statistics = [
  {
    value: "500+",
    label: "Expert Doctors",
    icon: Activity,
    color: "from-emerald-500 to-teal-600",
  },
  {
    value: "4,00+",
    label: "Tests & Checkups",
    icon: ClipboardCheck,
    color: "from-teal-500 to-cyan-600",
  },
  {
    value: "100+",
    label: "Cities",
    icon: MapPin,
    color: "from-amber-500 to-yellow-600",
  },
  {
    value: "98%",
    label: "Satisfaction",
    icon: BadgeCheck,
    color: "from-emerald-400 to-green-600",
  },
];

export default function Hero() {
  const [activeImage, setActiveImage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = window.setInterval(() => {
      setActiveImage((current) =>
        current === heroImages.length - 1 ? 0 : current + 1,
      );
    }, 4500);

    return () => window.clearInterval(interval);
  }, [isPaused]);

  const handleNext = () => {
    setActiveImage((prev) => (prev === heroImages.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setActiveImage((prev) => (prev === 0 ? heroImages.length - 1 : prev - 1));
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#ffffff] via-[#f4faf7] to-[#eaf5ef] text-[#092d28] transition-colors duration-500 dark:from-[#041611] dark:via-[#072018] dark:to-[#0a2c22] dark:text-white">
      {/* =====================================================
          DYNAMIC AMBIENT BACKGROUND GLOWS & GRID
      ====================================================== */}
      <motion.div
        animate={{
          x: [0, 25, 0],
          y: [0, -20, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -left-24 -top-24 h-[450px] w-[450px] rounded-full bg-gradient-to-br from-[#0dce91]/25 to-[#246b1c]/15 blur-[120px] dark:from-[#0dce91]/20 dark:to-transparent"
      />
      <motion.div
        animate={{
          x: [0, -30, 0],
          y: [0, 25, 0],
          scale: [1.1, 1, 1.1],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -right-24 top-1/4 h-[450px] w-[450px] rounded-full bg-gradient-to-bl from-[#c89416]/20 to-[#0dce91]/15 blur-[130px] dark:from-[#c89416]/15 dark:to-transparent"
      />

      {/* Futuristic Mesh Grid Pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `radial-gradient(circle at 1.5px 1.5px, currentColor 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* =====================================================
          HERO MAIN CONTENT
      ====================================================== */}
      <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-8 sm:px-6 sm:pb-16 sm:pt-10 lg:px-8 lg:pb-20 lg:pt-14">
        {/* Top Floating Announcement Badge */}
        <div className="flex justify-center md:justify-start">
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="group inline-flex cursor-pointer items-center gap-2.5 rounded-full border border-[#a9ebd8]/80 bg-white/80 px-4 py-2 text-xs font-bold text-[#144439] shadow-md shadow-emerald-950/5 backdrop-blur-xl transition-all duration-300 hover:border-[#0dce91] hover:shadow-lg hover:shadow-[#0dce91]/15 dark:border-emerald-500/30 dark:bg-emerald-950/60 dark:text-emerald-100 sm:text-sm"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0dce91] opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#0dce91]" />
            </span>
            <span className="tracking-tight">
              NEW: Health Technology That Never Fails
            </span>
            <ArrowRight
              size={15}
              strokeWidth={2.5}
              className="text-[#00bd83] transition-transform duration-300 group-hover:translate-x-1"
            />
          </motion.div>
        </div>

        {/* 2-Column Bento Grid Showcase */}
        <div className="mt-7 grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* =================================================
              LEFT COLUMN: HERO HEADLINE & STORYTELLING
          ================================================== */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left lg:col-span-6">
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl font-black leading-[1.08] tracking-tight text-[#092d28] dark:text-white sm:text-5xl lg:text-[56px] xl:text-[62px]"
            >
              Better Health Today
              <br />
              <span className="relative inline-block pb-2 bg-gradient-to-r from-[#246b1c] via-[#0dce91] to-[#c89416] bg-clip-text text-transparent drop-shadow-sm dark:from-[#6ee7b7] dark:via-[#34d399] dark:to-[#fbbf24]">
                Stronger Tomorrow
                <motion.span
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.9, delay: 0.5, ease: "easeOut" }}
                  className="absolute -bottom-1.5 left-0 h-[3px] rounded-full bg-gradient-to-r from-[#246b1c] via-[#0dce91] to-[#c89416] opacity-60"
                />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 max-w-lg text-base leading-relaxed text-[#54654f] dark:text-emerald-100/80 sm:text-lg"
            >
              Restore Health helps you take charge of your health with expert
              care, advanced technology and personalized support for you and
              your family.
            </motion.p>

            {/* Benefit Capsules List (Staggered Interactive Grid) */}
            <div className="mt-8 grid w-full grid-cols-1 gap-3 sm:grid-cols-3">
              {benefits.map((benefit, i) => {
                const Icon = benefit.icon;
                return (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.08 }}
                    whileHover={{ y: -3, scale: 1.02 }}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/80 bg-white/75 p-3.5 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-emerald-400/40 hover:bg-white hover:shadow-md dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-emerald-400/30 dark:hover:bg-white/[0.07]"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-xl ${benefit.iconBg} shadow-inner transition-transform duration-300 group-hover:scale-110`}
                      >
                        <Icon size={18} strokeWidth={2.2} />
                      </span>
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                        {benefit.badge}
                      </span>
                    </div>

                    <div className="mt-3 text-left">
                      <h3 className="text-xs font-extrabold text-[#0c302b] dark:text-white sm:text-sm">
                        {benefit.title}
                      </h3>
                      <p className="mt-0.5 text-[11px] leading-tight text-[#6a7a63] dark:text-emerald-100/70">
                        {benefit.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* =================================================
              RIGHT COLUMN: IMMERSIVE 3D VISUAL SHOWCASE
          ================================================== */}
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              className="group relative overflow-hidden rounded-3xl border border-white/80 bg-white/40 p-3 shadow-2xl shadow-emerald-950/10 backdrop-blur-2xl transition-all duration-500 hover:shadow-emerald-900/15 dark:border-white/15 dark:bg-emerald-950/30"
            >
              {/* Main Visual Slider Window */}
              <div className="relative h-72 w-full overflow-hidden rounded-2xl shadow-inner sm:h-96 md:h-[400px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeImage}
                    initial={{ opacity: 0, scale: 1.08 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.75, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={heroImages[activeImage].src}
                      alt={`Restore Health Family Care - ${heroImages[activeImage].label}`}
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover object-center"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Ambient Depth Gradient Layer */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#042119]/80 via-[#042119]/20 to-transparent" />

                {/* Floating Top Status Badge */}
                <div className="absolute left-3.5 top-3.5 flex items-center gap-2 rounded-full border border-white/25 bg-black/45 px-3 py-1.5 backdrop-blur-md">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  </span>
                  <span className="text-[11px] font-extrabold text-white">
                    {heroImages[activeImage].tag}
                  </span>
                </div>

                {/* Floating Bottom Info Pill with Rating */}
                <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between rounded-xl border border-white/20 bg-black/45 p-2.5 backdrop-blur-md sm:p-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0dce91] text-emerald-950 font-bold shadow-md">
                      <Sparkles size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-white sm:text-sm">
                        {heroImages[activeImage].label}
                      </p>
                      <div className="flex items-center gap-1 text-[10px] text-emerald-200">
                        <span className="text-amber-300">★★★★★</span>
                        <span>4.9 / 5.0 (10k+ Families)</span>
                      </div>
                    </div>
                  </div>

                  {/* Manual Arrow Controls */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handlePrev}
                      aria-label="Previous Image"
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-white transition-all hover:bg-white/30 active:scale-95"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={handleNext}
                      aria-label="Next Image"
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-white transition-all hover:bg-white/30 active:scale-95"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Slider Bottom Thumbnail Navigation Bar */}
              <div className="mt-3 flex items-center justify-center gap-2 px-2 pb-1">
                {heroImages.map((img, index) => {
                  const isActive = activeImage === index;
                  return (
                    <button
                      key={img.src}
                      onClick={() => setActiveImage(index)}
                      className={`relative flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-bold transition-all duration-300 ${isActive
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-700/20 dark:bg-[#0dce91] dark:text-emerald-950"
                        : "bg-black/5 text-[#54654f] hover:bg-black/10 dark:bg-white/5 dark:text-emerald-100/60 dark:hover:bg-white/10"
                        }`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      <span>{img.label}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>

        {/* =====================================================
            BOTTOM STATS BAR (LUXURY GLASS METRIC RIBBON)
        ====================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 overflow-hidden rounded-3xl border border-white/80 bg-white/80 p-5 shadow-xl shadow-emerald-950/5 backdrop-blur-xl transition-all duration-300 dark:border-white/10 dark:bg-white/[0.04] sm:mt-14 sm:p-6"
        >
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
            {statistics.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  whileHover={{ y: -2, scale: 1.02 }}
                  className={`group flex items-center gap-3.5 rounded-2xl p-2.5 transition-all duration-300 hover:bg-emerald-500/[0.06] dark:hover:bg-white/[0.04] ${index !== statistics.length - 1
                    ? "sm:border-r sm:border-black/5 sm:dark:border-white/10"
                    : ""
                    }`}
                >
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.color} text-white shadow-md shadow-emerald-900/10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}
                  >
                    <Icon size={20} strokeWidth={2.2} />
                  </div>

                  <div>
                    <span className="block text-2xl font-black leading-tight text-[#092d28] dark:text-white sm:text-3xl">
                      {stat.value}
                    </span>
                    <span className="block text-xs font-semibold text-[#66775f] dark:text-emerald-100/70 sm:text-sm">
                      {stat.label}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
