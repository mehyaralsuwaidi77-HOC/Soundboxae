import type { Metadata } from "next";
import Image from "next/image";
import SiteShell from "@/components/layout/SiteShell";
import SectionHeader from "@/components/ui/SectionHeader";
import CTASection from "@/components/home/CTASection";
import { clients as staticClients } from "@/data/clients";
import { isServerConfigured, serverSupabase } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Our Clients | Soundbox Dubai",
  description:
    "Soundbox Dubai is trusted by leading brands, hotels, and entertainment companies across the UAE for premium audio visual production.",
};

interface DisplayClient {
  id: string;
  name: string;
  logo: string;
  websiteUrl?: string;
}

export default async function ClientsPage() {
  let clients: DisplayClient[] = staticClients.map((c) => ({
    id: c.id,
    name: c.name,
    logo: c.logo,
  }));
  let isLive = false;

  if (isServerConfigured()) {
    try {
      const db = await serverSupabase();
      const { data } = await db
        .from("client_logos")
        .select("id, client_name, logo_url, website_url")
        .eq("is_visible", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (data && data.length > 0) {
        clients = data.map((c) => ({
          id: c.id as string,
          name: c.client_name as string,
          logo: c.logo_url as string,
          websiteUrl: (c.website_url as string) || undefined,
        }));
        isLive = true;
      }
    } catch {
      // Fall back to static on error
    }
  }

  return (
    <SiteShell>
      {/* Hero */}
      <section className="relative pt-36 pb-20 overflow-hidden" style={{ background: "#050505" }}>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(214,168,79,0.1) 0%, transparent 60%)",
          }}
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionHeader
            eyebrow="Trusted By"
            title="Our Clients"
            subtitle="We are proud to partner with Dubai's most prestigious brands, venues, and organisations."
            centered
          />
        </div>
      </section>

      {/* Logos grid */}
      <section className="py-20" style={{ background: "#0B0B0F" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {!isLive && (
            <p
              className="text-xs text-center mb-8 px-3 py-2 rounded-lg"
              style={{
                color: "#F2994A",
                background: "rgba(242,153,74,0.08)",
                border: "1px solid rgba(242,153,74,0.15)",
              }}
            >
              Demo data — add real client logos via Admin → Clients to display them here.
            </p>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {clients.map((client) => {
              const inner = (
                <div
                  key={client.id}
                  className="client-logo-card group flex items-center justify-center rounded-xl p-6 transition-[transform] duration-300 hover:-translate-y-1"
                  style={{ aspectRatio: "4/3" }}
                >
                  <Image
                    src={client.logo}
                    alt={client.name}
                    width={120}
                    height={70}
                    sizes="(max-width: 640px) 40vw, (max-width: 1024px) 20vw, 15vw"
                    className="client-logo-img object-contain max-h-16 w-auto"
                    unoptimized
                  />
                </div>
              );

              return client.websiteUrl ? (
                <a
                  key={client.id}
                  href={client.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={client.name}
                >
                  {inner}
                </a>
              ) : (
                <div key={client.id}>{inner}</div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust block */}
      <section className="py-16" style={{ background: "#111118" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { icon: "🏆", value: "500+", label: "Events Delivered" },
              { icon: "⭐", value: "50+", label: "Premium Clients" },
              { icon: "🇦🇪", value: "UAE-Wide", label: "Coverage" },
            ].map((stat) => (
              <div key={stat.label} className="glass-card rounded-xl p-8">
                <span className="text-4xl block mb-3">{stat.icon}</span>
                <p
                  className="text-3xl font-bold mb-1 text-gold-gradient"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {stat.value}
                </p>
                <p className="text-sm uppercase tracking-widest" style={{ color: "#5A5A6E" }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </SiteShell>
  );
}
