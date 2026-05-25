"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown } from "lucide-react";
import { whatsappGeneral } from "@/lib/whatsapp";

const navLinks = [
  { label: "Home", href: "/" },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "Audio Systems", href: "/services/audio-systems" },
      { label: "Lighting Systems", href: "/services/lighting-systems" },
      { label: "LED Screens", href: "/services/led-screens" },
      { label: "Stages", href: "/services/stages" },
      { label: "Rigging", href: "/services/rigging" },
      { label: "Trusses", href: "/services/trusses" },
      { label: "DJ Equipment", href: "/services/dj-equipment" },
      { label: "Event Production", href: "/services/event-production" },
      { label: "Concert Setup", href: "/services/concert-setup" },
      { label: "Wedding Setup", href: "/services/wedding-setup" },
      { label: "Corporate Events", href: "/services/corporate-events" },
    ],
  },
  { label: "Products", href: "/products" },
  { label: "Gallery", href: "/gallery" },
  { label: "Clients", href: "/clients" },
  { label: "Track Booking", href: "/tracking" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-[background,box-shadow] duration-300"
      style={{
        background: scrolled
          ? "rgba(5,5,5,0.95)"
          : "linear-gradient(to bottom, rgba(5,5,5,0.8), transparent)",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        boxShadow: scrolled ? "0 1px 0 rgba(214,168,79,0.15)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <Image
              src="/logos/soundbox-icon.png"
              alt="Soundbox Dubai"
              width={38}
              height={38}
              className="object-contain"
            />
            <Image
              src="/logos/soundbox-logo.png"
              alt="Soundbox Dubai"
              width={130}
              height={36}
              className="object-contain hidden sm:block"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.label} className="relative group">
                  <button
                    className="flex items-center gap-1 px-3 py-2 rounded text-sm font-medium transition-[color,opacity] duration-150 hover:opacity-80"
                    style={{ color: "#A7A7B3" }}
                    onMouseEnter={() => setServicesOpen(true)}
                    onMouseLeave={() => setServicesOpen(false)}
                  >
                    {link.label}
                    <ChevronDown size={14} />
                  </button>
                  <div
                    className="absolute top-full left-0 pt-2 w-52"
                    onMouseEnter={() => setServicesOpen(true)}
                    onMouseLeave={() => setServicesOpen(false)}
                  >
                    <div
                      className="glass-card rounded-lg py-2 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-[opacity,transform] duration-200 pointer-events-none group-hover:pointer-events-auto"
                    >
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-2 text-sm transition-[color,background] duration-150 hover:text-white"
                          style={{ color: "#A7A7B3" }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.color = "#D6A84F";
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.color = "#A7A7B3";
                          }}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 rounded text-sm font-medium transition-[color,opacity] duration-150 hover:opacity-80"
                  style={{ color: "#A7A7B3" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "#D6A84F";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "#A7A7B3";
                  }}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={whatsappGeneral()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold"
            >
              WhatsApp Us
            </a>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="lg:hidden p-2 rounded"
            style={{ color: "#D6A84F" }}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="lg:hidden border-t"
          style={{
            background: "rgba(5,5,5,0.98)",
            borderColor: "rgba(214,168,79,0.15)",
          }}
        >
          <div className="px-4 py-4 space-y-1 max-h-[80vh] overflow-y-auto">
            {navLinks.map((link) => (
              <div key={link.label}>
                {link.children ? (
                  <>
                    <button
                      className="w-full text-left px-3 py-3 text-sm font-medium flex items-center justify-between"
                      style={{ color: "#D6A84F" }}
                      onClick={() => setServicesOpen(!servicesOpen)}
                    >
                      {link.label}
                      <ChevronDown
                        size={14}
                        style={{
                          transform: servicesOpen ? "rotate(180deg)" : "none",
                          transition: "transform 0.2s ease",
                        }}
                      />
                    </button>
                    {servicesOpen && (
                      <div className="pl-4 space-y-1">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block px-3 py-2 text-sm"
                            style={{ color: "#A7A7B3" }}
                            onClick={() => setMobileOpen(false)}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={link.href}
                    className="block px-3 py-3 text-sm font-medium"
                    style={{ color: "#A7A7B3" }}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
            <div className="pt-4 pb-2">
              <a
                href={whatsappGeneral()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold w-full block text-center"
                onClick={() => setMobileOpen(false)}
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
