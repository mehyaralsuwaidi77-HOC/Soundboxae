import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, MessageCircle, ArrowLeft } from "lucide-react";
import SiteShell from "@/components/layout/SiteShell";
import WhatsAppLeadModal from "@/components/ui/WhatsAppLeadModal";
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
        {/* Category BG image as hero background */}
        <div className="absolute inset-0">
          <Image
            src={service.bgImage}
            alt=""
            fill
            className="object-cover opacity-25"
            unoptimized
            priority
          />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to bottom, rgba(5,5,5,0.55), rgba(5,5,5,0.92))",
            }}
          />
        </div>

        {/* Glow overlay */}
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
              <WhatsAppLeadModal
                href={whatsappInquiry(service.title)}
                className="btn-gold inline-flex items-center gap-2"
                source="service_page"
                service={service.title}
              >
                <MessageCircle size={15} />
                Inquire Now
              </WhatsAppLeadModal>
              <Link href="/products" className="btn-ghost">
                Browse Equipment
              </Link>
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

            {/* Category BG image */}
            <div className="rounded-xl aspect-video overflow-hidden relative">
              <Image
                src={service.bgImage}
                alt={service.title}
                fill
                className="object-cover"
                unoptimized
              />
              <div
                className="absolute inset-0"
                style={{ background: "rgba(0,0,0,0.15)" }}
              />
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
              <WhatsAppLeadModal
                href={whatsappInquiry(service.title)}
                className="btn-gold w-full block text-center"
                source="service_sidebar"
                service={service.title}
              >
                WhatsApp Us
              </WhatsAppLeadModal>
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
                className="group glass-card rounded-xl overflow-hidden flex flex-col transition-[transform] duration-200 hover:-translate-y-1"
              >
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={s.bgImage}
                    alt={s.title}
                    fill
                    className="object-cover transition-[transform] duration-500 group-hover:scale-105"
                    unoptimized
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: "rgba(0,0,0,0.3)" }}
                  />
                </div>
                <div className="p-4">
                  <p
                    className="text-sm font-semibold group-hover:text-[#D6A84F] transition-[color] duration-150"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {s.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
