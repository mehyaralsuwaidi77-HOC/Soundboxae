import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import { whatsappGeneral, WHATSAPP_NUMBER_DISPLAY } from "@/lib/whatsapp";

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
  { label: "Products & Bundles", href: "/products" },
  { label: "Gallery", href: "/gallery" },
  { label: "Our Clients", href: "/clients" },
  { label: "About Us", href: "/about-us" },
  { label: "FAQ", href: "/faq" },
  { label: "Track Your Booking", href: "/tracking" },
  { label: "Admin", href: "/admin" },
];

export default function Footer() {
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
            <a
              href={whatsappGeneral()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 btn-gold"
            >
              <MessageCircle size={15} />
              WhatsApp Us
            </a>
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
                  Dubai, United Arab Emirates
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} style={{ color: "#D6A84F", flexShrink: 0 }} />
                <a
                  href="tel:+971553320051"
                  className="text-sm transition-[color] duration-150 hover:text-white"
                  style={{ color: "#A7A7B3" }}
                >
                  {WHATSAPP_NUMBER_DISPLAY}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} style={{ color: "#D6A84F", flexShrink: 0 }} />
                <a
                  href="mailto:info@soundboxdubai.com"
                  className="text-sm transition-[color] duration-150 hover:text-white"
                  style={{ color: "#A7A7B3" }}
                >
                  info@soundboxdubai.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle size={16} style={{ color: "#D6A84F", flexShrink: 0 }} />
                <a
                  href={whatsappGeneral()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm transition-[color] duration-150 hover:text-white"
                  style={{ color: "#A7A7B3" }}
                >
                  WhatsApp: {WHATSAPP_NUMBER_DISPLAY}
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
            © {new Date().getFullYear()} Soundbox Electronic Equipment Rental LLC. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: "#5A5A6E" }}>
            Dubai, United Arab Emirates · AV Rental · Event Production
          </p>
        </div>
      </div>
    </footer>
  );
}
