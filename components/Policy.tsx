export default function PrivacyPolicy() {
  return (
    <section className="w-full bg-white px-5 py-10 text-black transition-colors duration-300 dark:bg-[#111827] dark:text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        {/* Heading */}
        <h2 className="mb-5 text-2xl font-bold sm:text-3xl">
          Refund Policy
        </h2>

        {/* Policy Text */}
        <div className="space-y-4 text-sm leading-7 text-gray-700 dark:text-gray-300 sm:text-base">
          <p>
            After the policy is issued, the premium amount will not be
            refunded and the policy cannot be cancelled.
          </p>

          <p>
            The reason is that after issuance of the policy, the applicable
            amount will be transferred to the respective service partner.
          </p>

          <p className="font-semibold text-black dark:text-white">
            Therefore, there will be no policy cancellation and no refund
            after the policy has been issued.
          </p>
        </div>
      </div>
    </section>
  );
}