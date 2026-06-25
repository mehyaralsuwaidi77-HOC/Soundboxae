"use client";

import { useState, useEffect } from "react";
import { X, MessageCircle, Mail, Loader2, CheckCircle, Send } from "lucide-react";
import { useSettings } from "@/components/providers/SettingsProvider";

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
    </svg>
  );
}

function FacebookIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  );
}

const EVENT_TYPES = [
  "Wedding",
  "Corporate Event",
  "Concert / Festival",
  "Private Party",
  "Product Launch",
  "Conference",
  "Other",
];

import { contactMailto } from "@/lib/mailto";
import { INSTAGRAM_URL, FACEBOOK_URL } from "@/lib/social";

interface Props {
  open: boolean;
  onClose: () => void;
}

interface FormState {
  name: string;
  phone: string;
  email: string;
  eventType: string;
  eventDate: string;
  message: string;
}

const EMPTY: FormState = { name: "", phone: "", email: "", eventType: "", eventDate: "", message: "" };

export default function ContactModal({ open, onClose }: Props) {
  const { whatsappNumber } = useSettings();
  const [form, setForm]   = useState<FormState>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone]   = useState(false);
  const [error, setError] = useState("");

  function fireAnalytics(name: string) {
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event_name: name, event_type: "engagement", source: "contact_modal" }),
    }).catch(() => {});
  }

  useEffect(() => {
    if (open) fireAnalytics("contact_form_opened");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:      form.name.trim(),
          phone:     form.phone.trim(),
          email:     form.email.trim() || undefined,
          eventType: form.eventType || "General Inquiry",
          eventDate: form.eventDate || undefined,
          notes:     form.message.trim() || undefined,
          source:    "contact_modal",
        }),
      });
      if (!res.ok) {
        const { error: msg } = await res.json().catch(() => ({}));
        throw new Error(msg ?? "Failed to submit");
      }
      fireAnalytics("contact_form_submitted");
      setDone(true);
      setForm(EMPTY);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleClose() {
    onClose();
    setTimeout(() => { setDone(false); setError(""); setForm(EMPTY); }, 300);
  }

  const waMsg = encodeURIComponent(
    `Hi Soundbox Dubai! I'd like to get in touch about your AV rental services.` +
    (form.name  ? `\n\nName: ${form.name}`         : "") +
    (form.phone ? `\nPhone: ${form.phone}`          : "") +
    (form.eventType ? `\nEvent type: ${form.eventType}` : "") +
    (form.eventDate ? `\nEvent date: ${form.eventDate}` : "") +
    (form.message   ? `\nMessage: ${form.message}`      : "")
  );
  const waUrl = `https://wa.me/${whatsappNumber}?text=${waMsg}`;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div
        className="w-full max-w-lg rounded-2xl overflow-hidden flex flex-col max-h-[90vh]"
        style={{ background: "#0D0D12", border: "1px solid rgba(214,168,79,0.2)" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 pt-6 pb-4 shrink-0"
          style={{ borderBottom: "1px solid rgba(214,168,79,0.1)" }}
        >
          <div>
            <h2 className="text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
              Get in Touch
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "#5A5A6E" }}>
              Tell us about your event and we&apos;ll be in touch shortly
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg transition-[background] duration-150 hover:bg-white/5"
            aria-label="Close"
          >
            <X size={18} style={{ color: "#A7A7B3" }} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          {done ? (
            <div className="px-6 py-12 text-center">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: "rgba(39,174,96,0.15)" }}
              >
                <CheckCircle size={28} style={{ color: "#27AE60" }} />
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
                Message Received!
              </h3>
              <p className="text-sm" style={{ color: "#A7A7B3" }}>
                Our team will review your inquiry and get back to you shortly. You can also reach us directly below.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-6 justify-center">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => fireAnalytics("contact_whatsapp_click")}
                  className="btn-gold inline-flex items-center gap-2 justify-center"
                >
                  <MessageCircle size={15} /> WhatsApp Us
                </a>
                <a
                  href={contactMailto}
                  onClick={() => fireAnalytics("email_cta_click")}
                  className="btn-ghost inline-flex items-center gap-2 justify-center"
                >
                  <Mail size={15} /> Email Us
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              {/* Name + Phone */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: "#A7A7B3" }}>
                    Name <span style={{ color: "#EB5757" }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Your name"
                    className="w-full bg-[#181824] rounded-lg px-3 py-2.5 text-sm border outline-none"
                    style={{ borderColor: "rgba(214,168,79,0.2)", color: "#FFF" }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: "#A7A7B3" }}>
                    Phone <span style={{ color: "#EB5757" }}>*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    placeholder="+971 50 XXX XXXX"
                    className="w-full bg-[#181824] rounded-lg px-3 py-2.5 text-sm border outline-none"
                    style={{ borderColor: "rgba(214,168,79,0.2)", color: "#FFF" }}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "#A7A7B3" }}>
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="your@email.com"
                  className="w-full bg-[#181824] rounded-lg px-3 py-2.5 text-sm border outline-none"
                  style={{ borderColor: "rgba(214,168,79,0.2)", color: "#FFF" }}
                />
              </div>

              {/* Event type + Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: "#A7A7B3" }}>
                    Event Type
                  </label>
                  <select
                    value={form.eventType}
                    onChange={(e) => setForm((f) => ({ ...f, eventType: e.target.value }))}
                    className="w-full bg-[#181824] rounded-lg px-3 py-2.5 text-sm border outline-none"
                    style={{ borderColor: "rgba(214,168,79,0.2)", color: form.eventType ? "#FFF" : "#5A5A6E" }}
                  >
                    <option value="">Select type…</option>
                    {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: "#A7A7B3" }}>
                    Event Date
                  </label>
                  <input
                    type="date"
                    value={form.eventDate}
                    onChange={(e) => setForm((f) => ({ ...f, eventDate: e.target.value }))}
                    className="w-full bg-[#181824] rounded-lg px-3 py-2.5 text-sm border outline-none"
                    style={{ borderColor: "rgba(214,168,79,0.2)", color: "#FFF", colorScheme: "dark" }}
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "#A7A7B3" }}>
                  Message / Requirements
                </label>
                <textarea
                  rows={3}
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  placeholder="Tell us about your event, venue, AV requirements…"
                  className="w-full bg-[#181824] rounded-lg px-3 py-2.5 text-sm border outline-none resize-none"
                  style={{ borderColor: "rgba(214,168,79,0.2)", color: "#FFF" }}
                />
              </div>

              {error && <p className="text-xs" style={{ color: "#EB5757" }}>{error}</p>}

              <button
                type="submit"
                disabled={submitting || !form.name.trim() || !form.phone.trim()}
                className="btn-gold w-full inline-flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {submitting
                  ? <><Loader2 size={15} className="animate-spin" /> Sending…</>
                  : <><Send size={15} /> Send Message</>}
              </button>
            </form>
          )}

          {/* Contact options + social */}
          <div
            className="px-6 pb-6 pt-2"
            style={{ borderTop: done ? "none" : "1px solid rgba(214,168,79,0.08)" }}
          >
            {!done && (
              <>
                <p className="text-[11px] text-center mb-3" style={{ color: "#5A5A6E" }}>
                  Or reach us directly
                </p>
                <div className="flex flex-col sm:flex-row gap-2 mb-4">
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => fireAnalytics("contact_whatsapp_click")}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-[background,color] duration-150"
                    style={{ background: "rgba(37,211,102,0.12)", color: "#25D366", border: "1px solid rgba(37,211,102,0.2)" }}
                  >
                    <MessageCircle size={14} /> WhatsApp
                  </a>
                  <a
                    href={contactMailto}
                    onClick={() => fireAnalytics("email_cta_click")}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-[background,color] duration-150"
                    style={{ background: "rgba(214,168,79,0.08)", color: "#D6A84F", border: "1px solid rgba(214,168,79,0.15)" }}
                  >
                    <Mail size={14} /> Email Us
                  </a>
                </div>
              </>
            )}
            <div className="flex items-center justify-center gap-3">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => fireAnalytics("instagram_click")}
                aria-label="Instagram"
                className="w-9 h-9 rounded-full flex items-center justify-center transition-[background] duration-150 hover:bg-white/10"
                style={{ background: "rgba(255,255,255,0.05)", color: "#A7A7B3" }}
              >
                <InstagramIcon size={16} />
              </a>
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => fireAnalytics("facebook_click")}
                aria-label="Facebook"
                className="w-9 h-9 rounded-full flex items-center justify-center transition-[background] duration-150 hover:bg-white/10"
                style={{ background: "rgba(255,255,255,0.05)", color: "#A7A7B3" }}
              >
                <FacebookIcon size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
