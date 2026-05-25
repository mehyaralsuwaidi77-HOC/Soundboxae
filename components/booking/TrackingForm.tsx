"use client";

import { useState } from "react";
import {
  Search, CheckCircle, Clock, AlertCircle, Truck, Package, Wrench,
  FileText, CreditCard, Phone, MessageCircle, CalendarDays, MapPin,
} from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { getBookingByRef, BOOKING_STATUS_LABELS, PAYMENT_STATUS_LABELS } from "@/lib/storage";
import { BOOKING_STATUS_LABELS as DB_BOOKING_LABELS, PAYMENT_STATUS_LABELS as DB_PAYMENT_LABELS } from "@/lib/supabase/types";
import type { DbBooking } from "@/lib/supabase/types";

interface TrackData {
  reference: string;
  eventType: string;
  eventDate: string;
  venue: string;
  services: string[];
  status: string;
  statusLabel: string;
  paymentStatus: string;
  paymentLabel: string;
  timeline: { time: string; message: string; isSuccess: boolean }[];
  managerPhone: string;
  setupTeamPhone: string;
  clientName: string;
}

const DEMO: TrackData = {
  reference: "SBX-2025-0001",
  eventType: "Corporate Gala",
  eventDate: "2025-07-15",
  venue: "JW Marriott Marquis, Dubai",
  services: ["Sound System", "Lighting", "LED Screen", "Stage"],
  status: "confirmed",
  statusLabel: "Confirmed",
  paymentStatus: "paid",
  paymentLabel: "Paid in Full",
  timeline: [
    { time: "2025-06-01T10:00:00Z", message: "Booking received and under review.", isSuccess: false },
    { time: "2025-06-03T09:00:00Z", message: "Booking confirmed. Technical team assigned.", isSuccess: true },
    { time: "2025-06-10T14:30:00Z", message: "Payment confirmed in full. Booking reference activated.", isSuccess: true },
  ],
  managerPhone: "+971553320051",
  setupTeamPhone: "+971553320051",
  clientName: "Mohammed Al Rashid",
};

const STATUS_CONFIG: Record<string, { color: string; icon: React.ReactNode }> = {
  new_inquiry:         { color: "#F2994A", icon: <FileText size={15} /> },
  quotation_sent:      { color: "#2F80ED", icon: <FileText size={15} /> },
  awaiting_payment:    { color: "#F2C94C", icon: <CreditCard size={15} /> },
  confirmed:           { color: "#D6A84F", icon: <CheckCircle size={15} /> },
  preparing_equipment: { color: "#9B51E0", icon: <Package size={15} /> },
  team_on_the_way:     { color: "#56CCF2", icon: <Truck size={15} /> },
  setup_in_progress:   { color: "#27AE60", icon: <Wrench size={15} /> },
  completed:           { color: "#219653", icon: <CheckCircle size={15} /> },
  cancelled:           { color: "#EB5757", icon: <AlertCircle size={15} /> },
  "new-inquiry":         { color: "#F2994A", icon: <FileText size={15} /> },
  "quotation-sent":      { color: "#2F80ED", icon: <FileText size={15} /> },
  "awaiting-payment":    { color: "#F2C94C", icon: <CreditCard size={15} /> },
  "preparing-equipment": { color: "#9B51E0", icon: <Package size={15} /> },
  "team-on-the-way":     { color: "#56CCF2", icon: <Truck size={15} /> },
  "setup-in-progress":   { color: "#27AE60", icon: <Wrench size={15} /> },
  pending:               { color: "#A7A7B3", icon: <Clock size={15} /> },
  "in-progress":         { color: "#27AE60", icon: <Wrench size={15} /> },
};

const PAYMENT_COLOR: Record<string, string> = {
  unpaid: "#EB5757", deposit_pending: "#F2994A", deposit: "#F2994A",
  partially_paid: "#F2C94C", partial: "#F2C94C",
  paid_100: "#27AE60", paid: "#27AE60", refunded: "#A7A7B3",
};

function fromDb(booking: DbBooking): TrackData {
  return {
    reference:     booking.booking_reference ?? "",
    eventType:     booking.event_type ?? "—",
    eventDate:     booking.event_date ?? "—",
    venue:         booking.event_location ?? "—",
    services:      booking.services ?? [],
    status:        booking.status,
    statusLabel:   DB_BOOKING_LABELS[booking.status] ?? booking.status,
    paymentStatus: booking.payment_status,
    paymentLabel:  DB_PAYMENT_LABELS[booking.payment_status] ?? booking.payment_status,
    timeline: (booking.status_updates ?? [])
      .filter((u) => u.visible_to_customer)
      .map((u) => ({
        time:      u.created_at,
        message:   u.description ?? u.title ?? u.status,
        isSuccess: ["confirmed","completed","setup_in_progress","team_on_the_way"].includes(u.status),
      })),
    managerPhone:   booking.manager_phone ?? "+971553320051",
    setupTeamPhone: booking.setup_team_phone ?? "+971553320051",
    clientName:     booking.customer?.full_name ?? "",
  };
}

export default function TrackingForm() {
  const [ref, setRef]         = useState("");
  const [track, setTrack]     = useState<TrackData | null>(null);
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    const trimmed = ref.trim().toUpperCase();
    if (!trimmed) return;
    setLoading(true);
    setError("");

    if (trimmed === "SBX-2025-0001") {
      await new Promise((r) => setTimeout(r, 500));
      setTrack(DEMO);
      setLoading(false);
      return;
    }

    try {
      if (isSupabaseConfigured) {
        const res = await fetch(`/api/tracking?ref=${encodeURIComponent(trimmed)}`);
        if (!res.ok) {
          setTrack(null);
          setError("No booking found with that reference. Please check and try again.");
          setLoading(false);
          return;
        }
        const json = await res.json();
        setTrack(fromDb(json.booking as DbBooking));
      } else {
        await new Promise((r) => setTimeout(r, 400));
        const found = getBookingByRef(trimmed);
        if (found) {
          setTrack({
            reference:     found.referenceNumber ?? trimmed,
            eventType:     found.eventType,
            eventDate:     found.eventDate,
            venue:         found.venue,
            services:      found.services,
            status:        found.status,
            statusLabel:   BOOKING_STATUS_LABELS[found.status as keyof typeof BOOKING_STATUS_LABELS] ?? found.status,
            paymentStatus: found.paymentStatus,
            paymentLabel:  PAYMENT_STATUS_LABELS[found.paymentStatus as keyof typeof PAYMENT_STATUS_LABELS] ?? found.paymentStatus,
            timeline:      found.timeline.map((t) => ({
              time: t.time, message: t.message, isSuccess: t.type === "success",
            })),
            managerPhone:   found.managerPhone ?? "+971553320051",
            setupTeamPhone: found.setupTeamPhone ?? "+971553320051",
            clientName:     found.clientName,
          });
        } else {
          setTrack(null);
          setError("No booking found with that reference. Please check and try again.");
        }
      }
    } catch {
      setError("Unable to fetch booking. Please try again.");
    }

    setLoading(false);
  }

  const statusCfg    = track ? (STATUS_CONFIG[track.status] ?? { color: "#A7A7B3", icon: <Clock size={15} /> }) : null;
  const paymentColor = track ? (PAYMENT_COLOR[track.paymentStatus] ?? "#A7A7B3") : "#A7A7B3";

  return (
    <>
      {/* Search */}
      <section className="py-12" style={{ background: "#0B0B0F" }}>
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card rounded-2xl p-8">
            <label className="block text-sm font-medium mb-3" style={{ color: "#A7A7B3" }}>
              Booking Reference Number
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={ref}
                onChange={(e) => setRef(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="e.g. SBX-2025-0001"
                className="flex-1 bg-[#181824] rounded-lg px-4 py-3 text-sm border outline-none transition-[border-color] duration-150 placeholder:text-[#3A3A4E]"
                style={{ color: "#FFF", borderColor: "rgba(214,168,79,0.2)" }}
                onFocus={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = "#D6A84F"; }}
                onBlur={(e)  => { (e.currentTarget as HTMLInputElement).style.borderColor = "rgba(214,168,79,0.2)"; }}
              />
              <button
                onClick={handleSearch}
                disabled={loading || !ref.trim()}
                className="btn-gold inline-flex items-center gap-2 shrink-0 disabled:opacity-50"
              >
                <Search size={15} />
                {loading ? "Searching…" : "Track"}
              </button>
            </div>
            {error && <p className="mt-3 text-sm" style={{ color: "#EB5757" }}>{error}</p>}
            <p className="mt-3 text-xs" style={{ color: "#5A5A6E" }}>
              Try demo:{" "}
              <button className="underline" onClick={() => setRef("SBX-2025-0001")} style={{ color: "#D6A84F" }}>
                SBX-2025-0001
              </button>
            </p>
          </div>
        </div>
      </section>

      {/* Result */}
      {track && statusCfg && (
        <section className="pb-20" style={{ background: "#0B0B0F" }}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

            {/* Header card */}
            <div
              className="rounded-2xl p-8"
              style={{
                background: "linear-gradient(135deg, rgba(214,168,79,0.1), rgba(214,168,79,0.03))",
                border: "1px solid rgba(214,168,79,0.25)",
              }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div>
                  <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#5A5A6E" }}>Booking Reference</p>
                  <p className="text-2xl font-bold text-gold-gradient" style={{ fontFamily: "var(--font-display)" }}>
                    {track.reference}
                  </p>
                  {track.clientName && (
                    <p className="text-sm mt-1" style={{ color: "#A7A7B3" }}>{track.clientName}</p>
                  )}
                </div>
                <div className="flex flex-col gap-2 items-start sm:items-end">
                  <div
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold"
                    style={{
                      background: `${statusCfg.color}18`,
                      color: statusCfg.color,
                      border: `1px solid ${statusCfg.color}30`,
                    }}
                  >
                    {statusCfg.icon}
                    {track.statusLabel}
                  </div>
                  <div
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ background: `${paymentColor}18`, color: paymentColor }}
                  >
                    {track.paymentLabel}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                {[
                  { icon: <Package size={14} />,     label: "Event Type", value: track.eventType },
                  {
                    icon: <CalendarDays size={14} />, label: "Event Date",
                    value: (() => {
                      try {
                        return new Date(track.eventDate).toLocaleDateString("en-AE", {
                          weekday: "long", year: "numeric", month: "long", day: "numeric",
                        });
                      } catch { return track.eventDate; }
                    })(),
                  },
                  { icon: <MapPin size={14} />,      label: "Venue",    value: track.venue },
                  { icon: <CheckCircle size={14} />, label: "Services", value: track.services.join(" · ") || "—" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <span style={{ color: "#D6A84F", marginTop: 2 }}>{item.icon}</span>
                    <div>
                      <p className="text-xs mb-0.5" style={{ color: "#5A5A6E" }}>{item.label}</p>
                      <p className="text-sm" style={{ color: "#A7A7B3" }}>{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            {track.timeline.length > 0 && (
              <div className="glass-card rounded-2xl p-8">
                <h3 className="text-xl font-bold mb-6" style={{ fontFamily: "var(--font-display)", color: "#D6A84F" }}>
                  Booking Timeline
                </h3>
                <div className="space-y-5">
                  {track.timeline.map((entry, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0 mt-1.5"
                        style={{ background: entry.isSuccess ? "#27AE60" : "#D6A84F" }}
                      />
                      <div className="flex-1">
                        <p className="text-sm text-white">{entry.message}</p>
                        <p className="text-xs mt-1" style={{ color: "#5A5A6E" }}>
                          {new Date(entry.time).toLocaleString("en-AE")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Map placeholder */}
            <div className="glass-card rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "var(--font-display)", color: "#D6A84F" }}>
                Setup Team Location
              </h3>
              <p className="text-sm mb-4" style={{ color: "#A7A7B3" }}>
                Live team tracking is available on the day of your event.
              </p>
              <div
                className="rounded-xl aspect-video flex items-center justify-center"
                style={{ background: "#111118", border: "1px solid rgba(214,168,79,0.1)" }}
              >
                <div className="text-center">
                  <MapPin size={32} style={{ color: "#2A2A38", margin: "0 auto 8px" }} />
                  <p className="text-sm" style={{ color: "#3A3A4E" }}>Live map — available event day</p>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="glass-card rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-6" style={{ fontFamily: "var(--font-display)", color: "#D6A84F" }}>
                Contact Your Team
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a
                  href={`tel:${track.setupTeamPhone}`}
                  className="flex items-center gap-3 rounded-xl p-4 transition-[background] duration-150 hover:bg-[rgba(214,168,79,0.08)]"
                  style={{ background: "rgba(17,17,24,0.8)", border: "1px solid rgba(214,168,79,0.12)" }}
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(214,168,79,0.15)" }}>
                    <Phone size={16} style={{ color: "#D6A84F" }} />
                  </div>
                  <div>
                    <p className="text-xs mb-0.5" style={{ color: "#5A5A6E" }}>Call Setup Team</p>
                    <p className="text-sm font-semibold text-white">{track.setupTeamPhone}</p>
                  </div>
                </a>
                <a
                  href={`https://wa.me/${track.setupTeamPhone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi, I'm enquiring about booking ${track.reference}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl p-4 transition-[background] duration-150 hover:bg-[rgba(214,168,79,0.08)]"
                  style={{ background: "rgba(17,17,24,0.8)", border: "1px solid rgba(214,168,79,0.12)" }}
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(214,168,79,0.15)" }}>
                    <MessageCircle size={16} style={{ color: "#D6A84F" }} />
                  </div>
                  <div>
                    <p className="text-xs mb-0.5" style={{ color: "#5A5A6E" }}>WhatsApp Team</p>
                    <p className="text-sm font-semibold text-white">Message Now</p>
                  </div>
                </a>
              </div>
            </div>

          </div>
        </section>
      )}
    </>
  );
}
