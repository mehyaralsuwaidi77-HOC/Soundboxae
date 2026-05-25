"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Trash2 } from "lucide-react";
import { galleryItems as defaultItems, galleryCategories } from "@/data/gallery";

interface GalleryEntry {
  id: string;
  title: string;
  category: string;
  image: string;
  location: string;
  year: number;
  tags: string;
}

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryEntry[]>(
    defaultItems.map((g) => ({
      id: g.id,
      title: g.title,
      category: g.category,
      image: g.image,
      location: g.location ?? "",
      year: g.year ?? new Date().getFullYear(),
      tags: g.tags.join(", "),
    }))
  );
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Omit<GalleryEntry, "id">>({
    title: "",
    category: "corporate",
    image: "",
    location: "",
    year: new Date().getFullYear(),
    tags: "",
  });

  function handleAdd() {
    if (!form.title || !form.image) return;
    setItems((prev) => [
      { ...form, id: `g${Date.now()}` },
      ...prev,
    ]);
    setForm({ title: "", category: "corporate", image: "", location: "", year: new Date().getFullYear(), tags: "" });
    setShowForm(false);
  }

  function handleDelete(id: string) {
    setItems((prev) => prev.filter((g) => g.id !== id));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
            Gallery Management
          </h1>
          <p className="text-sm" style={{ color: "#A7A7B3" }}>
            {items.length} items
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-gold inline-flex items-center gap-2">
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
              { key: "title", label: "Title *" },
              { key: "image", label: "Image URL *" },
              { key: "location", label: "Location" },
              { key: "year", label: "Year", type: "number" },
            ].map(({ key, label, type }) => (
              <div key={key}>
                <label className="block text-xs mb-1" style={{ color: "#A7A7B3" }}>{label}</label>
                <input
                  type={type ?? "text"}
                  value={String(form[key as keyof typeof form])}
                  onChange={(e) => setForm({ ...form, [key]: type === "number" ? Number(e.target.value) : e.target.value })}
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
                {galleryCategories.filter((c) => c.value !== "all").map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
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
          </div>
          <div className="flex gap-3">
            <button onClick={handleAdd} className="btn-gold">Add Item</button>
            <button onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {items.map((item) => (
          <div
            key={item.id}
            className="group glass-card rounded-xl overflow-hidden"
          >
            <div className="relative aspect-video overflow-hidden" style={{ background: "#181824" }}>
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
              />
              <button
                onClick={() => handleDelete(item.id)}
                className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-[opacity] duration-200"
                style={{ background: "rgba(235,87,87,0.9)" }}
              >
                <Trash2 size={13} className="text-white" />
              </button>
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
    </div>
  );
}
