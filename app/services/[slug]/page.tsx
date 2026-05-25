import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle, MessageCircle, ArrowLeft } from "lucide-react";
import SiteShell from "@/components/layout/SiteShell";
import GoldBadge from "@/components/ui/GoldBadge";
import { services, getServiceBySlug } from "@/data/services";
import { whatsappInquiry } from "@/lib/whatsapp";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};
  return {
    title: `${service.title} Rental Dubai`,
    description: `${service.description} Professional ${service.title.toLowerCase()} rental in Dubai for weddings, corporate events & concerts.`,
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const others = services.filter((s) => s.slug !== slug).slice(0, 4);

  return (
    <SiteShell>
      {/* Hero */}
      <section
        className="relative pt-36 pb-20 overflow-hidden"
        style={{ background: "#050505" }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 30% 0%, rgba(214,168,79,0.1) 0%, transparent 60%)",
          }}
        />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm mb-8 transition-[color] duration-150 hover:text-white"
            style={{ color: "#A7A7B3" }}
          >
            <ArrowLeft size={14} /> Back to Services
          </Link>
          <GoldBadge className="mb-4">{service.category}</GoldBadge>
          <div className="flex items-start gap-6">
            <span className="text-5xl shrink-0">{service.icon}</span>
            <div>
              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
                style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
              >
                {service.title}
              </h1>
              <p className="text-xl leading-relaxed mb-8" style={{ color: "#A7A7B3" }}>
                {service.subtitle}
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={whatsappInquiry(service.title)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold inline-flex items-center gap-2"
                >
                  <MessageCircle size={15} />
                  Inquire Now
                </a>
                <Link href="/products" className="btn-ghost">
                  Browse Equipment
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20" style={{ background: "#0B0B0F" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main */}
          <div className="lg:col-span-2 space-y-10">
            <div>
              <h2
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: "var(--font-display)" }}
              >
                About This Service
              </h2>
              <p className="text-base leading-relaxed" style={{ color: "#A7A7B3" }}>
                {service.longDescription}
              </p>
            </div>

            <div>
              <h2
                className="text-2xl font-bold mb-6"
                style={{ fontFamily: "var(--font-display)" }}
              >
                What&apos;s Included
              </h2>
              <ul className="space-y-3">
                {service.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <CheckCircle size={16} style={{ color: "#D6A84F", marginTop: 3, flexShrink: 0 }} />
                    <span className="text-sm" style={{ color: "#A7A7B3" }}>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Placeholder image */}
            <div
              className="rounded-xl aspect-video flex items-center justify-center overflow-hidden"
              style={{ background: "#111118", border: "1px solid rgba(214,168,79,0.1)" }}
            >
              <span className="text-6xl">{service.icon}</span>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Use cases */}
            <div className="glass-card rounded-xl p-6">
              <h3
                className="text-lg font-bold mb-4"
                style={{ fontFamily: "var(--font-display)", color: "#D6A84F" }}
              >
                Perfect For
              </h3>
              <ul className="space-y-2">
                {service.useCases.map((uc) => (
                  <li key={uc} className="flex items-center gap-2">
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: "#D6A84F" }}
                    />
                    <span className="text-sm" style={{ color: "#A7A7B3" }}>{uc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA card */}
            <div
              className="rounded-xl p-6"
              style={{
                background: "linear-gradient(135deg, rgba(214,168,79,0.12), rgba(214,168,79,0.04))",
                border: "1px solid rgba(214,168,79,0.25)",
              }}
            >
              <h3
                className="text-lg font-bold mb-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Need a Quote?
              </h3>
              <p className="text-sm mb-4" style={{ color: "#A7A7B3" }}>
                Contact our team for a custom quote tailored to your event.
              </p>
              <a
                href={whatsappInquiry(service.title)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold w-full block text-center"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Other services */}
      <section className="py-16" style={{ background: "#111118" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-2xl font-bold mb-8"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Other Services
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {others.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="group glass-card rounded-xl p-5 flex flex-col gap-3 transition-[transform] duration-200 hover:-translate-y-1"
              >
                <span className="text-2xl">{s.icon}</span>
                <p
                  className="text-sm font-semibold group-hover:text-[#D6A84F] transition-[color] duration-150"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {s.title}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
