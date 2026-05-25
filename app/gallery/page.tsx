"use client";

import { useState } from "react";
import Image from "next/image";
import { MapPin, Calendar } from "lucide-react";
import SiteShell from "@/components/layout/SiteShell";
import SectionHeader from "@/components/ui/SectionHeader";
import CTASection from "@/components/home/CTASection";
import { galleryItems, galleryCategories, type GalleryCategory } from "@/data/gallery";

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>("all");

  const filtered =
    activeCategory === "all"
      ? galleryItems
      : galleryItems.filter((g) => g.category === activeCategory);

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

      {/* Filter */}
      <section
        className="sticky top-20 z-30 py-4"
        style={{
          background: "rgba(11,11,15,0.95)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(214,168,79,0.08)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {galleryCategories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className="shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-[background,color,border-color] duration-200"
                style={{
                  background:
                    activeCategory === cat.value
                      ? "linear-gradient(135deg, #D6A84F, #B8852A)"
                      : "rgba(17,17,24,0.8)",
                  color: activeCategory === cat.value ? "#050505" : "#A7A7B3",
                  border: `1px solid ${activeCategory === cat.value ? "transparent" : "rgba(214,168,79,0.15)"}`,
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16" style={{ background: "#0B0B0F" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-xl break-inside-avoid"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  width={800}
                  height={600}
                  className="w-full object-cover transition-[transform] duration-500 group-hover:scale-105"
                />
                {/* Overlay */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-[opacity] duration-300"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(5,5,5,0.95) 0%, rgba(5,5,5,0.4) 50%, transparent 100%)",
                  }}
                />
                {/* Info */}
                <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-[transform,opacity] duration-300">
                  <p
                    className="text-xs font-semibold uppercase tracking-wider mb-1"
                    style={{ color: "#D6A84F" }}
                  >
                    {item.category.replace("-", " ")}
                  </p>
                  <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                  <div className="flex items-center gap-4">
                    {item.location && (
                      <span className="flex items-center gap-1 text-xs" style={{ color: "#A7A7B3" }}>
                        <MapPin size={11} /> {item.location}
                      </span>
                    )}
                    {item.year && (
                      <span className="flex items-center gap-1 text-xs" style={{ color: "#A7A7B3" }}>
                        <Calendar size={11} /> {item.year}
                      </span>
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div className="absolute top-3 right-3 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-[opacity] duration-300">
                  {item.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        background: "rgba(214,168,79,0.15)",
                        color: "#D6A84F",
                        border: "1px solid rgba(214,168,79,0.25)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center py-20" style={{ color: "#5A5A6E" }}>
              No items in this category yet.
            </p>
          )}
        </div>
      </section>

      <CTASection />
    </SiteShell>
  );
}
