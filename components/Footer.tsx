"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, ChevronRight } from "lucide-react";
import { FaInstagram, FaFacebook, FaLinkedin, FaEnvelope } from "react-icons/fa";

export default function Footer() {
  const quickLinks = [
    {
      label: "About",
      href: "/About",
    },
    {
      label: "Privacy Policy",
      href: "/privacy-policy",
    },
    {
      label: "Terms and Conditions",
      href: "/terms-and-conditions",
    },
    {
      label: "Cancellation and Refund Policy",
      href: "/cancellation-and-refund-policy",
    },
  ];

  return (
    <footer className="w-full bg-[#123500] py-8 font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* =====================================================
            MAIN SECTION
        ====================================================== */}

        <div className="grid grid-cols-1 gap-8 border-b border-[#365A24]/70 pb-7 md:grid-cols-2 lg:grid-cols-12">
          {/* =====================================================
              LOGO & BRAND
          ====================================================== */}

          <div className="flex flex-col gap-3 lg:col-span-4">
            {/* Logo */}

            <div className="relative h-20 w-48">
              <Image
                src="/logo2.png"
                alt="Restore Health Services Logo"
                fill
                sizes="192px"
                className="object-contain object-left"
              />
            </div>

            {/* Description */}

            <p className="max-w-sm text-[13px] leading-relaxed text-[#DCE8D4]">
              Modern healthcare technology built for everyone — individuals,
              families, and enterprises across India.
            </p>

            {/* Social Icons */}

            <div className="mt-2 flex items-center gap-3">
              {/* Instagram */}

              <Link
                href="https://www.instagram.com/p/Db7esDQGGXp/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=="
                target="_blank"
                rel="noopener noreferrer"
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-[#365A24]
                  bg-transparent
                  text-[#DCE8D4]
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-[#D4A300]
                  hover:text-[#D4A300]
                "
                aria-label="Instagram"
              >
                <FaInstagram size={16} />
              </Link>

              {/* Facebook */}

              <Link
                href="https://www.facebook.com/share/p/1BzYDGgYBp/"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-[#365A24]
                  bg-transparent
                  text-[#DCE8D4]
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-[#D4A300]
                  hover:text-[#D4A300]
                "
                aria-label="Facebook"
              >
                <FaFacebook size={16} />
              </Link>
          {/* Email */}
              <Link
  href="mailto:support@restorehealthservices.in"
  className="
    flex
    h-9
    w-9
    items-center
    justify-center
    rounded-lg
    border
    border-[#365A24]
    bg-transparent
    text-[#DCE8D4]
    transition-all
    duration-300
    hover:-translate-y-1
    hover:border-[#D4A300]
    hover:text-[#D4A300]
  "
  aria-label="Email"
>
  <FaEnvelope size={16} />
</Link>

              {/* LinkedIn */}

              <Link
                href="https://www.linkedin.com/company/restore-health-services/about/?viewAsMember=true"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-[#365A24]
                  bg-transparent
                  text-[#DCE8D4]
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-[#D4A300]
                  hover:text-[#D4A300]
                "
                aria-label="LinkedIn"
              >
                <FaLinkedin size={16} />
              </Link>
            </div>
          </div>

          {/* =====================================================
              QUICK LINKS
          ====================================================== */}

          <div className="lg:col-span-3 lg:pl-5">
            <h4 className="mb-4 text-[12px] font-bold uppercase tracking-widest text-white">
              Quick Links
            </h4>

            <div className="flex flex-col gap-3">
              {quickLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="
                    group
                    flex
                    w-fit
                    items-center
                    gap-2
                    text-[13px]
                    font-medium
                    text-[#DCE8D4]
                    transition-all
                    duration-300
                    hover:translate-x-1
                    hover:text-[#D4A300]
                  "
                >
                  <ChevronRight
                    size={14}
                    className="
                      text-[#D4A300]
                      transition-transform
                      duration-300
                      group-hover:translate-x-1
                    "
                  />

                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* =====================================================
              REGISTERED OFFICE
          ====================================================== */}

          <div className="flex flex-col gap-2 md:col-span-2 lg:col-span-5">
            <h4 className="text-[12px] font-bold uppercase tracking-widest text-white">
              Registered Office
            </h4>

            <div className="mt-2 flex items-start gap-3">
              <div
                className="
                  mt-0.5
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  bg-[#1B4D03]
                  text-[#D4A300]
                "
              >
                <MapPin size={16} />
              </div>

              <div className="flex-1">
                <h5 className="text-[13px] font-bold leading-relaxed text-white">
                  RESTORE HEALTH SERVICES (OPC) PRIVATE LIMITED
                </h5>

                <p className="mt-1 text-[12px] leading-relaxed text-[#DCE8D4]">
                  Office No. G-0005, A-1, Ground Floor, Sector 59, Noida, Gautam
                  Buddha Nagar, Uttar Pradesh, 201301
                </p>

                <div className="mt-3 flex flex-col gap-1 text-[11px] font-medium text-[#AFC2A5]">
                  <span>GSTIN: 09AAQCR1885F1ZU</span>

                  <span>CIN: U86909UW2026OPC257013</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            MAP SECTION
        ====================================================== */}

        <div
          className="
            mt-6
            h-40
            w-full
            overflow-hidden
            rounded-xl
            border
            border-[#365A24]
          "
        >
          <iframe
            src="https://maps.google.com/maps?q=28%C2%B036'23.4%22N%2077%C2%B022'12.2%22E&t=&z=15&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Restore Health Registered Office"
            className="bg-[#123500]"
          />
        </div>

        {/* =====================================================
            BOTTOM SECTION
        ====================================================== */}

        <div className="flex flex-col items-center justify-center gap-2 pt-6 text-center">
          <p className="text-[12px] text-[#AFC2A5]">
            © 2026 Restore Health Services. All rights reserved.
          </p>

          <p className="text-[12px] text-[#AFC2A5]">
            Healthcare technology for modern India.
          </p>
        </div>
      </div>
    </footer>
  );
}
