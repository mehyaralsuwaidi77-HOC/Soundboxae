import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle, Phone, CheckCircle, ArrowRight } from "lucide-react";
import SiteShell from "@/components/layout/SiteShell";
import SectionHeader from "@/components/ui/SectionHeader";
import { whatsappGeneral } from "@/lib/whatsapp";
import { getSiteSettings } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "About Us | Soundbox Dubai — AV Equipment Rental",
  description:
    "Learn about Soundbox Dubai — a UAE-based audio visual equipment rental company driven by a passion for excellence and quality service across every event.",
};

const values = [
  "Premium audio visual equipment maintained to the highest standards",
  "Experienced, professional crew for every event size",
  "Transparent pricing — delivery and setup always included",
  "UAE-wide coverage from small private gatherings to major concerts",
  "Fast response and flexible scheduling to suit your event needs",
];

export default async function AboutUsPage() {
  const settings = await getSiteSettings();
  const waUrl = whatsappGeneral(settings.whatsappNumber);
  return (
    <SiteShell>
      {/* Hero */}
      <section
        className="relative pt-36 pb-24 overflow-hidden"
        style={{ background: "#050505" }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(214,168,79,0.1) 0%, transparent 65%)",
          }}
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionHeader
            eyebrow="Our Story"
            title="About Our Audio Visual Equipment Rental Service"
            subtitle="Dubai's premium AV rental company — built on quality, trust, and a passion for great events."
            centered
          />
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-24" style={{ background: "#0B0B0F" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Text */}
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-[0.18em] mb-4"
                style={{ color: "#D6A84F" }}
              >
                Who We Are
              </p>
              <h2
                className="text-3xl md:text-4xl font-bold mb-6 leading-tight"
                style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
              >
                Bringing Quality AV Rental to the UAE
              </h2>
              <p
                className="text-base leading-relaxed mb-6"
                style={{ color: "#A7A7B3", lineHeight: "1.8" }}
              >
                Soundbox is a Dubai-based company with the goal of bringing quality Audio
                Visual Equipment Rental Services to the people of the UAE. Our passion for
                excellence is what drove us from the beginning, and it continues to push us
                each day.
              </p>
              <p
                className="text-base leading-relaxed mb-8"
                style={{ color: "#A7A7B3", lineHeight: "1.8" }}
              >
                At Soundbox, we believe that offering the best rentals — even the most
                basic of items — can make a big difference in the lives of our customers.
                We strive to be the best AV rental company in the industry. Try us out and
                see what we are all about.
              </p>
              <p
                className="text-lg font-semibold italic"
                style={{ color: "#D6A84F", fontFamily: "var(--font-display)" }}
              >
                &ldquo;We guarantee you to feel the Soundbox difference.&rdquo;
              </p>
            </div>

            {/* Values */}
            <div
              className="rounded-2xl p-8"
              style={{
                background: "rgba(17,17,24,0.7)",
                border: "1px solid rgba(214,168,79,0.12)",
              }}
            >
              <h3
                className="text-lg font-bold mb-6"
                style={{ fontFamily: "var(--font-display)", color: "#D6A84F" }}
              >
                Our Commitment
              </h3>
              <ul className="space-y-4">
                {values.map((v) => (
                  <li key={v} className="flex items-start gap-3">
                    <CheckCircle
                      size={16}
                      style={{ color: "#D6A84F", marginTop: 3, flexShrink: 0 }}
                    />
                    <span className="text-sm leading-relaxed" style={{ color: "#A7A7B3" }}>
                      {v}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16" style={{ background: "#111118" }}>
        <div
          className="absolute left-0 right-0 h-px"
          style={{
            background: "linear-gradient(to right, transparent, rgba(214,168,79,0.15), transparent)",
          }}
        />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "500+", label: "Events Delivered" },
              { value: "50+", label: "Premium Clients" },
              { value: "11+", label: "AV Services" },
              { value: "UAE-Wide", label: "Coverage" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="glass-card rounded-xl p-6"
              >
                <p
                  className="text-2xl md:text-3xl font-bold mb-1"
                  style={{
                    fontFamily: "var(--font-display)",
                    background: "linear-gradient(135deg, #D6A84F, #F2D28A)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {stat.value}
                </p>
                <p
                  className="text-xs uppercase tracking-widest"
                  style={{ color: "#5A5A6E" }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24" style={{ background: "#0B0B0F" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className="text-3xl font-bold mb-4"
            style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
          >
            Ready to Work With Us?
          </h2>
          <p className="text-sm mb-8" style={{ color: "#A7A7B3" }}>
            Get in touch today and let us help make your next event unforgettable.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/services"
              className="btn-gold inline-flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <ArrowRight size={15} />
              Explore Our Services
            </Link>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost inline-flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <MessageCircle size={15} />
              WhatsApp Us
            </a>
            <a
              href={`tel:${settings.managerPhone}`}
              className="inline-flex items-center gap-2 text-sm font-medium w-full sm:w-auto justify-center transition-[color] duration-150 hover:text-white"
              style={{ color: "#A7A7B3" }}
            >
              <Phone size={15} />
              {settings.whatsappDisplay}
            </a>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
