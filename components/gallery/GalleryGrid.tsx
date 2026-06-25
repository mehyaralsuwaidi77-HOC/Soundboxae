"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { MapPin, Calendar, X, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { type GalleryCategory, galleryCategories } from "@/data/gallery";

export interface GalleryDisplayItem {
  id: string;
  title: string;
  category: string;
  image?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  mediaType?: "image" | "video";
  location?: string;
  year?: number;
  tags: string[];
}

// ── Lightbox ─────────────────────────────────────────────────────────────────

function Lightbox({
  items,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  items: GalleryDisplayItem[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const item = items[index];

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    },
    [onClose, onPrev, onNext]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [handleKey]);

  // Touch swipe
  const [touchStart, setTouchStart] = useState<number | null>(null);
  function onTouchStart(e: React.TouchEvent) { setTouchStart(e.touches[0].clientX); }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? onNext() : onPrev();
    setTouchStart(null);
  }

  const isVideo = item.mediaType === "video" || Boolean(item.videoUrl);

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.95)", backdropFilter: "blur(12px)" }}
      onClick={onClose}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-[background] duration-150 hover:bg-white/10"
        style={{ background: "rgba(255,255,255,0.06)", color: "#FFF" }}
        aria-label="Close"
      >
        <X size={20} />
      </button>

      {/* Prev */}
      {index > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-3 sm:left-6 z-10 w-11 h-11 rounded-full flex items-center justify-center transition-[background] duration-150 hover:bg-white/10"
          style={{ background: "rgba(255,255,255,0.06)", color: "#FFF" }}
          aria-label="Previous"
        >
          <ChevronLeft size={22} />
        </button>
      )}

      {/* Next */}
      {index < items.length - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-3 sm:right-6 z-10 w-11 h-11 rounded-full flex items-center justify-center transition-[background] duration-150 hover:bg-white/10"
          style={{ background: "rgba(255,255,255,0.06)", color: "#FFF" }}
          aria-label="Next"
        >
          <ChevronRight size={22} />
        </button>
      )}

      {/* Media */}
      <div
        className="relative max-w-5xl max-h-[85vh] w-full mx-14 sm:mx-20 rounded-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.8)" }}
      >
        {isVideo && item.videoUrl ? (
          <video
            src={item.videoUrl}
            controls
            autoPlay={false}
            muted
            playsInline
            className="w-full max-h-[78vh] object-contain rounded-xl"
            style={{ background: "#000" }}
          />
        ) : (
          <Image
            src={item.image ?? item.thumbnailUrl ?? "/logos/soundbox-logo.png"}
            alt={item.title}
            width={1200}
            height={800}
            className="w-full max-h-[78vh] object-contain rounded-xl"
            unoptimized
            priority
          />
        )}

        {/* Caption bar */}
        <div
          className="absolute bottom-0 left-0 right-0 px-5 py-4"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent)",
          }}
        >
          <p className="text-sm font-semibold text-white">{item.title}</p>
          <div className="flex items-center gap-4 mt-1">
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
            <span className="text-xs" style={{ color: "#5A5A6E" }}>
              {index + 1} / {items.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main grid ─────────────────────────────────────────────────────────────────

export default function GalleryGrid({
  items,
  isLive,
}: {
  items: GalleryDisplayItem[];
  isLive: boolean;
}) {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered =
    activeCategory === "all"
      ? items
      : items.filter((g) => g.category === activeCategory);

  function openLightbox(i: number) {
    setLightboxIndex(i);
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_name: filtered[i].mediaType === "video" ? "gallery_video_played" : "gallery_media_opened",
        event_type: "engagement",
        metadata: { title: filtered[i].title, mediaType: filtered[i].mediaType ?? "image" },
      }),
    }).catch(() => {});
  }

  return (
    <>
      {/* Filter bar */}
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
          {!isLive && (
            <p
              className="text-xs text-center mb-6 px-3 py-2 rounded-lg inline-block"
              style={{
                color: "#F2994A",
                background: "rgba(242,153,74,0.08)",
                border: "1px solid rgba(242,153,74,0.2)",
              }}
            >
              Demo data — connect Supabase and add items via Admin → Gallery to show real events.
            </p>
          )}

          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
            {filtered.map((item, i) => {
              const isVideo = item.mediaType === "video" || Boolean(item.videoUrl);
              const thumb = item.thumbnailUrl ?? item.image ?? "";

              return (
                <div
                  key={item.id}
                  className="group relative overflow-hidden rounded-xl break-inside-avoid cursor-pointer"
                  onClick={() => openLightbox(i)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Open ${item.title}`}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") openLightbox(i); }}
                >
                  {isVideo ? (
                    <div className="relative bg-[#0D0D12] aspect-video overflow-hidden">
                      {thumb ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={thumb}
                          alt={item.title}
                          className="w-full h-full object-cover transition-[transform] duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ color: "#5A5A6E" }}>
                          <Play size={40} />
                        </div>
                      )}
                      {/* Play icon overlay */}
                      <div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{ background: "rgba(0,0,0,0.3)" }}
                      >
                        <div
                          className="w-14 h-14 rounded-full flex items-center justify-center transition-[transform] duration-200 group-hover:scale-110"
                          style={{ background: "rgba(214,168,79,0.9)" }}
                        >
                          <Play size={22} style={{ color: "#050505", marginLeft: 2 }} />
                        </div>
                      </div>
                      {/* Video badge */}
                      <span
                        className="absolute top-2 left-2 text-xs px-2 py-0.5 rounded-full font-semibold"
                        style={{ background: "rgba(214,168,79,0.85)", color: "#050505" }}
                      >
                        Video
                      </span>
                    </div>
                  ) : (
                    <Image
                      src={item.image ?? ""}
                      alt={item.title}
                      width={800}
                      height={600}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="w-full object-cover transition-[transform] duration-500 group-hover:scale-105"
                      unoptimized
                    />
                  )}

                  {/* Hover overlay */}
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
              );
            })}
          </div>

          {filtered.length === 0 && (
            <p className="text-center py-20" style={{ color: "#5A5A6E" }}>
              No items in this category yet.
            </p>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          items={filtered}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex((i) => (i !== null && i > 0 ? i - 1 : i))}
          onNext={() => setLightboxIndex((i) => (i !== null && i < filtered.length - 1 ? i + 1 : i))}
        />
      )}
    </>
  );
}
