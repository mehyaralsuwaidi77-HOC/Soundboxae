"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { galleryItems as defaultItems, galleryCategories } from "@/data/gallery";
import {
  getAdminGallery,
  saveGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  type GalleryItem,
} from "@/lib/storage";

const emptyForm = {
  title: "",
  category: "corporate",
  image: "",
  location: "",
  year: new Date().getFullYear(),
  tags: "",
  featured: false,
  visible: true,
  altText: "",
  caption: "",
};

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    let stored = getAdminGallery();
    if (stored.length === 0) {
      // Seed from static data on first visit
      defaultItems.forEach((g) => {
        saveGalleryItem({
          title: g.title,
          category: g.category,
          image: g.image,
          location: g.location ?? "",
          year: g.year ?? new Date().getFullYear(),
          tags: g.tags,
          featured: (g as { featured?: boolean }).featured ?? false,
          visible: (g as { visible?: boolean }).visible ?? true,
          altText: (g as { altText?: string }).altText ?? g.title,
          caption: (g as { caption?: string }).caption,
        });
      });
      stored = getAdminGallery();
    }
    setItems(stored);
  }, []);

  function refresh() { setItems(getAdminGallery()); }

  function handleAdd() {
    if (!form.title || !form.image) return;
    saveGalleryItem({
      title: form.title,
      category: form.category,
      image: form.image,
      location: form.location,
      year: form.year,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      featured: form.featured,
      visible: form.visible,
      altText: form.altText || form.title,
      caption: form.caption || undefined,
    });
    setForm(emptyForm);
    setShowForm(false);
    refresh();
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this gallery item?")) return;
    deleteGalleryItem(id);
    refresh();
  }

  function toggleVisible(id: string, visible: boolean) {
    updateGalleryItem(id, { visible: !visible });
    refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
            Gallery Management
          </h1>
          <p className="text-sm" style={{ color: "#A7A7B3" }}>
            {items.length} item{items.length !== 1 ? "s" : ""} &middot; changes persist in storage
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-gold inline-flex items-center gap-2"
        >
          <Plus size={15} /> Add Photo
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="glass-card rounded-xl p-6 space-y-4">
          <h3 className="font-bold" style={{ fontFamily: "var(--font-display)" }}>
            Add Gallery Item
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { key: "title",    label: "Title *" },
              { key: "image",    label: "Image URL *" },
              { key: "location", label: "Location" },
              { key: "altText",  label: "Alt Text" },
              { key: "year",     label: "Year", type: "number" },
            ].map(({ key, label, type }) => (
              <div key={key}>
                <label className="block text-xs mb-1" style={{ color: "#A7A7B3" }}>{label}</label>
                <input
                  type={type ?? "text"}
                  value={String(form[key as keyof typeof form])}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      [key]: type === "number" ? Number(e.target.value) : e.target.value,
                    })
                  }
                  className="w-full bg-[#181824] rounded-lg px-3 py-2 text-sm border outline-none"
                  style={{ color: "#FFF", borderColor: "rgba(214,168,79,0.2)" }}
                />
              </div>
            ))}
            <div>
              <label className="block text-xs mb-1" style={{ color: "#A7A7B3" }}>Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-[#181824] rounded-lg px-3 py-2 text-sm border outline-none"
                style={{ color: "#FFF", borderColor: "rgba(214,168,79,0.2)" }}
              >
                {galleryCategories
                  .filter((c) => c.value !== "all")
                  .map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs mb-1" style={{ color: "#A7A7B3" }}>Tags (comma-separated)</label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="Sound, Lighting, Stage"
                className="w-full bg-[#181824] rounded-lg px-3 py-2 text-sm border outline-none"
                style={{ color: "#FFF", borderColor: "rgba(214,168,79,0.2)" }}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs mb-1" style={{ color: "#A7A7B3" }}>Caption (optional)</label>
              <input
                type="text"
                value={form.caption}
                onChange={(e) => setForm({ ...form, caption: e.target.value })}
                className="w-full bg-[#181824] rounded-lg px-3 py-2 text-sm border outline-none"
                style={{ color: "#FFF", borderColor: "rgba(214,168,79,0.2)" }}
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: "#A7A7B3" }}>
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="accent-[#D6A84F]"
                />
                Featured
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: "#A7A7B3" }}>
                <input
                  type="checkbox"
                  checked={form.visible}
                  onChange={(e) => setForm({ ...form, visible: e.target.checked })}
                  className="accent-[#D6A84F]"
                />
                Visible
              </label>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleAdd} className="btn-gold">Add Item</button>
            <button onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
          </div>
        </div>
      )}

      {/* Grid */}
      {items.length === 0 ? (
        <div className="glass-card rounded-xl p-12 text-center">
          <p style={{ color: "#5A5A6E" }}>No gallery items yet. Add one above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {items.map((item) => (
            <div
              key={item.id}
              className="group glass-card rounded-xl overflow-hidden"
              style={{ opacity: item.visible ? 1 : 0.45 }}
            >
              <div className="relative aspect-video overflow-hidden" style={{ background: "#181824" }}>
                <Image src={item.image} alt={item.altText || item.title} fill className="object-cover" />
                {item.featured && (
                  <span
                    className="absolute top-2 left-2 text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={{ background: "rgba(214,168,79,0.9)", color: "#050505" }}
                  >
                    Featured
                  </span>
                )}
                <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-[opacity] duration-200">
                  <button
                    onClick={() => toggleVisible(item.id, item.visible)}
                    className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(17,17,24,0.9)", color: item.visible ? "#D6A84F" : "#5A5A6E" }}
                    title={item.visible ? "Hide" : "Show"}
                  >
                    {item.visible ? <Eye size={13} /> : <EyeOff size={13} />}
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(235,87,87,0.9)", color: "#FFF" }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <p className="text-xs mb-0.5" style={{ color: "#D6A84F" }}>{item.category}</p>
                <p className="text-sm font-semibold text-white line-clamp-2">{item.title}</p>
                {item.location && (
                  <p className="text-xs mt-1" style={{ color: "#5A5A6E" }}>📍 {item.location}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
