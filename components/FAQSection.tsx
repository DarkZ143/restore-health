"use client";

import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  ShieldCheck,
  Sparkles,
  MessageCircleQuestion,
  HeartPulse,
} from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [visibleItems, setVisibleItems] = useState<number[]>([]);

  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const faqs: FAQItem[] = [
    {
      question:
        "Is Restore Health Services genuine — who's actually behind it?",
      answer:
        "We are backed by top-tier healthcare professionals and a trusted nationwide network. Our goal is to make healthcare transparent, affordable, and accessible for everyone without any hidden agendas.",
    },
    {
      question: "How affordable is a membership, really?",
      answer:
        "You get access to free doctor consultations, discounted lab tests, and cashless treatments that cover the cost of the membership many times over.",
    },
    {
      question: "Will my whole family actually benefit?",
      answer:
        "Absolutely. Our Family Plan covers you, your spouse, kids, and dependent parents under one single dashboard. Everyone gets their own health profiles and dedicated support.",
    },
    {
      question: "Is support actually available when I need it?",
      answer:
        "Yes, we provide 24/7 digital and care support. You will be assigned a dedicated care coordinator who is a real human, ready to help you navigate emergencies, claims, or general queries.",
    },
    {
      question: "Is my health data safe with Restore Health Services?",
      answer:
        "We take data privacy very seriously, ensuring bank-level security for your medical records, prescriptions, and personal information.",
    },
  ];

  /* ==========================================
     SCROLL REVEAL
  ========================================== */

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    itemRefs.current.forEach((element, index) => {
      if (!element) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisibleItems((previous) => {
                if (previous.includes(index)) {
                  return previous;
                }

                return [...previous, index];
              });
            }
          });
        },
        {
          threshold: 0.12,
          rootMargin: "0px 0px -60px 0px",
        }
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  /* ==========================================
     FAQ TOGGLE
  ========================================== */

  const toggleFAQ = (index: number): void => {
    setOpenIndex((current) =>
      current === index ? null : index
    );
  };

  return (
    <section className="faq-section">
      {/* Background grid */}
      <div className="faq-grid" />

      {/* Background glow */}
      <div className="background-glow glow-one" />
      <div className="background-glow glow-two" />
      <div className="background-glow glow-three" />

      <div className="faq-container">

        {/* ========================================
            HEADER
        ======================================== */}

        <div className="faq-header">

          <div className="faq-badge">
            <span className="badge-icon">
              <MessageCircleQuestion size={15} />
            </span>

            <span>Before You Join</span>

            <span className="badge-pulse" />
          </div>

          <h2 className="faq-title">
            Questions,
            <span> Answered Honestly</span>
          </h2>

          <p className="faq-subtitle">
            Everything you need to know about Restore Health
            Services, explained simply and transparently.
          </p>

          <div className="title-decoration">
            <span />
            <div>
              <Sparkles size={14} />
            </div>
            <span />
          </div>
        </div>

        {/* ========================================
            TRUST CARDS
        ======================================== */}

        <div className="trust-grid">

          {/* Transparent */}

          <div className="trust-card">
            <div className="trust-icon">
              <ShieldCheck size={27} />
            </div>

            <div className="trust-content">
              <strong>Transparent</strong>

              <small>
                No hidden agendas
              </small>
            </div>
          </div>

          {/* Health First */}

          <div className="trust-card">
            <div className="trust-icon">
              <HeartPulse size={27} />
            </div>

            <div className="trust-content">
              <strong>Health First</strong>

              <small>
                Care built around you
              </small>
            </div>
          </div>

          {/* Real Support */}

          <div className="trust-card">
            <div className="trust-icon">
              <MessageCircleQuestion size={27} />
            </div>

            <div className="trust-content">
              <strong>Real Support</strong>

              <small>
                People when you need them
              </small>
            </div>
          </div>

        </div>

        {/* ========================================
            FAQ LIST
        ======================================== */}

        <div className="faq-list">

          {faqs.map((faq: FAQItem, index: number) => {
            const isOpen = openIndex === index;
            const isVisible = visibleItems.includes(index);

            return (
              <div
                key={faq.question}
                ref={(element) => {
                  itemRefs.current[index] = element;
                }}
                className={`faq-border-wrapper ${
                  isVisible ? "faq-item-visible" : ""
                } ${isOpen ? "faq-item-open" : ""}`}
              >

                {/* Rotating border */}

                <div className="rotating-border" />

                {/* Main card */}

                <div className="faq-item">

                  <div className="active-line" />

                  <div className="faq-card-glow" />

                  {/* QUESTION */}

                  <button
                    type="button"
                    className="faq-question"
                    onClick={() => toggleFAQ(index)}
                    aria-expanded={isOpen}
                  >

                    <div className="question-content">

                      <span className="question-number">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span className="question-text">
                        {faq.question}
                      </span>

                    </div>

                    <span
                      className={`chevron-wrapper ${
                        isOpen ? "chevron-active" : ""
                      }`}
                    >
                      <ChevronDown
                        size={21}
                        strokeWidth={2.5}
                      />
                    </span>

                  </button>

                  {/* ANSWER */}

                  <div
                    className={`answer-wrapper ${
                      isOpen ? "answer-visible" : ""
                    }`}
                  >
                    <div className="answer-content">

                      <div className="answer-decoration" />

                      <p>
                        {faq.answer}
                      </p>

                    </div>
                  </div>

                </div>
              </div>
            );
          })}

        </div>

        {/* ========================================
            BOTTOM MESSAGE
        ======================================== */}

        <div className="bottom-message">

          <div className="bottom-message-icon">
            <ShieldCheck size={22} />
          </div>

          <div className="bottom-message-text">

            <strong>
              Your questions matter.
            </strong>

            <span>
              Healthcare should always be clear and transparent.
            </span>

          </div>

          <div className="bottom-message-line" />

        </div>

      </div>

      {/* ==========================================
          STYLES
      ========================================== */}

      <style jsx>{`

        /* ========================================
           MAIN SECTION
        ======================================== */

        .faq-section {
          position: relative;
          width: 100%;
          overflow: hidden;

          padding: 100px 0 120px;

          background:
            radial-gradient(
              circle at 0% 0%,
              rgba(27, 77, 3, 0.20),
              transparent 30%
            ),
            radial-gradient(
              circle at 100% 5%,
              rgba(212, 163, 0, 0.18),
              transparent 28%
            ),
            radial-gradient(
              circle at 10% 100%,
              rgba(212, 163, 0, 0.13),
              transparent 30%
            ),
            linear-gradient(
              135deg,
              #e7f1df 0%,
              #f7f8eb 45%,
              #fff8e5 75%,
              #e8f2e1 100%
            );
        }

        /* ========================================
           DARK MODE BACKGROUND
        ======================================== */

        :global(.dark) .faq-section {
          background:
            radial-gradient(
              circle at 0% 0%,
              rgba(27, 77, 3, 0.50),
              transparent 32%
            ),
            radial-gradient(
              circle at 100% 0%,
              rgba(212, 163, 0, 0.13),
              transparent 28%
            ),
            linear-gradient(
              135deg,
              #061603,
              #0a2106 50%,
              #061603
            );
        }

        /* ========================================
           GRID
        ======================================== */

        .faq-grid {
          position: absolute;
          inset: 0;

          pointer-events: none;

          opacity: 0.32;

          background-image:
            linear-gradient(
              rgba(27, 77, 3, 0.035) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(27, 77, 3, 0.035) 1px,
              transparent 1px
            );

          background-size: 55px 55px;
        }

        :global(.dark) .faq-grid {
          opacity: 0.07;
        }

        /* ========================================
           BACKGROUND GLOW
        ======================================== */

        .background-glow {
          position: absolute;

          border-radius: 50%;

          pointer-events: none;

          filter: blur(100px);

          animation:
            floatingGlow
            9s
            ease-in-out
            infinite;
        }

        .glow-one {
          width: 350px;
          height: 350px;

          left: -180px;
          top: 180px;

          background:
            rgba(27, 77, 3, 0.13);
        }

        .glow-two {
          width: 320px;
          height: 320px;

          right: -160px;
          top: 420px;

          background:
            rgba(212, 163, 0, 0.13);

          animation-delay: 2s;
        }

        .glow-three {
          width: 250px;
          height: 250px;

          left: 40%;
          bottom: -140px;

          background:
            rgba(27, 77, 3, 0.12);

          animation-delay: 4s;
        }

        /* ========================================
           CONTAINER
        ======================================== */

        .faq-container {
          position: relative;

          z-index: 2;

          width:
            min(
              1120px,
              calc(100% - 80px)
            );

          margin: auto;
        }

        /* ========================================
           HEADER
        ======================================== */

        .faq-header {
          max-width: 820px;

          margin: auto;

          text-align: center;
        }

        .faq-badge {
          width: fit-content;

          display: flex;
          align-items: center;

          gap: 9px;

          margin:
            0 auto 20px;

          padding:
            9px 17px;

          border:
            1px solid
            rgba(27, 77, 3, 0.15);

          border-radius: 999px;

          background:
            rgba(255, 255, 255, 0.72);

          color: #1b4d03;

          font-size: 10px;

          font-weight: 900;

          letter-spacing: 0.18em;

          text-transform: uppercase;

          box-shadow:
            0 10px 35px
            rgba(27, 77, 3, 0.07);

          backdrop-filter: blur(14px);

          animation:
            headerDrop
            0.8s
            cubic-bezier(
              0.22,
              1,
              0.36,
              1
            )
            both;
        }

        :global(.dark) .faq-badge {
          color: #d4a300;

          border-color:
            rgba(212, 163, 0, 0.25);

          background:
            rgba(27, 77, 3, 0.35);
        }

        .badge-icon {
          width: 26px;
          height: 26px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 50%;

          color: #d4a300;

          background:
            rgba(212, 163, 0, 0.12);
        }

        .badge-pulse {
          width: 5px;
          height: 5px;

          border-radius: 50%;

          background: #1b4d03;

          animation:
            pulse
            1.7s
            infinite;
        }

        :global(.dark) .badge-pulse {
          background: #d4a300;
        }

        /* ========================================
           TITLE
        ======================================== */

        .faq-title {
          margin: 0;

          color: #000000;

          font-size:
            clamp(
              38px,
              5vw,
              58px
            );

          line-height: 1.05;

          letter-spacing: -0.045em;

          font-weight: 900;

          animation:
            titleReveal
            0.9s
            0.1s
            cubic-bezier(
              0.22,
              1,
              0.36,
              1
            )
            both;
        }

        :global(.dark) .faq-title {
          color: #ffffff;
        }

        .faq-title span {
          position: relative;

          display: inline-block;

          color: #1b4d03;
        }

        :global(.dark) .faq-title span {
          color: #d4a300;
        }

        .faq-title span::after {
          content: "";

          position: absolute;

          left: 0;
          bottom: -5px;

          width: 100%;
          height: 3px;

          border-radius: 999px;

          background:
            linear-gradient(
              90deg,
              #1b4d03,
              #d4a300
            );

          transform:
            scaleX(0);

          transform-origin: left;

          animation:
            underline
            0.8s
            0.8s
            ease
            forwards;
        }

        .faq-subtitle {
          max-width: 680px;

          margin:
            22px auto 0;

          color: #000000;

          font-size: 14px;

          line-height: 1.8;

          font-weight: 500;

          animation:
            titleReveal
            0.9s
            0.25s
            cubic-bezier(
              0.22,
              1,
              0.36,
              1
            )
            both;
        }

        :global(.dark) .faq-subtitle {
          color: #ffffff;
        }

        /* ========================================
           TITLE DECORATION
        ======================================== */

        .title-decoration {
          display: flex;

          align-items: center;
          justify-content: center;

          gap: 10px;

          margin-top: 24px;
        }

        .title-decoration > span {
          width: 65px;
          height: 1px;

          background:
            linear-gradient(
              90deg,
              transparent,
              #d4a300
            );
        }

        .title-decoration > span:last-child {
          background:
            linear-gradient(
              90deg,
              #d4a300,
              transparent
            );
        }

        .title-decoration > div {
          width: 31px;
          height: 31px;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 50%;

          color: #d4a300;

          background:
            rgba(212, 163, 0, 0.10);

          animation:
            spin
            5s
            linear
            infinite;
        }

        /* ========================================
           TRUST CARDS
        ======================================== */

        .trust-grid {
          display: grid;

          grid-template-columns:
            repeat(3, 1fr);

          gap: 24px;

          width: 100%;

          max-width: 1080px;

          margin:
            55px auto 50px;
        }

        .trust-card {
          position: relative;

          min-height: 125px;

          display: flex;

          align-items: center;

          gap: 19px;

          padding:
            26px 28px;

          border:
            1px solid
            rgba(27, 77, 3, 0.13);

          border-radius: 23px;

          background:
            rgba(255, 255, 255, 0.78);

          box-shadow:
            0 14px 38px
            rgba(27, 77, 3, 0.07);

          backdrop-filter: blur(18px);

          animation:
            cardAppear
            0.7s
            0.35s
            cubic-bezier(
              0.22,
              1,
              0.36,
              1
            )
            both;

          transition:
            transform 0.4s ease,
            box-shadow 0.4s ease,
            border-color 0.4s ease;
        }

        :global(.dark) .trust-card {
          background:
            rgba(27, 77, 3, 0.32);

          border-color:
            rgba(212, 163, 0, 0.16);
        }

        .trust-card:hover {
          transform:
            translateY(-9px)
            scale(1.015);

          border-color:
            rgba(212, 163, 0, 0.45);

          box-shadow:
            0 25px 55px
            rgba(27, 77, 3, 0.15);
        }

        .trust-icon {
          position: relative;

          z-index: 2;

          width: 64px;
          height: 64px;

          flex-shrink: 0;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 18px;

          color: #1b4d03;

          background:
            linear-gradient(
              135deg,
              #e7f2df,
              #f7edc8
            );

          box-shadow:
            0 8px 20px
            rgba(27, 77, 3, 0.10);

          transition:
            transform 0.4s ease,
            color 0.4s ease,
            background 0.4s ease;
        }

        :global(.dark) .trust-icon {
          color: #d4a300;

          background:
            rgba(212, 163, 0, 0.11);
        }

        .trust-card:hover .trust-icon {
          transform:
            rotate(-7deg)
            scale(1.1);

          color: white;

          background:
            linear-gradient(
              135deg,
              #1b4d03,
              #286b08
            );
        }

        .trust-card strong {
          display: block;

          color: #000000;

          font-size: 17px;

          font-weight: 900;
        }

        :global(.dark) .trust-card strong {
          color: #ffffff;
        }

        .trust-card small {
          display: block;

          margin-top: 6px;

          color: #000000;

          font-size: 12px;

          font-weight: 600;
        }

        :global(.dark) .trust-card small {
          color: #ffffff;
        }

        /* ========================================
           FAQ LIST
        ======================================== */

        .faq-list {
          display: flex;

          flex-direction: column;

          gap: 18px;

          width: 100%;
        }

        /* ========================================
           OUTER BORDER
        ======================================== */

        .faq-border-wrapper {
          position: relative;

          overflow: hidden;

          padding: 1.5px;

          border-radius: 23px;

          opacity: 0;

          transform:
            translateY(70px)
            scale(0.96);

          transition:
            opacity 0.75s
              cubic-bezier(
                0.22,
                1,
                0.36,
                1
              ),
            transform 0.75s
              cubic-bezier(
                0.22,
                1,
                0.36,
                1
              );
        }

        .faq-item-visible {
          opacity: 1;

          transform:
            translateY(0)
            scale(1);
        }

        .faq-border-wrapper:nth-child(1) {
          transition-delay: 0ms;
        }

        .faq-border-wrapper:nth-child(2) {
          transition-delay: 100ms;
        }

        .faq-border-wrapper:nth-child(3) {
          transition-delay: 200ms;
        }

        .faq-border-wrapper:nth-child(4) {
          transition-delay: 300ms;
        }

        .faq-border-wrapper:nth-child(5) {
          transition-delay: 400ms;
        }

        /* ========================================
           ROTATING BORDER
        ======================================== */

        .rotating-border {
          position: absolute;

          width: 180%;
          height: 600%;

          left: -40%;
          top: -250%;

          background:
            conic-gradient(
              from 0deg,
              transparent 0deg,
              transparent 45deg,
              #1b4d03 85deg,
              #d4a300 125deg,
              transparent 175deg,
              transparent 220deg,
              #d4a300 275deg,
              #1b4d03 320deg,
              transparent 360deg
            );

          animation:
            rotateBorder
            5s
            linear
            infinite;

          opacity: 0.72;
        }

        .faq-border-wrapper:hover
          .rotating-border {
          animation-duration: 2.8s;
          opacity: 1;
        }

        .faq-item-open
          .rotating-border {
          animation-duration: 2.5s;
          opacity: 1;
        }

        /* ========================================
           FAQ CARD
        ======================================== */

        .faq-item {
          position: relative;

          z-index: 2;

          overflow: hidden;

          border-radius: 21px;

          background:
            rgba(255, 255, 255, 0.97);

          box-shadow:
            0 12px 35px
            rgba(27, 77, 3, 0.07);
        }

        :global(.dark) .faq-item {
          background:
            #0b1d08;
        }

        /* ========================================
           ACTIVE LINE
        ======================================== */

        .active-line {
          position: absolute;

          left: 0;
          top: 0;
          bottom: 0;

          width: 4px;

          border-radius:
            20px 0 0 20px;

          background:
            linear-gradient(
              180deg,
              #1b4d03,
              #d4a300
            );

          transform:
            scaleY(0);

          transform-origin: center;

          transition:
            transform 0.55s
            cubic-bezier(
              0.22,
              1,
              0.36,
              1
            );
        }

        .faq-item-open .active-line {
          transform:
            scaleY(1);
        }

        /* ========================================
           QUESTION
        ======================================== */

        .faq-question {
          position: relative;

          z-index: 2;

          width: 100%;

          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 20px;

          padding:
            28px 32px;

          border: 0;

          background: transparent;

          cursor: pointer;

          text-align: left;

          outline: none;
        }

        .question-content {
          display: flex;

          align-items: center;

          gap: 17px;

          min-width: 0;
        }

        .question-number {
          flex-shrink: 0;

          color: #d4a300;

          font-size: 12px;

          font-weight: 900;

          letter-spacing: 0.08em;
        }

        .question-text {
          color: #000000;

          font-size: 17px;

          line-height: 1.5;

          font-weight: 900;

          transition:
            transform 0.35s ease,
            color 0.35s ease;
        }

        :global(.dark) .question-text {
          color: #ffffff;
        }

        .faq-item:hover
          .question-text {
          transform:
            translateX(4px);
        }

        /* ========================================
           CHEVRON
        ======================================== */

        .chevron-wrapper {
          width: 44px;
          height: 44px;

          flex-shrink: 0;

          display: flex;

          align-items: center;
          justify-content: center;

          border:
            1px solid
            rgba(27, 77, 3, 0.14);

          border-radius: 50%;

          color: #1b4d03;

          background:
            rgba(27, 77, 3, 0.05);

          transition:
            transform 0.55s
              cubic-bezier(
                0.87,
                0,
                0.13,
                1
              ),
            color 0.35s ease,
            background 0.35s ease;
        }

        :global(.dark)
          .chevron-wrapper {
          color: #d4a300;

          border-color:
            rgba(212, 163, 0, 0.18);
        }

        .chevron-active {
          transform:
            rotate(180deg);

          color: white;

          background:
            #1b4d03;

          border-color:
            #1b4d03;

          box-shadow:
            0 8px 25px
            rgba(27, 77, 3, 0.25);
        }

        /* ========================================
           ANSWER ANIMATION
        ======================================== */

        .answer-wrapper {
          display: grid;

          grid-template-rows: 0fr;

          opacity: 0;

          transition:
            grid-template-rows
              0.6s
              cubic-bezier(
                0.22,
                1,
                0.36,
                1
              ),
            opacity 0.35s ease;
        }

        .answer-visible {
          grid-template-rows: 1fr;

          opacity: 1;
        }

        .answer-content {
          min-height: 0;

          overflow: hidden;

          display: flex;

          gap: 17px;

          padding:
            0 32px;
        }

        .answer-visible
          .answer-content {
          padding-bottom: 32px;
        }

        .answer-decoration {
          width: 3px;

          flex-shrink: 0;

          border-radius: 99px;

          background:
            linear-gradient(
              180deg,
              #d4a300,
              #1b4d03,
              transparent
            );

          transform:
            scaleY(0);

          transform-origin: top;

          transition:
            transform 0.55s 0.1s ease;
        }

        .answer-visible
          .answer-decoration {
          transform:
            scaleY(1);
        }

        /* ========================================
           ANSWER TEXT
        ======================================== */

        .answer-content p {
          margin: 0;

          color: #000000;

          font-size: 15px;

          line-height: 1.9;

          font-weight: 650;

          letter-spacing: 0.005em;

          transform:
            translateY(-15px);

          opacity: 0;

          transition:
            transform 0.55s 0.1s ease,
            opacity 0.45s 0.1s ease;
        }

        :global(.dark)
          .answer-content p {
          color: #ffffff;
        }

        .answer-visible
          .answer-content p {
          transform:
            translateY(0);

          opacity: 1;
        }

        /* ========================================
           BOTTOM MESSAGE
        ======================================== */

        .bottom-message {
          position: relative;

          width: fit-content;

          max-width:
            calc(100% - 20px);

          min-height: 88px;

          display: flex;

          align-items: center;

          gap: 18px;

          margin:
            45px auto 0;

          padding:
            19px 27px;

          border:
            1px solid
            rgba(27, 77, 3, 0.16);

          border-radius: 20px;

          background:
            rgba(255, 255, 255, 0.72);

          box-shadow:
            0 16px 40px
            rgba(27, 77, 3, 0.09);

          backdrop-filter: blur(18px);

          transition:
            transform 0.4s ease,
            box-shadow 0.4s ease,
            border-color 0.4s ease;
        }

        :global(.dark) .bottom-message {
          background:
            rgba(27, 77, 3, 0.35);

          border-color:
            rgba(212, 163, 0, 0.22);
        }

        .bottom-message:hover {
          transform:
            translateY(-5px);

          border-color:
            rgba(212, 163, 0, 0.45);

          box-shadow:
            0 25px 55px
            rgba(27, 77, 3, 0.14);
        }

        .bottom-message-icon {
          width: 52px;
          height: 52px;

          flex-shrink: 0;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 15px;

          color: #1b4d03;

          background:
            linear-gradient(
              135deg,
              #e5f0dd,
              #f8edc9
            );

          box-shadow:
            0 8px 20px
            rgba(27, 77, 3, 0.10);

          animation:
            iconFloat
            3s
            ease-in-out
            infinite;
        }

        :global(.dark)
          .bottom-message-icon {
          color: #d4a300;

          background:
            rgba(212, 163, 0, 0.12);
        }

        .bottom-message-text {
          display: flex;

          flex-direction: column;

          gap: 5px;
        }

        .bottom-message strong {
          display: block;

          color: #000000;

          font-size: 16px;

          font-weight: 900;
        }

        :global(.dark)
          .bottom-message strong {
          color: #ffffff;
        }

        .bottom-message span {
          display: block;

          color: #000000;

          font-size: 12px;

          line-height: 1.5;

          font-weight: 600;
        }

        :global(.dark)
          .bottom-message span {
          color: #ffffff;
        }

        .bottom-message-line {
          width: 55px;
          height: 2px;

          margin-left: 15px;

          border-radius: 99px;

          background:
            linear-gradient(
              90deg,
              #1b4d03,
              #d4a300
            );

          animation:
            linePulse
            2.5s
            ease-in-out
            infinite;
        }

        /* ========================================
           ANIMATIONS
        ======================================== */

        @keyframes rotateBorder {
          from {
            transform:
              rotate(0deg);
          }

          to {
            transform:
              rotate(360deg);
          }
        }

        @keyframes headerDrop {
          from {
            opacity: 0;
            transform:
              translateY(-20px);
          }

          to {
            opacity: 1;
            transform:
              translateY(0);
          }
        }

        @keyframes titleReveal {
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

        @keyframes underline {
          from {
            transform:
              scaleX(0);
          }

          to {
            transform:
              scaleX(1);
          }
        }

        @keyframes pulse {
          0% {
            box-shadow:
              0 0 0 0
              rgba(212, 163, 0, 0.5);
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

        @keyframes spin {
          from {
            transform:
              rotate(0deg);
          }

          to {
            transform:
              rotate(360deg);
          }
        }

        @keyframes floatingGlow {
          0%,
          100% {
            transform:
              translate(0, 0)
              scale(1);
          }

          50% {
            transform:
              translate(25px, -25px)
              scale(1.08);
          }
        }

        @keyframes cardAppear {
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

        @keyframes iconFloat {
          0%,
          100% {
            transform:
              translateY(0);
          }

          50% {
            transform:
              translateY(-4px);
          }
        }

        @keyframes linePulse {
          0%,
          100% {
            opacity: 0.5;
            transform:
              scaleX(0.7);
          }

          50% {
            opacity: 1;
            transform:
              scaleX(1);
          }
        }

        /* ========================================
           MOBILE
        ======================================== */

        @media (max-width: 700px) {

          .faq-section {
            padding:
              75px 0 85px;
          }

          .faq-container {
            width:
              calc(100% - 20px);
          }

          .trust-grid {
            grid-template-columns:
              1fr;

            gap: 13px;

            margin:
              35px auto
              32px;
          }

          .trust-card {
            min-height: 95px;

            padding:
              20px;
            }
          
          .trust-icon {
            width: 52px;
            height: 52px;
          }

          .faq-question {
            padding:
              21px 17px;
          }

          .question-content {
            gap: 11px;
          }

          .question-text {
            font-size: 14px;
          }

          .question-number {
            font-size: 9px;
          }

          .chevron-wrapper {
            width: 37px;
            height: 37px;
          }

          .answer-content {
            padding:
              0 17px;
          }

          .answer-visible
            .answer-content {
            padding-bottom: 23px;
          }

          .answer-content p {
            font-size: 13px;

            line-height: 1.8;
          }

          .bottom-message {
            min-height: 92px;

            width:
              calc(100% - 8px);

            padding:
              18px;
          }

          .bottom-message-line {
            display: none;
          }

          .bottom-message strong {
            font-size: 14px;
          }

          .bottom-message span {
            font-size: 10px;
          }
        }

        /* ========================================
           SMALL MOBILE
        ======================================== */

        @media (max-width: 420px) {

          .faq-title {
            font-size: 31px;
          }

          .faq-subtitle {
            font-size: 12px;
          }

          .trust-card {
            min-height: 88px;

            padding:
              17px;
          }

          .trust-icon {
            width: 48px;
            height: 48px;
          }

          .trust-card strong {
            font-size: 14px;
          }

          .trust-card small {
            font-size: 9px;
          }

          .question-text {
            font-size: 12.5px;
          }

          .answer-content p {
            font-size: 12.5px;
          }
        }

        /* ========================================
           REDUCED MOTION
        ======================================== */

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

          .faq-border-wrapper {
            opacity: 1;
            transform: none;
          }

          .rotating-border {
            animation: none;
          }
        }

      `}</style>
    </section>
  );
}