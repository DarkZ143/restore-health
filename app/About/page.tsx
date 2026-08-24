/* eslint-disable react-hooks/refs */
"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  HeartPulse,
  ShieldCheck,
  Users,
  Stethoscope,
  Activity,
  Target,
  Eye,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

/* ============================================================
   SCROLL REVEAL HOOK
============================================================ */

function useReveal(direction: "left" | "right" | "up" = "up") {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(element);
        }
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -60px 0px",
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const directionClass = {
    left: "translate-x-[-70px]",
    right: "translate-x-[70px]",
    up: "translate-y-[60px]",
  }[direction];

  return {
    ref,
    className: `
      transform
      transition-all
      duration-1000
      ease-[cubic-bezier(0.22,1,0.36,1)]
      ${
        visible
          ? "translate-x-0 translate-y-0 opacity-100"
          : `${directionClass} opacity-0`
      }
    `,
  };
}

/* ============================================================
   ANIMATED HEART RATE
============================================================ */

function HeartRateLine({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative h-14 w-64 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 320 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        <path
          d="
            M0 30
            H35
            L45 30
            L53 17
            L62 43
            L72 26
            L82 34
            H108
            L118 30
            H135
            L145 8
            L157 51
            L169 25
            L179 34
            H204
            L215 30
            H230
            L240 16
            L249 44
            L260 27
            L270 34
            H320
          "
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="ecg-line"
        />
      </svg>

      {/* Gradient fades for smooth edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-linear-to-r from-white to-transparent dark:from-slate-950" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-linear-to-l from-white to-transparent dark:from-slate-950" />
    </div>
  );
}

/* ============================================================
   MAIN PAGE
============================================================ */

export default function AboutUsPage() {
  const introText = useReveal("left");
  const introImage = useReveal("right");

  const missionText = useReveal("left");
  const missionImage = useReveal("right");

  const visionText = useReveal("right");
  const visionImage = useReveal("left");

  const values = useReveal("up");
  const services = useReveal("up");
  const cta = useReveal("up");

  const valuesData = [
    {
      icon: HeartPulse,
      title: "Patient First",
      description:
        "Every experience starts with understanding the person behind the healthcare need.",
    },
    {
      icon: ShieldCheck,
      title: "Trust & Security",
      description:
        "We believe healthcare information deserves transparency, privacy and responsible handling.",
    },
    {
      icon: Users,
      title: "Connected Care",
      description:
        "We bring people, healthcare providers and services together through one connected platform.",
    },
    {
      icon: Sparkles,
      title: "Better Experience",
      description:
        "Technology should make healthcare simpler, clearer and easier to access.",
    },
  ];

  const servicesData = [
    {
      icon: Stethoscope,
      title: "Doctor Consultation",
      description:
        "Discover and connect with healthcare professionals for your consultation needs.",
    },
    {
      icon: Activity,
      title: "Diagnostics",
      description:
        "Access diagnostic services and manage your healthcare journey more conveniently.",
    },
    {
      icon: HeartPulse,
      title: "Wellness & Preventive Care",
      description:
        "Take a proactive approach to your health with wellness and preventive healthcare services.",
    },
    {
      icon: ShieldCheck,
      title: "Health Support",
      description:
        "Get support throughout your healthcare journey instead of navigating everything alone.",
    },
  ];

  return (
    <main className="w-full overflow-hidden bg-white text-slate-900 transition-colors duration-500 dark:bg-slate-950 dark:text-white">
      {/* ======================================================
          HERO / PAGE INTRO
      ======================================================= */}

      <section className="relative px-5 pb-20 pt-28 sm:px-8 sm:pb-24 sm:pt-32 lg:px-12 lg:pt-36">
        {/* Soft background decoration */}
        <div className="pointer-events-none absolute left-1/2 top-24 h-96 w-96 -translate-x-1/2 rounded-full bg-[#16a34a]/10 blur-3xl dark:bg-[#085433]/20" />

        <div className="relative mx-auto max-w-7xl">
          {/* Breadcrumb */}
          <div className="mb-7 text-center">
            <span className="text-[13px] font-medium text-slate-500 dark:text-slate-400">
              Home
              <span className="mx-2 text-[#ca8a04]">›</span>
              About Us
            </span>
          </div>

          {/* Heading */}
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#16a34a]/20 bg-[#16a34a]/5 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#085433] dark:border-[#ca8a04]/20 dark:bg-[#ca8a04]/10 dark:text-[#ca8a04]">
              <HeartPulse size={14} />
              About RestoreHealth
            </span>

            <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-extrabold leading-[1.05] tracking-[-0.04em] text-[#085433] sm:text-5xl md:text-6xl lg:text-7xl dark:text-white">
              Healthcare That Puts
              <br />
              <span className="text-[#ca8a04]">People First.</span>
            </h1>

            <div className="mt-7 flex justify-center">
              <HeartRateLine className="text-[#16a34a]" />
            </div>

            <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-7 text-slate-600 sm:text-base dark:text-slate-300">
              RestoreHealth is built to make healthcare simpler, more connected
              and easier to navigate — bringing essential healthcare experiences
              together in one place.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================
          INTRO / DIGITAL HEALTHCARE
      ======================================================= */}

      <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div ref={introText.ref} className={introText.className.trim()}>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#ca8a04]">
              Who We Are
            </span>

            <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl text-[#085433] dark:text-white">
              We Are RestoreHealth,
              <br />
              Your <span className="text-[#16a34a]">Healthcare Companion.</span>
            </h2>

            <div className="my-7">
              <HeartRateLine className="text-[#ca8a04]" />
            </div>

            <p className="text-[15px] leading-8 text-slate-600 dark:text-slate-300">
              Healthcare can often feel fragmented. Finding the right doctor,
              understanding available services, arranging diagnostics and
              keeping track of your health journey can become overwhelming.
            </p>

            <p className="mt-5 text-[15px] leading-8 text-slate-600 dark:text-slate-300">
              RestoreHealth brings these experiences closer together. Our goal
              is to create a digital healthcare ecosystem where people can
              discover, access and manage healthcare services with greater
              confidence and convenience.
            </p>

            <a
              href="/services/contact-us"
              className="
                group
                mt-8
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-[#ca8a04]
                px-7
                py-3.5
                text-[14px]
                font-bold
                text-white
                shadow-lg
                shadow-[#ca8a04]/20
                transition-all
                duration-300
                hover:-translate-y-1
                hover:bg-[#b47803]
              "
            >
              Connect With Us
              <ArrowRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </a>
          </div>

          <div ref={introImage.ref} className={introImage.className}>
            <div className="relative mx-auto aspect-square w-full max-w-xl overflow-hidden rounded-4xl bg-[#16a34a]/5 dark:bg-[#085433]/10">
              <div className="absolute inset-0 bg-linear-to-br from-[#16a34a]/10 via-transparent to-[#085433]/10 dark:from-[#16a34a]/20 dark:to-transparent" />

              <Image
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1400&q=85"
                alt="RestoreHealth digital healthcare application"
                fill
                sizes="(max-width: 1024px) 90vw, 520px"
                className="relative z-10 object-cover object-center"
              />

              <div className="absolute bottom-5 left-5 z-20 rounded-2xl border border-white/70 bg-white/85 px-5 py-3 shadow-xl backdrop-blur-md dark:border-slate-700/50 dark:bg-slate-900/90">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#16a34a]/10 text-[#16a34a] dark:bg-emerald-500/10 dark:text-emerald-400">
                    <HeartPulse size={20} />
                  </div>

                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Healthcare
                    </p>
                    <p className="text-sm font-bold text-[#085433] dark:text-white">
                      Connected. Simplified.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          MISSION
      ======================================================= */}

      <section className="bg-slate-50 px-5 py-20 sm:px-8 sm:py-28 lg:px-12 dark:bg-slate-900/50">
        <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2 lg:gap-24">
          <div ref={missionText.ref} className={missionText.className}>
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#085433]/10 text-[#085433] dark:bg-[#ca8a04]/10 dark:text-[#ca8a04]">
              <Target size={25} />
            </div>

            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#ca8a04]">
              Our Mission
            </span>

            <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl text-[#085433] dark:text-white">
              Making Healthcare
              <br />
              <span className="text-[#16a34a] dark:text-[#ca8a04]">
                Easier To Access.
              </span>
            </h2>

            <p className="mt-6 max-w-xl text-[15px] leading-8 text-slate-600 dark:text-slate-300">
              Our mission is to simplify the healthcare journey by connecting
              people with the services, professionals and information they need
              — through a technology-first experience designed around real human
              needs.
            </p>

            <div className="mt-7 flex flex-col gap-3">
              {[
                "Simplify healthcare discovery",
                "Connect people with trusted care",
                "Create a more convenient healthcare experience",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 text-[14px] font-medium text-slate-800 dark:text-slate-200"
                >
                  <CheckCircle2 size={18} className="shrink-0 text-[#16a34a]" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div ref={missionImage.ref} className={missionImage.className}>
            <div className="relative mx-auto aspect-4/3 max-w-xl overflow-hidden rounded-4xl bg-[#16a34a]/10 dark:bg-[#085433]/20">
              <Image
                src="https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1400&q=85"
                alt="Healthcare professional"
                fill
                sizes="(max-width: 1024px) 90vw, 560px"
                className="object-cover object-center"
              />

              <div className="absolute bottom-5 left-5 rounded-2xl border border-white/50 bg-white/90 px-5 py-4 shadow-xl backdrop-blur-md dark:border-slate-700/50 dark:bg-slate-900/90">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Our Focus
                </p>
                <p className="mt-1 text-sm font-bold text-[#085433] dark:text-white">
                  People. Care. Connection.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          VISION
      ======================================================= */}

      <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2 lg:gap-24">
          <div
            ref={visionImage.ref}
            className={`order-2 lg:order-1 ${visionImage.className}`}
          >
            <div className="relative mx-auto aspect-4/3 max-w-xl overflow-hidden rounded-4xl bg-[#16a34a]/5 p-5 dark:bg-[#085433]/10">
              <div className="absolute inset-0 bg-linear-to-br from-[#16a34a]/5 to-transparent dark:from-[#085433]/20 dark:to-transparent" />

              <div className="relative z-10 flex h-full items-center justify-center">
                <div className="relative flex h-56 w-56 items-center justify-center rounded-full border border-[#16a34a]/20 bg-white/70 shadow-2xl backdrop-blur-md sm:h-64 sm:w-64 dark:border-[#085433]/50 dark:bg-slate-900/70">
                  <div className="absolute inset-7 rounded-full border border-dashed border-[#ca8a04]/40" />

                  <div className="flex flex-col items-center text-center">
                    <HeartPulse
                      size={45}
                      strokeWidth={1.7}
                      className="text-[#16a34a] dark:text-emerald-400"
                    />

                    <span className="mt-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#ca8a04]">
                      Restore
                    </span>

                    <span className="mt-1 text-lg font-extrabold text-[#085433] dark:text-white">
                      Better Health
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            ref={visionText.ref}
            className={`order-1 lg:order-2 ${visionText.className}`}
          >
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ca8a04]/10 text-[#ca8a04]">
              <Eye size={25} />
            </div>

            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#ca8a04]">
              Our Vision
            </span>

            <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl text-[#085433] dark:text-white">
              A Healthier Future,
              <br />
              <span className="text-[#16a34a] dark:text-[#ca8a04]">
                Connected By Technology.
              </span>
            </h2>

            <p className="mt-6 text-[15px] leading-8 text-slate-600 dark:text-slate-300">
              We envision a healthcare experience where technology does not make
              people feel further away from care — it brings them closer to it.
            </p>

            <p className="mt-5 text-[15px] leading-8 text-slate-600 dark:text-slate-300">
              RestoreHealth aims to build a connected ecosystem that makes
              healthcare more understandable, accessible and convenient for
              individuals and families.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================
          VALUES
      ======================================================= */}

      <section className="bg-slate-50 px-5 py-20 sm:px-8 sm:py-28 lg:px-12 dark:bg-slate-900/50">
        <div
          ref={values.ref}
          className={`mx-auto max-w-6xl ${values.className}`}
        >
          <div className="text-center">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#ca8a04]">
              What Guides Us
            </span>

            <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl text-[#085433] dark:text-white">
              Our Values
            </h2>

            <div className="mt-5 flex justify-center">
              <HeartRateLine className="text-[#16a34a]" />
            </div>

            <p className="mx-auto mt-2 max-w-2xl text-[15px] leading-7 text-slate-600 dark:text-slate-300">
              The principles behind how we think about healthcare, technology
              and the people we serve.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {valuesData.map((value, index) => {
              const Icon = value.icon;

              return (
                <div
                  key={value.title}
                  className="group rounded-3xl border border-slate-200 bg-white p-7 transition-all duration-300 hover:-translate-y-2 hover:border-[#ca8a04]/40 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-amber-500/40"
                  style={{
                    transitionDelay: `${index * 100}ms`,
                  }}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#16a34a]/10 text-[#16a34a] transition-colors duration-300 group-hover:bg-[#16a34a] group-hover:text-white dark:bg-emerald-500/10 dark:text-emerald-400 dark:group-hover:bg-emerald-500 dark:group-hover:text-slate-900">
                    <Icon size={22} />
                  </div>

                  <h3 className="mt-6 text-lg font-bold text-[#085433] dark:text-white">
                    {value.title}
                  </h3>

                  <p className="mt-3 text-[14px] leading-6 text-slate-500 dark:text-slate-400">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ======================================================
          HEALTHCARE SERVICES
      ======================================================= */}

      <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div
          ref={services.ref}
          className={`mx-auto max-w-6xl ${services.className}`}
        >
          <div className="max-w-2xl">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#ca8a04]">
              What We Connect
            </span>

            <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl text-[#085433] dark:text-white">
              Healthcare,
              <br />
              <span className="text-[#16a34a] dark:text-[#ca8a04]">
                All In One Journey.
              </span>
            </h2>

            <p className="mt-5 text-[15px] leading-7 text-slate-600 dark:text-slate-300">
              RestoreHealth is designed around the complete healthcare journey
              rather than isolated services.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {servicesData.map((service, index) => {
              const Icon = service.icon;

              return (
                <div
                  key={service.title}
                  className="
                    group
                    rounded-3xl
                    border
                    border-slate-200
                    bg-white
                    p-7
                    transition-all
                    duration-300
                    hover:-translate-y-2
                    hover:border-[#16a34a]/30
                    hover:shadow-xl
                    dark:border-slate-800
                    dark:bg-slate-900
                    dark:hover:border-emerald-500/30
                  "
                  style={{
                    transitionDelay: `${index * 100}ms`,
                  }}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#085433]/5 text-[#085433] transition-all duration-300 group-hover:bg-[#085433] group-hover:text-white dark:bg-emerald-500/10 dark:text-emerald-400 dark:group-hover:bg-emerald-500 dark:group-hover:text-slate-900">
                    <Icon size={22} />
                  </div>

                  <h3 className="mt-6 text-[17px] font-bold text-[#085433] dark:text-white">
                    {service.title}
                  </h3>

                  <p className="mt-3 text-[14px] leading-6 text-slate-500 dark:text-slate-400">
                    {service.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ======================================================
          FINAL CTA
      ======================================================= */}

      <section className="px-5 pb-20 sm:px-8 sm:pb-28 lg:px-12">
        <div ref={cta.ref} className={`mx-auto max-w-6xl ${cta.className}`}>
          <div className="relative overflow-hidden rounded-4xl bg-[#085433] px-7 py-12 text-white sm:px-12 sm:py-14 lg:px-16">
            {/* Decorative circles */}
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#16a34a]/30 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-32 left-20 h-72 w-72 rounded-full bg-[#ca8a04]/20 blur-3xl" />

            <div className="relative z-10 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#ca8a04]">
                  Your Health Journey
                </span>

                <h2 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">
                  Let&apos;s Build A Better
                  <br />
                  Healthcare Experience Together.
                </h2>

                <p className="mt-4 max-w-xl text-[14px] leading-7 text-emerald-50">
                  Discover a simpler way to connect with healthcare through
                  RestoreHealth.
                </p>

                <div className="mt-5">
                  <HeartRateLine className="text-[#ca8a04]" />
                </div>
              </div>

              <a
                href="/services/contact-us"
                className="
                  group
                  inline-flex
                  shrink-0
                  items-center
                  gap-2
                  rounded-full
                  bg-[#ca8a04]
                  px-7
                  py-3.5
                  text-[14px]
                  font-bold
                  text-white
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:bg-[#b47803]
                  shadow-lg
                  shadow-[#ca8a04]/20
                "
              >
                Get In Touch
                <ArrowRight
                  size={17}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          PAGE ANIMATIONS (Fixed from <style jsx>)
      ======================================================= */}

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .ecg-line {
          stroke-dasharray: 520;
          stroke-dashoffset: 520;
          animation: ecgDraw 2.8s linear infinite;
          filter: drop-shadow(0 0 4px currentColor);
        }

        @keyframes ecgDraw {
          0% {
            stroke-dashoffset: 520;
          }
          45% {
            stroke-dashoffset: 0;
          }
          70% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: -520;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ecg-line {
            animation: none;
            stroke-dashoffset: 0;
          }
        }
      `,
        }}
      />
    </main>
  );
}
