import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import SiteShell from "@/components/layout/SiteShell";
import SectionHeader from "@/components/ui/SectionHeader";
import GoldBadge from "@/components/ui/GoldBadge";
import { services } from "@/data/services";
import { whatsappGeneral } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "AV Rental Services Dubai",
  description:
    "Complete audio visual rental services in Dubai: sound systems, LED screens, lighting, staging, rigging, DJ equipment, event production and more.",
};

const categoryLabels: Record<string, string> = {
  audio: "Audio",
  visual: "Visual",
  staging: "Staging",
  production: "Production",
};

export default function ServicesPage() {
  const grouped = services.reduce(
    (acc, s) => {
      if (!acc[s.category]) acc[s.category] = [];
      acc[s.category].push(s);
      return acc;
    },
    {} as Record<string, typeof services>
  );

  return (
    <SiteShell>
      {/* Hero */}
      <section
        className="relative pt-40 pb-24 overflow-hidden"
        style={{ background: "#050505" }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(214,168,79,0.1) 0%, transparent 60%)",
          }}
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionHeader
            eyebrow="What We Offer"
            title="Our Services"
            subtitle="From a single microphone to a full concert production — we supply and operate every technical element your event requires."
            centered
          />
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href={whatsappGeneral()} target="_blank" rel="noopener noreferrer" className="btn-gold">
              Get a Quote
            </a>
            <Link href="/products" className="btn-ghost">
              Browse Products
            </Link>
          </div>
        </div>
      </section>

      {/* Services by category */}
      <section className="py-20" style={{ background: "#0B0B0F" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          {Object.entries(grouped).map(([cat, items]) => (
            <div key={cat}>
              <div className="flex items-center gap-3 mb-8">
                <GoldBadge>{categoryLabels[cat] ?? cat}</GoldBadge>
                <div className="flex-1 h-px" style={{ background: "rgba(214,168,79,0.1)" }} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {items.map((service) => (
                  <Link
                    key={service.slug}
                    href={`/services/${service.slug}`}
                    className="group glass-card rounded-xl overflow-hidden flex flex-col transition-[transform,box-shadow] duration-300 hover:-translate-y-1"
                  >
                    {/* Category BG image */}
                    <div className="relative aspect-video overflow-hidden shrink-0">
                      <Image
                        src={service.bgImage}
                        alt={service.title}
                        fill
                        className="object-cover transition-[transform] duration-500 group-hover:scale-105"
                        unoptimized
                      />
                      <div
                        className="absolute inset-0"
                        style={{
                          background: "linear-gradient(to bottom, rgba(0,0,0,0.05), rgba(11,11,15,0.65))",
                        }}
                      />
                    </div>

                    <div className="p-6 flex flex-col gap-3 flex-1">
                      <div>
                        <h3
                          className="text-xl font-bold mb-2 group-hover:text-[#D6A84F] transition-[color] duration-150"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          {service.title}
                        </h3>
                        <p className="text-sm leading-relaxed" style={{ color: "#A7A7B3" }}>
                          {service.description}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-auto">
                        {service.useCases.slice(0, 3).map((uc) => (
                          <span
                            key={uc}
                            className="text-xs px-2 py-0.5 rounded"
                            style={{ background: "rgba(214,168,79,0.08)", color: "#D6A84F" }}
                          >
                            {uc}
                          </span>
                        ))}
                      </div>
                      <span
                        className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider"
                        style={{ color: "#D6A84F" }}
                      >
                        View details <ArrowRight size={12} />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
