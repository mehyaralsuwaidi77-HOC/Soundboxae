import type { Metadata } from "next";
import SiteShell from "@/components/layout/SiteShell";
import SectionHeader from "@/components/ui/SectionHeader";
import CTASection from "@/components/home/CTASection";
import GalleryGrid, { type GalleryDisplayItem } from "@/components/gallery/GalleryGrid";
import { galleryItems } from "@/data/gallery";
import { isServerConfigured, serverSupabase } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Gallery & Past Events | Soundbox Dubai",
  description:
    "A showcase of world-class events produced by Soundbox Dubai — weddings, corporate galas, concerts, and more across the UAE.",
};

export default async function GalleryPage() {
  let items: GalleryDisplayItem[] = galleryItems.map((g) => ({
    id: g.id,
    title: g.title,
    category: g.category,
    image: g.image,
    location: g.location,
    year: g.year,
    tags: g.tags,
  }));
  let isLive = false;

  if (isServerConfigured()) {
    try {
      const db = await serverSupabase();
      const { data } = await db
        .from("gallery_items")
        .select("*, section:gallery_sections(name, slug)")
        .eq("is_visible", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (data && data.length > 0) {
        items = data.map((item) => {
          const meta = (item.metadata ?? {}) as Record<string, unknown>;
          const section = item.section as { slug?: string } | null;
          return {
            id: item.id as string,
            title: (item.title as string) ?? "",
            category: (section?.slug ?? "corporate") as string,
            image: item.image_url as string,
            location: meta.location as string | undefined,
            year: meta.year as number | undefined,
            tags: Array.isArray(meta.tags) ? (meta.tags as string[]) : [],
          };
        });
        isLive = true;
      }
    } catch {
      // Fall back to static data on error
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
              "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(214,168,79,0.08) 0%, transparent 60%)",
          }}
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionHeader
            eyebrow="Portfolio"
            title="Gallery & Past Events"
            subtitle="A showcase of world-class events we've produced across Dubai and the UAE."
            centered
          />
        </div>
      </section>

      <GalleryGrid items={items} isLive={isLive} />

      <CTASection />
    </SiteShell>
  );
}
