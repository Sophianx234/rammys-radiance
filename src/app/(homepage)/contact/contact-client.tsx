"use client";

import type React from "react";

import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    setSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <main>
      {/* Page Header */}
      <section className="bg-secondary border-b border-border py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-serif font-bold">
            Get in Touch
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Reach out to our team
            anytime.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Contact Info */}
          <Card className="bg-card border-border p-8 space-y-4 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
              <Mail size={32} className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Email</h3>
              <a
                href="mailto:info@rammys.com"
                className="text-primary hover:text-primary/80"
              >
                info@rammys.com
              </a>
              <p className="text-muted-foreground text-sm mt-1">
                We typically respond within 24 hours
              </p>
            </div>
          </Card>

          <Card className="bg-card border-border p-8 space-y-4 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
              <Phone size={32} className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Phone</h3>
              <a
                href="tel:+2341234567890"
                className="text-primary hover:text-primary/80"
              >
                +234 (123) 456-7890
              </a>
              <p className="text-muted-foreground text-sm mt-1">
                Available Mon-Fri, 9AM-6PM WAT
              </p>
            </div>
          </Card>

          <Card className="bg-card border-border p-8 space-y-4 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
              <MapPin size={32} className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Location</h3>
              <p className="text-primary hover:text-primary/80 cursor-pointer">
                Lagos, Nigeria
              </p>
              <p className="text-muted-foreground text-sm mt-1">
                Visit us by appointment
              </p>
            </div>
          </Card>
        </div>

        {/* Contact Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-6">
              Send us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full bg-secondary border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-secondary border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full bg-secondary border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
              <textarea
                name="message"
                placeholder="Your Message"
                rows={6}
                value={formData.message}
                onChange={handleInputChange}
                className="w-full bg-secondary border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                required
              />
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3"
              >
                Send Message
              </Button>
              {submitted && (
                <div className="p-3 bg-green-500/10 border border-green-500 rounded-lg text-sm text-green-500">
                  Thank you! We'll get back to you soon.
                </div>
              )}
            </form>
          </div>

          {/* FAQ or Info */}
          <div className="space-y-6">
            <Card className="bg-secondary border-border p-6 space-y-4">
              <div className="flex items-start gap-4">
                <Clock size={24} className="text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Business Hours</h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>Monday - Friday: 9:00 AM - 6:00 PM WAT</p>
                    <p>Saturday: 11:00 AM - 4:00 PM WAT</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-secondary border-border p-6 space-y-4">
              <h3 className="font-semibold text-lg">
                Frequently Asked Questions
              </h3>
              <div className="space-y-3">
                <details className="group">
                  <summary className="cursor-pointer font-semibold text-sm flex justify-between items-center hover:text-primary">
                    What are your delivery times?
                    <span className="group-open:rotate-180 transition-transform">
                      +
                    </span>
                  </summary>
                  <p className="text-sm text-muted-foreground mt-2">
                    We offer standard delivery (2-3 business days) and express
                    delivery (same day for Lagos).
                  </p>
                </details>

                <details className="group">
                  <summary className="cursor-pointer font-semibold text-sm flex justify-between items-center hover:text-primary">
                    Do you accept returns?
                    <span className="group-open:rotate-180 transition-transform">
                      +
                    </span>
                  </summary>
                  <p className="text-sm text-muted-foreground mt-2">
                    Yes! We offer 30-day returns on all unopened products in
                    original packaging.
                  </p>
                </details>

                <details className="group">
                  <summary className="cursor-pointer font-semibold text-sm flex justify-between items-center hover:text-primary">
                    Are all products cruelty-free?
                    <span className="group-open:rotate-180 transition-transform">
                      +
                    </span>
                  </summary>
                  <p className="text-sm text-muted-foreground mt-2">
                    All brands in our collection are committed to cruelty-free
                    and ethical practices.
                  </p>
                </details>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
