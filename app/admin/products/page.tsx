"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Plus, Pencil, Trash2, Eye, EyeOff, Star, Package,
  X, Loader2, ChevronUp, ChevronDown, StarOff,
} from "lucide-react";
import type { DbProduct } from "@/lib/supabase/types";

const CATEGORIES = ["Bundles", "Audio", "Lighting", "LED Screens", "Staging", "DJ Equipment", "Other"];

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function parseSpecs(raw: string): Record<string, string> {
  const result: Record<string, string> = {};
  for (const line of raw.split("\n")) {
    const idx = line.indexOf(":");
    if (idx < 1) continue;
    const k = line.slice(0, idx).trim();
    const v = line.slice(idx + 1).trim();
    if (k && v) result[k] = v;
  }
  return result;
}

function formatSpecs(specs: Record<string, unknown> | undefined | null): string {
  if (!specs) return "";
  return Object.entries(specs)
    .filter(([k]) => k !== "bundleIncludes")
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
}

function formatBundleIncludes(specs: Record<string, unknown> | undefined | null): string {
  if (!specs) return "";
  const bi = specs["bundleIncludes"];
  if (!Array.isArray(bi)) return "";
  return (bi as string[]).join("\n");
}

interface FormState {
  title: string;
  slug: string;
  category: string;
  description: string;
  specsRaw: string;
  bundleIncludesRaw: string;
  image_url: string;
  is_bundle: boolean;
  is_visible: boolean;
  is_featured: boolean;
  sort_order: number;
}

const DEFAULT_FORM: FormState = {
  title: "",
  slug: "",
  category: "Audio",
  description: "",
  specsRaw: "",
  bundleIncludesRaw: "",
  image_url: "",
  is_bundle: false,
  is_visible: true,
  is_featured: false,
  sort_order: 0,
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<DbProduct | null>(null);
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filterCat, setFilterCat] = useState("All");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/products");
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed to load");
      const { data } = await res.json();
      setProducts(data ?? []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  function openAdd() {
    setEditing(null);
    setForm({ ...DEFAULT_FORM, sort_order: products.length });
    setModalOpen(true);
  }

  function openEdit(p: DbProduct) {
    setEditing(p);
    setForm({
      title: p.title,
      slug: p.slug,
      category: p.category ?? "Other",
      description: p.description ?? "",
      specsRaw: formatSpecs(p.specs as Record<string, unknown> | null),
      bundleIncludesRaw: formatBundleIncludes(p.specs as Record<string, unknown> | null),
      image_url: p.image_url ?? "",
      is_bundle: p.is_bundle,
      is_visible: p.is_visible,
      is_featured: p.is_featured,
      sort_order: p.sort_order,
    });
    setModalOpen(true);
  }

  async function handleSave() {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      const specs: Record<string, unknown> = parseSpecs(form.specsRaw);
      if (form.is_bundle && form.bundleIncludesRaw.trim()) {
        specs["bundleIncludes"] = form.bundleIncludesRaw.split("\n").map((l) => l.trim()).filter(Boolean);
      }
      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim() || slugify(form.title),
        category: form.category,
        description: form.description.trim(),
        specs,
        image_url: form.image_url.trim() || null,
        is_bundle: form.is_bundle,
        is_visible: form.is_visible,
        is_featured: form.is_featured,
        sort_order: form.sort_order,
      };

      const res = await fetch("/api/admin/products", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing ? { id: editing.id, ...payload } : payload),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Save failed");
      setModalOpen(false);
      await fetchProducts();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function quickUpdate(id: string, patch: Partial<DbProduct>) {
    try {
      const res = await fetch("/api/admin/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...patch }),
      });
      if (!res.ok) throw new Error("Update failed");
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
    } catch {
      alert("Update failed");
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch("/api/admin/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Delete failed");
      setDeleteId(null);
      await fetchProducts();
    } catch {
      alert("Delete failed");
    }
  }

  async function handleReorder(id: string, dir: -1 | 1) {
    const sorted = [...products].sort((a, b) => a.sort_order - b.sort_order);
    const idx = sorted.findIndex((p) => p.id === id);
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const a = sorted[idx];
    const b = sorted[swapIdx];
    await Promise.all([
      quickUpdate(a.id, { sort_order: b.sort_order }),
      quickUpdate(b.id, { sort_order: a.sort_order }),
    ]);
  }

  const visible = filterCat === "All" ? products : products.filter((p) => p.category === filterCat);
  const sortedVisible = [...visible].sort((a, b) => a.sort_order - b.sort_order);

  const stats = {
    total: products.length,
    visible: products.filter((p) => p.is_visible).length,
    featured: products.filter((p) => p.is_featured).length,
    bundles: products.filter((p) => p.is_bundle).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Products</h1>
          <p className="text-sm mt-0.5" style={{ color: "#5A5A6E" }}>
            {stats.total} total · {stats.visible} visible · {stats.featured} featured · {stats.bundles} bundles
          </p>
        </div>
        <button
          onClick={openAdd}
          className="btn-gold inline-flex items-center gap-2 text-sm"
        >
          <Plus size={15} /> Add Product
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total", value: stats.total, color: "#A7A7B3" },
          { label: "Visible", value: stats.visible, color: "#27AE60" },
          { label: "Featured", value: stats.featured, color: "#D6A84F" },
          { label: "Bundles", value: stats.bundles, color: "#9B51E0" },
        ].map(({ label, value, color }) => (
          <div key={label} className="glass-card rounded-xl p-4 flex items-center justify-between">
            <span className="text-sm" style={{ color: "#5A5A6E" }}>{label}</span>
            <span className="text-xl font-bold" style={{ color }}>{value}</span>
          </div>
        ))}
      </div>

      {/* Category filter */}
      <div className="flex items-center gap-2 flex-wrap">
        {["All", ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCat(cat)}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-[background,color] duration-150"
            style={{
              background: filterCat === cat ? "linear-gradient(135deg, #D6A84F, #B8852A)" : "rgba(255,255,255,0.04)",
              color: filterCat === cat ? "#050505" : "#A7A7B3",
              border: `1px solid ${filterCat === cat ? "transparent" : "rgba(255,255,255,0.08)"}`,
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg px-4 py-3 text-sm" style={{ background: "rgba(235,87,87,0.1)", color: "#EB5757", border: "1px solid rgba(235,87,87,0.2)" }}>
          {error}
          <button className="ml-3 underline text-xs" onClick={fetchProducts}>Retry</button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={28} className="animate-spin" style={{ color: "#D6A84F" }} />
        </div>
      )}

      {/* Products table */}
      {!loading && (
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: "1px solid rgba(214,168,79,0.1)" }}
        >
          {sortedVisible.length === 0 ? (
            <div className="py-16 text-center" style={{ color: "#5A5A6E" }}>
              No products. <button className="text-[#D6A84F] underline" onClick={openAdd}>Add one</button>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "rgba(214,168,79,0.05)", borderBottom: "1px solid rgba(214,168,79,0.1)" }}>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#5A5A6E" }}>Product</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider hidden sm:table-cell" style={{ color: "#5A5A6E" }}>Category</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#5A5A6E" }}>Visible</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider hidden md:table-cell" style={{ color: "#5A5A6E" }}>Featured</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider hidden lg:table-cell" style={{ color: "#5A5A6E" }}>Order</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#5A5A6E" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedVisible.map((p, i) => (
                  <tr
                    key={p.id}
                    style={{
                      background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)",
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                    }}
                  >
                    {/* Product cell */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-lg overflow-hidden shrink-0 flex items-center justify-center"
                          style={{ background: "#111118" }}
                        >
                          {p.image_url ? (
                            <Image src={p.image_url} alt={p.title} width={40} height={40} className="object-cover w-full h-full" unoptimized />
                          ) : (
                            <Package size={18} style={{ color: "#2A2A38" }} />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-white leading-snug">{p.title}</p>
                          <p className="text-xs" style={{ color: "#5A5A6E" }}>
                            {p.is_bundle && <span className="mr-1" style={{ color: "#9B51E0" }}>Bundle</span>}
                            /{p.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3 hidden sm:table-cell" style={{ color: "#A7A7B3" }}>
                      {p.category ?? "—"}
                    </td>

                    {/* Visible toggle */}
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => quickUpdate(p.id, { is_visible: !p.is_visible })}
                        title={p.is_visible ? "Hide" : "Show"}
                        className="transition-[opacity] duration-150 hover:opacity-70"
                      >
                        {p.is_visible
                          ? <Eye size={16} style={{ color: "#27AE60" }} />
                          : <EyeOff size={16} style={{ color: "#5A5A6E" }} />}
                      </button>
                    </td>

                    {/* Featured toggle */}
                    <td className="px-4 py-3 text-center hidden md:table-cell">
                      <button
                        onClick={() => quickUpdate(p.id, { is_featured: !p.is_featured })}
                        title={p.is_featured ? "Unfeature" : "Feature"}
                        className="transition-[opacity] duration-150 hover:opacity-70"
                      >
                        {p.is_featured
                          ? <Star size={16} style={{ color: "#D6A84F" }} />
                          : <StarOff size={16} style={{ color: "#5A5A6E" }} />}
                      </button>
                    </td>

                    {/* Order */}
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleReorder(p.id, -1)}
                          disabled={i === 0}
                          className="p-0.5 rounded transition-[opacity] duration-100 disabled:opacity-20"
                          style={{ color: "#A7A7B3" }}
                        >
                          <ChevronUp size={14} />
                        </button>
                        <span className="text-xs w-5 text-center" style={{ color: "#5A5A6E" }}>{p.sort_order}</span>
                        <button
                          onClick={() => handleReorder(p.id, 1)}
                          disabled={i === sortedVisible.length - 1}
                          className="p-0.5 rounded transition-[opacity] duration-100 disabled:opacity-20"
                          style={{ color: "#A7A7B3" }}
                        >
                          <ChevronDown size={14} />
                        </button>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(p)}
                          className="p-1.5 rounded-lg transition-[background] duration-150 hover:bg-white/5"
                          title="Edit"
                        >
                          <Pencil size={14} style={{ color: "#A7A7B3" }} />
                        </button>
                        <button
                          onClick={() => setDeleteId(p.id)}
                          className="p-1.5 rounded-lg transition-[background] duration-150 hover:bg-white/5"
                          title="Delete"
                        >
                          <Trash2 size={14} style={{ color: "#EB5757" }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ── Add/Edit Modal ─────────────────────────────────────────────────────── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}>
          <div
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 space-y-5"
            style={{ background: "#0D0D12", border: "1px solid rgba(214,168,79,0.2)" }}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold" style={{ fontFamily: "var(--font-display)" }}>
                {editing ? "Edit Product" : "Add Product"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg transition-[background] duration-150 hover:bg-white/5"
              >
                <X size={18} style={{ color: "#A7A7B3" }} />
              </button>
            </div>

            {/* Title + Slug */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "#A7A7B3" }}>
                  Title <span style={{ color: "#EB5757" }}>*</span>
                </label>
                <input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value, slug: slugify(e.target.value) }))}
                  className="w-full bg-[#181824] rounded-lg px-3 py-2.5 text-sm border outline-none"
                  style={{ borderColor: "rgba(214,168,79,0.2)", color: "#FFF" }}
                  placeholder="Product name"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "#A7A7B3" }}>Slug</label>
                <input
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  className="w-full bg-[#181824] rounded-lg px-3 py-2.5 text-sm border outline-none font-mono"
                  style={{ borderColor: "rgba(214,168,79,0.2)", color: "#D6A84F" }}
                  placeholder="auto-generated"
                />
              </div>
            </div>

            {/* Category + Sort order */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "#A7A7B3" }}>Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="w-full bg-[#181824] rounded-lg px-3 py-2.5 text-sm border outline-none"
                  style={{ borderColor: "rgba(214,168,79,0.2)", color: "#FFF" }}
                >
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "#A7A7B3" }}>Sort Order</label>
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm((f) => ({ ...f, sort_order: Number(e.target.value) }))}
                  className="w-full bg-[#181824] rounded-lg px-3 py-2.5 text-sm border outline-none"
                  style={{ borderColor: "rgba(214,168,79,0.2)", color: "#FFF" }}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "#A7A7B3" }}>Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={3}
                className="w-full bg-[#181824] rounded-lg px-3 py-2.5 text-sm border outline-none resize-none"
                style={{ borderColor: "rgba(214,168,79,0.2)", color: "#FFF" }}
                placeholder="Short product description"
              />
            </div>

            {/* Specs */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "#A7A7B3" }}>
                Specs <span className="font-normal" style={{ color: "#5A5A6E" }}>(one per line: Key: Value)</span>
              </label>
              <textarea
                value={form.specsRaw}
                onChange={(e) => setForm((f) => ({ ...f, specsRaw: e.target.value }))}
                rows={4}
                className="w-full bg-[#181824] rounded-lg px-3 py-2.5 text-sm border outline-none resize-none font-mono"
                style={{ borderColor: "rgba(214,168,79,0.2)", color: "#A7A7B3" }}
                placeholder={"Coverage: Up to 500 guests\nPower: 2000W\nDriver: 18\" woofer"}
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "#A7A7B3" }}>Image URL</label>
              <input
                value={form.image_url}
                onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
                className="w-full bg-[#181824] rounded-lg px-3 py-2.5 text-sm border outline-none"
                style={{ borderColor: "rgba(214,168,79,0.2)", color: "#FFF" }}
                placeholder="/Category%20BG/Audio%20Systems%20BG.png"
              />
              {form.image_url && (
                <div className="mt-2 w-24 h-16 rounded-lg overflow-hidden relative" style={{ background: "#111118" }}>
                  <Image src={form.image_url} alt="preview" fill className="object-cover" unoptimized />
                </div>
              )}
            </div>

            {/* Toggles */}
            <div className="flex flex-wrap gap-4">
              {[
                { key: "is_bundle", label: "Is Bundle" },
                { key: "is_visible", label: "Visible" },
                { key: "is_featured", label: "Featured" },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer select-none">
                  <div
                    className="w-9 h-5 rounded-full relative transition-[background] duration-200"
                    style={{ background: form[key as keyof FormState] ? "#D6A84F" : "rgba(255,255,255,0.1)" }}
                    onClick={() => setForm((f) => ({ ...f, [key]: !f[key as keyof FormState] }))}
                  >
                    <span
                      className="absolute top-0.5 w-4 h-4 rounded-full transition-[left] duration-200"
                      style={{
                        left: form[key as keyof FormState] ? "calc(100% - 18px)" : "2px",
                        background: "#FFF",
                      }}
                    />
                  </div>
                  <span className="text-sm" style={{ color: "#A7A7B3" }}>{label}</span>
                </label>
              ))}
            </div>

            {/* Bundle includes */}
            {form.is_bundle && (
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "#A7A7B3" }}>
                  Bundle Includes <span className="font-normal" style={{ color: "#5A5A6E" }}>(one item per line)</span>
                </label>
                <textarea
                  value={form.bundleIncludesRaw}
                  onChange={(e) => setForm((f) => ({ ...f, bundleIncludesRaw: e.target.value }))}
                  rows={5}
                  className="w-full bg-[#181824] rounded-lg px-3 py-2.5 text-sm border outline-none resize-none"
                  style={{ borderColor: "rgba(214,168,79,0.2)", color: "#A7A7B3" }}
                  placeholder={"2× Line array cabinets\n4× Subwoofers\nDigital mixing console"}
                />
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setModalOpen(false)}
                className="px-5 py-2.5 rounded-xl text-sm font-medium transition-[background] duration-150"
                style={{ background: "rgba(255,255,255,0.06)", color: "#A7A7B3" }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.title.trim()}
                className="btn-gold px-5 py-2.5 inline-flex items-center gap-2 disabled:opacity-60"
              >
                {saving && <Loader2 size={14} className="animate-spin" />}
                {editing ? "Save Changes" : "Add Product"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ─────────────────────────────────────────────────────── */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}>
          <div
            className="w-full max-w-sm rounded-2xl p-6 space-y-5"
            style={{ background: "#0D0D12", border: "1px solid rgba(235,87,87,0.3)" }}
          >
            <h2 className="text-lg font-bold" style={{ fontFamily: "var(--font-display)" }}>Delete Product?</h2>
            <p className="text-sm" style={{ color: "#A7A7B3" }}>
              This will permanently delete{" "}
              <strong style={{ color: "#FFF" }}>
                {products.find((p) => p.id === deleteId)?.title}
              </strong>
              . This cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-xl text-sm font-medium"
                style={{ background: "rgba(255,255,255,0.06)", color: "#A7A7B3" }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-[background] duration-150"
                style={{ background: "rgba(235,87,87,0.15)", color: "#EB5757", border: "1px solid rgba(235,87,87,0.3)" }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
