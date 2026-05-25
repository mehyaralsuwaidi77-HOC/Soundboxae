import Link from "next/link";
import { MessageCircle, CalendarCheck } from "lucide-react";
import { whatsappGeneral } from "@/lib/whatsapp";

export default function CTASection() {
  return (
    <section
      className="py-24 relative overflow-hidden"
      style={{ background: "#111118" }}
    >
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(214,168,79,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p
          className="text-xs font-semibold uppercase tracking-[0.2em] mb-4"
          style={{ color: "#D6A84F" }}
        >
          Ready to Create Something Extraordinary?
        </p>
        <h2
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
          style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
        >
          Let&apos;s Build Your{" "}
          <span className="text-gold-gradient">Perfect Event</span>
        </h2>
        <p className="text-lg mb-10 max-w-xl mx-auto" style={{ color: "#A7A7B3" }}>
          Tell us about your event and we&apos;ll put together the ideal AV package —
          from a single speaker to a full stadium production.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/products" className="btn-gold inline-flex items-center gap-2">
            <CalendarCheck size={16} />
            Create Booking Request
          </Link>
          <a
            href={whatsappGeneral()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost inline-flex items-center gap-2"
          >
            <MessageCircle size={16} />
            WhatsApp Us Now
          </a>
        </div>
      </div>
    </section>
  );
}
