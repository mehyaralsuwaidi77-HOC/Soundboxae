"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Plus, Trash2, Eye, EyeOff, Upload, RefreshCw, ExternalLink } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import type { DbClientLogo } from "@/lib/supabase/types";

const emptyForm = { clientName: "", logoUrl: "", storagePath: "", websiteUrl: "", visible: true };

export default function AdminClientsPage() {
  const [clients, setClients]   = useState<DbClientLogo[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading]   = useState(true);
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    if (isSupabaseConfigured) {
      const { data } = await supabase
        .from("client_logos")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      setClients((data ?? []) as DbClientLogo[]);
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleUpload(file: File): Promise<{ url: string; path: string } | null> {
    const ext = file.name.split(".").pop();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `logos/${Date.now()}_${safeName}`;
    const { error } = await supabase.storage.from("client-logos").upload(path, file, {
      contentType: file.type, upsert: false,
    });
    if (error) { alert(`Upload failed: ${error.message}`); return null; }
    const { data: { publicUrl } } = supabase.storage.from("client-logos").getPublicUrl(path);
    return { url: publicUrl, path };
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !isSupabaseConfigured) return;
    setUploading(true);
    const result = await handleUpload(file);
    if (result) setForm((f) => ({ ...f, logoUrl: result.url, storagePath: result.path }));
    setUploading(false);
  }

  async function handleAdd() {
    if (!form.clientName || !form.logoUrl || !isSupabaseConfigured) return;
    await supabase.from("client_logos").insert({
      client_name: form.clientName,
      logo_url: form.logoUrl,
      storage_path: form.storagePath || null,
      website_url: form.websiteUrl || null,
      is_visible: form.visible,
      sort_order: clients.length,
    });
    await load();
    setForm(emptyForm);
    setShowForm(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this client logo?")) return;
    await supabase.from("client_logos").delete().eq("id", id);
    setClients((prev) => prev.filter((c) => c.id !== id));
  }

  async function toggleVisible(id: string, visible: boolean) {
    await supabase.from("client_logos").update({ is_visible: !visible }).eq("id", id);
    setClients((prev) => prev.map((c) => c.id === id ? { ...c, is_visible: !visible } : c));
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Client Logos</h1>
        <div className="glass-card rounded-xl p-10 text-center space-y-2">
          <p className="text-sm font-medium" style={{ color: "#F2994A" }}>Supabase required</p>
          <p className="text-sm" style={{ color: "#5A5A6E" }}>Configure Supabase to manage client logos with image uploads and cloud storage.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Client Logos</h1>
          <p className="text-sm" style={{ color: "#A7A7B3" }}>{clients.length} client{clients.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={load} className="p-2 rounded-lg glass-card" style={{ color: "#D6A84F" }}><RefreshCw size={15} /></button>
          <button onClick={() => setShowForm(!showForm)} className="btn-gold inline-flex items-center gap-2"><Plus size={15} /> Add Client</button>
        </div>
      </div>

      {showForm && (
        <div className="glass-card rounded-xl p-6 space-y-4">
          <h3 className="font-bold" style={{ fontFamily: "var(--font-display)" }}>Add Client Logo</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs mb-1" style={{ color: "#A7A7B3" }}>Client Name *</label>
              <input
                type="text"
                value={form.clientName}
                onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                className="w-full bg-[#181824] rounded-lg px-3 py-2 text-sm border outline-none"
                style={{ color: "#FFF", borderColor: "rgba(214,168,79,0.2)" }}
              />
            </div>
            <div>
              <label className="block text-xs mb-1" style={{ color: "#A7A7B3" }}>Website URL</label>
              <input
                type="url"
                value={form.websiteUrl}
                onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })}
                placeholder="https://client.com"
                className="w-full bg-[#181824] rounded-lg px-3 py-2 text-sm border outline-none"
                style={{ color: "#FFF", borderColor: "rgba(214,168,79,0.2)" }}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs mb-1" style={{ color: "#A7A7B3" }}>Logo Image *</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={form.logoUrl}
                  onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
                  placeholder="Paste URL or upload →"
                  className="flex-1 bg-[#181824] rounded-lg px-3 py-2 text-sm border outline-none"
                  style={{ color: "#FFF", borderColor: "rgba(214,168,79,0.2)" }}
                />
                <button
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="px-3 py-2 rounded-lg text-xs border inline-flex items-center gap-1.5 disabled:opacity-50"
                  style={{ borderColor: "rgba(214,168,79,0.3)", color: "#D6A84F" }}
                >
                  <Upload size={13} />{uploading ? "…" : "Upload"}
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </div>
              {form.logoUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.logoUrl} alt="preview" className="mt-2 h-12 rounded object-contain bg-[#0E0E16] px-2" />
              )}
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: "#A7A7B3" }}>
                <input
                  type="checkbox"
                  checked={form.visible}
                  onChange={(e) => setForm({ ...form, visible: e.target.checked })}
                  className="accent-[#D6A84F]"
                />
                Visible on site
              </label>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleAdd} className="btn-gold">Add Client</button>
            <button onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="glass-card rounded-xl p-12 text-center">
          <div className="w-5 h-5 rounded-full border-2 border-[#D6A84F] border-t-transparent animate-spin mx-auto" />
        </div>
      ) : clients.length === 0 ? (
        <div className="glass-card rounded-xl p-12 text-center">
          <p style={{ color: "#5A5A6E" }}>No client logos yet. Add your first client above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {clients.map((client) => (
            <div
              key={client.id}
              className="group glass-card rounded-xl p-4 flex flex-col items-center gap-3"
              style={{ opacity: client.is_visible ? 1 : 0.4 }}
            >
              <div
                className="relative w-full h-16 rounded-lg overflow-hidden"
                style={{ background: "#0E0E16" }}
              >
                <Image
                  src={client.logo_url}
                  alt={client.client_name}
                  fill
                  className="object-contain p-2"
                  unoptimized
                />
              </div>
              <p className="text-sm font-medium text-white text-center line-clamp-2">{client.client_name}</p>
              {client.website_url && (
                <a
                  href={client.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs flex items-center gap-1"
                  style={{ color: "#D6A84F" }}
                >
                  <ExternalLink size={11} /> Website
                </a>
              )}
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-[opacity] duration-200">
                <button
                  onClick={() => toggleVisible(client.id, client.is_visible)}
                  className="w-7 h-7 rounded flex items-center justify-center"
                  style={{ background: "rgba(214,168,79,0.1)", color: client.is_visible ? "#D6A84F" : "#5A5A6E" }}
                  title={client.is_visible ? "Hide" : "Show"}
                >
                  {client.is_visible ? <Eye size={12} /> : <EyeOff size={12} />}
                </button>
                <button
                  onClick={() => handleDelete(client.id)}
                  className="w-7 h-7 rounded flex items-center justify-center"
                  style={{ background: "rgba(235,87,87,0.1)", color: "#EB5757" }}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
