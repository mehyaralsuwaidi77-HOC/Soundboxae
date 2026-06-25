"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Plus, Trash2, Eye, EyeOff, Upload, RefreshCw, Link as LinkIcon, Pencil, X, Play } from "lucide-react";
import { galleryItems as defaultItems, galleryCategories } from "@/data/gallery";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  getAdminGallery, saveGalleryItem, updateGalleryItem, deleteGalleryItem,
  type GalleryItem,
} from "@/lib/storage";
import type { DbGalleryItem } from "@/lib/supabase/types";

const ACCEPTED_TYPES = "image/png,image/jpeg,image/webp,image/gif,video/mp4,video/webm";

const emptyForm = {
  title: "", category: "corporate", image: "", videoUrl: "", thumbnailUrl: "",
  storagePath: "", location: "", year: new Date().getFullYear(),
  tags: "", featured: false, visible: true, altText: "", caption: "",
  mediaType: "image" as "image" | "video",
};

const emptyIgForm = {
  imageUrl: "", permalink: "", caption: "", category: "corporate", eventDate: "",
};

type DisplayItem = {
  id: string; title: string; category: string; image: string;
  videoUrl?: string; thumbnailUrl?: string; mediaType?: string;
  location?: string; featured: boolean; visible: boolean; caption?: string;
};

function dbToDisplay(item: DbGalleryItem): DisplayItem {
  const meta = item.metadata as Record<string, string> | null;
  return {
    id:           item.id,
    title:        item.title ?? "",
    category:     (item.section as { slug?: string } | null)?.slug ?? "general",
    image:        item.image_url,
    videoUrl:     item.video_url,
    thumbnailUrl: item.thumbnail_url,
    mediaType:    item.media_type ?? "image",
    location:     meta?.location,
    featured:     item.is_featured,
    visible:      item.is_visible,
    caption:      item.caption ?? undefined,
  };
}

function lsToDisplay(item: GalleryItem): DisplayItem {
  return {
    id: item.id, title: item.title, category: item.category, image: item.image,
    location: item.location, featured: item.featured, visible: item.visible,
    caption: item.caption,
  };
}

export default function AdminGalleryPage() {
  const [items, setItems]           = useState<DisplayItem[]>([]);
  const [showForm, setShowForm]     = useState(false);
  const [editingId, setEditingId]   = useState<string | null>(null);
  const [showIgForm, setShowIgForm] = useState(false);
  const [form, setForm]             = useState(emptyForm);
  const [igForm, setIgForm]         = useState(emptyIgForm);
  const [uploading, setUploading]   = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>("");
  const [igLoading, setIgLoading]   = useState(false);
  const [igError, setIgError]       = useState<string | null>(null);
  const [loading, setLoading]       = useState(true);
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    if (isSupabaseConfigured) {
      const { data } = await supabase
        .from("gallery_items")
        .select("*, section:gallery_sections(name, slug)")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      setItems(((data ?? []) as DbGalleryItem[]).map(dbToDisplay));
    } else {
      let stored = getAdminGallery();
      if (stored.length === 0) {
        defaultItems.forEach((g) => {
          saveGalleryItem({
            title: g.title, category: g.category, image: g.image,
            location: g.location ?? "", year: g.year ?? new Date().getFullYear(),
            tags: g.tags,
            featured: (g as { featured?: boolean }).featured ?? false,
            visible:  (g as { visible?: boolean }).visible  ?? true,
            altText:  (g as { altText?: string }).altText   ?? g.title,
            caption:  (g as { caption?: string }).caption,
          });
        });
        stored = getAdminGallery();
      }
      setItems(stored.map(lsToDisplay));
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleUpload(file: File): Promise<{ url: string; path: string; isVideo: boolean } | null> {
    const isVideo = file.type.startsWith("video/");
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `gallery/${Date.now()}_${safeName}`;

    setUploadProgress(isVideo ? "Uploading video…" : "Uploading image…");

    const { error } = await supabase.storage.from("gallery").upload(path, file, {
      contentType: file.type, upsert: false,
    });
    if (error) {
      alert(`Upload failed: ${error.message}`);
      setUploadProgress("");
      return null;
    }
    const { data: { publicUrl } } = supabase.storage.from("gallery").getPublicUrl(path);
    setUploadProgress("");
    return { url: publicUrl, path, isVideo };
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);

    if (files.length === 1) {
      const file = files[0];
      if (isSupabaseConfigured) {
        const result = await handleUpload(file);
        if (result) {
          if (result.isVideo) {
            setForm((f) => ({ ...f, videoUrl: result.url, storagePath: result.path, mediaType: "video" }));
          } else {
            setForm((f) => ({ ...f, image: result.url, storagePath: result.path, mediaType: "image" }));
          }
        }
      } else {
        const isVideo = file.type.startsWith("video/");
        const url = URL.createObjectURL(file);
        if (isVideo) {
          setForm((f) => ({ ...f, videoUrl: url, mediaType: "video" }));
        } else {
          setForm((f) => ({ ...f, image: url, mediaType: "image" }));
        }
      }
    } else {
      // Bulk upload
      setUploadProgress(`Uploading ${files.length} files…`);
      for (const file of files) {
        if (isSupabaseConfigured) {
          const result = await handleUpload(file);
          if (result) {
            const { data: section } = await supabase
              .from("gallery_sections")
              .select("id")
              .eq("slug", form.category)
              .maybeSingle();
            const sectionId = (section as { id: string } | null)?.id ?? null;

            await supabase.from("gallery_items").insert({
              title:        file.name.replace(/\.[^.]+$/, "").replace(/_/g, " "),
              image_url:    result.isVideo ? null : result.url,
              video_url:    result.isVideo ? result.url : null,
              media_type:   result.isVideo ? "video" : "image",
              storage_path: result.path,
              is_featured:  false,
              is_visible:   true,
              section_id:   sectionId,
              source:       "admin_bulk",
              sort_order:   items.length,
            });
          }
        }
      }
      setUploadProgress("");
      await load();
    }

    setUploading(false);
    if (e.target) e.target.value = "";
  }

  async function handleIgImport() {
    if (!igForm.imageUrl) return;
    setIgLoading(true);
    setIgError(null);
    try {
      const res = await fetch("/api/admin/instagram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image_url:            igForm.imageUrl,
          caption:              igForm.caption || null,
          category:             igForm.category,
          instagram_permalink:  igForm.permalink || null,
          event_date:           igForm.eventDate || null,
          source:               "instagram_manual",
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Import failed");
      await load();
      setIgForm(emptyIgForm);
      setShowIgForm(false);
    } catch (e: unknown) {
      setIgError(e instanceof Error ? e.message : "Import failed");
    } finally {
      setIgLoading(false);
    }
  }

  function openEdit(item: DisplayItem) {
    setEditingId(item.id);
    setForm({
      title:        item.title,
      category:     item.category,
      image:        item.image ?? "",
      videoUrl:     item.videoUrl ?? "",
      thumbnailUrl: item.thumbnailUrl ?? "",
      storagePath:  "",
      location:     item.location ?? "",
      year:         new Date().getFullYear(),
      tags:         "",
      featured:     item.featured,
      visible:      item.visible,
      altText:      "",
      caption:      item.caption ?? "",
      mediaType:    (item.mediaType as "image" | "video") ?? "image",
    });
    setShowForm(true);
    setShowIgForm(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSave() {
    if (!form.title || (!form.image && !form.videoUrl)) return;
    if (isSupabaseConfigured) {
      const { data: section } = await supabase
        .from("gallery_sections")
        .select("id")
        .eq("slug", form.category)
        .maybeSingle();
      const sectionId = (section as { id: string } | null)?.id ?? null;
      const metadata = {
        location: form.location,
        year:     form.year,
        tags:     form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      };

      const payload = {
        title:        form.title,
        image_url:    form.mediaType === "image"  ? form.image    : null,
        video_url:    form.mediaType === "video"  ? form.videoUrl : null,
        thumbnail_url: form.thumbnailUrl || null,
        media_type:   form.mediaType,
        caption:      form.caption || null,
        alt_text:     form.altText || form.title,
        is_featured:  form.featured,
        is_visible:   form.visible,
        section_id:   sectionId,
        metadata,
      };

      if (editingId) {
        await supabase.from("gallery_items").update({
          ...payload,
          ...(form.storagePath ? { storage_path: form.storagePath } : {}),
        }).eq("id", editingId);
      } else {
        await supabase.from("gallery_items").insert({
          ...payload,
          storage_path: form.storagePath || null,
          source:       "admin",
          sort_order:   items.length,
        });
      }
      await load();
    } else {
      if (editingId) {
        updateGalleryItem(editingId, {
          title: form.title, category: form.category,
          image: form.image || form.thumbnailUrl,
          location: form.location, featured: form.featured, visible: form.visible,
          caption: form.caption || undefined,
        });
      } else {
        saveGalleryItem({
          title: form.title, category: form.category,
          image: form.image || form.thumbnailUrl || "",
          location: form.location, year: form.year,
          tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
          featured: form.featured, visible: form.visible,
          altText: form.altText || form.title,
          caption: form.caption || undefined,
        });
      }
      await load();
    }
    closeForm();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this gallery item?")) return;
    if (isSupabaseConfigured) {
      await supabase.from("gallery_items").delete().eq("id", id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } else {
      deleteGalleryItem(id);
      await load();
    }
  }

  async function toggleVisible(id: string, visible: boolean) {
    if (isSupabaseConfigured) {
      await supabase.from("gallery_items").update({ is_visible: !visible }).eq("id", id);
      setItems((prev) => prev.map((i) => i.id === id ? { ...i, visible: !visible } : i));
    } else {
      updateGalleryItem(id, { visible: !visible });
      await load();
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Gallery Management</h1>
          <p className="text-sm" style={{ color: "#A7A7B3" }}>{items.length} item{items.length !== 1 ? "s" : ""} · Supports images &amp; videos</p>
        </div>
        <div className="flex gap-3">
          <button onClick={load} className="p-2 rounded-lg glass-card" style={{ color: "#D6A84F" }}><RefreshCw size={15} /></button>
          <button
            onClick={() => { setShowIgForm(!showIgForm); setShowForm(false); }}
            className="px-3 py-2 rounded-lg text-sm font-medium inline-flex items-center gap-2 border transition-[background] duration-150"
            style={{ borderColor: "rgba(214,168,79,0.3)", color: "#D6A84F", background: showIgForm ? "rgba(214,168,79,0.12)" : "transparent" }}
          >
            <LinkIcon size={14} /> Instagram
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="px-3 py-2 rounded-lg text-sm font-medium inline-flex items-center gap-2 border transition-[background] duration-150"
            style={{ borderColor: "rgba(214,168,79,0.3)", color: "#D6A84F" }}
            disabled={uploading}
          >
            <Upload size={14} /> Bulk Upload
          </button>
          <button
            onClick={() => { if (showForm && !editingId) { closeForm(); } else { closeForm(); setShowForm(true); setShowIgForm(false); } }}
            className="btn-gold inline-flex items-center gap-2"
          >
            <Plus size={15} /> Add Media
          </button>
        </div>
      </div>

      {/* Hidden bulk file input */}
      <input
        ref={fileRef}
        type="file"
        accept={ACCEPTED_TYPES}
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      {uploadProgress && (
        <div
          className="px-4 py-3 rounded-xl text-sm flex items-center gap-3"
          style={{ background: "rgba(214,168,79,0.08)", border: "1px solid rgba(214,168,79,0.2)", color: "#D6A84F" }}
        >
          <div className="w-4 h-4 rounded-full border-2 border-[#D6A84F] border-t-transparent animate-spin shrink-0" />
          {uploadProgress}
        </div>
      )}

      {/* Instagram manual import form */}
      {showIgForm && (
        <div className="glass-card rounded-xl p-6 space-y-4" style={{ border: "1px solid rgba(214,168,79,0.2)" }}>
          <div className="flex items-center gap-2">
            <LinkIcon size={15} style={{ color: "#D6A84F" }} />
            <h3 className="font-bold" style={{ fontFamily: "var(--font-display)" }}>Import Instagram Post</h3>
            <span className="ml-auto text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(242,153,74,0.12)", color: "#F2994A" }}>Manual — paste image URL</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs mb-1" style={{ color: "#A7A7B3" }}>Image URL *</label>
              <input
                type="url"
                value={igForm.imageUrl}
                onChange={(e) => setIgForm({ ...igForm, imageUrl: e.target.value })}
                placeholder="https://instagram.com/… or CDN URL"
                className="w-full bg-[#181824] rounded-lg px-3 py-2 text-sm border outline-none"
                style={{ color: "#FFF", borderColor: "rgba(214,168,79,0.2)" }}
              />
              {igForm.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={igForm.imageUrl} alt="preview" className="mt-2 h-20 rounded object-cover" />
              )}
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs mb-1" style={{ color: "#A7A7B3" }}>Instagram Post URL (permalink)</label>
              <input
                type="url"
                value={igForm.permalink}
                onChange={(e) => setIgForm({ ...igForm, permalink: e.target.value })}
                placeholder="https://www.instagram.com/p/ABC123/"
                className="w-full bg-[#181824] rounded-lg px-3 py-2 text-sm border outline-none"
                style={{ color: "#FFF", borderColor: "rgba(214,168,79,0.2)" }}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs mb-1" style={{ color: "#A7A7B3" }}>Caption</label>
              <input
                type="text"
                value={igForm.caption}
                onChange={(e) => setIgForm({ ...igForm, caption: e.target.value })}
                placeholder="Event description from Instagram…"
                className="w-full bg-[#181824] rounded-lg px-3 py-2 text-sm border outline-none"
                style={{ color: "#FFF", borderColor: "rgba(214,168,79,0.2)" }}
              />
            </div>
            <div>
              <label className="block text-xs mb-1" style={{ color: "#A7A7B3" }}>Category</label>
              <select
                value={igForm.category}
                onChange={(e) => setIgForm({ ...igForm, category: e.target.value })}
                className="w-full bg-[#181824] rounded-lg px-3 py-2 text-sm border outline-none"
                style={{ color: "#FFF", borderColor: "rgba(214,168,79,0.2)" }}
              >
                {galleryCategories.filter((c) => c.value !== "all").map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs mb-1" style={{ color: "#A7A7B3" }}>Event Date</label>
              <input
                type="date"
                value={igForm.eventDate}
                onChange={(e) => setIgForm({ ...igForm, eventDate: e.target.value })}
                className="w-full bg-[#181824] rounded-lg px-3 py-2 text-sm border outline-none"
                style={{ color: "#FFF", borderColor: "rgba(214,168,79,0.2)" }}
              />
            </div>
          </div>
          {igError && (
            <p className="text-xs px-3 py-2 rounded-lg" style={{ background: "rgba(235,87,87,0.1)", color: "#EB5757", border: "1px solid rgba(235,87,87,0.2)" }}>
              {igError}
            </p>
          )}
          <div className="flex gap-3">
            <button
              onClick={handleIgImport}
              disabled={igLoading || !igForm.imageUrl}
              className="btn-gold disabled:opacity-60 inline-flex items-center gap-2"
            >
              {igLoading ? "Importing…" : <><LinkIcon size={13} /> Import Post</>}
            </button>
            <button onClick={() => { setShowIgForm(false); setIgError(null); setIgForm(emptyIgForm); }} className="btn-ghost">Cancel</button>
          </div>
        </div>
      )}

      {showForm && (
        <div className="glass-card rounded-xl p-6 space-y-4" style={{ border: editingId ? "1px solid rgba(214,168,79,0.3)" : undefined }}>
          <div className="flex items-center justify-between">
            <h3 className="font-bold" style={{ fontFamily: "var(--font-display)" }}>
              {editingId ? "Edit Gallery Item" : "Add Gallery Item"}
            </h3>
            <button onClick={closeForm} className="p-1 rounded transition-[opacity] hover:opacity-70" style={{ color: "#5A5A6E" }}>
              <X size={16} />
            </button>
          </div>

          {/* Media type toggle */}
          <div className="flex gap-2">
            {(["image", "video"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setForm((f) => ({ ...f, mediaType: t }))}
                className="px-4 py-1.5 rounded-full text-xs font-medium capitalize transition-[background,color] duration-150"
                style={{
                  background: form.mediaType === t ? "rgba(214,168,79,0.2)" : "rgba(255,255,255,0.04)",
                  color: form.mediaType === t ? "#D6A84F" : "#A7A7B3",
                  border: `1px solid ${form.mediaType === t ? "rgba(214,168,79,0.4)" : "rgba(255,255,255,0.07)"}`,
                }}
              >
                {t === "video" ? "🎬 Video" : "🖼 Image"}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { key: "title",    label: "Title *" },
              { key: "location", label: "Location" },
              { key: "altText",  label: "Alt Text" },
              { key: "year",     label: "Year", type: "number" },
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
              <label className="block text-xs mb-1" style={{ color: "#A7A7B3" }}>
                {form.mediaType === "video" ? "Video URL" : "Image URL"} *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={form.mediaType === "video" ? form.videoUrl : form.image}
                  onChange={(e) => setForm((f) =>
                    f.mediaType === "video"
                      ? { ...f, videoUrl: e.target.value }
                      : { ...f, image: e.target.value }
                  )}
                  placeholder="Paste URL or upload →"
                  className="flex-1 bg-[#181824] rounded-lg px-3 py-2 text-sm border outline-none"
                  style={{ color: "#FFF", borderColor: "rgba(214,168,79,0.2)" }}
                />
                <label
                  className="px-3 py-2 rounded-lg text-xs border inline-flex items-center gap-1.5 cursor-pointer"
                  style={{ borderColor: "rgba(214,168,79,0.3)", color: uploading ? "#5A5A6E" : "#D6A84F" }}
                >
                  <Upload size={13} />{uploading ? "…" : "Upload"}
                  <input
                    type="file"
                    accept={ACCEPTED_TYPES}
                    className="hidden"
                    disabled={uploading}
                    onChange={handleFileChange}
                  />
                </label>
              </div>
              {form.mediaType === "video" && form.videoUrl && (
                <video src={form.videoUrl} className="mt-2 h-16 rounded object-cover" muted />
              )}
              {form.mediaType === "image" && form.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.image} alt="preview" className="mt-2 h-16 rounded object-cover" />
              )}
            </div>
            {form.mediaType === "video" && (
              <div>
                <label className="block text-xs mb-1" style={{ color: "#A7A7B3" }}>Thumbnail URL (optional)</label>
                <input
                  type="text"
                  value={form.thumbnailUrl}
                  onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })}
                  placeholder="Paste thumbnail image URL"
                  className="w-full bg-[#181824] rounded-lg px-3 py-2 text-sm border outline-none"
                  style={{ color: "#FFF", borderColor: "rgba(214,168,79,0.2)" }}
                />
              </div>
            )}
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
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="accent-[#D6A84F]" />
                Featured
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: "#A7A7B3" }}>
                <input type="checkbox" checked={form.visible} onChange={(e) => setForm({ ...form, visible: e.target.checked })} className="accent-[#D6A84F]" />
                Visible
              </label>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleSave} className="btn-gold">
              {editingId ? "Save Changes" : "Add Item"}
            </button>
            <button onClick={closeForm} className="btn-ghost">Cancel</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="glass-card rounded-xl p-12 text-center">
          <div className="w-5 h-5 rounded-full border-2 border-[#D6A84F] border-t-transparent animate-spin mx-auto" />
        </div>
      ) : items.length === 0 ? (
        <div className="glass-card rounded-xl p-12 text-center">
          <p style={{ color: "#5A5A6E" }}>No gallery items yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {items.map((item) => {
            const isVideo = item.mediaType === "video";
            const thumb   = item.thumbnailUrl ?? item.image ?? "";
            return (
              <div
                key={item.id}
                className="group glass-card rounded-xl overflow-hidden"
                style={{ opacity: item.visible ? 1 : 0.45 }}
              >
                <div className="relative aspect-video overflow-hidden" style={{ background: "#181824" }}>
                  {isVideo ? (
                    <>
                      {thumb ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={thumb} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ color: "#3A3A50" }}>
                          <Play size={32} />
                        </div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.35)" }}>
                        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(214,168,79,0.85)" }}>
                          <Play size={16} style={{ color: "#050505", marginLeft: 1 }} />
                        </div>
                      </div>
                      <span
                        className="absolute bottom-2 right-2 text-xs px-2 py-0.5 rounded-full font-semibold"
                        style={{ background: "rgba(214,168,79,0.9)", color: "#050505" }}
                      >
                        Video
                      </span>
                    </>
                  ) : (
                    <Image src={item.image ?? ""} alt={item.title} fill className="object-cover" unoptimized />
                  )}

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
                      onClick={() => openEdit(item)}
                      className="w-7 h-7 rounded-full flex items-center justify-center"
                      style={{ background: "rgba(214,168,79,0.9)", color: "#050505" }}
                      title="Edit"
                    >
                      <Pencil size={12} />
                    </button>
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
                  <p className="text-xs mb-0.5" style={{ color: "#D6A84F" }}>{item.category} · {isVideo ? "Video" : "Image"}</p>
                  <p className="text-sm font-semibold text-white line-clamp-2">{item.title}</p>
                  {item.location && (
                    <p className="text-xs mt-1" style={{ color: "#5A5A6E" }}>📍 {item.location}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
