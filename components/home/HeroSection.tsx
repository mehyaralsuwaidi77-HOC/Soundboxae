"use client";

import Image from "next/image";
import Link from "next/link";
import { MessageCircle, CalendarCheck } from "lucide-react";
import { useSettings } from "@/components/providers/SettingsProvider";

export default function HeroSection() {
  const { whatsappUrl } = useSettings();
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden noise"
      style={{ background: "#050505" }}
    >
      {/* Layered radial gradient background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(214,168,79,0.12) 0%, transparent 60%)," +
            "radial-gradient(ellipse 60% 80% at 80% 50%, rgba(47,128,237,0.06) 0%, transparent 50%)," +
            "radial-gradient(ellipse 60% 80% at 20% 50%, rgba(214,168,79,0.04) 0%, transparent 50%)",
        }}
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(214,168,79,0.5) 1px, transparent 1px)," +
            "linear-gradient(90deg, rgba(214,168,79,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        {/* Eyebrow */}
        <div className="animate-fade-up flex items-center justify-center gap-3 mb-6">
          <span
            className="h-px w-12"
            style={{ background: "linear-gradient(to right, transparent, #D6A84F)" }}
          />
          <span
            className="text-xs font-semibold uppercase tracking-[0.25em]"
            style={{ color: "#D6A84F" }}
          >
            Audio Visual Rental Dubai
          </span>
          <span
            className="h-px w-12"
            style={{ background: "linear-gradient(to left, transparent, #D6A84F)" }}
          />
        </div>

        {/* Logo */}
        <div className="animate-fade-up delay-100 flex justify-center mb-8">
          <Image
            src="/logos/soundbox-logo.png"
            alt="Soundbox Dubai"
            width={280}
            height={80}
            priority
            className="object-contain"
          />
        </div>

        {/* Headline */}
        <h1
          className="animate-fade-up delay-200 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-none"
          style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.03em" }}
        >
          <span className="text-white">Premium </span>
          <span className="text-gold-gradient">AV Production</span>
          <br />
          <span className="text-white">for Dubai Events</span>
        </h1>

        {/* Subheadline */}
        <p
          className="animate-fade-up delay-300 text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed mb-12"
          style={{ color: "#A7A7B3" }}
        >
          World-class sound systems, dynamic lighting, LED screens, stages, and
          full event production — crafted for Dubai&apos;s most remarkable events.
        </p>

        {/* CTA buttons */}
        <div className="animate-fade-up delay-400 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/products" className="btn-gold inline-flex items-center gap-2">
            <CalendarCheck size={16} />
            Create Booking Request
          </Link>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost inline-flex items-center gap-2"
          >
            <MessageCircle size={16} />
            WhatsApp Us
          </a>
        </div>

        {/* Stats bar */}
        <div className="animate-fade-up delay-600 mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {[
            { value: "500+", label: "Events Delivered" },
            { value: "10+", label: "Years Experience" },
            { value: "50+", label: "Top Clients" },
            { value: "UAE", label: "Wide Coverage" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="glass-card rounded-lg p-4 text-center"
            >
              <p
                className="text-2xl font-bold mb-1"
                style={{
                  fontFamily: "var(--font-display)",
                  background: "linear-gradient(135deg, #D6A84F, #F2D28A)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {stat.value}
              </p>
              <p className="text-xs uppercase tracking-widest" style={{ color: "#5A5A6E" }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in delay-600"
        style={{ color: "#5A5A6E" }}
      >
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <div
          className="w-px h-10"
          style={{
            background: "linear-gradient(to bottom, #D6A84F, transparent)",
          }}
        />
      </div>
    </section>
  );
}
