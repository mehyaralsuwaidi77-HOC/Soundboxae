import type { Metadata } from "next";
import SiteShell from "@/components/layout/SiteShell";
import SectionHeader from "@/components/ui/SectionHeader";
import TrackingForm from "@/components/booking/TrackingForm";

export const metadata: Metadata = {
  title: "Track Your Booking | Soundbox Dubai",
  description: "Track your Soundbox Dubai booking status in real-time. Enter your booking reference to view updates, timeline, and team contact details.",
};

export default function TrackPage() {
  return (
    <SiteShell>
      {/* Hero */}
      <section className="relative pt-36 pb-16 overflow-hidden" style={{ background: "#050505" }}>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(214,168,79,0.08) 0%, transparent 60%)" }}
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionHeader
            eyebrow="Client Portal"
            title="Track Your Booking"
            subtitle="Enter your booking reference to view real-time status, updates, and team contact details."
            centered
          />
        </div>
      </section>

      <TrackingForm />
    </SiteShell>
  );
}
