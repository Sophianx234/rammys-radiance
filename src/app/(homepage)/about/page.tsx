import AboutClient from "./about-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Our Story & Values",
  description: "Learn about Rammy's Radiance. Our journey, values, and the passionate team dedicated to bringing you the best in luxury cosmetics and premium skincare.",
  alternates: {
    canonical: "https://rammysradiance.com/about",
  },
  openGraph: {
    title: "About Us | Rammy's Radiance",
    description: "Learn about Rammy's Radiance. Our journey, values, and the passionate team dedicated to bringing you the best in luxury cosmetics and premium skincare.",
    url: "https://rammysradiance.com/about",
  }
};

export default function AboutPage() {
  return <AboutClient />;
}
