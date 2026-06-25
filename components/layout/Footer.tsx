import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";

function InstagramIcon({ size = 15 }: { size?: number }) {
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

const INSTAGRAM_URL = "https://www.instagram.com/soundboxdubai/";
const EMAIL_ADDRESS = "info@soundboxdubai.com";

const serviceLinks = [
  { label: "Audio Systems", href: "/services/audio-systems" },
  { label: "Lighting Systems", href: "/services/lighting-systems" },
  { label: "LED Screens", href: "/services/led-screens" },
  { label: "Stages", href: "/services/stages" },
  { label: "Rigging & Trusses", href: "/services/rigging" },
  { label: "DJ Equipment", href: "/services/dj-equipment" },
  { label: "Event Production", href: "/services/event-production" },
  { label: "Wedding Setup", href: "/services/wedding-setup" },
  { label: "Corporate Events", href: "/services/corporate-events" },
];

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Gallery", href: "/gallery" },
  { label: "Our Clients", href: "/clients" },
  { label: "About Us", href: "/about-us" },
  { label: "FAQ", href: "/faq" },
  { label: "Admin", href: "/admin" },
];

export default async function Footer() {
  const settings = await getSiteSettings();
  const waUrl = whatsappGeneral(settings.whatsappNumber);
  return (
    <footer
      style={{ background: "#050505", borderTop: "1px solid rgba(214,168,79,0.12)" }}
    >
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/logos/soundbox-logo.png"
                alt="Soundbox Dubai"
                width={150}
                height={42}
                className="object-contain"
              />
            </Link>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "#A7A7B3" }}>
              Dubai&apos;s premier audio visual rental company — delivering premium
              sound, lighting, and event production across the UAE.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 btn-gold"
              >
                <MessageCircle size={15} />
                WhatsApp Us
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Soundbox Dubai on Instagram"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-[background,color] duration-150"
                style={{ background: "rgba(255,255,255,0.05)", color: "#A7A7B3", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <InstagramIcon size={15} />
                Instagram
              </a>
            </div>
            <div className="mt-3">
              <a
                href={`mailto:${EMAIL_ADDRESS}`}
                className="inline-flex items-center gap-2 text-sm transition-[color] duration-150 hover:text-white"
                style={{ color: "#A7A7B3" }}
              >
                <Mail size={14} style={{ color: "#D6A84F" }} />
                {EMAIL_ADDRESS}
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4
              className="text-xs font-semibold uppercase tracking-[0.15em] mb-5"
              style={{ color: "#D6A84F" }}
            >
              Services
            </h4>
            <ul className="space-y-2">
              {serviceLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm transition-[color] duration-150 hover:text-white"
                    style={{ color: "#A7A7B3" }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h4
              className="text-xs font-semibold uppercase tracking-[0.15em] mb-5"
              style={{ color: "#D6A84F" }}
            >
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm transition-[color] duration-150 hover:text-white"
                    style={{ color: "#A7A7B3" }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4
              className="text-xs font-semibold uppercase tracking-[0.15em] mb-5"
              style={{ color: "#D6A84F" }}
            >
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={16} style={{ color: "#D6A84F", marginTop: 2, flexShrink: 0 }} />
                <span className="text-sm" style={{ color: "#A7A7B3" }}>
                  {settings.companyAddress}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} style={{ color: "#D6A84F", flexShrink: 0 }} />
                <a
                  href={`tel:${settings.managerPhone}`}
                  className="text-sm transition-[color] duration-150 hover:text-white"
                  style={{ color: "#A7A7B3" }}
                >
                  {settings.whatsappDisplay}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} style={{ color: "#D6A84F", flexShrink: 0 }} />
                <a
                  href={`mailto:${EMAIL_ADDRESS}`}
                  className="text-sm transition-[color] duration-150 hover:text-white"
                  style={{ color: "#A7A7B3" }}
                >
                  {EMAIL_ADDRESS}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle size={16} style={{ color: "#D6A84F", flexShrink: 0 }} />
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm transition-[color] duration-150 hover:text-white"
                  style={{ color: "#A7A7B3" }}
                >
                  WhatsApp: {settings.whatsappDisplay}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{ borderTop: "1px solid rgba(214,168,79,0.08)" }}
        className="py-5"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs" style={{ color: "#5A5A6E" }}>
            © {new Date().getFullYear()} Soundbox Electronic Equipment Rental. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: "#5A5A6E" }}>
            Dubai, United Arab Emirates · AV Rental · Event Production
          </p>
        </div>
      </div>
    </footer>
  );
}
