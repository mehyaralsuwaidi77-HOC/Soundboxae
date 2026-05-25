import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { galleryItems } from "@/data/gallery";
import { isServerConfigured, serverSupabase } from "@/lib/supabase/server";

interface PreviewItem {
  id: string;
  title: string;
  category: string;
  image: string;
  location?: string;
}

async function getFeatured(): Promise<PreviewItem[]> {
  if (!isServerConfigured()) return galleryItems.slice(0, 6);
  try {
    const db = await serverSupabase();
    const { data } = await db
      .from("gallery_items")
      .select("id, title, image_url, caption, is_featured, sort_order, category, metadata, section:gallery_sections(slug)")
      .eq("is_visible", true)
      .order("is_featured", { ascending: false })
      .order("sort_order", { ascending: true })
      .limit(6);

    if (!data || data.length === 0) return galleryItems.slice(0, 6);

    return data.map((item) => {
      const meta = item.metadata as Record<string, unknown> | null;
      const section = item.section as { slug?: string } | null;
      return {
        id:       item.id,
        title:    item.title ?? item.caption ?? "Event",
        category: section?.slug ?? item.category ?? "event",
        image:    item.image_url,
        location: meta?.location as string | undefined,
      };
    });
  } catch {
    return galleryItems.slice(0, 6);
  }
}

export default async function GalleryPreview() {
  const featured = await getFeatured();

  return (
    <section className="py-24" style={{ background: "#0B0B0F" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <SectionHeader
            eyebrow="Our Work"
            title="Events We've Produced"
            subtitle="A glimpse of the world-class events our team has powered across Dubai and the UAE."
          />
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-sm font-medium shrink-0 transition-[color] duration-150"
            style={{ color: "#D6A84F" }}
          >
            View Full Gallery
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* Masonry-style grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((item, i) => (
            <Link
              key={item.id}
              href="/gallery"
              className={`group relative overflow-hidden rounded-xl ${i === 0 ? "sm:col-span-2 lg:col-span-1" : ""}`}
              style={{ aspectRatio: i === 0 ? "16/9" : "4/3" }}
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-[transform] duration-500 group-hover:scale-105"
                unoptimized
              />
              {/* Gradient overlay */}
              <div
                className="absolute inset-0 transition-[opacity] duration-300 group-hover:opacity-70"
                style={{
                  background:
                    "linear-gradient(to top, rgba(5,5,5,0.9) 0%, rgba(5,5,5,0.3) 50%, transparent 100%)",
                }}
              />
              {/* Color tint */}
              <div
                className="absolute inset-0 opacity-20 mix-blend-multiply pointer-events-none"
                style={{ background: "#D6A84F" }}
              />
              {/* Info */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p
                  className="text-xs font-semibold uppercase tracking-wider mb-1"
                  style={{ color: "#D6A84F" }}
                >
                  {item.category.replace(/-/g, " ")}
                </p>
                <p className="text-sm font-semibold leading-tight text-white line-clamp-2">
                  {item.title}
                </p>
                {item.location && (
                  <p className="text-xs mt-1 opacity-70 text-white">{item.location}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
