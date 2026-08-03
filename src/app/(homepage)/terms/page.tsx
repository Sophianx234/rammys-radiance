"use client";

import { motion } from "framer-motion";
import {
  FileText,
  ShieldAlert,
  UserCheck,
  Globe2,
  Lock,
  BadgeCheck,
  Scale,
  Wallet,
} from "lucide-react";

export default function TermsPage() {
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
            Terms & Conditions
          </h1>
          <p className="text-gray-400 max-w-lg mx-auto">
            Clear and simple guidelines for using our website and services.
          </p>
        </motion.div>

        {/* Main Container */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 md:p-12 shadow-xl space-y-10 leading-relaxed text-gray-300"
        >
          {/* Section 1 */}
          <section>
            <h2 className="text-xl font-semibold text-primary mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Acceptance of Terms
            </h2>
            <p>
              By using this website, you agree to comply with and be bound by
              these Terms & Conditions. If you do not agree with any part of
              these terms, you may not use our services.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-xl font-semibold text-primary mb-3 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-primary" />
              Eligibility
            </h2>
            <p>
              You must be at least 18 years old or accessing the site under the
              supervision of a guardian to place an order or create an account.
            </p>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-xl font-semibold text-primary mb-3 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-primary" />
              Orders & Payments
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-400">
              <li>
                <span className="text-gray-300">Accurate information:</span> You
                agree to provide correct billing and delivery details.
              </li>
              <li>
                <span className="text-gray-300">Price changes:</span> Prices may
                change without prior notice.
              </li>
              <li>
                <span className="text-gray-300">Order confirmation:</span>{" "}
                Orders are confirmed once payment is received.
              </li>
              <li>
                <span className="text-gray-300">Fraud prevention:</span>{" "}
                Suspicious or fraudulent orders may be cancelled.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-xl font-semibold text-primary mb-3 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-primary" />
              Product Availability
            </h2>
            <p>
              Stock availability is not guaranteed. If a product becomes
              unavailable after ordering, we will notify you and issue a refund
              or offer an alternative.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-xl font-semibold text-primary mb-3 flex items-center gap-2">
              <BadgeCheck className="w-5 h-5 text-primary" />
              Use of Website
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-400">
              <li>Do not misuse the website or attempt unauthorized access.</li>
              <li>Do not upload harmful, misleading, or unlawful content.</li>
              <li>Do not interfere with website performance or security.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-xl font-semibold text-primary mb-3 flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              Privacy & Data Protection
            </h2>
            <p>
              We respect your privacy and handle personal information
              responsibly. Please read our{" "}
              <span className="text-primary underline">Privacy Policy</span> for
              full details.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-xl font-semibold text-primary mb-3 flex items-center gap-2">
              <Globe2 className="w-5 h-5 text-primary" />
              Third-Party Links
            </h2>
            <p>
              Our website may contain links to third-party services. We are not
              responsible for the content, policies, or actions of these
              external sites.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-xl font-semibold text-primary mb-3 flex items-center gap-2">
              <Scale className="w-5 h-5 text-primary" />
              Limitation of Liability
            </h2>
            <p>
              Rammys Radiance is not liable for any indirect, incidental, or
              consequential damages resulting from the use of our services.
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-xl font-semibold text-primary mb-3">
              Changes to Terms
            </h2>
            <p>
              We may update these terms occasionally. Continued use of our
              website indicates acceptance of the new terms.
            </p>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-xl font-semibold text-primary mb-3">
              Contact Us
            </h2>
            <p>
              If you have questions about these Terms & Conditions, contact us
              at <span className="text-primary">support@rammys.com</span>.
            </p>
          </section>
        </motion.div>
      </div>
    </section>
  );
}
