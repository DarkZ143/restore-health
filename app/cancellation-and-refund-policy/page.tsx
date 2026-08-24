"use client";

import { motion } from "framer-motion";

export default function CancellationRefundPolicyPage() {
  return (
    <main className="w-full bg-white text-slate-900 transition-colors duration-300 dark:bg-[#111827] dark:text-white">
      <section className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
        {/* HEADER */}

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
            Cancellation and Refund Policy
          </h1>

          <div className="mt-4 h-1 w-16 rounded-full bg-[#D4A300]" />

          <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
            Please read our cancellation and refund terms carefully before
            purchasing or activating any policy or healthcare-related service.
          </p>

          <p className="mt-4 text-xs font-medium text-slate-500 dark:text-slate-400">
            Last updated: 19 August 2026
          </p>
        </motion.div>

        {/* POLICY CONTENT */}

        <div className="mt-10">
          {/* SECTION 1 */}

          <motion.section
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.45 }}
            className="border-b border-slate-200 py-7 dark:border-slate-700"
          >
            <h2 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
              1. No refund after policy issuance
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base sm:leading-8">
              After the policy has been issued, the premium amount will not be
              refunded.
            </p>
          </motion.section>

          {/* SECTION 2 */}

          <motion.section
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.45, delay: 0.04 }}
            className="border-b border-slate-200 py-7 dark:border-slate-700"
          >
            <h2 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
              2. No cancellation after policy issuance
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base sm:leading-8">
              Once the policy has been successfully issued, the policy cannot be
              cancelled.
            </p>
          </motion.section>

          {/* SECTION 3 */}

          {/* SECTION 4 */}

          <motion.section
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.45, delay: 0.12 }}
            className="border-b border-slate-200 py-7 dark:border-slate-700"
          >
            <h2 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
              3. Reason for non-refund and non-cancellation
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base sm:leading-8">
              Since the applicable amount is transferred to the respective
              service partner after the policy is issued, cancellation and
              refund cannot be processed after issuance.
            </p>
          </motion.section>

          {/* CONTACT */}

          <motion.section
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.45, delay: 0.2 }}
            className="py-7"
          >
            <h2 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
              4. Contact us
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base sm:leading-8">
              If you have any questions regarding this Cancellation and Refund
              Policy, please contact our support team before purchasing or
              activating a policy.
            </p>

            <a
              href="/services/contact-us"
              className="mt-4 inline-block font-semibold text-[#1B4D03] underline underline-offset-4 transition-colors hover:text-[#B88600] dark:text-[#D4A300]"
            >
              Contact Restore Health Services
            </a>
          </motion.section>
        </div>

        {/* FINAL NOTE */}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-4 border-t border-slate-200 pt-7 dark:border-slate-700"
        >
          <p className="text-xs leading-6 text-slate-500 dark:text-slate-400 sm:text-sm">
            By purchasing or activating a policy, the customer acknowledges and
            agrees to the above cancellation and refund terms.
          </p>
        </motion.div>
      </section>
    </main>
  );
}
