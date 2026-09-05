import ContactClient from "./contact-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Get in Touch",
  description: "Have questions about our premium cosmetics or your order? Contact the Rammy's Radiance team for support, inquiries, and beauty advice.",
  alternates: {
    canonical: "https://rammysradiance.com/contact",
  },
  openGraph: {
    title: "Contact Us | Rammy's Radiance",
    description: "Have questions about our premium cosmetics or your order? Contact the Rammy's Radiance team for support, inquiries, and beauty advice.",
    url: "https://rammysradiance.com/contact",
  }
};

export default function ContactPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Rammy's Radiance",
    description: "Get in touch with Rammy's Radiance customer support.",
    url: "https://rammysradiance.com/contact",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContactClient />
    </>
  );
}
