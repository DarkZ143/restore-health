"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function TermsAndConditionsPage() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: (
        <p>
          By accessing or using the website, healthcare services, memberships,
          plans or other services offered through Restore Health Services, you
          acknowledge that you have read, understood and agreed to these Terms
          and Conditions.
        </p>
      ),
    },

    {
      title: "2. About Our Services",
      content: (
        <>
          <p>
            Restore Health Services provides access to healthcare-related
            services, wellness benefits, consultations, diagnostics,
            medicines, healthcare memberships and other related services.
          </p>

          <p className="mt-3">
            Certain services may be provided directly by Restore Health
            Services while others may be fulfilled through authorised doctors,
            hospitals, laboratories, pharmacies, insurers or other service
            partners.
          </p>
        </>
      ),
    },

    {
      title: "3. Eligibility and Accurate Information",
      content: (
        <>
          <p>
            You are responsible for providing accurate, complete and current
            information when using our website or requesting any service.
          </p>

          <p className="mt-3">
            This may include your name, contact details, age, healthcare
            information, prescription details, service requirements and other
            information necessary to process your request.
          </p>

          <p className="mt-3">
            Providing incorrect, incomplete or misleading information may
            affect the availability, processing or delivery of a requested
            service.
          </p>
        </>
      ),
    },

    {
      title: "4. Healthcare Information",
      content: (
        <>
          <p>
            Information available on this website is intended to provide
            general information regarding our healthcare services and should
            not be treated as a substitute for professional medical advice,
            diagnosis or treatment.
          </p>

          <p className="mt-3">
            Medical decisions should be made in consultation with an
            appropriately qualified healthcare professional.
          </p>

          <p className="mt-3 font-semibold text-slate-900 dark:text-white">
            In case of a medical emergency, please seek immediate assistance
            from an appropriate emergency healthcare provider.
          </p>
        </>
      ),
    },

    {
      title: "5. Service Availability",
      content: (
        <>
          <p>
            The availability of services may depend on your location, service
            provider availability, eligibility requirements, operating hours,
            network availability and other service-specific conditions.
          </p>

          <p className="mt-3">
            We may update, replace, modify, suspend or discontinue a service
            where reasonably necessary.
          </p>
        </>
      ),
    },

    {
      title: "6. Plans, Memberships and Benefits",
      content: (
        <>
          <p>
            Healthcare plans, memberships and benefit packages may contain
            different eligibility requirements, usage limits, credits,
            validity periods, coverage amounts, exclusions and service
            conditions.
          </p>

          <p className="mt-3">
            Customers should carefully review the applicable plan details and
            benefit information before making a purchase.
          </p>

          <p className="mt-3">
            Benefits associated with a specific plan are subject to the terms
            applicable to that plan and the relevant service partner.
          </p>
        </>
      ),
    },

    {
      title: "7. Pricing and Payments",
      content: (
        <>
          <p>
            Prices displayed on the website may be subject to applicable taxes,
            charges or fees as communicated at the time of purchase.
          </p>

          <p className="mt-3">
            Payments may be processed through authorised payment service
            providers. A transaction will be considered successful only after
            the relevant payment confirmation is received.
          </p>

          <p className="mt-3">
            Any payment failure, delay or technical issue caused by a bank,
            payment gateway or external payment provider may be subject to that
            provider&apos;s processing procedures.
          </p>
        </>
      ),
    },

    {
      title: "8. Cancellation and Refunds",
      content: (
        <>
          <p>
            Cancellation and refund eligibility is governed by our separate
            Cancellation and Refund Policy.
          </p>

          <Link
            href="/cancellation-and-refund-policy"
            className="mt-4 inline-block font-semibold text-[#1B4D03] underline underline-offset-4 transition-colors hover:text-[#B88600] dark:text-[#D4A300]"
          >
            View Cancellation and Refund Policy
          </Link>
        </>
      ),
    },

    {
      title: "9. Third-Party Service Partners",
      content: (
        <>
          <p>
            Some healthcare services may be delivered through third-party
            service partners such as hospitals, laboratories, pharmacies,
            doctors, healthcare professionals, insurers, payment processors or
            technology providers.
          </p>

          <p className="mt-3">
            Where a third-party provider is involved, additional terms,
            eligibility requirements or operational conditions of that provider
            may apply.
          </p>
        </>
      ),
    },

    {
      title: "10. User Responsibilities",
      content: (
        <>
          <p>When using our website and services, you agree not to:</p>

          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Provide false, misleading or fraudulent information.</li>

            <li>
              Use another person&apos;s identity or personal information
              without appropriate authorisation.
            </li>

            <li>
              Attempt to interfere with the security or functionality of the
              website.
            </li>

            <li>
              Use our services for unlawful, fraudulent or abusive purposes.
            </li>

            <li>
              Copy, reproduce or misuse website content in violation of
              applicable rights.
            </li>
          </ul>
        </>
      ),
    },

    {
      title: "11. Account and Access Security",
      content: (
        <p>
          If account-based services are made available, you are responsible for
          maintaining the confidentiality of your login information and for
          activities performed through your account. Please notify our support
          team if you become aware of unauthorised access or suspicious
          activity.
        </p>
      ),
    },

    {
      title: "12. Intellectual Property",
      content: (
        <p>
          Unless otherwise stated, the website&apos;s branding, text,
          graphics, design, logos and other proprietary content belonging to
          Restore Health Services may not be copied, reproduced, distributed or
          commercially used without appropriate permission.
        </p>
      ),
    },

    {
      title: "13. Privacy and Personal Information",
      content: (
        <>
          <p>
            Personal information submitted through this website is handled in
            accordance with our Privacy Policy and applicable requirements.
          </p>

          <Link
            href="/privacy-policy"
            className="mt-4 inline-block font-semibold text-[#1B4D03] underline underline-offset-4 transition-colors hover:text-[#B88600] dark:text-[#D4A300]"
          >
            View Privacy Policy
          </Link>
        </>
      ),
    },

    {
      title: "14. Website Availability",
      content: (
        <>
          <p>
            We aim to keep our website and digital services available and
            functional. However, temporary interruptions may occur due to
            maintenance, updates, network problems, technical failures or other
            circumstances.
          </p>

          <p className="mt-3">
            We may perform maintenance or updates where required to maintain or
            improve the website and its services.
          </p>
        </>
      ),
    },

    {
      title: "15. Limitation of Responsibility",
      content: (
        <p>
          To the extent permitted by applicable law, Restore Health Services
          will not be responsible for losses resulting solely from circumstances
          beyond its reasonable control, including failures of independent
          third-party systems, networks or service providers. Nothing in these
          Terms is intended to exclude rights or remedies that cannot lawfully
          be excluded.
        </p>
      ),
    },

    {
      title: "16. Suspension or Termination",
      content: (
        <p>
          We may restrict or suspend access to website features or services
          where reasonably necessary to address misuse, suspected fraud,
          security risks, unlawful activity or violations of these Terms.
        </p>
      ),
    },

    {
      title: "17. Changes to These Terms",
      content: (
        <p>
          These Terms and Conditions may be updated from time to time to reflect
          changes in our services, operational practices or applicable
          requirements. The updated version will be published on this page.
        </p>
      ),
    },

    {
      title: "18. Governing Law",
      content: (
        <p>
          These Terms and Conditions are governed by the laws applicable in
          India. Any dispute or proceeding will be handled in accordance with
          applicable law and the jurisdiction permitted under such law.
        </p>
      ),
    },

    {
      title: "19. Contact Us",
      content: (
        <>
          <p>
            If you have questions about these Terms and Conditions or require
            assistance regarding our services, please contact Restore Health
            Services through our official Contact Us page.
          </p>

          <Link
            href="/services/contact-us"
            className="mt-4 inline-block font-semibold text-[#1B4D03] underline underline-offset-4 transition-colors hover:text-[#B88600] dark:text-[#D4A300]"
          >
            Contact Restore Health Services
          </Link>
        </>
      ),
    },
  ];

  return (
    <main className="w-full bg-white text-slate-900 transition-colors duration-300 dark:bg-[#111827] dark:text-white">
      <section className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
        {/* ================= HEADER ================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
            ease: "easeOut",
          }}
          className="border-b border-slate-200 pb-8 dark:border-slate-700"
        >
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#B88600]">
            Restore Health Services
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-[#1B4D03] dark:text-white sm:text-4xl lg:text-5xl">
            Terms and Conditions
          </h1>

          <div className="mt-4 h-1 w-16 rounded-full bg-[#D4A300]" />

          <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
            These Terms and Conditions govern your access to and use of the
            Restore Health Services website and the healthcare-related services
            made available through our platform.
          </p>

          <p className="mt-4 text-xs font-medium text-slate-500 dark:text-slate-400">
            Last updated: 19 August 2026
          </p>
        </motion.div>

        {/* ================= CONTENT ================= */}

        <div className="mt-10">
          {sections.map((section, index) => (
            <motion.section
              key={section.title}
              initial={{
                opacity: 0,
                y: 14,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.08,
              }}
              transition={{
                duration: 0.42,
                delay: Math.min(index * 0.02, 0.12),
                ease: "easeOut",
              }}
              className="
                border-b
                border-slate-200
                py-7
                last:border-b-0
                dark:border-slate-700
              "
            >
              <h2 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
                {section.title}
              </h2>

              <div className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base sm:leading-8">
                {section.content}
              </div>
            </motion.section>
          ))}
        </div>

        {/* ================= BOTTOM NOTE ================= */}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-8 border-t border-slate-200 pt-7 dark:border-slate-700"
        >
          <p className="text-xs leading-6 text-slate-500 dark:text-slate-400 sm:text-sm">
            By continuing to access or use our website or services, you
            acknowledge that you have read and understood these Terms and
            Conditions.
          </p>
        </motion.div>
      </section>
    </main>
  );
}