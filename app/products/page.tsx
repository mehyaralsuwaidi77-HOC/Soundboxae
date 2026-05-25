import type { Metadata } from "next";
import Link from "next/link";
import SiteShell from "@/components/layout/SiteShell";
import SectionHeader from "@/components/ui/SectionHeader";
import ProductsGrid, { type NormalizedProduct } from "@/components/products/ProductsGrid";
import { products as staticProducts, productCategories } from "@/data/products";
import { isServerConfigured, serverSupabase } from "@/lib/supabase/server";
import type { DbProduct } from "@/lib/supabase/types";

export const metadata: Metadata = {
  title: "AV Equipment & Packages",
  description:
    "Browse Soundbox Dubai's complete inventory of professional audio visual equipment and curated event packages — no prices listed, contact us for a custom quote.",
};

function fromDb(p: DbProduct): NormalizedProduct {
  const raw = (p.specs ?? {}) as Record<string, unknown>;
  const bundleIncludes = Array.isArray(raw["bundleIncludes"])
    ? (raw["bundleIncludes"] as string[])
    : undefined;
  const specs: Record<string, string> = {};
  for (const [k, v] of Object.entries(raw)) {
    if (k !== "bundleIncludes" && typeof v === "string") specs[k] = v;
  }
  return {
    id: p.id,
    title: p.title,
    category: p.category ?? "Other",
    description: p.description ?? "",
    specs,
    imageUrl: p.image_url ?? undefined,
    isBundle: p.is_bundle,
    bundleIncludes,
    isFeatured: p.is_featured,
  };
}

async function fetchProducts(): Promise<{ items: NormalizedProduct[]; categories: string[] }> {
  if (isServerConfigured()) {
    try {
      const db = await serverSupabase();
      const { data, error } = await db
        .from("products")
        .select("*")
        .eq("is_visible", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      if (data && data.length > 0) {
        const items = (data as DbProduct[]).map(fromDb);
        const cats = [...new Set(items.map((p) => p.category))].filter(Boolean);
        return { items, categories: cats };
      }
    } catch (err) {
      console.error("[products page] Supabase fetch failed, using static data:", err);
    }
  }

  // Static fallback
  const items = staticProducts.map((p) => ({
    id: p.id,
    title: p.name,
    category: p.category,
    description: p.description,
    specs: p.specs,
    imageUrl: undefined,
    isBundle: p.isBundle,
    bundleIncludes: p.bundleIncludes,
    isFeatured: false,
  }));
  return { items, categories: [...productCategories].filter((c) => c !== "All") };
}

export default async function ProductsPage() {
  const { items, categories } = await fetchProducts();

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
            subtitle="Browse our complete inventory of professional AV equipment and curated event packages. Contact us for pricing."
            centered
          />
        </div>
      </section>

      <ProductsGrid products={items} categories={categories} />

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
