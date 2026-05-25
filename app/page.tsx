import type { Metadata } from "next";
import SiteShell from "@/components/layout/SiteShell";
import HeroSection from "@/components/home/HeroSection";
import ServicesPreview from "@/components/home/ServicesPreview";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import ClientLogosStrip from "@/components/home/ClientLogosStrip";
import GalleryPreview from "@/components/home/GalleryPreview";
import CTASection from "@/components/home/CTASection";

export const metadata: Metadata = {
  title: "Soundbox Dubai — Premium Audio Visual Rental",
  description:
    "Dubai's #1 AV rental company. Sound systems, LED screens, lighting, stages, rigging, DJ equipment & full event production. Serving weddings, concerts & corporate events.",
};

export default function HomePage() {
  return (
    <SiteShell>
      <HeroSection />
      <ServicesPreview />
      <FeaturedCategories />
      <ClientLogosStrip />
      <GalleryPreview />
      <CTASection />
    </SiteShell>
  );
}
