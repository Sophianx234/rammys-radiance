import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Inter,
  Barlow,
  Lato,
  Pacifico,
} from "next/font/google";
import type React from "react";
import "../globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://rammysradiance.com"),
  title: {
    default: "Rammy's Radiance | Premium Cosmetics & Beauty",
    template: "%s | Rammy's Radiance",
  },
  description: "Discover luxury beauty products, premium cosmetics, and radiant skincare curated for your glowing look at Rammy's Radiance.",
  keywords: ["cosmetics", "beauty", "skincare", "premium makeup", "Rammy's Radiance"],
  authors: [{ name: "Rammy's Radiance" }],
  creator: "Rammy's Radiance",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://rammysradiance.com",
    title: "Rammy's Radiance | Premium Cosmetics & Beauty",
    description: "Discover luxury beauty products, premium cosmetics, and radiant skincare curated for your glowing look at Rammy's Radiance.",
    siteName: "Rammy's Radiance",
    images: [
      {
        url: "/og-image.jpg", // Add an actual image to the public folder later if possible
        width: 1200,
        height: 630,
        alt: "Rammy's Radiance - Premium Cosmetics",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rammy's Radiance | Premium Cosmetics & Beauty",
    description: "Discover luxury beauty products, premium cosmetics, and radiant skincare curated for your glowing look.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: "https://rammysradiance.com",
  }
};

export const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
export const barlow = Barlow({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-barlow",
});
export const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-lato",
});
export const pacifico = Pacifico({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pacifico",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Rammy's Radiance",
    url: "https://rammysradiance.com",
    logo: "https://rammysradiance.com/icon.png",
    description: "Discover luxury beauty products, premium cosmetics, and radiant skincare curated for your glowing look.",
    sameAs: [
      "https://instagram.com/rammysradiance",
      "https://facebook.com/rammysradiance",
      "https://twitter.com/rammysradiance",
    ],
  };

  return (
    <html lang="en">
      <head>
        <script src="https://js.paystack.co/v1/inline.js"></script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={` ${inter.className} antialiased`}>
        <Header />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
