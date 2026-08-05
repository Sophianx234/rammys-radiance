"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Mail, MessageSquare, Phone } from "lucide-react";

export default function SupportPage() {
  const [activeSection, setActiveSection] = useState("contact");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    // If there's a hash in the URL, scroll to it
    const hash = window.location.hash.replace("#", "");
    if (hash && ["contact", "faq", "shipping"].includes(hash)) {
      setActiveSection(hash);
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

  const scrollTo = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      // Offset for the sticky header
      const y = element.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top: y, behavior: "smooth" });
      window.history.pushState(null, "", `#${id}`);
    }
  };

  const faqs = [
    {
      q: "How long does delivery take?",
      a: "Delivery is done exclusively on Fridays to ensure the highest quality control and batch freshness for our products. You will receive a tracking update on Thursday evening.",
    },
    {
      q: "Do you ship internationally?",
      a: "At this time, we provide shipping nationwide across our home region. We are actively working on expanding to select international destinations. Please subscribe to our newsletter for updates.",
    },
    {
      q: "Can I return or exchange a product?",
      a: "We accept returns on unopened, unused products in their original packaging within 14 days of delivery. For hygiene reasons, we cannot accept returns on opened cosmetics or skincare items.",
    },
    {
      q: "Are your products cruelty-free?",
      a: "Yes. Rammy's Radiance is proud to be 100% cruelty-free. We never test on animals, nor do we work with suppliers who do.",
    },
    {
      q: "What payment methods are accepted?",
      a: "We accept all major credit and debit cards, as well as secure online bank transfers via Paystack.",
    }
  ];

  return (
    <div className="min-h-screen bg-surface">
      {/* Header Banner */}
      <div className="w-full bg-[#5B7763] text-white py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[32px] md:text-[52px] font-bold tracking-tight uppercase mb-4"
          >
            How can we help?
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[13px] tracking-widest uppercase text-white/80 max-w-lg"
          >
            Client care, frequently asked questions, and our shipping policies.
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 md:py-24 flex flex-col lg:flex-row gap-16 lg:gap-24">
        
        {/* Sticky Sidebar */}
        <div className="lg:w-64 shrink-0">
          <div className="sticky top-32 flex flex-col gap-6">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#5B7763] mb-2">Support Menu</h3>
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => scrollTo("contact")}
                className={`text-left text-[13px] tracking-wider uppercase transition-colors ${activeSection === "contact" ? "text-black font-bold" : "text-text-muted hover:text-black"}`}
              >
                Customer Service
              </button>
              <button 
                onClick={() => scrollTo("faq")}
                className={`text-left text-[13px] tracking-wider uppercase transition-colors ${activeSection === "faq" ? "text-black font-bold" : "text-text-muted hover:text-black"}`}
              >
                FAQs
              </button>
              <button 
                onClick={() => scrollTo("shipping")}
                className={`text-left text-[13px] tracking-wider uppercase transition-colors ${activeSection === "shipping" ? "text-black font-bold" : "text-text-muted hover:text-black"}`}
              >
                Shipping & Returns
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 max-w-3xl flex flex-col gap-24">
          
          {/* Customer Service Section */}
          <section id="contact" className="scroll-mt-32">
            <h2 className="text-2xl font-bold uppercase tracking-wide text-[#222222] mb-8 border-b border-border/40 pb-4">Customer Service</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white p-8 border border-border/40 text-center flex flex-col items-center">
                <Mail className="w-6 h-6 text-[#5B7763] mb-4" strokeWidth={1.5} />
                <h4 className="text-[13px] font-bold uppercase tracking-widest text-[#222222] mb-2">Email Us</h4>
                <p className="text-[13px] text-text-muted mb-4">We aim to reply within 24 hours.</p>
                <a href="mailto:support@rammysradiance.com" className="text-[#5B7763] font-medium text-[13px] hover:underline">support@rammysradiance.com</a>
              </div>
              <div className="bg-white p-8 border border-border/40 text-center flex flex-col items-center">
                <Phone className="w-6 h-6 text-[#5B7763] mb-4" strokeWidth={1.5} />
                <h4 className="text-[13px] font-bold uppercase tracking-widest text-[#222222] mb-2">Call Us</h4>
                <p className="text-[13px] text-text-muted mb-4">Mon-Fri, 9am - 5pm WAT</p>
                <a href="tel:+2348000000000" className="text-[#5B7763] font-medium text-[13px] hover:underline">+234 800 000 0000</a>
              </div>
            </div>

            <form className="bg-white p-8 border border-border/40 flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
              <h3 className="text-[13px] font-bold uppercase tracking-[0.1em] text-[#222222] mb-2">Send a Message</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-text-muted">First Name</label>
                  <input type="text" className="border-b border-border/60 pb-2 bg-transparent text-[13px] focus:outline-none focus:border-[#5B7763] transition-colors" placeholder="Enter your first name" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-text-muted">Last Name</label>
                  <input type="text" className="border-b border-border/60 pb-2 bg-transparent text-[13px] focus:outline-none focus:border-[#5B7763] transition-colors" placeholder="Enter your last name" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-text-muted">Email Address</label>
                <input type="email" className="border-b border-border/60 pb-2 bg-transparent text-[13px] focus:outline-none focus:border-[#5B7763] transition-colors" placeholder="Enter your email" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-text-muted">Message</label>
                <textarea rows={4} className="border-b border-border/60 pb-2 bg-transparent text-[13px] focus:outline-none focus:border-[#5B7763] transition-colors resize-none" placeholder="How can we help you?"></textarea>
              </div>
              <button className="bg-[#222222] text-white text-[11px] font-bold uppercase tracking-widest py-4 hover:bg-[#5B7763] transition-colors mt-2">
                Submit Request
              </button>
            </form>
          </section>

          {/* FAQs Section */}
          <section id="faq" className="scroll-mt-32">
            <h2 className="text-2xl font-bold uppercase tracking-wide text-[#222222] mb-8 border-b border-border/40 pb-4">Frequently Asked Questions</h2>
            <div className="flex flex-col border-t border-border/40">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-border/40">
                  <button 
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full py-6 flex items-center justify-between text-left group"
                  >
                    <span className="text-[14px] font-medium text-[#222222] group-hover:text-[#5B7763] transition-colors">{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-text-muted transition-transform duration-300 ${openFaq === index ? "rotate-180" : ""}`} />
                  </button>
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: openFaq === index ? "auto" : 0, opacity: openFaq === index ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="text-[14px] leading-relaxed text-text-muted pb-6">{faq.a}</p>
                  </motion.div>
                </div>
              ))}
            </div>
          </section>

          {/* Shipping Section */}
          <section id="shipping" className="scroll-mt-32">
            <h2 className="text-2xl font-bold uppercase tracking-wide text-[#222222] mb-8 border-b border-border/40 pb-4">Shipping & Returns</h2>
            
            <div className="prose prose-sm max-w-none prose-headings:font-bold prose-headings:uppercase prose-headings:tracking-widest prose-headings:text-[13px] prose-p:text-[14px] prose-p:leading-relaxed prose-p:text-text-muted mb-12">
              <h3 className="text-[#222222]">Shipping Policy</h3>
              <p>We pride ourselves on delivering your luxury essentials in pristine condition. All orders are processed during the week and are dispatched exclusively on <strong>Fridays</strong>. This allows us to maintain strict quality control and batch tracking.</p>
              <p>You will receive a shipping confirmation email containing your tracking information on Thursday evening. Standard delivery takes 2-5 business days from the dispatch date, depending on your location.</p>
              
              <div className="h-8"></div>
              
              <h3 className="text-[#222222]">Return Policy</h3>
              <p>We want you to be completely satisfied with your purchase. If for any reason you are not, we accept returns on unused, unopened products in their original packaging within 14 days of delivery.</p>
              <p>To initiate a return, please contact our Customer Service team via the form above with your order number. Please note that return shipping costs are the responsibility of the customer unless the item received was incorrect or defective.</p>
              <p>For health and hygiene reasons, we strictly cannot accept returns or exchanges on opened skincare or cosmetic products. Refunds will be processed to the original payment method within 5-7 business days after we receive and inspect the returned items.</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
