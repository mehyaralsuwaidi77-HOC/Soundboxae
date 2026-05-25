"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Package } from "lucide-react";
import SiteShell from "@/components/layout/SiteShell";
import SectionHeader from "@/components/ui/SectionHeader";
import GoldBadge from "@/components/ui/GoldBadge";
import { products, productCategories } from "@/data/products";
import { whatsappInquiry } from "@/lib/whatsapp";

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filtered =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <SiteShell>
      {/* Hero */}
      <section className="relative pt-36 pb-16 overflow-hidden" style={{ background: "#050505" }}>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(214,168,79,0.08) 0%, transparent 60%)",
          }}
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionHeader
            eyebrow="Equipment & Packages"
            title="Products & Bundles"
            subtitle="Browse our complete inventory of professional AV equipment and curated event packages."
            centered
          />
        </div>
      </section>

      {/* Filter bar */}
      <section className="sticky top-20 z-30 py-4" style={{ background: "rgba(11,11,15,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(214,168,79,0.08)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {productCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-[background,color,border-color] duration-200"
                style={{
                  background:
                    activeCategory === cat
                      ? "linear-gradient(135deg, #D6A84F, #B8852A)"
                      : "rgba(17,17,24,0.8)",
                  color: activeCategory === cat ? "#050505" : "#A7A7B3",
                  border: `1px solid ${activeCategory === cat ? "transparent" : "rgba(214,168,79,0.15)"}`,
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products grid */}
      <section className="py-16" style={{ background: "#0B0B0F" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((product) => (
              <div
                key={product.id}
                className="group glass-card rounded-xl overflow-hidden flex flex-col transition-[transform,box-shadow] duration-300 hover:-translate-y-1"
              >
                {/* Image */}
                <div
                  className="relative aspect-video flex items-center justify-center overflow-hidden"
                  style={{ background: "#111118" }}
                >
                  <Package size={48} style={{ color: "#2A2A38" }} />
                  {product.isBundle && (
                    <div className="absolute top-3 left-3">
                      <GoldBadge>Bundle</GoldBadge>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-5 flex flex-col gap-3 flex-1">
                  <div>
                    <p className="text-xs mb-1" style={{ color: "#5A5A6E" }}>
                      {product.category}
                    </p>
                    <h3
                      className="text-base font-bold leading-snug"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {product.name}
                    </h3>
                  </div>
                  <p className="text-xs leading-relaxed line-clamp-3 flex-1" style={{ color: "#A7A7B3" }}>
                    {product.description}
                  </p>

                  {/* Specs */}
                  {Object.keys(product.specs).length > 0 && (
                    <div className="space-y-1">
                      {Object.entries(product.specs)
                        .slice(0, 3)
                        .map(([k, v]) => (
                          <div key={k} className="flex items-start justify-between gap-2">
                            <span className="text-xs" style={{ color: "#5A5A6E" }}>{k}</span>
                            <span className="text-xs text-right" style={{ color: "#A7A7B3" }}>{v}</span>
                          </div>
                        ))}
                    </div>
                  )}

                  {/* Bundle includes */}
                  {product.isBundle && product.bundleIncludes && (
                    <div>
                      <p className="text-xs font-semibold mb-2" style={{ color: "#D6A84F" }}>Includes:</p>
                      <ul className="space-y-1">
                        {product.bundleIncludes.slice(0, 4).map((item) => (
                          <li key={item} className="text-xs flex items-start gap-1.5">
                            <span style={{ color: "#D6A84F" }}>·</span>
                            <span style={{ color: "#A7A7B3" }}>{item}</span>
                          </li>
                        ))}
                        {product.bundleIncludes.length > 4 && (
                          <li className="text-xs" style={{ color: "#5A5A6E" }}>
                            +{product.bundleIncludes.length - 4} more items
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  {/* CTA */}
                  <a
                    href={whatsappInquiry(product.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto btn-gold inline-flex items-center justify-center gap-2 text-xs"
                  >
                    <MessageCircle size={13} />
                    Inquire via WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p style={{ color: "#5A5A6E" }}>No products found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Custom CTA */}
      <section
        className="py-16"
        style={{ background: "#111118", borderTop: "1px solid rgba(214,168,79,0.08)" }}
      >
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2
            className="text-3xl font-bold mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Need a Custom Package?
          </h2>
          <p className="mb-8" style={{ color: "#A7A7B3" }}>
            Don&apos;t see exactly what you need? We build custom packages for every event type and budget.
          </p>
          <Link href="/services" className="btn-ghost">
            View All Services
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
