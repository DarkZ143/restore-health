"use client";

import Image from "next/image";

const brands = [
  {
    name: "BlackRock",
    image: "/blackrock.png",
  },
  {
    name: "Amway",
    image: "/amway.png",
  },
  {
    name: "Indegene",
    image: "/indegene.png",
  },
  {
    name: "Raheja",
    image: "/raheja.png",
  },
];

export default function TrustedBrands() {
  // Multiple copies ensure there is always another set entering
  const marqueeBrands = [...brands, ...brands, ...brands];

  return (
    <section className="w-full overflow-hidden bg-white py-14 transition-colors duration-300 dark:bg-slate-950">
      {/* Heading */}
      <div className="mb-9 text-center">
        <h2 className="text-[12px] font-bold uppercase tracking-[0.22em] text-[#78908a] dark:text-slate-400 sm:text-[13px]">
          Trusted by India&apos;s Leading Organisations
        </h2>
      </div>

      {/* Marquee */}
      <div className="relative w-full overflow-hidden">
        {/* Left Fade */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-linear-to-r from-white to-transparent dark:from-slate-950" />

        {/* Right Fade */}
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-linear-to-l from-white to-transparent dark:from-slate-950" />

        {/* Moving Track */}
        <div className="brand-track flex w-max items-center">
          {marqueeBrands.map((brand, index) => (
            <div
              key={`${brand.name}-${index}`}
              className="
                flex
                h-17.5
                w-55
                shrink-0
                items-center
                justify-center
              "
              // Hide duplicates from screen readers for better accessibility
              aria-hidden={index >= brands.length ? "true" : undefined}
            >
              <Image
                src={brand.image}
                alt={brand.name}
                width={125}
                height={42}
                className="
                  max-h-10.5
                  max-w-31.25
                  object-contain
                  opacity-55
                  grayscale
                  transition-all
                  duration-300
                  hover:opacity-100
                  hover:grayscale-0
                  dark:invert
                  dark:opacity-70
                  dark:hover:opacity-100
                "
              />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .brand-track {
          animation: brandLoop 24s linear infinite;
        }

        /* Pause animation on hover for better user experience */
        .brand-track:hover {
          animation-play-state: paused;
        }

        @keyframes brandLoop {
          from {
            transform: translateX(0);
          }
          to {
            /* -33.333333% perfectly offsets the array which is tripled */
            transform: translateX(-33.333333%);
          }
        }
      `}</style>
    </section>
  );
}
