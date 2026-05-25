"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Phone, Mail, Globe, Building2, MessageCircle } from "lucide-react";
import { getAdminSettings, saveAdminSettings, type AdminSettings } from "@/lib/storage";

const DEFAULT_FORM: AdminSettings = {
  managerPhone: "",
  setupTeamPhone: "",
  whatsappNumber: "",
  notificationEmail: "",
  companyName: "",
  companyAddress: "",
  websiteUrl: "",
};

export default function AdminSettingsPage() {
  const [form, setForm] = useState<AdminSettings>(DEFAULT_FORM);
  const [saved, setSaved] = useState(false);

  useEffect(() => { setForm(getAdminSettings()); }, []);

  function set(key: keyof AdminSettings, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave() {
    saveAdminSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
          Settings
        </h1>
        <p className="text-sm" style={{ color: "#A7A7B3" }}>
          Company profile, contact details, and notification preferences
        </p>
      </div>

      {/* Contact numbers */}
      <section className="glass-card rounded-xl p-6 space-y-5">
        <h2 className="text-sm font-semibold uppercase tracking-widest" style={{ color: "#D6A84F" }}>
          Contact Numbers
        </h2>

        <div>
          <label className="flex items-center gap-2 text-xs font-medium mb-1.5" style={{ color: "#A7A7B3" }}>
            <Phone size={13} style={{ color: "#D6A84F" }} />
            Manager Phone
          </label>
          <input
            type="tel"
            value={form.managerPhone}
            onChange={(e) => set("managerPhone", e.target.value)}
            placeholder="+971553320051"
            className="w-full bg-[#181824] rounded-lg px-4 py-2.5 text-sm border outline-none transition-[border-color] duration-150 placeholder:text-[#3A3A4E]"
            style={{ color: "#FFF", borderColor: "rgba(214,168,79,0.2)" }}
            onFocus={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = "#D6A84F"; }}
            onBlur={(e)  => { (e.currentTarget as HTMLInputElement).style.borderColor = "rgba(214,168,79,0.2)"; }}
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-xs font-medium mb-1.5" style={{ color: "#A7A7B3" }}>
            <Phone size={13} style={{ color: "#D6A84F" }} />
            Setup Team Phone
          </label>
          <input
            type="tel"
            value={form.setupTeamPhone}
            onChange={(e) => set("setupTeamPhone", e.target.value)}
            placeholder="+971553320051"
            className="w-full bg-[#181824] rounded-lg px-4 py-2.5 text-sm border outline-none transition-[border-color] duration-150 placeholder:text-[#3A3A4E]"
            style={{ color: "#FFF", borderColor: "rgba(214,168,79,0.2)" }}
            onFocus={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = "#D6A84F"; }}
            onBlur={(e)  => { (e.currentTarget as HTMLInputElement).style.borderColor = "rgba(214,168,79,0.2)"; }}
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-xs font-medium mb-1.5" style={{ color: "#A7A7B3" }}>
            <MessageCircle size={13} style={{ color: "#D6A84F" }} />
            WhatsApp Number <span style={{ color: "#5A5A6E" }}>(digits only, no +)</span>
          </label>
          <input
            type="tel"
            value={form.whatsappNumber}
            onChange={(e) => set("whatsappNumber", e.target.value)}
            placeholder="971553320051"
            className="w-full bg-[#181824] rounded-lg px-4 py-2.5 text-sm border outline-none transition-[border-color] duration-150 placeholder:text-[#3A3A4E]"
            style={{ color: "#FFF", borderColor: "rgba(214,168,79,0.2)" }}
            onFocus={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = "#D6A84F"; }}
            onBlur={(e)  => { (e.currentTarget as HTMLInputElement).style.borderColor = "rgba(214,168,79,0.2)"; }}
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-xs font-medium mb-1.5" style={{ color: "#A7A7B3" }}>
            <Mail size={13} style={{ color: "#D6A84F" }} />
            Notification Email
          </label>
          <input
            type="email"
            value={form.notificationEmail}
            onChange={(e) => set("notificationEmail", e.target.value)}
            placeholder="info@soundboxdubai.com"
            className="w-full bg-[#181824] rounded-lg px-4 py-2.5 text-sm border outline-none transition-[border-color] duration-150 placeholder:text-[#3A3A4E]"
            style={{ color: "#FFF", borderColor: "rgba(214,168,79,0.2)" }}
            onFocus={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = "#D6A84F"; }}
            onBlur={(e)  => { (e.currentTarget as HTMLInputElement).style.borderColor = "rgba(214,168,79,0.2)"; }}
          />
        </div>
      </section>

      {/* Company profile */}
      <section className="glass-card rounded-xl p-6 space-y-5">
        <h2 className="text-sm font-semibold uppercase tracking-widest" style={{ color: "#D6A84F" }}>
          Company Profile
        </h2>

        <div>
          <label className="flex items-center gap-2 text-xs font-medium mb-1.5" style={{ color: "#A7A7B3" }}>
            <Building2 size={13} style={{ color: "#D6A84F" }} />
            Company Name
          </label>
          <input
            type="text"
            value={form.companyName}
            onChange={(e) => set("companyName", e.target.value)}
            placeholder="Soundbox Electronic Equipment Rental"
            className="w-full bg-[#181824] rounded-lg px-4 py-2.5 text-sm border outline-none transition-[border-color] duration-150 placeholder:text-[#3A3A4E]"
            style={{ color: "#FFF", borderColor: "rgba(214,168,79,0.2)" }}
            onFocus={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = "#D6A84F"; }}
            onBlur={(e)  => { (e.currentTarget as HTMLInputElement).style.borderColor = "rgba(214,168,79,0.2)"; }}
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-xs font-medium mb-1.5" style={{ color: "#A7A7B3" }}>
            <Building2 size={13} style={{ color: "#D6A84F" }} />
            Company Address
          </label>
          <input
            type="text"
            value={form.companyAddress}
            onChange={(e) => set("companyAddress", e.target.value)}
            placeholder="Dubai, United Arab Emirates"
            className="w-full bg-[#181824] rounded-lg px-4 py-2.5 text-sm border outline-none transition-[border-color] duration-150 placeholder:text-[#3A3A4E]"
            style={{ color: "#FFF", borderColor: "rgba(214,168,79,0.2)" }}
            onFocus={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = "#D6A84F"; }}
            onBlur={(e)  => { (e.currentTarget as HTMLInputElement).style.borderColor = "rgba(214,168,79,0.2)"; }}
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-xs font-medium mb-1.5" style={{ color: "#A7A7B3" }}>
            <Globe size={13} style={{ color: "#D6A84F" }} />
            Website URL
          </label>
          <input
            type="url"
            value={form.websiteUrl}
            onChange={(e) => set("websiteUrl", e.target.value)}
            placeholder="https://www.soundboxdubai.com"
            className="w-full bg-[#181824] rounded-lg px-4 py-2.5 text-sm border outline-none transition-[border-color] duration-150 placeholder:text-[#3A3A4E]"
            style={{ color: "#FFF", borderColor: "rgba(214,168,79,0.2)" }}
            onFocus={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = "#D6A84F"; }}
            onBlur={(e)  => { (e.currentTarget as HTMLInputElement).style.borderColor = "rgba(214,168,79,0.2)"; }}
          />
        </div>
      </section>

      {/* Save */}
      <div className="flex items-center gap-4">
        <button onClick={handleSave} className="btn-gold">
          Save Settings
        </button>
        {saved && (
          <span className="flex items-center gap-1.5 text-sm" style={{ color: "#27AE60" }}>
            <CheckCircle size={14} /> Saved successfully
          </span>
        )}
      </div>

      <p
        className="text-xs rounded-xl px-4 py-3"
        style={{
          color: "#5A5A6E",
          background: "rgba(214,168,79,0.04)",
          border: "1px solid rgba(214,168,79,0.1)",
        }}
      >
        <span style={{ color: "#D6A84F" }}>Note:</span> Settings are stored in browser localStorage.
        For multi-device persistence, connect a backend database via{" "}
        <code className="text-xs px-1 rounded" style={{ background: "#181824", color: "#D6A84F" }}>
          DATABASE_URL
        </code>
        {" "}in .env.local.
      </p>
    </div>
  );
}
