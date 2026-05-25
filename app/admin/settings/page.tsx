"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Phone, Mail, Globe, Building2, MessageCircle } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { getAdminSettings, saveAdminSettings, type AdminSettings } from "@/lib/storage";

const SETTING_KEYS: Record<keyof AdminSettings, string> = {
  managerPhone:       "manager_phone",
  setupTeamPhone:     "setup_team_phone",
  whatsappNumber:     "whatsapp_number",
  notificationEmail:  "notification_email",
  companyName:        "company_name",
  companyAddress:     "company_address",
  websiteUrl:         "website_url",
};

const DEFAULT_FORM: AdminSettings = {
  managerPhone: "", setupTeamPhone: "", whatsappNumber: "",
  notificationEmail: "", companyName: "", companyAddress: "", websiteUrl: "",
};

export default function AdminSettingsPage() {
  const [form, setForm]   = useState<AdminSettings>(DEFAULT_FORM);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      if (isSupabaseConfigured) {
        const { data } = await supabase.from("website_settings").select("key, value");
        if (data && data.length > 0) {
          const kvMap: Record<string, string> = {};
          data.forEach((row) => { kvMap[row.key] = String(row.value ?? ""); });
          setForm({
            managerPhone:      kvMap["manager_phone"]      ?? "",
            setupTeamPhone:    kvMap["setup_team_phone"]   ?? "",
            whatsappNumber:    kvMap["whatsapp_number"]    ?? "",
            notificationEmail: kvMap["notification_email"] ?? "",
            companyName:       kvMap["company_name"]       ?? "",
            companyAddress:    kvMap["company_address"]    ?? "",
            websiteUrl:        kvMap["website_url"]        ?? "",
          });
        }
      } else {
        setForm(getAdminSettings());
      }
    }
    load();
  }, []);

  function set(key: keyof AdminSettings, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    if (isSupabaseConfigured) {
      const upserts = (Object.entries(SETTING_KEYS) as [keyof AdminSettings, string][]).map(
        ([formKey, dbKey]) => ({
          key: dbKey,
          value: form[formKey],
        })
      );
      await supabase.from("website_settings").upsert(upserts, { onConflict: "key" });
    } else {
      saveAdminSettings(form);
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const inputClass = "w-full bg-[#181824] rounded-lg px-4 py-2.5 text-sm border outline-none transition-[border-color] duration-150 placeholder:text-[#3A3A4E]";
  const inputStyle = { color: "#FFF", borderColor: "rgba(214,168,79,0.2)" };
  const focusIn  = (e: React.FocusEvent<HTMLInputElement>) => { e.currentTarget.style.borderColor = "#D6A84F"; };
  const focusOut = (e: React.FocusEvent<HTMLInputElement>) => { e.currentTarget.style.borderColor = "rgba(214,168,79,0.2)"; };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Settings</h1>
        <p className="text-sm" style={{ color: "#A7A7B3" }}>
          {isSupabaseConfigured
            ? "Saved to Supabase — changes take effect on next page load across the entire website"
            : "Saved to browser localStorage (Supabase not configured)"}
        </p>
      </div>

      {/* Contact numbers */}
      <section className="glass-card rounded-xl p-6 space-y-5">
        <h2 className="text-sm font-semibold uppercase tracking-widest" style={{ color: "#D6A84F" }}>
          Contact Numbers
        </h2>

        <div>
          <label className="flex items-center gap-2 text-xs font-medium mb-1.5" style={{ color: "#A7A7B3" }}>
            <Phone size={13} style={{ color: "#D6A84F" }} /> Manager Phone
          </label>
          <input
            type="tel"
            value={form.managerPhone}
            onChange={(e) => set("managerPhone", e.target.value)}
            placeholder="+971553320051"
            className={inputClass}
            style={inputStyle}
            onFocus={focusIn}
            onBlur={focusOut}
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-xs font-medium mb-1.5" style={{ color: "#A7A7B3" }}>
            <Phone size={13} style={{ color: "#D6A84F" }} /> Setup Team Phone
          </label>
          <input
            type="tel"
            value={form.setupTeamPhone}
            onChange={(e) => set("setupTeamPhone", e.target.value)}
            placeholder="+971553320051"
            className={inputClass}
            style={inputStyle}
            onFocus={focusIn}
            onBlur={focusOut}
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
            className={inputClass}
            style={inputStyle}
            onFocus={focusIn}
            onBlur={focusOut}
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-xs font-medium mb-1.5" style={{ color: "#A7A7B3" }}>
            <Mail size={13} style={{ color: "#D6A84F" }} /> Notification Email
          </label>
          <input
            type="email"
            value={form.notificationEmail}
            onChange={(e) => set("notificationEmail", e.target.value)}
            placeholder="info@soundboxdubai.com"
            className={inputClass}
            style={inputStyle}
            onFocus={focusIn}
            onBlur={focusOut}
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
            <Building2 size={13} style={{ color: "#D6A84F" }} /> Company Name
          </label>
          <input
            type="text"
            value={form.companyName}
            onChange={(e) => set("companyName", e.target.value)}
            placeholder="Soundbox Electronic Equipment Rental"
            className={inputClass}
            style={inputStyle}
            onFocus={focusIn}
            onBlur={focusOut}
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-xs font-medium mb-1.5" style={{ color: "#A7A7B3" }}>
            <Building2 size={13} style={{ color: "#D6A84F" }} /> Company Address
          </label>
          <input
            type="text"
            value={form.companyAddress}
            onChange={(e) => set("companyAddress", e.target.value)}
            placeholder="Dubai, United Arab Emirates"
            className={inputClass}
            style={inputStyle}
            onFocus={focusIn}
            onBlur={focusOut}
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-xs font-medium mb-1.5" style={{ color: "#A7A7B3" }}>
            <Globe size={13} style={{ color: "#D6A84F" }} /> Website URL
          </label>
          <input
            type="url"
            value={form.websiteUrl}
            onChange={(e) => set("websiteUrl", e.target.value)}
            placeholder="https://www.soundboxdubai.com"
            className={inputClass}
            style={inputStyle}
            onFocus={focusIn}
            onBlur={focusOut}
          />
        </div>
      </section>

      <div className="flex items-center gap-4">
        <button onClick={handleSave} disabled={saving} className="btn-gold disabled:opacity-60">
          {saving ? "Saving…" : "Save Settings"}
        </button>
        {saved && (
          <span className="flex items-center gap-1.5 text-sm" style={{ color: "#27AE60" }}>
            <CheckCircle size={14} /> Saved successfully
          </span>
        )}
      </div>
    </div>
  );
}
