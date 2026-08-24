"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const wellnessImages = ["/webimg1.webp", "/webimg2.webp", "/webimg3.webp"];

export default function WellnessFeature() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === wellnessImages.length - 1 ? 0 : prev + 1,
      );
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === wellnessImages.length - 1 ? 0 : prev + 1,
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? wellnessImages.length - 1 : prev - 1,
    );
  };

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8">
      {/* HERO CAROUSEL */}
      <div className="relative mx-auto w-full max-w-350 overflow-hidden rounded-4xl bg-[#302d18]">
        {/* SLIDES */}
        <div className="relative aspect-[16/7.6] w-full">
          {wellnessImages.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                currentSlide === index ? "z-10 opacity-100" : "z-0 opacity-0"
              }`}
            >
              <Image
                src={img}
                alt={`Employee Wellness ${index + 1}`}
                fill
                priority={index === 0}
                sizes="(max-width: 768px) 100vw, 1400px"
                className="object-cover"
              />
            </div>
          ))}

          {/* LEFT ARROW */}
          <button
            onClick={prevSlide}
            aria-label="Previous slide"
            className="
              absolute
              left-5
              top-1/2
              z-30
              flex
              h-14
              w-14
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              bg-black/30
              text-white
              backdrop-blur-sm
              transition-all
              duration-300
              hover:bg-black/50
              sm:left-6
            "
          >
            <ChevronLeft size={30} strokeWidth={2} />
          </button>

          {/* RIGHT ARROW */}
          <button
            onClick={nextSlide}
            aria-label="Next slide"
            className="
              absolute
              right-5
              top-1/2
              z-30
              flex
              h-14
              w-14
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              bg-black/30
              text-white
              backdrop-blur-sm
              transition-all
              duration-300
              hover:bg-black/50
              sm:right-6
            "
          >
            <ChevronRight size={30} strokeWidth={2} />
          </button>
        </div>

        {/* BOTTOM GREEN BAR */}
        <div className="relative z-30 flex h-14 w-full items-center justify-center bg-[#106b53]">
          <div className="flex items-center gap-2.5">
            {wellnessImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentSlide === index
                    ? "w-8 bg-white"
                    : "w-2 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
