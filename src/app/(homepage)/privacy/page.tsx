"use client";

import { motion } from "framer-motion";

export default function PrivacyPage() {
  return (
    <section className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-zinc-950 text-white py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-400 max-w-lg mx-auto">
            How we collect, use, protect, and respect your information.
          </p>
        </motion.div>

        {/* Content Container */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 md:p-12 shadow-xl space-y-10 leading-relaxed text-gray-300"
        >
          <section>
            <h2 className="text-xl font-semibold text-primary mb-3">
              1. Introduction
            </h2>
            <p>
              At Rammys Radiance, we are committed to protecting your personal
              data. This policy explains how your information is collected,
              used, and safeguarded when you visit our website, make purchases,
              or interact with our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mb-3">
              2. Information We Collect
            </h2>
            <p className="mb-4">
              We may collect the following types of information:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-400">
              <li>
                <span className="text-gray-300">Personal details:</span> Name,
                email, phone number, address.
              </li>
              <li>
                <span className="text-gray-300">Order information:</span>{" "}
                Products purchased, payment status, transaction data.
              </li>
              <li>
                <span className="text-gray-300">Device data:</span> IP address,
                browser type, operating system.
              </li>
              <li>
                <span className="text-gray-300">Cookies:</span> Session data
                used to remember preferences and enhance experience.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mb-3">
              3. How We Use Your Information
            </h2>
            <p className="mb-4">Your data helps us:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-400">
              <li>Process and deliver your orders.</li>
              <li>
                Communicate updates, confirmations, and support responses.
              </li>
              <li>Improve our website, services, and customer experience.</li>
              <li>Detect and prevent fraudulent or unauthorized activities.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mb-3">
              4. Sharing Your Information
            </h2>
            <p>
              We do not sell or trade your data. We only share information with
              trusted partners such as payment processors, logistics providers,
              and service tools required to operate our store. These partners
              are obligated to keep your information secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mb-3">
              5. Cookies & Tracking
            </h2>
            <p>
              Cookies help us personalize your experience and understand how
              visitors use the website. You can disable cookies in your browser
              settings, although some features may not function properly without
              them.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mb-3">
              6. Data Protection & Security
            </h2>
            <p>
              We use encrypted connections, secure servers, and
              industry-standard safeguards to protect your data. While no system
              is entirely infallible, we continuously strengthen our security
              measures.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mb-3">
              7. Your Rights
            </h2>
            <p className="mb-4">
              You may request to update, correct, or delete your personal
              information at any time.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-400">
              <li>Access: Request a copy of your stored data.</li>
              <li>Correction: Update incomplete or inaccurate information.</li>
              <li>
                Deletion: Request removal of your personal information (within
                legal limits).
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mb-3">
              8. Retention of Data
            </h2>
            <p>
              We retain your information only as long as necessary for order
              fulfillment, support, legal compliance, and improving customer
              experience.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mb-3">
              9. Changes to This Policy
            </h2>
            <p>
              We may update this policy occasionally to reflect new regulations
              or service improvements. Any changes will be posted on this page
              with an updated revision date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mb-3">
              10. Contact Us
            </h2>
            <p>
              For questions or privacy-related requests, contact us at
              <br />
              <span className="text-primary">privacy@rammys.com</span>
            </p>
          </section>
        </motion.div>
      </div>
    </section>
  );
}
