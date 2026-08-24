"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import PrivacyPolicy from "@/components/Policy";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  Sparkles,
  Microscope,
  Clock,
  Video,
  Stethoscope,
  ShieldCheck,
  HeartPulse,
  Umbrella,
  BedDouble,
  Wallet,
  Activity,
  Home,
  FileHeart,
  Mail,
  Phone,
  MessageSquare,
  Send,
  Building2,
  Truck,
  Pill,
  Star,
  Zap,
  Check,
  Award,
  ExternalLink,
  BadgeCheck,
  Landmark,
  X,
  Eye,
} from "lucide-react";

interface SlideItem {
  src: string;
  title: string;
  subtitle: string;
}

interface CertificateItem {
  title: string;
  description: string;
  image: string;
  icon: typeof Building2;
}

const serviceSlidesMap: Record<string, SlideItem[]> = {
  "online-medicine": [
    {
      src: "/medicine.jpeg",
      title: "Doorstep Pharmacy Delivery",
      subtitle: "Verified Genuine Prescriptions & Health Essentials",
    },
    {
      src: "/Medicine2.jpeg",
      title: "Certified Pharmacist Check",
      subtitle: "Every Dosage Carefully Checked by Medical Experts",
    },
    {
      src: "/medicine3.webp",
      title: "Smart Prescription Tracking",
      subtitle: "Real-time Temperature & Transit Updates",
    },
  ],

  "blood-test": [
    {
      src: "/blod-test.webp",
      title: "NABL Certified Lab Diagnostics",
      subtitle: "Zero-Error Precision Diagnostic Testing",
    },
    {
      src: "/Bloodtest2.webp",
      title: "Hygienic Home Sample Draw",
      subtitle: "Safe & Painless Sample Collection by Phlebotomists",
    },
    {
      src: "/Bloodtest3.webp",
      title: "24-Hour Digital Smart Reports",
      subtitle: "Instant Access to Comprehensive Health Markers",
    },
  ],

  "online-doctor-consultation": [
    {
      src: "/online_consultation.webp",
      title: "Instant Video Consultations",
      subtitle: "Connect with Top Verified Specialists 24/7",
    },
    {
      src: "/Consultation2.webp",
      title: "20+ Medical Specialties",
      subtitle: "Cardiology, Dermatology, Pediatrics & General Care",
    },
    {
      src: "/consultation3.webp",
      title: "Instant Digital E-Prescriptions",
      subtitle: "Valid Prescriptions Sent Straight to Your WhatsApp & App",
    },
  ],

  "personal-accident-covered": [
    {
      src: "/accident.webp",
      title: "Emergency Trauma Coverage",
      subtitle: "Immediate Financial Protection When You Need It Most",
    },
    {
      src: "/Accident2.webp",
      title: "Cashless Network Hospitals",
      subtitle: "Access 5,000+ Top Partner Hospitals Nationwide",
    },
    {
      src: "/Accident3.webp",
      title: "High Sum Assured Protection",
      subtitle: "Covers Hospitalization, Disability & Recovery Needs",
    },
  ],

  hospicase: [
    {
      src: "/hospicash.webp",
      title: "Daily Hospital Cash Allowance",
      subtitle: "Fixed Daily Payout to Support Incidental Expenses",
    },
    {
      src: "/Hospicash2.webp",
      title: "Enhanced ICU Bonus Payout",
      subtitle: "Higher Daily Support During Critical ICU Admissions",
    },
    {
      src: "/hospicash3.webp",
      title: "Paperless Quick Claims",
      subtitle: "Fast Digital Approvals & Direct Bank Transfers",
    },
  ],

  "contact-us": [
    {
      src: "/contact.jpeg",
      title: "24/7 Dedicated Care Team",
      subtitle: "Speak Directly with Our Experienced Health Advisors",
    },
    {
      src: "/contact2.webp",
      title: "Personalized Health Support",
      subtitle: "Guidance on Tests, Plans & Healthcare Policies",
    },
    {
      src: "/Contact3.webp",
      title: "Fast WhatsApp Assistance",
      subtitle: "Chat with Medical Coordinators in Real-Time",
    },
  ],

  certificate: [
    {
      src: "/certificate/certificate1.webp",
      title: "MSME Registration Certificate",
      subtitle:
        "Official Government of India Udyam Registration for Restore Health Services.",
    },
    {
      src: "/certificate/certificate3.webp",
      title: "ISO 9001:2015 Certification",
      subtitle:
        "Quality Management System certification for healthcare and online doctor consultation services.",
    },
    {
      src: "/certificate/certificate2.webp",
      title: "Startup India Recognition",
      subtitle:
        "Official recognition certificate under the Government of India Startup India initiative.",
    },
  ],
  login: [
    {
      src: "/certificate/certificate1.webp",
      title: "MSME Registration Certificate",
      subtitle:
        "Official Government of India Udyam Registration for Restore Health Services.",
    },
    {
      src: "/certificate/certificate3.webp",
      title: "ISO 9001:2015 Certification",
      subtitle:
        "Quality Management System certification for healthcare and online doctor consultation services.",
    },
    {
      src: "/certificate/certificate2.webp",
      title: "Startup India Recognition",
      subtitle:
        "Official recognition certificate under the Government of India Startup India initiative.",
    },
  ],
};

const servicesData = {
  "online-medicine": {
    badge: "100% Genuine Medicines",
    title: "Doorstep Pharmacy & Essentials",
    description:
      "Order prescription drugs and wellness essentials with confidence. Fast, verified, and temperature-controlled delivery straight to your doorstep.",
    image: "/medicine.jpeg",
    features: [
      {
        icon: Pill,
        title: "Licensed Pharmacist Vetted",
        desc: "Every order is reviewed and verified by certified pharmacists before dispatch.",
      },
      {
        icon: Truck,
        title: "Express Doorstep Delivery",
        desc: "Get your vital prescriptions delivered within hours with real-time tracking.",
      },
      {
        icon: ShieldCheck,
        title: "Authentic & Tamper-Proof",
        desc: "Direct sourcing from accredited manufacturers in sealed, discrete packaging.",
      },
    ],
  },

  "blood-test": {
    badge: "NABL Certified Labs",
    title: "Comprehensive Blood Diagnostics",
    description:
      "Get accurate health insights with our precision blood tests. Fast, painless, and highly reliable diagnostics delivered straight to you.",
    image: "/blod-test.webp",
    features: [
      {
        icon: Home,
        title: "Home Sample Collection",
        desc: "Safe, hygienic blood draw right from your doorstep by trained phlebotomists.",
      },
      {
        icon: Clock,
        title: "24-Hour Digital Reports",
        desc: "Access your detailed, easy-to-understand test results via our secure portal within a day.",
      },
      {
        icon: Microscope,
        title: "Advanced Precision Tech",
        desc: "Samples are analyzed in state-of-the-art, certified facilities for zero-error reporting.",
      },
    ],
  },

  "online-doctor-consultation": {
    badge: "Available 24/7",
    title: "Digital Health Consultations",
    description:
      "Connect instantly with verified specialists. Experience premium healthcare guidance from the safety and comfort of your home.",
    image: "/online_consultation.jpeg",
    features: [
      {
        icon: Video,
        title: "HD Video Consults",
        desc: "Face-to-face interaction with doctors via our secure, high-definition video platform.",
      },
      {
        icon: Stethoscope,
        title: "Top-Tier Specialists",
        desc: "Consult with highly qualified doctors across 20+ specialized medical fields.",
      },
      {
        icon: FileHeart,
        title: "Instant E-Prescriptions",
        desc: "Get digital prescriptions and medical advice instantly on your phone after the call.",
      },
    ],
  },

  "personal-accident-covered": {
    badge: "Comprehensive Shield",
    title: "Personal Accident Protection",
    description:
      "Unpredictable life events require rock-solid backup. Secure your financial peace of mind with our robust accident coverage.",
    image: "/accident.webp",
    features: [
      {
        icon: ShieldCheck,
        title: "Instant Coverage",
        desc: "Your protective shield activates swiftly, ensuring zero waiting time for emergencies.",
      },
      {
        icon: HeartPulse,
        title: "Cashless Network",
        desc: "Access premium trauma care at our extensive network of top-rated partner hospitals.",
      },
      {
        icon: Umbrella,
        title: "High Sum Assured",
        desc: "Extensive financial backup that covers hospitalization, disability, and recovery costs.",
      },
    ],
  },

  hospicase: {
    badge: "Financial Comfort",
    title: "Hospicash Support System",
    description:
      "Focus purely on recovery. We provide a fixed daily allowance to cover incidental expenses during your hospital stay.",
    image: "/hospicash.webp",
    features: [
      {
        icon: Wallet,
        title: "Daily Cash Allowance",
        desc: "Receive a fixed amount per day of hospitalization, regardless of your actual hospital bill.",
      },
      {
        icon: BedDouble,
        title: "ICU Bonus Payouts",
        desc: "Enhanced daily cash limits when admitted to the ICU to support critical care needs.",
      },
      {
        icon: Activity,
        title: "Hassle-Free Claims",
        desc: "Minimal documentation required. No need to submit individual pharmacy or food bills.",
      },
    ],
  },

  "contact-us": {
    badge: "Get In Touch",
    title: "Let's Talk About Your Health",
    description:
      "Have questions about our health plans, diagnostics, or services? Our healthcare team is here to help you with the right information and support.",
    image: "/contact.jpeg",
    features: [
      {
        icon: Phone,
        title: "Talk To Our Team",
        desc: "Connect with our healthcare support team for quick assistance and guidance.",
      },
      {
        icon: Clock,
        title: "Quick Response",
        desc: "Our team will help you with your healthcare queries as quickly as possible.",
      },
      {
        icon: ShieldCheck,
        title: "Secure & Private",
        desc: "Your contact information and healthcare queries are handled securely.",
      },
    ],
  },

  certificate: {
    badge: "Official Company Credentials",
    title: "Our Certificates & Registrations",
    description:
      "We believe in complete transparency and trust. Explore our official company registrations, government recognitions and important business certificates.",
    image: "/certificate/certificate1.webp",
    features: [
      {
        icon: BadgeCheck,
        title: "Verified Business Credentials",
        desc: "Our important company registration and certification documents are available for viewing and verification.",
      },
      {
        icon: Landmark,
        title: "Official Recognition",
        desc: "Our registrations and certificates reflect our commitment to compliance and trusted business operations.",
      },
      {
        icon: ShieldCheck,
        title: "Transparent & Trusted",
        desc: "View our official credentials directly on our website with complete transparency.",
      },
    ],
  },
};

type ServiceKey = keyof typeof servicesData;

const certificates: CertificateItem[] = [
  {
    title: "MSME Registration Certificate",
    description:
      "Official Government of India Udyam Registration certificate for Restore Health Services (OPC) Private Limited.",
    image: "/certificate/certificate1.webp",
    icon: Building2,
  },
  {
    title: "ISO 9001:2015 Certificate",
    description:
      "Quality Management System certification for providing online doctor consultation and healthcare services.",
    image: "/certificate/certificate3.webp",
    icon: Award,
  },
  {
    title: "Startup India Recognition",
    description:
      "Official recognition certificate issued under the Government of India Startup India initiative.",
    image: "/certificate/certificate2.webp",
    icon: Sparkles,
  },
];

export default function ServiceDetailClient({ service }: { service: string }) {
  const serviceKey = (
    Object.keys(servicesData).includes(service) ? service : "online-medicine"
  ) as ServiceKey;

  const details = servicesData[serviceKey];

  const slides =
    serviceSlidesMap[serviceKey] || serviceSlidesMap["online-medicine"];

  const isContactPage = serviceKey === "contact-us";
  const isCertificatePage = serviceKey === "certificate";

  const showPrivacyPolicy = !isContactPage && !isCertificatePage;

  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  const [selectedCertificate, setSelectedCertificate] =
    useState<CertificateItem | null>(null);

  const [isHeroImageOpen, setIsHeroImageOpen] = useState(false);

  const nextSlide = useCallback(() => {
    setDirection("next");

    setActiveSlide((current) => {
      return (current + 1) % slides.length;
    });
  }, [slides.length]);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  useEffect(() => {
    setActiveSlide(0);
  }, [serviceKey]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedCertificate(null);
        setIsHeroImageOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const selectSlide = (index: number) => {
    if (index === activeSlide) return;

    setDirection(index > activeSlide ? "next" : "prev");
    setActiveSlide(index);
  };

  const handleContactSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const name = String(formData.get("name") || "");
    const phone = String(formData.get("phone") || "");
    const email = String(formData.get("email") || "");
    const message = String(formData.get("message") || "");

    const whatsappMessage = `
Hello Restore Health Services Team,

I would like to get in touch with your healthcare team.

Name: ${name}
Phone: ${phone}
Email: ${email}

Message:
${message}
    `.trim();

    const whatsappUrl =
      `https://wa.me/919289250468?text=` + encodeURIComponent(whatsappMessage);

    window.open(whatsappUrl, "_blank");
  };

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-[#fbfdfb] text-slate-900 dark:bg-[#07130e] dark:text-white">
      {/* ================= HERO ================= */}

      <div className="w-full py-0">
        <section className="relative w-full overflow-hidden border-y border-slate-200/80 bg-white/90 backdrop-blur-xl dark:border-[#1c3829] dark:bg-[#0c1f18]/90">
          <div className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:radial-gradient(#246b1c_1px,transparent_1px)] [background-size:24px_24px]" />

          <div className="relative z-10 grid w-full lg:grid-cols-12">
            {/* ================= LEFT HERO ================= */}

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.9,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative flex min-h-[560px] flex-col justify-start overflow-hidden px-6 pb-10 pt-10 text-slate-900 sm:px-10 sm:pb-12 sm:pt-12 lg:col-span-6 lg:min-h-[650px] lg:px-14 lg:pb-16 lg:pt-14 xl:px-20 xl:pb-20 xl:pt-16 2xl:px-28 2xl:pt-16"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#eef8eb] via-[#fffdf4] to-[#f7efd2] dark:from-[#0b2617] dark:via-[#102d1c] dark:to-[#2b2109]" />

              <motion.div
                animate={{
                  x: [0, 35, 0],
                  y: [0, -25, 0],
                  scale: [1, 1.12, 1],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-[#246b1c]/20 blur-3xl"
              />

              <motion.div
                animate={{
                  x: [0, -30, 0],
                  y: [0, 30, 0],
                  scale: [1, 1.15, 1],
                }}
                transition={{
                  duration: 9,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-[#c89416]/20 blur-3xl"
              />

              <div className="relative z-10 w-full">
                <motion.div
                  initial={{
                    opacity: 0,
                    y: -20,
                    scale: 0.9,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  transition={{
                    duration: 0.7,
                    delay: 0.15,
                  }}
                  className="flex flex-wrap items-center gap-3"
                >
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#246b1c]/25 bg-white/70 px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-[#246b1c] shadow-sm backdrop-blur-md dark:border-[#c89416]/30 dark:bg-[#102d21]/70 dark:text-[#c89416]">
                    <Sparkles size={14} className="text-[#c89416]" />
                    {details.badge}
                  </span>

                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
                    <Star size={13} className="fill-[#c89416] text-[#c89416]" />
                    4.9 / 5 Rated Service
                  </span>
                </motion.div>

                <motion.h1
                  initial={{
                    opacity: 0,
                    y: 35,
                    filter: "blur(8px)",
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                  }}
                  transition={{
                    duration: 0.9,
                    delay: 0.3,
                  }}
                  className="mt-6 max-w-2xl bg-gradient-to-r from-[#173f15] via-[#246b1c] to-[#9a6d00] bg-clip-text text-3xl font-extrabold leading-[1.1] tracking-tight text-transparent sm:text-4xl lg:text-5xl xl:text-6xl dark:from-white dark:via-[#dff0d8] dark:to-[#c89416]"
                >
                  {details.title}
                </motion.h1>

                <motion.p
                  initial={{
                    opacity: 0,
                    y: 25,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.8,
                    delay: 0.5,
                  }}
                  className="mt-5 max-w-2xl text-base leading-relaxed text-slate-700 sm:text-lg lg:text-xl dark:text-slate-300"
                >
                  {details.description}
                </motion.p>

                <div className="mt-7 flex items-center gap-2.5">
                  <div className="h-1.5 w-16 rounded-full bg-[#246b1c]" />
                  <div className="h-1.5 w-4 rounded-full bg-[#c89416]" />
                  <div className="h-1.5 w-1.5 rounded-full bg-[#173f15]/40" />
                </div>

                {!isCertificatePage && (
  <div className="mt-8 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
    {[
      {
        icon: Check,
        text: "Instant Verification",
        color: "green",
      },
      {
        icon: Zap,
        text: "Express Delivery & Response",
        color: "gold",
      },
      {
        icon: ShieldCheck,
        text: "100% Confidential & Safe",
        color: "green",
      },
      {
        icon: Clock,
        text: "24/7 Dedicated Support",
        color: "gold",
      },
    ].map((item) => {
      const Icon = item.icon;

      return (
        <motion.div
          key={item.text}
          whileHover={{ x: 7 }}
          className="group flex items-center gap-3 text-sm font-semibold text-slate-800 dark:text-slate-200"
        >
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full shadow-sm ${
              item.color === "green"
                ? "bg-[#246b1c]/10 text-[#246b1c]"
                : "bg-[#c89416]/10 text-[#9a6d00]"
            }`}
          >
            <Icon size={15} strokeWidth={3} />
          </span>

          <span>{item.text}</span>
        </motion.div>
      );
    })}
  </div>
)}

                {isContactPage && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 25,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.7,
                      delay: 1.4,
                    }}
                    className="mt-8 flex flex-col gap-3 sm:flex-row"
                  >
                    <a
                      href="https://wa.me/919289250468"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#173f15] via-[#246b1c] to-[#173f15] px-7 py-4 font-bold text-white shadow-lg"
                    >
                      <MessageSquare size={19} />
                      Connect on WhatsApp
                      <ArrowUpRight size={18} />
                    </a>

                    <a
                      href="tel:+919289250468"
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#246b1c]/20 bg-white/60 px-6 py-4 font-bold text-[#173f15] shadow-sm backdrop-blur-md dark:border-white/20 dark:bg-white/10 dark:text-white"
                    >
                      <Phone size={18} className="text-[#c89416]" />
                      +91 9289250468
                    </a>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* ================= RIGHT SLIDER ================= */}

            <motion.div
              initial={{
                opacity: 0,
                x: 30,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.7,
                delay: 0.1,
              }}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              className="flex min-h-[500px] items-center justify-center bg-gradient-to-b from-[#f3f9f4] to-[#f9f7ee] px-5 py-10 dark:from-[#0d261d] dark:to-[#081711] sm:px-10 lg:col-span-6 lg:min-h-[650px] lg:px-14 xl:px-20 2xl:px-28"
            >
              <div className="w-full max-w-2xl">
                <div className="relative">
                  <div className="absolute -inset-5 rounded-[34px] bg-gradient-to-tr from-[#246b1c]/20 via-[#c89416]/20 to-transparent blur-2xl" />

                  <button
                    type="button"
                    onClick={() => setIsHeroImageOpen(true)}
                    aria-label={`Open ${slides[activeSlide].title} image`}
                    className="group relative aspect-[4/3] w-full cursor-zoom-in overflow-hidden rounded-[28px] border border-[#246b1c]/15 bg-gradient-to-br from-[#eef8eb] via-[#fffdf4] to-[#f7efd2] text-left shadow-[0_25px_60px_rgba(23,63,21,0.20)] outline-none transition-all duration-500 hover:scale-[1.025] hover:shadow-[0_30px_75px_rgba(23,63,21,0.28)] focus-visible:ring-4 focus-visible:ring-[#c89416]/40 dark:border-[#c89416]/20"
                  >
                    <AnimatePresence initial={false} mode="sync">
                      <motion.div
                        key={activeSlide}
                        initial={{
                          opacity: 0,
                          x: direction === "next" ? 50 : -50,
                        }}
                        animate={{
                          opacity: 1,
                          x: 0,
                        }}
                        exit={{
                          opacity: 0,
                          x: direction === "next" ? -50 : 50,
                        }}
                        transition={{
                          duration: 0.95,
                        }}
                        className="absolute inset-0"
                      >
                        <Image
                          src={slides[activeSlide].src}
                          alt={slides[activeSlide].title}
                          fill
                          priority={activeSlide === 0}
                          className="object-contain transition-transform duration-500 group-hover:scale-[1.04]"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                        {/* TAG AND HIGHLIGHT REMOVED */}

                        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 lg:p-8">
                          <h3 className="text-xl font-extrabold text-white sm:text-2xl lg:text-3xl">
                            {slides[activeSlide].title}
                          </h3>

                          <p className="mt-2 max-w-xl text-xs text-white/80 sm:text-sm">
                            {slides[activeSlide].subtitle}
                          </p>
                        </div>
                      </motion.div>
                    </AnimatePresence>

                    <div className="absolute right-4 top-4 rounded-full border border-white/20 bg-black/50 px-3 py-1.5 text-[11px] font-bold text-white backdrop-blur-md">
                      {activeSlide + 1} / {slides.length}
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                      <motion.div
                        key={activeSlide}
                        initial={{ width: "0%" }}
                        animate={{
                          width: isPaused ? "0%" : "100%",
                        }}
                        transition={{
                          duration: 5,
                          ease: "linear",
                        }}
                        className="h-full bg-gradient-to-r from-[#246b1c] to-[#c89416]"
                      />
                    </div>
                  </button>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3 sm:gap-4">
                  {slides.slice(0, 3).map((slide, index) => {
                    const active = index === activeSlide;

                    return (
                      <button
                        key={slide.src}
                        type="button"
                        onClick={() => selectSlide(index)}
                        className={`group overflow-hidden rounded-2xl border text-left transition-all duration-300 ${
                          active
                            ? "border-[#c89416] bg-white shadow-lg ring-2 ring-[#c89416]/40 dark:bg-[#102d21]"
                            : "border-slate-200 bg-white/70 hover:-translate-y-1 hover:border-[#246b1c]/40 dark:border-slate-800 dark:bg-[#0c1f18]/70"
                        }`}
                      >
                        <div className="relative aspect-[16/10] overflow-hidden">
                          <Image
                            src={slide.src}
                            alt={slide.title}
                            fill
                            className={`object-cover transition-transform duration-700 ${
                              active ? "scale-105" : "group-hover:scale-105"
                            }`}
                            sizes="200px"
                          />

                          {active && (
                            <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#c89416] text-[#173f15]">
                              <Check size={11} strokeWidth={3} />
                            </span>
                          )}
                        </div>

                        <div className="p-2.5 sm:p-3">
                          <p
                            className={`truncate text-[11px] font-bold sm:text-xs ${
                              active
                                ? "text-[#173f15] dark:text-[#c89416]"
                                : "text-slate-700 dark:text-slate-300"
                            }`}
                          >
                            {slide.title}
                          </p>
                        </div>

                        {active && (
                          <div className="h-0.5 w-full bg-gradient-to-r from-[#246b1c] to-[#c89416]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      {/* ================= HERO IMAGE PREVIEW MODAL ================= */}

      <AnimatePresence>
        {isHeroImageOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-3 backdrop-blur-md sm:p-6"
            onClick={() => setIsHeroImageOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{
                duration: 0.35,
                ease: [0.22, 1, 0.36, 1],
              }}
              onClick={(event) => event.stopPropagation()}
              className="relative w-full max-w-6xl overflow-hidden rounded-[28px] border border-white/20 bg-white shadow-[0_30px_100px_rgba(0,0,0,0.55)] dark:bg-[#0c1f18]"
            >
              <button
                type="button"
                onClick={() => setIsHeroImageOpen(false)}
                aria-label="Close image preview"
                className="absolute right-3 top-3 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:rotate-90 hover:bg-[#246b1c] sm:right-5 sm:top-5"
              >
                <X size={22} />
              </button>

              <div className="relative h-[72vh] min-h-[360px] w-full bg-gradient-to-br from-[#eef8eb] via-[#fffdf4] to-[#f7efd2] dark:from-[#102d21] dark:via-[#0c1f18] dark:to-[#241d09]">
                <Image
                  src={slides[activeSlide].src}
                  alt={slides[activeSlide].title}
                  fill
                  priority
                  className="object-contain p-3 sm:p-5"
                  sizes="100vw"
                />
              </div>

              <div className="border-t border-slate-200 bg-white px-5 py-4 dark:border-[#1c3829] dark:bg-[#0c1f18] sm:px-7">
                <h3 className="text-base font-extrabold text-[#173f15] dark:text-white sm:text-xl">
                  {slides[activeSlide].title}
                </h3>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                  {slides[activeSlide].subtitle}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= PRIVACY POLICY ================= */}

      {showPrivacyPolicy && <PrivacyPolicy />}

      {/* ================= CONTACT FORM ================= */}

      {isContactPage && (
        <section className="w-full px-4 py-8 sm:px-6 sm:py-10 lg:px-10 xl:px-14">
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.6,
            }}
            className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-white p-7 shadow-[0_20px_60px_rgba(23,63,21,0.07)] dark:border-[#1c3829] dark:bg-[#0c1f18] sm:p-10 lg:p-14"
          >
            <div className="relative z-10">
              <div className="mx-auto max-w-2xl text-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#c89416]/30 bg-[#c89416]/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#9a6d00] dark:text-[#c89416]">
                  <MessageSquare size={14} />
                  Send Us A Direct Message
                </span>

                <h2 className="mt-4 text-3xl font-extrabold text-[#173f15] dark:text-white sm:text-4xl">
                  How Can We Assist Your Health Today?
                </h2>

                <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 sm:text-base">
                  Fill in your query below. Clicking submit connects you
                  directly to our healthcare coordinators on WhatsApp.
                </p>
              </div>

              <form
                onSubmit={handleContactSubmit}
                className="mx-auto mt-10 max-w-3xl space-y-6"
              >
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200"
                    >
                      Full Name
                    </label>

                    <div className="relative">
                      <Building2
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        id="name"
                        name="name"
                        required
                        type="text"
                        placeholder="Enter your full name"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-sm outline-none transition-all focus:border-[#246b1c] focus:bg-white focus:ring-4 focus:ring-[#246b1c]/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200"
                    >
                      Phone Number
                    </label>

                    <div className="relative">
                      <Phone
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        id="phone"
                        name="phone"
                        required
                        type="tel"
                        placeholder="Enter your phone number"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-sm outline-none transition-all focus:border-[#246b1c] focus:bg-white focus:ring-4 focus:ring-[#246b1c]/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200"
                  >
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="email"
                      name="email"
                      required
                      type="email"
                      placeholder="Enter your email address"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-sm outline-none transition-all focus:border-[#246b1c] focus:bg-white focus:ring-4 focus:ring-[#246b1c]/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200"
                  >
                    Your Message
                  </label>

                  <div className="relative">
                    <MessageSquare
                      size={18}
                      className="absolute left-4 top-4 text-slate-400"
                    />

                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      placeholder="Describe your healthcare inquiry..."
                      className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-sm outline-none transition-all focus:border-[#246b1c] focus:bg-white focus:ring-4 focus:ring-[#246b1c]/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="group inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-[#173f15] px-9 py-4 text-base font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#246b1c] sm:w-auto"
                  >
                    <Send
                      size={18}
                      className="transition-transform group-hover:translate-x-1"
                    />
                    Submit Query to WhatsApp
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </section>
      )}

      {/* ================= CERTIFICATES ================= */}

      {isCertificatePage && (
        <section className="w-full px-4 py-8 sm:px-6 sm:py-12 lg:px-10 xl:px-14">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <motion.span
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 rounded-full border border-[#c89416]/30 bg-[#c89416]/10 px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-[#9a6d00] dark:text-[#c89416]"
              >
                <Award size={14} />
                Official Credentials
              </motion.span>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mt-4 text-3xl font-extrabold text-[#173f15] dark:text-white sm:text-4xl lg:text-5xl"
              >
                Certificates You Can Verify
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-slate-500 dark:text-slate-400 sm:text-base"
              >
                Explore our official company registrations, business
                recognitions and important certificates. Click View Certificate
                to open the document directly on this page.
              </motion.p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {certificates.map((certificate, index) => {
                const CertificateIcon = certificate.icon;

                return (
                  <motion.div
                    key={certificate.title}
                    initial={{
                      opacity: 0,
                      y: 60,
                      scale: 0.95,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }}
                    viewport={{
                      once: true,
                      amount: 0.2,
                    }}
                    transition={{
                      duration: 0.65,
                      delay: index * 0.15,
                    }}
                    whileHover={{ y: -10 }}
                    className="group relative flex flex-col overflow-hidden rounded-[30px] border border-[#246b1c]/15 bg-white shadow-[0_18px_50px_rgba(23,63,21,0.08)] transition-all duration-500 hover:border-[#c89416]/60 hover:shadow-[0_25px_60px_rgba(23,63,21,0.16)] dark:border-[#2d5935] dark:bg-[#0c1f18]"
                  >
                    <div className="absolute left-0 right-0 top-0 z-10 h-1 bg-gradient-to-r from-[#246b1c] via-[#c89416] to-[#246b1c]" />

                    <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-[#eef8eb] via-[#fffdf4] to-[#f7efd2] dark:from-[#102d21] dark:via-[#0c1f18] dark:to-[#241d09]">
                      <Image
                        src={certificate.image}
                        alt={certificate.title}
                        fill
                        className="object-contain p-3 transition-transform duration-700 group-hover:scale-[1.03]"
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      />

                      <span className="absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-full bg-[#173f15] px-3 py-2 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-lg">
                        <CertificateIcon size={13} />
                        Verified Document
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#173f15] via-[#246b1c] to-[#c89416] text-white shadow-lg">
                          <CertificateIcon size={22} />
                        </div>

                        <div>
                          <h3 className="text-xl font-extrabold text-[#173f15] dark:text-white">
                            {certificate.title}
                          </h3>

                          <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                            {certificate.description}
                          </p>
                        </div>
                      </div>

                      <div className="mt-auto flex justify-center pt-7">
                        <button
                          type="button"
                          onClick={() => setSelectedCertificate(certificate)}
                          className="group/button inline-flex min-w-[190px] items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-[#173f15] via-[#246b1c] to-[#173f15] px-6 py-3.5 text-sm font-extrabold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(36,107,28,0.35)]"
                        >
                          <Eye
                            size={18}
                            className="transition-transform duration-300 group-hover/button:scale-110"
                          />
                          View Certificate
                          <ExternalLink
                            size={16}
                            className="transition-transform duration-300 group-hover/button:translate-x-1"
                          />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ================= CERTIFICATE MODAL ================= */}

      <AnimatePresence>
        {selectedCertificate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 p-3 backdrop-blur-md sm:p-6"
            onClick={() => setSelectedCertificate(null)}
          >
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9,
                y: 40,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
                y: 40,
              }}
              transition={{
                duration: 0.35,
                ease: [0.22, 1, 0.36, 1],
              }}
              onClick={(event) => event.stopPropagation()}
              className="relative flex max-h-[94vh] w-full max-w-6xl flex-col overflow-hidden rounded-[28px] border border-white/20 bg-white shadow-[0_30px_100px_rgba(0,0,0,0.5)] dark:bg-[#0c1f18]"
            >
              <div className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 py-4 dark:border-[#1c3829] dark:bg-[#0c1f18] sm:px-7">
                <div className="min-w-0">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#c89416] sm:text-xs">
                    Official Verified Document
                  </p>

                  <h3 className="mt-1 truncate text-base font-extrabold text-[#173f15] dark:text-white sm:text-xl">
                    {selectedCertificate.title}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedCertificate(null)}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 shadow-sm transition-all duration-300 hover:rotate-90 hover:bg-[#246b1c] hover:text-white dark:bg-white/10 dark:text-white"
                  aria-label="Close certificate"
                >
                  <X size={22} />
                </button>
              </div>

              <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-auto bg-gradient-to-br from-[#eef8eb] via-[#fffdf4] to-[#f7efd2] p-3 dark:from-[#102d21] dark:via-[#0c1f18] dark:to-[#241d09] sm:p-6 lg:p-8">
                <div className="relative h-[72vh] min-h-[400px] w-full">
                  <Image
                    src={selectedCertificate.image}
                    alt={selectedCertificate.title}
                    fill
                    className="object-contain"
                    sizes="100vw"
                    priority
                  />
                </div>
              </div>

              <div className="flex shrink-0 items-center justify-center border-t border-slate-200 bg-white px-5 py-3 dark:border-[#1c3829] dark:bg-[#0c1f18]">
                <span className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <BadgeCheck size={15} className="text-[#246b1c]" />
                  Verified company credential
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= KEY SERVICE FEATURES ================= */}

      <section className="w-full px-4 py-8 sm:px-6 sm:py-12 lg:px-10 xl:px-14">
        <div className="text-center">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#246b1c]/20 bg-[#246b1c]/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-[#173f15] dark:border-[#c89416]/30 dark:bg-[#c89416]/10 dark:text-[#c89416]"
          >
            <Sparkles size={13} />
            Key Service Features
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 text-2xl font-extrabold text-[#173f15] dark:text-white sm:text-3xl lg:text-4xl"
          >
            {isContactPage
              ? "Why Choose Restore Health Support?"
              : isCertificatePage
                ? "Why Trust Our Credentials?"
                : "Why Choose This Service?"}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400 sm:text-base"
          >
            {isCertificatePage
              ? "Built on transparency, verified credentials and trusted business recognition."
              : "Engineered for absolute accuracy, maximum safety, and compassionate care."}
          </motion.p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {details.features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{
                  opacity: 0,
                  y: 70,
                  scale: 0.92,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                viewport={{
                  once: true,
                  amount: 0.2,
                }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.18,
                }}
                whileHover={{
                  y: -12,
                  scale: 1.025,
                }}
                className="group relative overflow-hidden rounded-[30px] border border-[#246b1c]/20 bg-gradient-to-br from-[#f0f8ee] via-white to-[#fff8df] p-8 shadow-[0_15px_40px_rgba(23,63,21,0.08)] transition-shadow duration-500 hover:border-[#c89416]/60 hover:shadow-[0_25px_60px_rgba(23,63,21,0.20)] dark:border-[#2d5935] dark:from-[#102d21] dark:via-[#0c1f18] dark:to-[#241d09]"
              >
                <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-[#173f15] via-[#246b1c] to-[#c89416]" />

                <motion.div
                  whileHover={{
                    rotate: [0, -8, 8, -4, 4, 0],
                    scale: 1.12,
                  }}
                  transition={{
                    duration: 0.6,
                  }}
                  className="relative z-10 mb-7 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#173f15] via-[#246b1c] to-[#c89416] text-white shadow-[0_10px_25px_rgba(36,107,28,0.25)]"
                >
                  <Icon size={28} strokeWidth={2.2} />
                </motion.div>

                <div className="relative z-10">
                  <h3 className="mb-3 text-lg font-extrabold text-[#173f15] transition-colors duration-300 group-hover:text-[#246b1c] dark:text-white dark:group-hover:text-[#c89416] sm:text-xl">
                    {feature.title}
                  </h3>

                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {feature.desc}
                  </p>
                </div>

                <div className="relative z-10 mt-7 flex items-center gap-2">
                  <div className="h-1 w-16 rounded-full bg-[#246b1c]" />
                  <div className="h-1 w-5 rounded-full bg-[#c89416]" />
                  <div className="h-1 w-1 rounded-full bg-[#173f15]/40" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ================= BOTTOM CTA ================= */}

      <section className="w-full px-4 py-8 sm:px-6 sm:py-12 lg:px-10 xl:px-14">
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.98,
          }}
          whileInView={{
            opacity: 1,
            scale: 1,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.6,
          }}
          className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-[#173f15] via-[#1b4d19] to-[#0d261d] px-6 py-14 text-center sm:px-12 sm:py-20"
        >
          <div className="relative z-10 mx-auto max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-[#c89416] backdrop-blur-md">
              <HeartPulse size={14} />
              {isCertificatePage
                ? "Trust & Transparency"
                : "Your Trusted Health Ally"}
            </span>

            <h2 className="mt-5 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
              {isContactPage
                ? "Need Guidance on Your Health Plan?"
                : isCertificatePage
                  ? "Your Trust Is Our Strongest Certificate"
                  : `Ready to Activate Your ${
                      details.title.split(" ")[0]
                    } Service?`}
            </h2>

            <p className="mt-4 text-base text-[#e6efd1] sm:text-lg">
              {isContactPage
                ? "Reach out to our specialist advisors and let us customize the ideal healthcare plan for you."
                : isCertificatePage
                  ? "We believe in maintaining transparency through accessible company credentials and verified official documentation."
                  : "Join thousands of satisfied patients across the country who trust Restore Health Services every day."}
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="https://wa.me/919289250468"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 rounded-full bg-[#c89416] px-8 py-4 text-base font-extrabold text-[#173f15] shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#dfa71b]"
              >
                <MessageSquare size={20} />
                Chat With Us On WhatsApp
                <ArrowUpRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </a>

              <Link
                href="/#home"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-7 py-4 text-base font-bold text-white backdrop-blur-md transition-all hover:bg-white/20"
              >
                Explore All Services
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
