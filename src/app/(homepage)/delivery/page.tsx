"use client";

import { motion } from "framer-motion";
import { Truck, Package, Clock, Globe2 } from "lucide-react";

export default function DeliveryPage() {
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
            Delivery & Shipping
          </h1>
          <p className="text-gray-400 max-w-lg mx-auto">
            How your order travels from our hands to your doorstep.
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
              <Truck className="w-5 h-5 text-primary" />
              Delivery Options
            </h2>
            <p className="mb-4">
              Rammys Radiance offers reliable delivery across Ghana and
              international shipping to select countries. Each order is
              carefully packaged to ensure it arrives in perfect condition.
            </p>

            <ul className="list-disc list-inside space-y-2 text-gray-400">
              <li>
                <span className="text-gray-300">Standard Delivery:</span>
                Affordable option for non-urgent orders.
              </li>
              <li>
                <span className="text-gray-300">Express Delivery:</span>
                Faster arrival for customers who need their items quickly.
              </li>
              <li>
                <span className="text-gray-300">
                  Pickup Points (when available):
                </span>
                Collect from approved pickup locations.
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-xl font-semibold text-primary mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Delivery Timeframes
            </h2>
            <p className="mb-4">Estimated timelines are as follows:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-400">
              <li>
                <span className="text-gray-300">Within Accra:</span> 1–2 working
                days
              </li>
              <li>
                <span className="text-gray-300">Greater Accra Region:</span> 1–3
                working days
              </li>
              <li>
                <span className="text-gray-300">Other Regions in Ghana:</span>{" "}
                2–5 working days
              </li>
              <li>
                <span className="text-gray-300">International Shipping:</span>{" "}
                7–15 working days depending on destination
              </li>
            </ul>
            <p className="mt-3 text-gray-400">
              Note: Weekends and public holidays may extend delivery times
              slightly.
            </p>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-xl font-semibold text-primary mb-3 flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              Order Packaging
            </h2>
            <p>
              Every package is sealed securely and inspected before dispatch.
              Fragile or delicate products receive extra protective packaging to
              ensure safe delivery.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-xl font-semibold text-primary mb-3 flex items-center gap-2">
              <Globe2 className="w-5 h-5 text-primary" />
              International Shipping
            </h2>
            <p className="mb-3">
              We currently ship to select countries outside Ghana. Shipping fees
              and delivery times vary based on your destination.
            </p>

            <p className="text-gray-400">
              Customs or import duties (where applicable) are the responsibility
              of the customer.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-xl font-semibold text-primary mb-3">
              Tracking Your Order
            </h2>
            <p>
              Once your order is dispatched, you will receive a tracking number
              via email or SMS. You can use this number to monitor your
              package’s journey until it reaches you.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-xl font-semibold text-primary mb-3">
              Delivery Fees
            </h2>
            <p className="mb-4">
              Delivery fees are calculated based on your location and the size
              of your order. You’ll see the delivery cost clearly displayed at
              checkout before confirming your purchase.
            </p>
            <p className="text-gray-400">
              From time to time, we offer discounted or free delivery
              promotions.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-xl font-semibold text-primary mb-3">
              Failed or Delayed Deliveries
            </h2>
            <p>
              If a delivery attempt fails due to incorrect details or an
              unavailable recipient, our team will contact you to reschedule.
              Severe weather or unexpected courier delays may occasionally
              affect delivery times.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-xl font-semibold text-primary mb-3">
              Need Assistance?
            </h2>
            <p>
              Our support team is always ready to help with delivery questions
              or concerns. Reach us at{" "}
              <span className="text-primary">support@rammys.com</span>.
            </p>
          </section>
        </motion.div>
      </div>
    </section>
  );
}
