/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Menu, X, Moon, Sun, CircleUserRound } from "lucide-react";

import { useTheme } from "../app/providers/ThemeProvider";

// =====================================================
// NAVIGATION ITEMS
// =====================================================

const navItems = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Blood Test",
    href: "/services/blood-test",
  },
  {
    label: "Hospicash",
    href: "/services/hospicase",
  },
  {
    label: "Online Medicine",
    href: "/services/online-medicine",
  },
  {
    label: "Online Doctor Consultation",
    href: "/services/online-doctor-consultation",
  },
  {
    label: "Personal Accident Covered",
    href: "/services/personal-accident-covered",
  },
  {
    label: "Certification",
    href: "/services/certificate",
  },
  {
    label: "Contact Us",
    href: "/services/contact-us",
  },
  {
    label: "Login",
    href: "/auth/login",
  },
];

// =====================================================
// NAVBAR COMPONENT
// =====================================================

export default function Navbar() {
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { theme, toggleTheme } = useTheme();

  const darkMode = theme === "dark";

  // =====================================================
  // HYDRATION FIX
  // =====================================================

  useEffect(() => {
    setMounted(true);
  }, []);

  // =====================================================
  // ACTIVE PAGE CHECK
  // =====================================================

  const isActivePage = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  };

  // =====================================================
  // PREVENT BODY SCROLL WHEN MOBILE MENU OPEN
  // =====================================================

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // =====================================================
  // CLOSE MOBILE DRAWER ON DESKTOP
  // =====================================================

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // =====================================================
  // CLOSE MOBILE MENU
  // =====================================================

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  return (
    <>
      {/* =================================================
          HEADER
      ================================================= */}

      <header
        className="
          sticky
          top-0
          z-50
          w-full
          border-b
          border-[#E5E7EB]
          bg-white
          shadow-[0_2px_12px_rgba(0,0,0,0.04)]
          transition-all
          duration-300
          dark:border-[#27303D]
          dark:bg-[#111827]
        "
      >
        {/* =================================================
            MAIN NAVBAR
        ================================================= */}

        <div
          className="
            mx-auto
            flex
            h-27
            w-full
            max-w-[1920px]
            items-center
            px-4

            sm:h-28.5
            sm:px-6

            lg:h-30
            lg:px-5

            xl:h-31
            xl:px-8

            2xl:h-33
            2xl:px-12
          "
        >
          {/* ===============================================
              LOGO AREA
          =============================================== */}

          <div
            className="
              flex
              h-full
              shrink-0
              flex-col
              items-center
              justify-center
              pb-3
              pt-2

              lg:w-38.75
              xl:w-47.5
              2xl:w-60
            "
          >
            <Image
              src="/logo2.png"
              alt="Restore Health Services Logo"
              width={280}
              height={104}
              priority
              className="
                h-14
                w-auto
                object-contain

                sm:h-15.5
                lg:h-14.5
                xl:h-16.5
                2xl:h-19.5
              "
            />

            <p
              className="
                mt-2
                whitespace-nowrap
                text-center
                text-[10px]
                font-bold
                leading-tight
                tracking-wide
                text-[#1B4D03]

                sm:text-[11px]
                lg:text-[9px]
                xl:text-[11px]
                2xl:text-sm

                dark:text-[#D4A300]
              "
            >
              Restore Health Services (OPC) Pvt.Ltd.
            </p>
          </div>

          {/* ===============================================
              DESKTOP NAVIGATION
          =============================================== */}

          <nav
            className="
              ml-6
              hidden
              min-w-0
              flex-1
              items-center

              lg:flex
              xl:ml-8
              2xl:ml-10
            "
          >
            {/* =============================================
                DESKTOP NAV LINKS
            ============================================= */}

            <div
              className="
                flex
                min-w-0
                flex-1
                items-center
                justify-between
              "
            >
              {navItems.map((item) => {
                const active = isActivePage(item.href);
                const isLogin = item.label === "Login";

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    aria-label={isLogin ? "Login / Profile" : item.label}
                    title={isLogin ? "Login" : undefined}
                    className={`
                      group
                      relative
                      shrink-0
                      whitespace-nowrap
                      text-center
                      transition-all
                      duration-300

                      ${
                        isLogin
                          ? `
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-full
                          `
                          : `
                            lg:text-[13px]
                            xl:text-[14px]
                            2xl:text-[16px]
                          `
                      }

                      ${
                        active
                          ? `
                            font-bold
                            text-[#1B4D03]
                            dark:text-[#D4A300]
                          `
                          : `
                            font-semibold
                            text-[#1B4D03]
                            hover:text-[#B88600]
                            dark:text-gray-200
                            dark:hover:text-[#D4A300]
                          `
                      }

                      ${
                        isLogin
                          ? `
                            border
                            border-[#D8E6CC]
                            bg-[#F4F9F0]
                            hover:scale-105
                            hover:border-[#B88600]
                            hover:bg-[#EAF3E4]
                            hover:text-[#B88600]

                            dark:border-[#36574F]
                            dark:bg-[#182C28]
                            dark:text-[#D4A300]
                          `
                          : ""
                      }
                    `}
                  >
                    {/* =====================================
                        LOGIN = PROFILE ICON
                    ===================================== */}

                    {isLogin ? (
                      <CircleUserRound
                        size={25}
                        strokeWidth={2.1}
                        aria-hidden="true"
                      />
                    ) : (
                      item.label
                    )}

                    {/* =====================================
                        NORMAL LINK ACTIVE / HOVER LINE
                    ===================================== */}

                    {!isLogin && (
                      <span
                        className={`
                          absolute
                          left-1/2
                          -bottom-4.5
                          h-0.75
                          -translate-x-1/2
                          rounded-full

                          bg-linear-to-r
                          from-[#1B4D03]
                          via-[#246B1C]
                          to-[#B88600]

                          transition-all
                          duration-300
                          ease-out

                          ${
                            active
                              ? "w-full opacity-100"
                              : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
                          }
                        `}
                      />
                    )}

                    {/* =====================================
                        PROFILE ACTIVE RING
                    ===================================== */}

                    {isLogin && active && (
                      <span
                        className="
                          pointer-events-none
                          absolute
                          inset-0
                          rounded-full
                          ring-2
                          ring-[#B88600]
                          ring-offset-2
                          ring-offset-white

                          dark:ring-offset-[#111827]
                        "
                      />
                    )}

                    {/* =====================================
                        NORMAL LINK ACTIVE DOT
                    ===================================== */}

                    {!isLogin && active && (
                      <span
                        className="
                          absolute
                          left-1/2
                          -bottom-5.75
                          h-1
                          w-1
                          -translate-x-1/2
                          rounded-full
                          bg-[#B88600]
                          shadow-[0_0_8px_rgba(184,134,0,0.65)]
                        "
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* =============================================
                DESKTOP THEME AREA
            ============================================= */}

            <div
              className="
                ml-4
                flex
                shrink-0
                items-center

                xl:ml-5
              "
            >
              {/* SEPARATOR */}

              <div
                className="
                  mr-4
                  h-8
                  w-px
                  bg-[#E3E7EB]

                  dark:bg-[#374151]
                "
              />

              {/* THEME BUTTON */}

              {mounted && (
                <button
                  type="button"
                  onClick={toggleTheme}
                  aria-label={
                    darkMode ? "Switch to light mode" : "Switch to dark mode"
                  }
                  className="
                    relative
                    flex
                    h-8
                    w-14.5
                    shrink-0
                    items-center
                    rounded-full
                    border
                    border-[#D8E6CC]
                    bg-[#F4F9F0]
                    p-1

                    transition-all
                    duration-300

                    xl:w-16

                    dark:border-[#36574F]
                    dark:bg-[#182C28]
                  "
                >
                  <span
                    className={`
                      flex
                      h-6
                      w-6
                      items-center
                      justify-center
                      rounded-full
                      bg-white
                      text-[#1B4D03]
                      shadow-md

                      transition-transform
                      duration-300

                      dark:bg-[#253C37]
                      dark:text-[#D4A300]

                      ${
                        darkMode
                          ? "translate-x-6.5 xl:translate-x-8"
                          : "translate-x-0"
                      }
                    `}
                  >
                    {darkMode ? (
                      <Moon size={14} strokeWidth={2.5} />
                    ) : (
                      <Sun size={14} strokeWidth={2.5} />
                    )}
                  </span>
                </button>
              )}
            </div>
          </nav>

          {/* ===============================================
              MOBILE / TABLET CONTROLS
              BELOW 1024px
          =============================================== */}

          <div
            className="
              ml-auto
              flex
              shrink-0
              items-center
              gap-3

              lg:hidden
            "
          >
            {/* =============================================
                MOBILE PROFILE / LOGIN BUTTON
            ============================================= */}

            <Link
              href="/services/login"
              aria-label="Login / Profile"
              title="Login"
              onClick={closeMobileMenu}
              className={`
                relative
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                border

                transition-all
                duration-200

                hover:scale-105

                ${
                  isActivePage("/services/login")
                    ? `
                      border-[#B88600]
                      bg-[#1B4D03]
                      text-white
                      shadow-[0_0_12px_rgba(184,134,0,0.25)]

                      dark:bg-[#D4A300]
                      dark:text-[#111827]
                    `
                    : `
                      border-[#D8E6CC]
                      bg-[#F4F9F0]
                      text-[#1B4D03]

                      hover:border-[#B88600]
                      hover:bg-[#EAF3E4]
                      hover:text-[#B88600]

                      dark:border-[#36574F]
                      dark:bg-[#182C28]
                      dark:text-[#D4A300]
                    `
                }
              `}
            >
              <CircleUserRound size={24} strokeWidth={2.1} />
            </Link>

            {/* =============================================
                MOBILE THEME BUTTON
            ============================================= */}

            {mounted && (
              <button
                type="button"
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#D8E6CC]
                  bg-[#F4F9F0]
                  text-[#1B4D03]

                  transition-all
                  duration-200

                  hover:scale-105
                  hover:border-[#B88600]

                  dark:border-[#36574F]
                  dark:bg-[#182C28]
                  dark:text-[#D4A300]
                "
              >
                {darkMode ? <Moon size={18} /> : <Sun size={18} />}
              </button>
            )}

            {/* =============================================
                HAMBURGER
            ============================================= */}

            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label={
                mobileOpen ? "Close navigation menu" : "Open navigation menu"
              }
              aria-expanded={mobileOpen}
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-[#F4F9F0]
                text-[#1B4D03]

                transition-all
                duration-200

                hover:scale-105
                hover:bg-[#EAF3E4]

                dark:bg-[#12382F]
                dark:text-[#D4A300]
              "
            >
              {mobileOpen ? <X size={23} /> : <Menu size={23} />}
            </button>
          </div>
        </div>

        {/* =================================================
            MOBILE / TABLET DRAWER
        ================================================= */}

        <div
          className={`
            overflow-hidden
            border-t
            border-gray-100
            bg-white

            transition-all
            duration-300
            ease-in-out

            dark:border-gray-700
            dark:bg-[#111827]

            lg:hidden

            ${
              mobileOpen
                ? "max-h-[calc(100vh-108px)] opacity-100"
                : "max-h-0 border-t-0 opacity-0"
            }
          `}
        >
          <div
            className="
              max-h-[calc(100vh-108px)]
              overflow-y-auto
              px-5
              py-5

              sm:px-8
            "
          >
            <div className="flex flex-col">
              {navItems.map((item) => {
                const active = isActivePage(item.href);
                const isLogin = item.label === "Login";

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={closeMobileMenu}
                    aria-label={isLogin ? "Login / Profile" : item.label}
                    title={isLogin ? "Login" : undefined}
                    className={`
                      relative
                      flex
                      items-center
                      border-b
                      border-gray-100
                      py-4
                      text-[16px]

                      transition-all
                      duration-300

                      dark:border-gray-700

                      ${
                        active
                          ? `
                            bg-[#F4F9F0]
                            pl-5
                            font-bold
                            text-[#1B4D03]

                            dark:bg-[#18382C]
                            dark:text-[#D4A300]
                          `
                          : `
                            font-medium
                            text-[#1B4D03]

                            hover:bg-[#F8FBF6]
                            hover:text-[#B88600]

                            dark:text-gray-200
                            dark:hover:text-[#D4A300]
                          `
                      }

                      ${isLogin && !active ? "pl-3" : ""}
                    `}
                  >
                    {/* =====================================
                        ACTIVE LEFT LINE
                    ===================================== */}

                    {active && (
                      <span
                        className="
                          absolute
                          left-0
                          top-1/2
                          h-8
                          w-1
                          -translate-y-1/2
                          rounded-r-full

                          bg-linear-to-b
                          from-[#1B4D03]
                          via-[#246B1C]
                          to-[#B88600]
                        "
                      />
                    )}

                    {/* =====================================
                        ACTIVE DOT
                    ===================================== */}

                    {active && (
                      <span
                        className="
                          absolute
                          right-3
                          top-1/2
                          h-2
                          w-2
                          -translate-y-1/2
                          rounded-full
                          bg-[#B88600]

                          shadow-[0_0_10px_rgba(184,134,0,0.55)]
                        "
                      />
                    )}

                    {/* =====================================
                        LOGIN TEXT KI JAGAH PROFILE ICON
                    ===================================== */}

                    {isLogin ? (
                      <span
                        className={`
                          flex
                          h-10
                          w-10
                          items-center
                          justify-center
                          rounded-full
                          border

                          transition-all
                          duration-200

                          ${
                            active
                              ? `
                                border-[#B88600]
                                bg-[#1B4D03]
                                text-white

                                dark:bg-[#D4A300]
                                dark:text-[#111827]
                              `
                              : `
                                border-[#D8E6CC]
                                bg-[#EDF5E8]
                                text-[#1B4D03]

                                hover:border-[#B88600]
                                hover:text-[#B88600]

                                dark:border-[#36574F]
                                dark:bg-[#18382C]
                                dark:text-[#D4A300]
                              `
                          }
                        `}
                      >
                        <CircleUserRound size={24} strokeWidth={2.1} />
                      </span>
                    ) : (
                      item.label
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* =================================================
          MOBILE / TABLET BACKDROP
      ================================================= */}

      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={closeMobileMenu}
          className="
            fixed
            inset-0
            z-40
            bg-black/20
            backdrop-blur-[1px]

            lg:hidden
          "
        />
      )}
    </>
  );
}
