"use client";

import { useEffect, useState } from "react";
import {
  Check,
  X,
  Minus,
  Sparkles,
  ShieldCheck,
  Activity,
  Users,
  HeartPulse,
} from "lucide-react";

type Status = boolean | "no" | "partial";

interface ComparisonItem {
  feature: string;
  restore: Status;
  traditional: Status;
}

const comparisonData: ComparisonItem[] = [
  {
    feature: "Nationwide Network (10,000+ providers)",
    restore: true,
    traditional: "no",
  },
  {
    feature: "Real-time Claims Processing",
    restore: true,
    traditional: "no",
  },
  {
    feature: "Digital Onboarding in Under 24 Hours",
    restore: true,
    traditional: "no",
  },
  {
    feature: "AI Driven Health Analytics",
    restore: true,
    traditional: "no",
  },
  {
    feature: "Preventive Care Programmes",
    restore: true,
    traditional: "partial",
  },
  {
    feature: "24/7 Digital & Care Support",
    restore: true,
    traditional: "no",
  },
  {
    feature: "Affordable Pricing for SMBs",
    restore: true,
    traditional: "no",
  },
  {
    feature: "HR System Integration",
    restore: true,
    traditional: "no",
  },
];

export default function AdvantageComparison() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => window.clearTimeout(timer);
  }, []);

  const renderStatus = (status: Status): React.ReactNode => {
    if (status === true) {
      return (
        <div className="status-icon status-check">
          <Check size={17} strokeWidth={3.2} />
        </div>
      );
    }

    if (status === "no") {
      return (
        <div className="status-icon status-cross">
          <X size={17} strokeWidth={3} />
        </div>
      );
    }

    if (status === "partial") {
      return (
        <div className="status-icon status-partial">
          <Minus size={17} strokeWidth={3} />
        </div>
      );
    }

    return null;
  };

  return (
    <section
      className={`comparison-section ${
        isVisible ? "section-visible" : ""
      }`}
    >
      {/* Background Effects */}
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="ambient ambient-three" />

      <div className="comparison-container">
        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="header-area">
          <div className="section-badge animation-item delay-1">
            <span className="badge-icon">
              <Sparkles size={13} />
            </span>

            <span>Clear Advantage</span>

            <span className="badge-live" />
          </div>

          <h2 className="main-heading animation-item delay-2">
            Why People Choose{" "}
            <span className="brand-word">
              Restore
              <span className="brand-underline" />
            </span>{" "}
            Health Services
          </h2>

          <p className="description animation-item delay-3">
            A smarter and simpler approach to healthcare — designed
            to give you more value, better support, and a seamless
            digital experience.
          </p>
        </div>

        {/* ==========================================
            FEATURE CARDS
        ========================================== */}

        <div className="feature-grid">
          <div className="feature-card animation-item delay-4">
            <div className="feature-icon">
              <ShieldCheck size={20} />
            </div>

            <div>
              <strong>Trusted Care</strong>
              <span>Reliable healthcare</span>
            </div>
          </div>

          <div className="feature-card animation-item delay-5">
            <div className="feature-icon">
              <Activity size={20} />
            </div>

            <div>
              <strong>Smart Health</strong>
              <span>Digital-first care</span>
            </div>
          </div>

          <div className="feature-card animation-item delay-6">
            <div className="feature-icon">
              <Users size={20} />
            </div>

            <div>
              <strong>Wide Network</strong>
              <span>10,000+ providers</span>
            </div>
          </div>
        </div>

        {/* ==========================================
            HERO IMAGE
        ========================================== */}

        <div className="image-wrapper animation-item delay-7">
          <img
            src="/doctors2.webp"
            alt="Healthcare professionals"
            className="doctor-image"
          />

          <div className="image-overlay" />
          <div className="image-grid" />

          <div className="image-content">
            <div className="image-label">
              <HeartPulse size={15} />
              Better Healthcare
            </div>

            <h3>Healthcare designed around you.</h3>

            <p>
              Connected care, transparent support and technology
              that puts your health first.
            </p>
          </div>

          <div className="image-chip">
            <span className="chip-check">
              <Check size={14} strokeWidth={3} />
            </span>

            <div>
              <small>RESTORE</small>
              <strong>Health First</strong>
            </div>
          </div>
        </div>

        {/* ==========================================
            COMPARISON TABLE
        ========================================== */}

        <div className="table-wrapper animation-item delay-8">
          {/* Table Header */}

          <div className="table-header">
            <div className="feature-title">
              <span>COMPARE</span>
              <strong>Healthcare Benefits</strong>
            </div>

            <div className="restore-title">
              <div className="restore-pill">
                <span className="live-dot" />
                RESTORE
              </div>
            </div>

            <div className="traditional-title">
              TRADITIONAL
            </div>
          </div>

          {/* Table Body */}

          <div className="table-body">
            {comparisonData.map(
              (item: ComparisonItem, index: number) => (
                <div
                  key={item.feature}
                  className={`comparison-row row-${index + 1}`}
                >
                  <div className="feature-name">
                    <span className="feature-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span>{item.feature}</span>
                  </div>

                  <div className="restore-cell">
                    <div className="restore-cell-glow" />
                    {renderStatus(item.restore)}
                  </div>

                  <div className="traditional-cell">
                    {renderStatus(item.traditional)}
                  </div>
                </div>
              )
            )}
          </div>

          {/* Legend */}

          <div className="legend">
            <div className="legend-item">
              <span className="legend-circle available" />
              Available
            </div>

            <div className="legend-item">
              <span className="legend-circle partial" />
              Partially Available
            </div>

            <div className="legend-item">
              <span className="legend-circle unavailable" />
              Not Available
            </div>
          </div>
        </div>
      </div>

      {/* ==========================================
          COMPLETE CSS
      ========================================== */}

      <style jsx>{`
        /* ==========================================
           MAIN SECTION
        ========================================== */

        .comparison-section {
          position: relative;
          width: 100%;
          overflow: hidden;

          /* ONLY TOP ALIGNMENT CHANGED */
          padding: 58px 0 90px;

          background:
            radial-gradient(
              circle at 8% 12%,
              rgba(27, 77, 3, 0.09),
              transparent 28%
            ),
            radial-gradient(
              circle at 92% 55%,
              rgba(212, 163, 0, 0.08),
              transparent 27%
            ),
            linear-gradient(
              135deg,
              #f6faf4,
              #f0f6ed
            );

          color: #173b08;

          transition:
            background 0.45s ease,
            color 0.45s ease;
        }

        /* ==========================================
           DARK MODE
        ========================================== */

        :global(.dark) .comparison-section {
          background:
            radial-gradient(
              circle at 8% 10%,
              rgba(27, 77, 3, 0.4),
              transparent 30%
            ),
            radial-gradient(
              circle at 90% 50%,
              rgba(212, 163, 0, 0.13),
              transparent 30%
            ),
            radial-gradient(
              circle at 50% 100%,
              rgba(27, 77, 3, 0.22),
              transparent 35%
            ),
            linear-gradient(
              135deg,
              #061604 0%,
              #0a2106 48%,
              #051303 100%
            );

          color: white;
        }

        .comparison-container {
          position: relative;
          z-index: 2;

          width: min(1120px, calc(100% - 32px));

          margin: 0 auto;
        }

        /* ==========================================
           BACKGROUND AMBIENT
        ========================================== */

        .ambient {
          position: absolute;

          border-radius: 999px;

          pointer-events: none;

          filter: blur(100px);

          animation:
            ambientMove
            9s
            ease-in-out
            infinite;
        }

        .ambient-one {
          width: 330px;
          height: 330px;

          top: 250px;
          left: -180px;

          background:
            rgba(27, 77, 3, 0.12);
        }

        .ambient-two {
          width: 300px;
          height: 300px;

          right: -150px;
          top: 650px;

          background:
            rgba(212, 163, 0, 0.09);

          animation-delay: 2s;
        }

        .ambient-three {
          width: 240px;
          height: 240px;

          left: 45%;
          bottom: 20px;

          background:
            rgba(27, 77, 3, 0.07);

          animation-delay: 4s;
        }

        :global(.dark) .ambient-one {
          background:
            rgba(27, 77, 3, 0.3);
        }

        :global(.dark) .ambient-two {
          background:
            rgba(212, 163, 0, 0.12);
        }

        :global(.dark) .ambient-three {
          background:
            rgba(27, 77, 3, 0.2);
        }

        /* ==========================================
           HEADER
        ========================================== */

        .header-area {
          max-width: 800px;

          margin: 0 auto;

          text-align: center;
        }

        .section-badge {
          width: fit-content;

          /* ONLY TOP HEADER SPACING CHANGED */
          margin: 0 auto 16px;

          display: flex;

          align-items: center;

          gap: 8px;

          padding: 8px 13px;

          border:
            1px solid
            rgba(27, 77, 3, 0.12);

          border-radius: 999px;

          background:
            rgba(255, 255, 255, 0.88);

          color: #1b4d03;

          font-size: 10px;

          font-weight: 900;

          letter-spacing: 0.17em;

          text-transform: uppercase;

          box-shadow:
            0 8px 25px
            rgba(27, 77, 3, 0.06);

          backdrop-filter: blur(14px);

          transition:
            background 0.4s ease,
            border-color 0.4s ease,
            color 0.4s ease;
        }

        :global(.dark) .section-badge {
          border-color:
            rgba(212, 163, 0, 0.25);

          background:
            rgba(27, 77, 3, 0.42);

          color: #d4a300;

          box-shadow:
            0 10px 30px
            rgba(0, 0, 0, 0.28);
        }

        .badge-icon {
          width: 24px;
          height: 24px;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 50%;

          color: #d4a300;

          background:
            rgba(212, 163, 0, 0.12);

          animation:
            badgePulse
            2.5s
            ease-in-out
            infinite;
        }

        .badge-live {
          width: 5px;
          height: 5px;

          border-radius: 50%;

          background: #1b4d03;

          animation:
            livePulse
            1.8s
            infinite;
        }

        :global(.dark) .badge-live {
          background: #d4a300;
        }

        .main-heading {
          margin: 0;

          color: #173b08;

          font-size:
            clamp(34px, 5vw, 58px);

          line-height: 1.07;

          letter-spacing: -0.045em;

          font-weight: 900;

          transition:
            color 0.4s ease;
        }

        :global(.dark) .main-heading {
          color: #ffffff;
        }

        .brand-word {
          position: relative;

          display: inline-block;

          color: #1b4d03;
        }

        :global(.dark) .brand-word {
          color: #d4a300;
        }

        .brand-underline {
          position: absolute;

          left: 0;
          right: 0;

          bottom: -5px;

          height: 4px;

          border-radius: 999px;

          background: #d4a300;

          transform: scaleX(0);

          transform-origin: left;
        }

        .section-visible .brand-underline {
          animation:
            underlineReveal
            0.8s
            ease-out
            0.7s
            forwards;
        }

        .description {
          max-width: 650px;

          margin: 22px auto 0;

          color: #64748b;

          font-size: 15px;

          line-height: 1.8;

          transition:
            color 0.4s ease;
        }

        :global(.dark) .description {
          color: #b6c6ad;
        }

        /* ==========================================
           FEATURE GRID
        ========================================== */

        .feature-grid {
          width: min(1080px, 100%);
          max-width: 1080px;

          margin: 42px auto 0;

          display: grid;

          grid-template-columns:
            repeat(3, minmax(0, 1fr));

          gap: 20px;
        }

        .feature-card {
          position: relative;

          min-height: 118px;

          display: flex;

          align-items: center;

          gap: 18px;

          padding: 24px 22px;

          border:
            1px solid
            rgba(212, 163, 0, 0.18);

          border-radius: 22px;

          background:
            linear-gradient(
              135deg,
              #1b4d03 0%,
              #123b04 58%,
              #0c2d03 100%
            );

          box-shadow:
            0 12px 35px
            rgba(27, 77, 3, 0.08);

          overflow: hidden;

          transition:
            transform 0.4s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 0.4s ease,
            border-color 0.4s ease,
            background 0.4s ease;
        }

        .feature-card::before {
          content: "";
          position: absolute;
          inset: 0;

          background:
            radial-gradient(
              circle at 0% 0%,
              rgba(212, 163, 0, 0.13),
              transparent 42%
            );

          pointer-events: none;
        }

        :global(.dark) .feature-card {
          border-color:
            rgba(212, 163, 0, 0.24);

          background:
            linear-gradient(
              135deg,
              rgba(27, 77, 3, 0.62),
              rgba(7, 27, 4, 0.9)
            );

          box-shadow:
            0 18px 45px
            rgba(0, 0, 0, 0.3);
        }

        .feature-card:hover {
          transform:
            translateY(-9px)
            scale(1.02);

          border-color:
            rgba(212, 163, 0, 0.55);

          box-shadow:
            0 24px 55px
            rgba(27, 77, 3, 0.16),
            0 0 0 1px
            rgba(212, 163, 0, 0.08);
        }

        :global(.dark) .feature-card:hover {
          box-shadow:
            0 20px 50px
            rgba(0, 0, 0, 0.4),
            0 0 25px
            rgba(212, 163, 0, 0.06);
        }

        .feature-icon {
          position: relative;
          z-index: 1;

          flex-shrink: 0;

          width: 56px;
          height: 56px;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 16px;

          color: #d4a300;

          background:
            linear-gradient(
              135deg,
              rgba(212, 163, 0, 0.25),
              rgba(212, 163, 0, 0.08)
            );

          border:
            1px solid
            rgba(212, 163, 0, 0.28);

          box-shadow:
            0 8px 22px
            rgba(212, 163, 0, 0.12);

          transition:
            color 0.3s ease,
            background 0.3s ease,
            transform 0.35s ease,
            box-shadow 0.35s ease;
        }

        :global(.dark) .feature-icon {
          color: #d4a300;

          background:
            rgba(212, 163, 0, 0.13);

          border-color:
            rgba(212, 163, 0, 0.3);
        }

        .feature-card:hover .feature-icon {
          color: #173b08;

          background: #d4a300;

          transform:
            rotate(-6deg)
            scale(1.1);

          box-shadow:
            0 12px 30px
            rgba(212, 163, 0, 0.3);
        }

        .feature-card strong {
          position: relative;
          z-index: 1;

          display: block;

          color: #ffffff;

          font-size: 16px;

          line-height: 1.25;

          font-weight: 900;

          transition:
            color 0.35s ease;
        }

        :global(.dark) .feature-card strong {
          color: #ffffff;
        }

        .feature-card span {
          position: relative;
          z-index: 1;

          display: block;

          margin-top: 6px;

          color:
            rgba(255, 255, 255, 0.72);

          font-size: 12px;

          line-height: 1.4;

          transition:
            color 0.35s ease;
        }

        :global(.dark) .feature-card span {
          color: #b6c6ad;
        }

        .section-visible .feature-card {
          animation:
            featureCardReveal
            0.85s
            cubic-bezier(0.22, 1, 0.36, 1)
            forwards;
        }

        .section-visible .feature-card.delay-4 {
          animation-delay: 0.08s;
        }

        .section-visible .feature-card.delay-5 {
          animation-delay: 0.22s;
        }

        .section-visible .feature-card.delay-6 {
          animation-delay: 0.36s;
        }

        /* ==========================================
           HERO IMAGE
        ========================================== */

        .image-wrapper {
          position: relative;

          height: 395px;

          margin-top: 48px;

          overflow: hidden;

          border:
            1px solid
            rgba(212, 163, 0, 0.12);

          border-radius: 28px;

          box-shadow:
            0 25px 70px
            rgba(27, 77, 3, 0.13);
        }

        :global(.dark) .image-wrapper {
          border-color:
            rgba(212, 163, 0, 0.22);

          box-shadow:
            0 30px 80px
            rgba(0, 0, 0, 0.55);
        }

        .doctor-image {
          width: 100%;
          height: 100%;

          display: block;

          object-fit: cover;

          transition:
            transform 1.2s
            cubic-bezier(
              0.2,
              0.8,
              0.2,
              1
            );
        }

        .image-wrapper:hover .doctor-image {
          transform: scale(1.05);
        }

        .image-overlay {
          position: absolute;

          inset: 0;

          background:
            linear-gradient(
              180deg,
              rgba(9, 29, 4, 0.02),
              rgba(9, 29, 4, 0.15) 45%,
              rgba(7, 29, 2, 0.82)
            );
        }

        :global(.dark) .image-overlay {
          background:
            linear-gradient(
              180deg,
              rgba(2, 14, 1, 0.15),
              rgba(2, 14, 1, 0.4) 42%,
              rgba(2, 12, 1, 0.91)
            );
        }

        .image-grid {
          position: absolute;

          inset: 0;

          opacity: 0.1;

          background-image:
            radial-gradient(
              rgba(255, 255, 255, 0.8)
                1px,
              transparent 1px
            );

          background-size: 20px 20px;

          animation:
            gridMove
            14s
            linear
            infinite;
        }

        .image-content {
          position: absolute;

          left: 30px;

          bottom: 28px;

          color: white;
        }

        .image-label {
          display: flex;

          align-items: center;

          gap: 7px;

          color: #d4a300;

          font-size: 10px;

          font-weight: 900;

          letter-spacing: 0.16em;

          text-transform: uppercase;
        }

        .image-content h3 {
          margin: 8px 0 0;

          color: white;

          font-size:
            clamp(22px, 4vw, 35px);

          line-height: 1.1;

          font-weight: 900;
        }

        .image-content p {
          max-width: 500px;

          margin: 8px 0 0;

          color:
            rgba(255, 255, 255, 0.72);

          font-size: 12px;

          line-height: 1.6;
        }

        .image-chip {
          position: absolute;

          top: 24px;
          right: 24px;

          display: flex;

          align-items: center;

          gap: 9px;

          padding: 10px 14px;

          border:
            1px solid
            rgba(255, 255, 255, 0.17);

          border-radius: 14px;

          background:
            rgba(255, 255, 255, 0.12);

          backdrop-filter: blur(15px);

          color: white;

          animation:
            floatingChip
            4s
            ease-in-out
            infinite;
        }

        .chip-check {
          width: 29px;
          height: 29px;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 50%;

          color: #173b08;

          background: #d4a300;
        }

        .image-chip small,
        .image-chip strong {
          display: block;
        }

        .image-chip small {
          color:
            rgba(255, 255, 255, 0.6);

          font-size: 8px;

          font-weight: 800;
        }

        .image-chip strong {
          margin-top: 1px;

          color: white;

          font-size: 10px;

          font-weight: 900;
        }

        /* ==========================================
           TABLE
        ========================================== */

        .table-wrapper {
          margin-top: 48px;

          overflow: hidden;

          border:
            1px solid
            rgba(27, 77, 3, 0.1);

          border-radius: 27px;

          background: white;

          box-shadow:
            0 25px 70px
            rgba(27, 77, 3, 0.09);

          transition:
            background 0.45s ease,
            border-color 0.45s ease,
            box-shadow 0.45s ease;
        }

        :global(.dark) .table-wrapper {
          border-color:
            rgba(212, 163, 0, 0.2);

          background: #0b2407;

          box-shadow:
            0 30px 80px
            rgba(0, 0, 0, 0.42);
        }

        .table-header,
        .comparison-row {
          display: grid;

          grid-template-columns:
            2fr 1fr 1fr;
        }

        .table-header {
          min-height: 82px;

          align-items: center;

          padding: 14px 28px;

          background:
            linear-gradient(
              135deg,
              #1b4d03,
              #123b04
            );
        }

        :global(.dark) .table-header {
          background:
            linear-gradient(
              135deg,
              #1b4d03,
              #0b2c04
            );

          border-bottom:
            1px solid
            rgba(212, 163, 0, 0.2);
        }

        .feature-title span {
          display: block;

          color: #d4a300;

          font-size: 9px;

          font-weight: 900;

          letter-spacing: 0.2em;
        }

        .feature-title strong {
          display: block;

          margin-top: 5px;

          color: white;

          font-size: 17px;

          font-weight: 900;

          letter-spacing: -0.01em;
        }

        .restore-title {
          display: flex;

          justify-content: center;
        }

        .restore-pill {
          display: flex;

          align-items: center;

          gap: 8px;

          padding: 10px 17px;

          border-radius: 999px;

          color: #173b08;

          background:
            linear-gradient(
              135deg,
              #d4a300,
              #e4b932
            );

          font-size: 11px;

          font-weight: 900;

          letter-spacing: 0.08em;

          box-shadow:
            0 8px 25px
            rgba(212, 163, 0, 0.25);

          transition:
            transform 0.3s ease,
            box-shadow 0.3s ease;
        }

        .restore-pill:hover {
          transform:
            translateY(-2px)
            scale(1.04);

          box-shadow:
            0 12px 30px
            rgba(212, 163, 0, 0.35);
        }

        .live-dot {
          width: 5px;
          height: 5px;

          border-radius: 50%;

          background: #1b4d03;

          animation:
            livePulse
            1.5s
            infinite;
        }

        .traditional-title {
          text-align: center;

          color:
            rgba(255, 255, 255, 0.72);

          font-size: 11px;

          font-weight: 900;

          letter-spacing: 0.13em;
        }

        /* ==========================================
           TABLE ROW
        ========================================== */

        .comparison-row {
          position: relative;

          min-height: 78px;

          align-items: center;

          padding: 13px 28px;

          border-bottom:
            1px solid #edf2ea;

          background: white;

          opacity: 0;

          transform:
            translateY(25px)
            scale(0.98);

          transition:
            background 0.35s ease,
            transform 0.35s ease,
            box-shadow 0.35s ease,
            border-color 0.35s ease;
        }

        :global(.dark) .comparison-row {
          background:
            rgba(11, 36, 7, 0.9);

          border-bottom:
            1px solid
            rgba(212, 163, 0, 0.08);
        }

        .section-visible .comparison-row {
          animation:
            rowReveal
            0.65s
            cubic-bezier(
              0.22,
              1,
              0.36,
              1
            )
            forwards;
        }

        .section-visible .row-1 {
          animation-delay: 0.72s;
        }

        .section-visible .row-2 {
          animation-delay: 0.80s;
        }

        .section-visible .row-3 {
          animation-delay: 0.88s;
        }

        .section-visible .row-4 {
          animation-delay: 0.96s;
        }

        .section-visible .row-5 {
          animation-delay: 1.04s;
        }

        .section-visible .row-6 {
          animation-delay: 1.12s;
        }

        .section-visible .row-7 {
          animation-delay: 1.20s;
        }

        .section-visible .row-8 {
          animation-delay: 1.28s;
        }

        .comparison-row:last-child {
          border-bottom: 0;
        }

        .comparison-row:hover {
          background:
            linear-gradient(
              90deg,
              rgba(27, 77, 3, 0.055),
              rgba(212, 163, 0, 0.035)
            );

          transform: translateX(5px);

          box-shadow:
            inset 4px 0 0 #d4a300;
        }

        :global(.dark) .comparison-row:hover {
          background:
            linear-gradient(
              90deg,
              rgba(27, 77, 3, 0.7),
              rgba(212, 163, 0, 0.09)
            );

          box-shadow:
            inset 4px 0 0 #d4a300,
            0 8px 25px
            rgba(0, 0, 0, 0.2);
        }

        .comparison-row::before {
          content: "";

          position: absolute;

          left: 0;
          top: 0;
          bottom: 0;

          width: 4px;

          background: #d4a300;

          transform: scaleY(0);

          transform-origin: center;

          transition:
            transform 0.35s ease;
        }

        .comparison-row:hover::before {
          transform: scaleY(1);
        }

        /* ==========================================
           FEATURE TEXT
        ========================================== */

        .feature-name {
          display: flex;

          align-items: center;

          gap: 14px;

          padding-right: 15px;

          color: #1b3d08;

          font-size: 15px;

          font-weight: 800;

          line-height: 1.5;

          transition:
            color 0.3s ease,
            transform 0.3s ease;
        }

        :global(.dark) .feature-name {
          color: #f1f6ed;
        }

        .comparison-row:hover .feature-name {
          color: #1b4d03;

          transform: translateX(5px);
        }

        :global(.dark)
          .comparison-row:hover
          .feature-name {
          color: white;
        }

        .feature-number {
          flex-shrink: 0;

          color: #d4a300;

          font-size: 10px;

          font-weight: 900;

          transition:
            transform 0.3s ease,
            color 0.3s ease;
        }

        .comparison-row:hover
          .feature-number {
          color: #1b4d03;

          transform: scale(1.15);
        }

        :global(.dark)
          .comparison-row:hover
          .feature-number {
          color: #d4a300;
        }

        /* ==========================================
           STATUS
        ========================================== */

        .restore-cell,
        .traditional-cell {
          position: relative;

          display: flex;

          align-items: center;

          justify-content: center;
        }

        .restore-cell-glow {
          position: absolute;

          width: 55px;
          height: 55px;

          border-radius: 50%;

          background:
            rgba(27, 77, 3, 0.1);

          filter: blur(12px);

          opacity: 0;

          transition:
            opacity 0.3s ease;
        }

        :global(.dark)
          .restore-cell-glow {
          background:
            rgba(212, 163, 0, 0.13);
        }

        .comparison-row:hover
          .restore-cell-glow {
          opacity: 1;
        }

        .status-icon {
          position: relative;

          z-index: 2;

          width: 40px;
          height: 40px;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 50%;

          transition:
            transform 0.35s ease,
            box-shadow 0.35s ease,
            background 0.35s ease,
            color 0.35s ease;
        }

        .status-check {
          color: #1b4d03;

          background: #edf7e9;
        }

        :global(.dark) .status-check {
          color: #d4a300;

          background:
            rgba(212, 163, 0, 0.11);

          box-shadow:
            inset 0 0 0 1px
            rgba(212, 163, 0, 0.13);
        }

        .status-cross {
          color: #e54848;

          background: #fff1f1;
        }

        :global(.dark) .status-cross {
          color: #ff7c7c;

          background:
            rgba(229, 72, 72, 0.1);

          box-shadow:
            inset 0 0 0 1px
            rgba(229, 72, 72, 0.1);
        }

        .status-partial {
          color: #c29300;

          background: #fff9df;
        }

        :global(.dark) .status-partial {
          color: #d4a300;

          background:
            rgba(212, 163, 0, 0.1);
        }

        .comparison-row:hover
          .status-check {
          transform:
            scale(1.18)
            rotate(5deg);

          color: white;

          background: #1b4d03;

          box-shadow:
            0 8px 24px
            rgba(27, 77, 3, 0.25);
        }

        :global(.dark)
          .comparison-row:hover
          .status-check {
          color: #173b08;

          background: #d4a300;

          box-shadow:
            0 8px 24px
            rgba(212, 163, 0, 0.28);
        }

        .comparison-row:hover
          .status-cross {
          transform: scale(1.12);
        }

        .comparison-row:hover
          .status-partial {
          transform:
            scale(1.12)
            rotate(-5deg);
        }

        /* ==========================================
           LEGEND
        ========================================== */

        .legend {
          display: flex;

          align-items: center;

          justify-content: center;

          flex-wrap: wrap;

          gap: 23px;

          padding: 17px;

          border-top:
            1px solid #edf2ea;

          background: #fafcf9;

          transition:
            background 0.4s ease,
            border-color 0.4s ease;
        }

        :global(.dark) .legend {
          border-top:
            1px solid
            rgba(212, 163, 0, 0.1);

          background:
            #081e05;
        }

        .legend-item {
          display: flex;

          align-items: center;

          gap: 7px;

          color: #64748b;

          font-size: 9px;

          font-weight: 700;
        }

        :global(.dark) .legend-item {
          color: #a8b99f;
        }

        .legend-circle {
          width: 7px;
          height: 7px;

          border-radius: 50%;
        }

        .available {
          background: #1b4d03;
        }

        :global(.dark) .available {
          background: #d4a300;

          box-shadow:
            0 0 10px
            rgba(212, 163, 0, 0.4);
        }

        .partial {
          background: #d4a300;
        }

        .unavailable {
          background: #e54848;
        }

        /* ==========================================
           BOTTOM BRAND
        ========================================== */

        .bottom-brand {
          display: flex;

          align-items: center;

          justify-content: center;

          gap: 14px;

          margin-top: 32px;
        }

        .bottom-brand span {
          width: 50px;

          height: 1px;

          background:
            linear-gradient(
              90deg,
              transparent,
              #d4a300
            );
        }

        .bottom-brand span:last-child {
          background:
            linear-gradient(
              90deg,
              #d4a300,
              transparent
            );
        }

        .bottom-brand p {
          margin: 0;

          color:
            rgba(27, 77, 3, 0.58);

          font-size: 9px;

          font-weight: 900;

          letter-spacing: 0.16em;

          text-transform: uppercase;

          transition:
            color 0.4s ease;
        }

        :global(.dark) .bottom-brand p {
          color:
            rgba(212, 163, 0, 0.75);
        }

        /* ==========================================
           ANIMATION
        ========================================== */

        .animation-item {
          opacity: 0;

          transform:
            translateY(25px);
        }

        .section-visible
          .animation-item {
          animation:
            fadeUp
            0.75s
            cubic-bezier(
              0.22,
              1,
              0.36,
              1
            )
            forwards;
        }

        .delay-1 {
          animation-delay: 0.05s;
        }

        .delay-2 {
          animation-delay: 0.12s;
        }

        .delay-3 {
          animation-delay: 0.2s;
        }

        .delay-4 {
          animation-delay: 0.28s;
        }

        .delay-5 {
          animation-delay: 0.43s;
        }

        .delay-6 {
          animation-delay: 0.58s;
        }

        .delay-7 {
          animation-delay: 0.52s;
        }

        .delay-8 {
          animation-delay: 0.62s;
        }

        .delay-9 {
          animation-delay: 1.5s;
        }

        @keyframes fadeUp {
          from {
            opacity: 0;

            transform:
              translateY(25px);
          }

          to {
            opacity: 1;

            transform:
              translateY(0);
          }
        }

        @keyframes featureCardReveal {
          0% {
            opacity: 0;
            transform:
              translateY(42px)
              scale(0.9)
              rotateX(10deg);
            filter: blur(5px);
          }

          65% {
            opacity: 1;
            transform:
              translateY(-7px)
              scale(1.025)
              rotateX(0deg);
            filter: blur(0);
          }

          100% {
            opacity: 1;
            transform:
              translateY(0)
              scale(1)
              rotateX(0deg);
            filter: blur(0);
          }
        }

        @keyframes rowReveal {
          0% {
            opacity: 0;

            transform:
              translateY(25px)
              scale(0.97);
          }

          60% {
            opacity: 1;

            transform:
              translateY(-3px)
              scale(1.01);
          }

          100% {
            opacity: 1;

            transform:
              translateY(0)
              scale(1);
          }
        }

        @keyframes underlineReveal {
          from {
            transform: scaleX(0);
          }

          to {
            transform: scaleX(1);
          }
        }

        @keyframes ambientMove {
          0%,
          100% {
            transform:
              translate(0, 0)
              scale(1);
          }

          50% {
            transform:
              translate(25px, -20px)
              scale(1.08);
          }
        }

        @keyframes badgePulse {
          0%,
          100% {
            transform: scale(1);
          }

          50% {
            transform: scale(1.1);
          }
        }

        @keyframes livePulse {
          0% {
            box-shadow:
              0 0 0 0
              rgba(212, 163, 0, 0.4);
          }

          70% {
            box-shadow:
              0 0 0 7px
              rgba(212, 163, 0, 0);
          }

          100% {
            box-shadow:
              0 0 0 0
              rgba(212, 163, 0, 0);
          }
        }

        @keyframes floatingChip {
          0%,
          100% {
            transform:
              translateY(0);
          }

          50% {
            transform:
              translateY(-7px);
          }
        }

        @keyframes gridMove {
          from {
            transform:
              translate(0, 0);
          }

          to {
            transform:
              translate(20px, 20px);
          }
        }

        /* ==========================================
           TABLET
        ========================================== */

        @media (max-width: 1024px) and (min-width: 769px) {
          .feature-grid {
            width: min(940px, calc(100% - 20px));
            gap: 16px;
          }

          .feature-card {
            min-height: 108px;
            padding: 20px 18px;
          }

          .feature-icon {
            width: 50px;
            height: 50px;
          }

          .feature-card strong {
            font-size: 14px;
          }

          .feature-card span {
            font-size: 11px;
          }
        }

        @media (max-width: 768px) {
          .comparison-section {
            padding: 70px 0 75px;
          }

          .comparison-container {
            width:
              min(
                650px,
                calc(100% - 24px)
              );
          }

          .feature-grid {
            grid-template-columns: 1fr;
          }

          .image-wrapper {
            height: 330px;
          }

          .table-header,
          .comparison-row {
            grid-template-columns:
              1.6fr
              0.7fr
              0.7fr;
          }

          .table-header {
            padding: 13px 16px;
          }

          .comparison-row {
            padding: 13px 16px;
          }

          .feature-name {
            font-size: 13px;

            font-weight: 800;
          }

          .status-icon {
            width: 36px;
            height: 36px;
          }

          .feature-number {
            display: none;
          }
        }

        /* ==========================================
           MOBILE
        ========================================== */

        @media (max-width: 480px) {
          .comparison-section {
            /* ONLY TOP ALIGNMENT CHANGED */
            padding: 42px 0 65px;
          }

          .comparison-container {
            width:
              calc(100% - 18px);
          }

          .main-heading {
            font-size: 31px;
          }

          .description {
            font-size: 12.5px;
          }

          .feature-grid {
            margin-top: 27px;

            gap: 8px;
          }

          .feature-card {
            min-height: 92px;
            padding: 16px;
            gap: 14px;

            border-radius: 17px;
          }

          .feature-icon {
            width: 44px;
            height: 44px;
            border-radius: 13px;
          }

          .feature-card strong {
            font-size: 14px;
          }

          .feature-card span {
            margin-top: 4px;
            font-size: 10px;
          }

          .image-wrapper {
            height: 270px;

            margin-top: 34px;

            border-radius: 20px;
          }

          .image-content {
            left: 17px;

            bottom: 17px;
          }

          .image-content h3 {
            font-size: 20px;
          }

          .image-content p {
            max-width: 310px;

            font-size: 9.5px;
          }

          .image-chip {
            top: 14px;
            right: 14px;

            padding: 8px 10px;
          }

          .table-wrapper {
            margin-top: 34px;

            border-radius: 18px;
          }

          .table-header,
          .comparison-row {
            grid-template-columns:
              1.55fr
              0.72fr
              0.72fr;
          }

          .table-header {
            min-height: 65px;

            padding: 9px;
          }

          .feature-title strong {
            font-size: 11px;
          }

          .feature-title span {
            font-size: 6.5px;
          }

          .restore-pill {
            padding: 8px 10px;

            font-size: 8px;
          }

          .traditional-title {
            font-size: 7px;
          }

          .comparison-row {
            min-height: 70px;

            padding: 10px 9px;
          }

          .feature-name {
            gap: 5px;

            font-size: 11px;

            font-weight: 800;

            line-height: 1.45;
          }

          .status-icon {
            width: 32px;
            height: 32px;
          }

          .legend {
            gap: 10px;

            padding: 12px 7px;
          }

          .legend-item {
            font-size: 7.5px;
          }

          .bottom-brand {
            margin-top: 25px;

            gap: 8px;
          }

          .bottom-brand p {
            font-size: 7px;

            letter-spacing: 0.1em;
          }

          .bottom-brand span {
            width: 25px;
          }
        }

        /* ==========================================
           REDUCED MOTION
        ========================================== */

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration:
              0.01ms !important;

            animation-iteration-count:
              1 !important;

            transition-duration:
              0.01ms !important;
          }

          .animation-item,
          .feature-card,
          .comparison-row {
            opacity: 1 !important;

            transform: none !important;

            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}