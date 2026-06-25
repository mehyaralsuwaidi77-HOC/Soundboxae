import { MessageCircle, Mail } from "lucide-react";

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
    </svg>
  );
}
import { whatsappGeneral } from "@/lib/whatsapp";
import { getSiteSettings } from "@/lib/site-settings";
import { contactMailto } from "@/lib/mailto";

const INSTAGRAM_URL = "https://www.instagram.com/soundboxdubai/";

export default async function CTASection() {
  const settings = await getSiteSettings();
  const waUrl = whatsappGeneral(settings.whatsappNumber);
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
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold inline-flex items-center gap-2"
          >
            <MessageCircle size={16} />
            WhatsApp Us Now
          </a>
          <a
            href={contactMailto}
            className="btn-ghost inline-flex items-center gap-2"
          >
            <Mail size={16} />
            Email Us
          </a>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow Soundbox Dubai on Instagram"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-[background,color,border-color] duration-150"
            style={{ background: "rgba(255,255,255,0.04)", color: "#A7A7B3", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <InstagramIcon size={16} />
            Follow on Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
