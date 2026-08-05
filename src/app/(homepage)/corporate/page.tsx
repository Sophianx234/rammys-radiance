"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Briefcase, Globe, Newspaper } from "lucide-react";
import Link from "next/link";

export default function CorporatePage() {
  const [activeSection, setActiveSection] = useState("wholesale");

  useEffect(() => {
    // If there's a hash in the URL, scroll to it
    const hash = window.location.hash.replace("#", "");
    if (hash && ["wholesale", "press", "careers"].includes(hash)) {
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

  return (
    <div className="min-h-screen bg-surface">
      {/* Header Banner */}
      <div className="w-full bg-[#222222] text-white py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[32px] md:text-[52px] font-bold tracking-tight uppercase mb-4"
          >
            Corporate & Business
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[13px] tracking-widest uppercase text-white/80 max-w-lg"
          >
            Wholesale partnerships, press inquiries, and career opportunities.
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 md:py-24 flex flex-col lg:flex-row gap-16 lg:gap-24">
        
        {/* Sticky Sidebar */}
        <div className="lg:w-64 shrink-0">
          <div className="sticky top-32 flex flex-col gap-6">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#5B7763] mb-2">Business Menu</h3>
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => scrollTo("wholesale")}
                className={`text-left text-[13px] tracking-wider uppercase transition-colors ${activeSection === "wholesale" ? "text-black font-bold" : "text-text-muted hover:text-black"}`}
              >
                Wholesale Inquiry
              </button>
              <button 
                onClick={() => scrollTo("press")}
                className={`text-left text-[13px] tracking-wider uppercase transition-colors ${activeSection === "press" ? "text-black font-bold" : "text-text-muted hover:text-black"}`}
              >
                Press & Media
              </button>
              <button 
                onClick={() => scrollTo("careers")}
                className={`text-left text-[13px] tracking-wider uppercase transition-colors ${activeSection === "careers" ? "text-black font-bold" : "text-text-muted hover:text-black"}`}
              >
                Careers
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 max-w-3xl flex flex-col gap-24">
          
          {/* Wholesale Section */}
          <section id="wholesale" className="scroll-mt-32">
            <div className="flex items-center gap-4 mb-8 border-b border-border/40 pb-4">
              <Globe className="w-8 h-8 text-[#5B7763]" strokeWidth={1.5} />
              <h2 className="text-2xl font-bold uppercase tracking-wide text-[#222222]">Wholesale Partners</h2>
            </div>
            
            <div className="prose prose-sm max-w-none prose-p:text-[14px] prose-p:leading-relaxed prose-p:text-text-muted mb-8">
              <p>We are actively seeking strategic retail partnerships with boutiques, spas, and luxury department stores that align with our brand ethos. As a wholesale partner, you will receive dedicated support, marketing materials, and exclusive previews of upcoming collections.</p>
            </div>

            <form className="bg-white p-8 border border-border/40 flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
              <h3 className="text-[13px] font-bold uppercase tracking-[0.1em] text-[#222222] mb-2">Apply for a Wholesale Account</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-text-muted">Business Name</label>
                  <input type="text" className="border-b border-border/60 pb-2 bg-transparent text-[13px] focus:outline-none focus:border-[#5B7763] transition-colors" placeholder="Enter your business name" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-text-muted">Contact Person</label>
                  <input type="text" className="border-b border-border/60 pb-2 bg-transparent text-[13px] focus:outline-none focus:border-[#5B7763] transition-colors" placeholder="Full name" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-text-muted">Email Address</label>
                  <input type="email" className="border-b border-border/60 pb-2 bg-transparent text-[13px] focus:outline-none focus:border-[#5B7763] transition-colors" placeholder="Enter your email" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-text-muted">Business Website</label>
                  <input type="text" className="border-b border-border/60 pb-2 bg-transparent text-[13px] focus:outline-none focus:border-[#5B7763] transition-colors" placeholder="https://" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-text-muted">Company Overview</label>
                <textarea rows={3} className="border-b border-border/60 pb-2 bg-transparent text-[13px] focus:outline-none focus:border-[#5B7763] transition-colors resize-none" placeholder="Tell us briefly about your business and why you'd be a good fit."></textarea>
              </div>
              <button className="bg-[#222222] text-white text-[11px] font-bold uppercase tracking-widest py-4 hover:bg-[#5B7763] transition-colors mt-2">
                Submit Application
              </button>
            </form>
          </section>

          {/* Press Section */}
          <section id="press" className="scroll-mt-32">
            <div className="flex items-center gap-4 mb-8 border-b border-border/40 pb-4">
              <Newspaper className="w-8 h-8 text-[#5B7763]" strokeWidth={1.5} />
              <h2 className="text-2xl font-bold uppercase tracking-wide text-[#222222]">Press & Media</h2>
            </div>
            
            <div className="prose prose-sm max-w-none prose-p:text-[14px] prose-p:leading-relaxed prose-p:text-text-muted mb-8">
              <p>For all press inquiries, high-resolution image requests, product samples for editorial review, or interview requests with our founders, please contact our PR team directly.</p>
            </div>

            <div className="bg-white p-8 border border-border/40 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h4 className="text-[13px] font-bold uppercase tracking-widest text-[#222222] mb-2">Media Relations</h4>
                <p className="text-[13px] text-text-muted">Please email us directly for all media requests.</p>
              </div>
              <a href="mailto:press@rammysradiance.com" className="shrink-0 flex items-center gap-2 bg-[#5B7763] text-white text-[11px] font-bold uppercase tracking-widest py-3 px-6 hover:bg-[#222222] transition-colors">
                Email PR Team <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </section>

          {/* Careers Section */}
          <section id="careers" className="scroll-mt-32">
            <div className="flex items-center gap-4 mb-8 border-b border-border/40 pb-4">
              <Briefcase className="w-8 h-8 text-[#5B7763]" strokeWidth={1.5} />
              <h2 className="text-2xl font-bold uppercase tracking-wide text-[#222222]">Careers</h2>
            </div>
            
            <div className="prose prose-sm max-w-none prose-p:text-[14px] prose-p:leading-relaxed prose-p:text-text-muted mb-8">
              <p>Join a dynamic team passionate about redefining beauty and wellness. At Rammy's Radiance, we foster a culture of creativity, inclusivity, and relentless pursuit of quality. While we may not always have open positions, we are always eager to connect with talented individuals.</p>
            </div>

            <div className="border border-border/40 bg-white">
              <div className="p-8 text-center border-b border-border/40">
                <p className="text-[13px] text-text-muted">There are currently no open positions.</p>
              </div>
              <div className="p-8 bg-surface/50 text-center flex flex-col items-center">
                <h4 className="text-[13px] font-bold uppercase tracking-widest text-[#222222] mb-2">Send us your resume</h4>
                <p className="text-[12px] text-text-muted mb-6 max-w-sm">We are always looking for exceptional talent. Send your resume and cover letter, and we'll keep it on file.</p>
                <a href="mailto:careers@rammysradiance.com" className="text-[11px] font-bold uppercase tracking-widest text-[#5B7763] hover:text-[#222222] transition-colors">
                  careers@rammysradiance.com
                </a>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
