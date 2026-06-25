"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import ContactModal from "@/components/ui/ContactModal";

function InstagramIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
    </svg>
  );
}

import { INSTAGRAM_URL } from "@/lib/social";

const serviceLinks = [
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
];

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services", children: serviceLinks },
  { label: "Gallery", href: "/gallery" },
  { label: "Clients", href: "/clients" },
  { label: "About", href: "/about-us" },
  { label: "FAQ", href: "/faq" },
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setServicesOpen(false);
  }, [pathname]);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: scrolled
            ? "rgba(5,5,5,0.97)"
            : "linear-gradient(to bottom, rgba(5,5,5,0.85) 0%, rgba(5,5,5,0.4) 60%, transparent 100%)",
          backdropFilter: scrolled ? "blur(16px) saturate(1.8)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(16px) saturate(1.8)" : "none",
          transition: "background 0.35s ease, box-shadow 0.35s ease",
          boxShadow: scrolled ? "0 1px 0 rgba(214,168,79,0.12), 0 4px 24px rgba(0,0,0,0.4)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="flex items-center justify-between h-[72px]">

            {/* ── Logo ──────────────────────────────────────────────────────── */}
            <Link href="/" className="flex items-center shrink-0" aria-label="Soundbox Dubai — Home">
              <Image
                src="/logos/soundbox-icon.png"
                alt="Soundbox Dubai"
                width={40}
                height={40}
                className="object-contain"
                priority
              />
            </Link>

            {/* ── Desktop nav ───────────────────────────────────────────────── */}
            <nav className="hidden lg:flex items-center gap-0.5" aria-label="Main navigation">
              {navLinks.map((link) =>
                link.children ? (
                  <div key={link.label} className="relative group">
                    <button
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-md text-[13px] font-medium tracking-wide transition-colors duration-150 outline-none"
                      style={{ color: isActive(link.href) ? "#D6A84F" : "#C8C8D4" }}
                      aria-expanded="false"
                      aria-haspopup="true"
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#FFFFFF"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = isActive(link.href) ? "#D6A84F" : "#C8C8D4"; }}
                    >
                      {link.label}
                      <ChevronDown
                        size={13}
                        className="opacity-60 group-hover:opacity-100 transition-[transform,opacity] duration-200 group-hover:rotate-180"
                      />
                    </button>

                    <div
                      className="absolute top-full left-0 pt-3 w-56 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto"
                      style={{ transition: "opacity 0.2s ease" }}
                    >
                      <div
                        className="rounded-xl py-2 overflow-hidden"
                        style={{
                          background: "rgba(13,13,18,0.98)",
                          border: "1px solid rgba(214,168,79,0.15)",
                          boxShadow: "0 16px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,0,0,0.3)",
                        }}
                      >
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="nav-dropdown-item block px-4 py-2.5 text-[12.5px] font-medium transition-[background,color] duration-100"
                            style={{ color: pathname === child.href ? "#D6A84F" : "#A7A7B8" }}
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
                    className="relative px-3.5 py-2 rounded-md text-[13px] font-medium tracking-wide transition-colors duration-150 outline-none"
                    style={{ color: isActive(link.href) ? "#D6A84F" : "#C8C8D4" }}
                    onMouseEnter={(e) => { if (!isActive(link.href)) (e.currentTarget as HTMLElement).style.color = "#FFFFFF"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = isActive(link.href) ? "#D6A84F" : "#C8C8D4"; }}
                  >
                    {link.label}
                    {isActive(link.href) && (
                      <span
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full"
                        style={{ background: "#D6A84F" }}
                      />
                    )}
                  </Link>
                )
              )}
            </nav>

            {/* ── Desktop CTA ───────────────────────────────────────────────── */}
            <div className="hidden lg:flex items-center gap-3">
              <button
                onClick={() => setContactOpen(true)}
                className="btn-gold text-[12px] py-2.5 px-5"
                aria-label="Get in touch with Soundbox Dubai"
              >
                Get in Touch
              </button>
            </div>

            {/* ── Mobile toggle ─────────────────────────────────────────────── */}
            <button
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg transition-[background] duration-150"
              style={{
                color: "#D6A84F",
                background: mobileOpen ? "rgba(214,168,79,0.1)" : "transparent",
              }}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* ── Mobile menu ───────────────────────────────────────────────────── */}
        <div
          className="lg:hidden overflow-hidden"
          style={{
            maxHeight: mobileOpen ? "100vh" : "0",
            transition: "max-height 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
            background: "rgba(5,5,5,0.99)",
            borderTop: mobileOpen ? "1px solid rgba(214,168,79,0.1)" : "none",
          }}
        >
          <nav className="px-5 py-4 space-y-0.5 max-h-[82vh] overflow-y-auto" aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <div key={link.label}>
                {link.children ? (
                  <>
                    <button
                      className="w-full flex items-center justify-between px-4 py-3.5 rounded-lg text-[14px] font-medium transition-[background] duration-150"
                      style={{
                        color: isActive(link.href) ? "#D6A84F" : "#E0E0EC",
                        background: isActive(link.href) ? "rgba(214,168,79,0.07)" : "transparent",
                      }}
                      onClick={() => setServicesOpen(!servicesOpen)}
                      aria-expanded={servicesOpen}
                    >
                      {link.label}
                      <ChevronDown
                        size={15}
                        style={{
                          transform: servicesOpen ? "rotate(180deg)" : "none",
                          transition: "transform 0.25s ease",
                          color: "#D6A84F",
                        }}
                      />
                    </button>
                    <div
                      className="overflow-hidden pl-4"
                      style={{
                        maxHeight: servicesOpen ? "500px" : "0",
                        transition: "max-height 0.3s ease",
                      }}
                    >
                      <div className="py-1 space-y-0.5">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block px-4 py-2.5 rounded-lg text-[13px] font-medium transition-[background,color] duration-100"
                            style={{
                              color: pathname === child.href ? "#D6A84F" : "#8A8A9A",
                              background: pathname === child.href ? "rgba(214,168,79,0.07)" : "transparent",
                            }}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    href={link.href}
                    className="block px-4 py-3.5 rounded-lg text-[14px] font-medium transition-[background,color] duration-100"
                    style={{
                      color: isActive(link.href) ? "#D6A84F" : "#E0E0EC",
                      background: isActive(link.href) ? "rgba(214,168,79,0.07)" : "transparent",
                    }}
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}

            <div className="pt-4 pb-2 space-y-2">
              <button
                onClick={() => { setMobileOpen(false); setContactOpen(true); }}
                className="btn-gold w-full block text-center text-[13px]"
              >
                Get in Touch
              </button>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Soundbox Dubai on Instagram"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-[13px] font-medium transition-[background,color] duration-150"
                style={{ background: "rgba(255,255,255,0.04)", color: "#A7A7B3", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <InstagramIcon size={14} /> Follow on Instagram
              </a>
            </div>
          </nav>
        </div>
      </header>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}
