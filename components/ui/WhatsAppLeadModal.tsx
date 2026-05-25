"use client";

import { useState } from "react";
import { X, MessageCircle, Loader2, ArrowRight } from "lucide-react";

interface Props {
  href: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  source?: string;
  service?: string;
}

interface FormState {
  name: string;
  phone: string;
  eventType: string;
  eventDate: string;
  guests: string;
  notes: string;
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

const DEFAULT_FORM: FormState = {
  name: "",
  phone: "",
  eventType: "",
  eventDate: "",
  guests: "",
  notes: "",
};

export default function WhatsAppLeadModal({ href, className, style, children, source = "whatsapp_modal", service }: Props) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function fireAnalytics(eventName: string) {
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_name: eventName,
        event_type: "engagement",
        source,
        metadata: { service: service ?? null, href },
      }),
    }).catch(() => {});
  }

  function handleSkip() {
    fireAnalytics("whatsapp_click_skipped_lead");
    setOpen(false);
    window.open(href, "_blank", "noopener,noreferrer");
  }

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
          name: form.name.trim(),
          phone: form.phone.trim(),
          eventType: form.eventType || service || "General Inquiry",
          eventDate: form.eventDate || undefined,
          guests: form.guests ? Number(form.guests) : undefined,
          services: service ? [service] : [],
          notes: form.notes.trim() || undefined,
          source,
          whatsappSent: true,
        }),
      });
      if (!res.ok) {
        const { error: msg } = await res.json().catch(() => ({}));
        throw new Error(msg ?? "Failed to submit");
      }
      fireAnalytics("whatsapp_lead_created");
      setOpen(false);
      setForm(DEFAULT_FORM);
      window.open(href, "_blank", "noopener,noreferrer");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={className}
        style={style}
      >
        {children}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div
            className="w-full max-w-md rounded-2xl overflow-hidden"
            style={{ background: "#0D0D12", border: "1px solid rgba(214,168,79,0.2)" }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 pt-6 pb-4"
              style={{ borderBottom: "1px solid rgba(214,168,79,0.1)" }}
            >
              <div>
                <h2 className="text-lg font-bold" style={{ fontFamily: "var(--font-display)" }}>
                  Tell Us About Your Event
                </h2>
                <p className="text-xs mt-0.5" style={{ color: "#5A5A6E" }}>
                  We&apos;ll follow up on WhatsApp immediately
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg transition-[background] duration-150 hover:bg-white/5"
              >
                <X size={18} style={{ color: "#A7A7B3" }} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              {/* Service pre-fill display */}
              {service && (
                <div
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
                  style={{ background: "rgba(214,168,79,0.08)", border: "1px solid rgba(214,168,79,0.15)" }}
                >
                  <span style={{ color: "#D6A84F" }}>Service:</span>
                  <span style={{ color: "#FFF" }}>{service}</span>
                </div>
              )}

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
                    Phone / WhatsApp <span style={{ color: "#EB5757" }}>*</span>
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

              {/* Event type */}
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "#A7A7B3" }}>Event Type</label>
                <select
                  value={form.eventType}
                  onChange={(e) => setForm((f) => ({ ...f, eventType: e.target.value }))}
                  className="w-full bg-[#181824] rounded-lg px-3 py-2.5 text-sm border outline-none"
                  style={{ borderColor: "rgba(214,168,79,0.2)", color: form.eventType ? "#FFF" : "#5A5A6E" }}
                >
                  <option value="">Select event type…</option>
                  {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {/* Event date + Guests */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: "#A7A7B3" }}>Event Date</label>
                  <input
                    type="date"
                    value={form.eventDate}
                    onChange={(e) => setForm((f) => ({ ...f, eventDate: e.target.value }))}
                    className="w-full bg-[#181824] rounded-lg px-3 py-2.5 text-sm border outline-none"
                    style={{ borderColor: "rgba(214,168,79,0.2)", color: "#FFF", colorScheme: "dark" }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: "#A7A7B3" }}>Guests</label>
                  <input
                    type="number"
                    min="1"
                    value={form.guests}
                    onChange={(e) => setForm((f) => ({ ...f, guests: e.target.value }))}
                    placeholder="Est. guest count"
                    className="w-full bg-[#181824] rounded-lg px-3 py-2.5 text-sm border outline-none"
                    style={{ borderColor: "rgba(214,168,79,0.2)", color: "#FFF" }}
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "#A7A7B3" }}>Additional Notes</label>
                <textarea
                  rows={2}
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  placeholder="Venue, special requirements, budget range…"
                  className="w-full bg-[#181824] rounded-lg px-3 py-2.5 text-sm border outline-none resize-none"
                  style={{ borderColor: "rgba(214,168,79,0.2)", color: "#FFF" }}
                />
              </div>

              {error && (
                <p className="text-xs" style={{ color: "#EB5757" }}>{error}</p>
              )}

              {/* Actions */}
              <div className="flex flex-col gap-2 pt-1">
                <button
                  type="submit"
                  disabled={submitting || !form.name.trim() || !form.phone.trim()}
                  className="btn-gold w-full inline-flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {submitting
                    ? <><Loader2 size={15} className="animate-spin" /> Sending…</>
                    : <><MessageCircle size={15} /> Send &amp; Open WhatsApp</>}
                </button>
                <button
                  type="button"
                  onClick={handleSkip}
                  className="inline-flex items-center justify-center gap-1 text-xs py-2 transition-[color] duration-150 hover:text-white"
                  style={{ color: "#5A5A6E" }}
                >
                  Skip — go directly to WhatsApp <ArrowRight size={11} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
