"use client";

import { motion } from "framer-motion";

export default function PrivacyPolicyPage() {
  const sections = [
    {
      title: "1. Information We May Collect",
      content: (
        <>
          <p>
            Depending on how you use our website and healthcare services, we may
            collect information that you voluntarily provide to us, including:
          </p>

          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Name, phone number, email address and contact details.</li>

            <li>
              Information submitted through contact forms, enquiries or service
              requests.
            </li>

            <li>
              Health-related or medical information that you choose to provide
              while using our healthcare services.
            </li>

            <li>
              Details related to selected healthcare plans, services,
              appointments or consultations.
            </li>

            <li>
              Transaction references and payment-related information necessary
              to process a service or membership.
            </li>

            <li>
              Technical information such as browser type, device information, IP
              address and website usage information.
            </li>
          </ul>
        </>
      ),
    },

    {
      title: "2. How We Use Your Information",
      content: (
        <>
          <p>
            We may use the information collected through our website and
            services for purposes such as:
          </p>

          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Providing and managing healthcare-related services.</li>

            <li>
              Processing service requests, memberships, appointments and
              enquiries.
            </li>

            <li>Communicating with you regarding your requested services.</li>

            <li>
              Coordinating with authorised healthcare or service partners where
              required to fulfil your request.
            </li>

            <li>
              Providing customer support and responding to questions or
              complaints.
            </li>

            <li>
              Improving the functionality, performance and user experience of
              our website.
            </li>

            <li>
              Preventing misuse, fraud, security threats or unauthorised
              activity.
            </li>

            <li>
              Meeting applicable legal, regulatory and compliance requirements.
            </li>
          </ul>
        </>
      ),
    },

    {
      title: "3. Consent and Information You Provide",
      content: (
        <p>
          When you provide personal information through our website, forms or
          healthcare services, we use that information for the purpose for which
          it was provided and for related purposes necessary to deliver the
          requested service. Where consent is required, you may be asked to
          provide your consent before your personal information is processed.
        </p>
      ),
    },

    {
      title: "4. Sharing of Personal Information",
      content: (
        <>
          <p>
            We do not intend to disclose your personal information to unrelated
            third parties for their independent use. However, information may be
            shared when reasonably necessary to provide a service requested by
            you.
          </p>

          <p className="mt-3">
            This may include authorised hospitals, diagnostic centres,
            pharmacies, doctors, healthcare professionals, payment processors,
            technology providers and other service partners involved in
            delivering the requested service.
          </p>

          <p className="mt-3">
            Information may also be disclosed where required under applicable
            law or to respond to a valid request from a competent authority.
          </p>
        </>
      ),
    },

    {
      title: "5. Health and Medical Information",
      content: (
        <p>
          Certain services may require you to provide health-related
          information, medical reports, prescriptions or other healthcare
          details. Such information should be collected and used only where
          necessary for providing the relevant healthcare service, consultation
          or support requested by you.
        </p>
      ),
    },

    {
      title: "6. Payment Information",
      content: (
        <p>
          Payments for memberships or services may be processed through
          authorised third-party payment providers. Payment providers may
          process payment credentials according to their own security and
          privacy practices. We may receive transaction-related information such
          as payment status, transaction reference or payment confirmation.
        </p>
      ),
    },

    {
      title: "7. Cookies and Website Usage Information",
      content: (
        <>
          <p>
            Our website may use cookies or similar technologies to support
            website functionality, remember preferences, understand website
            usage and improve the overall user experience.
          </p>

          <p className="mt-3">
            You may control or delete cookies through your browser settings.
            Disabling certain cookies may affect some website functionality.
          </p>
        </>
      ),
    },

    {
      title: "8. Data Security",
      content: (
        <p>
          We take reasonable technical and organisational measures designed to
          protect personal information against unauthorised access, misuse,
          alteration, disclosure or loss. However, no internet-based system or
          electronic transmission can be guaranteed to be completely secure.
        </p>
      ),
    },

    {
      title: "9. Data Retention",
      content: (
        <p>
          Personal information is retained only for as long as reasonably
          necessary for the purpose for which it was collected, to provide the
          requested services, maintain legitimate business records, resolve
          disputes and meet applicable legal or regulatory requirements.
        </p>
      ),
    },

    {
      title: "10. Your Privacy Choices and Requests",
      content: (
        <>
          <p>
            You may contact us regarding the personal information that you have
            provided to us, including requests concerning access, correction,
            updating or deletion, where applicable.
          </p>

          <p className="mt-3">
            Some information may need to be retained where retention is required
            for legal, regulatory, contractual, fraud-prevention or legitimate
            record-keeping purposes.
          </p>
        </>
      ),
    },

    {
      title: "11. Children's Privacy",
      content: (
        <p>
          Where personal information relating to a child is required for a
          healthcare service, appropriate information and consent should be
          obtained from the parent or lawful guardian where required. We do not
          intend to knowingly use children's personal information for purposes
          unrelated to the healthcare or service request.
        </p>
      ),
    },

    {
      title: "12. Third-Party Websites and Services",
      content: (
        <p>
          Our website may contain links to third-party websites, healthcare
          providers, payment services or other external platforms. Their privacy
          practices are governed by their own policies, and we encourage you to
          review those policies before providing personal information to them.
        </p>
      ),
    },

    {
      title: "13. Changes to This Privacy Policy",
      content: (
        <p>
          We may update this Privacy Policy from time to time to reflect changes
          in our services, technology, operational practices or applicable
          requirements. Any updated version will be published on this page with
          an updated revision date.
        </p>
      ),
    },

    {
      title: "14. Contact Us",
      content: (
        <>
          <p>
            If you have any questions, concerns or requests regarding this
            Privacy Policy or the handling of your personal information, you can
            contact Restore Health Services through our official Contact Us
            page.
          </p>

          <a
            href="/services/contact-us"
            className="mt-4 inline-block font-semibold text-[#1B4D03] underline underline-offset-4 transition-colors hover:text-[#B88600] dark:text-[#D4A300]"
          >
            Contact Restore Health Services
          </a>
        </>
      ),
    },
  ];

  return (
    <main className="w-full bg-white text-slate-900 transition-colors duration-300 dark:bg-[#111827] dark:text-white">
      <section className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
        {/* =========================================
            PAGE HEADER
        ========================================== */}

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
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
            Privacy Policy
          </h1>

          <div className="mt-4 h-1 w-16 rounded-full bg-[#D4A300]" />

          <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
            This Privacy Policy explains how Restore Health Services (OPC)
            Private Limited may collect, use, process, share and protect
            personal information when you visit our website or use our
            healthcare-related services.
          </p>

          <p className="mt-4 text-xs font-medium text-slate-500 dark:text-slate-400">
            Last updated: 19 August 2026
          </p>
        </motion.div>

        {/* =========================================
            POLICY CONTENT
        ========================================== */}

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
                amount: 0.1,
              }}
              transition={{
                duration: 0.45,
                delay: Math.min(index * 0.025, 0.15),
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

        {/* =========================================
            FINAL NOTE
        ========================================== */}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-8 border-t border-slate-200 pt-7 dark:border-slate-700"
        >
          <p className="text-xs leading-6 text-slate-500 dark:text-slate-400 sm:text-sm">
            By continuing to use this website or voluntarily providing your
            information, you acknowledge that you have read this Privacy Policy.
          </p>
        </motion.div>
      </section>
    </main>
  );
}
