"use client";

import React from "react";

const BoxIcon = () => (
  <svg 
    width="34" 
    height="34" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
    <path d="M12 12l8-4.5" />
    <path d="M12 12v9" />
    <path d="M12 12L4 7.5" />
  </svg>
);

const LeafPinIcon = () => (
  <svg 
    width="34" 
    height="34" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M12 22C12 22 5 15 5 9a7 7 0 0 1 14 0c0 6-7 13-7 13z" />
    <path d="M12 22V2" />
    <path d="M12 15l-4-4" />
    <path d="M12 11l-4-4" />
    {/* <path d="M12 17l4-4" />
    <path d="M12 13l4-4" />
    <path d="M12 9l3-3" /> */}
  </svg>
);

const ChatBubblesIcon = () => (
  <svg 
    width="34" 
    height="34" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M4 5h12v10H7l-3 3v-3H4z" />
    <path d="M16 9h5v9v3l-3-3h-2v-2" />
  </svg>
);

const CreditCardIcon = () => (
  <svg 
    width="34" 
    height="34" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <rect x="2" y="6" width="20" height="12" rx="1" />
    <line x1="2" y1="11" x2="22" y2="11" />
    <line x1="14" y1="15" x2="16" y2="15" />
    <line x1="18" y1="15" x2="20" y2="15" />
  </svg>
);

const features = [
  {
    icon: <BoxIcon />,
    title: "Free Shipping",
    description: "Free Shipping for orders over $130",
  },
  {
    icon: <LeafPinIcon />,
    title: "Returns",
    description: "Within 30 days for an exchange.",
  },
  {
    icon: <ChatBubblesIcon />,
    title: "Online Support",
    description: "24 hours a day, 7 days a week",
  },
  {
    icon: <CreditCardIcon />,
    title: "Flexible Payment",
    description: "Pay with Multiple Credit Cards",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-surface border-t border-b border-border/50">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {features.map((feature, idx) => (
            <div 
              key={idx} 
              className="flex flex-col items-center text-center group"
            >
              <div className="text-[#5B7763] mb-5 transform transition-transform duration-500 ">
                {feature.icon}
              </div>
              <h4 className="text-[15px] font-semibold text-text-main mb-2">
                {feature.title}
              </h4>
              <p className="text-[13px] text-text-muted leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
