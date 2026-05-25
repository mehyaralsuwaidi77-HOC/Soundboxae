"use client";

import { useState } from "react";
import {
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
  Phone,
  MessageCircle,
  CalendarDays,
  MapPin,
  Package,
} from "lucide-react";
import SiteShell from "@/components/layout/SiteShell";
import SectionHeader from "@/components/ui/SectionHeader";
import GoldBadge from "@/components/ui/GoldBadge";
import { getBookingByRef, type Booking } from "@/lib/storage";

const demoBooking: Booking = {
  id: "demo",
  referenceNumber: "SBX-2025-0001",
  clientName: "Mohammed Al Rashid",
  clientEmail: "demo@example.com",
  clientPhone: "+971501234567",
  eventType: "Corporate Gala",
  eventDate: "2025-07-15",
  venue: "JW Marriott Marquis, Dubai",
  services: ["Sound System", "Lighting", "LED Screen", "Stage"],
  status: "confirmed",
  paymentStatus: "paid",
  createdAt: "2025-06-01T10:00:00Z",
  updatedAt: "2025-06-10T14:30:00Z",
  timeline: [
    {
      time: "2025-06-01T10:00:00Z",
      message: "Booking received and under review.",
      type: "info",
    },
    {
      time: "2025-06-03T09:00:00Z",
      message: "Booking confirmed. Technical team assigned.",
      type: "success",
    },
    {
      time: "2025-06-10T14:30:00Z",
      message: "Payment confirmed in full. Booking reference activated.",
      type: "success",
    },
  ],
};

const statusConfig: Record<
  string,
  { label: string; color: string; icon: React.ReactNode }
> = {
  pending: {
    label: "Pending Review",
    color: "#A7A7B3",
    icon: <Clock size={16} />,
  },
  confirmed: {
    label: "Confirmed",
    color: "#D6A84F",
    icon: <CheckCircle size={16} />,
  },
  "in-progress": {
    label: "In Progress",
    color: "#2F80ED",
    icon: <Clock size={16} />,
  },
  completed: {
    label: "Completed",
    color: "#27AE60",
    icon: <CheckCircle size={16} />,
  },
  cancelled: {
    label: "Cancelled",
    color: "#EB5757",
    icon: <AlertCircle size={16} />,
  },
};

const paymentConfig: Record<string, { label: string; color: string }> = {
  unpaid: { label: "Unpaid", color: "#EB5757" },
  deposit: { label: "Deposit Paid", color: "#F2994A" },
  partial: { label: "Partial Payment", color: "#F2C94C" },
  paid: { label: "Paid in Full", color: "#27AE60" },
};

export default function TrackingPage() {
  const [ref, setRef] = useState("");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSearch() {
    const trimmed = ref.trim().toUpperCase();
    if (!trimmed) return;
    setLoading(true);
    setError("");
    setTimeout(() => {
      // Check demo first
      if (trimmed === "SBX-2025-0001") {
        setBooking(demoBooking);
      } else {
        const found = getBookingByRef(trimmed);
        if (found) {
          setBooking(found);
        } else {
          setBooking(null);
          setError("No booking found with that reference number. Please check and try again.");
        }
      }
      setLoading(false);
    }, 600);
  }

  return (
    <SiteShell>
      {/* Hero */}
      <section className="relative pt-36 pb-16 overflow-hidden" style={{ background: "#050505" }}>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(214,168,79,0.08) 0%, transparent 60%)",
          }}
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionHeader
            eyebrow="Client Portal"
            title="Track Your Booking"
            subtitle="Enter your booking reference number to view real-time status, timeline, and team contact details."
            centered
          />
        </div>
      </section>

      {/* Search */}
      <section className="py-12" style={{ background: "#0B0B0F" }}>
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="glass-card rounded-2xl p-8"
          >
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
                style={{
                  color: "#FFFFFF",
                  borderColor: "rgba(214,168,79,0.2)",
                }}
                onFocus={(e) => {
                  (e.currentTarget as HTMLInputElement).style.borderColor = "#D6A84F";
                }}
                onBlur={(e) => {
                  (e.currentTarget as HTMLInputElement).style.borderColor =
                    "rgba(214,168,79,0.2)";
                }}
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
            {error && (
              <p className="mt-3 text-sm" style={{ color: "#EB5757" }}>
                {error}
              </p>
            )}
            <p className="mt-3 text-xs" style={{ color: "#5A5A6E" }}>
              Try demo: <button className="underline" onClick={() => { setRef("SBX-2025-0001"); }} style={{ color: "#D6A84F" }}>SBX-2025-0001</button>
            </p>
          </div>
        </div>
      </section>

      {/* Booking result */}
      {booking && (
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
                  <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#5A5A6E" }}>
                    Booking Reference
                  </p>
                  <p
                    className="text-2xl font-bold text-gold-gradient"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {booking.referenceNumber}
                  </p>
                </div>
                <div className="flex flex-col gap-2 items-start sm:items-end">
                  <div
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold"
                    style={{
                      background: `${statusConfig[booking.status]?.color}18`,
                      color: statusConfig[booking.status]?.color,
                      border: `1px solid ${statusConfig[booking.status]?.color}30`,
                    }}
                  >
                    {statusConfig[booking.status]?.icon}
                    {statusConfig[booking.status]?.label}
                  </div>
                  <div
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                    style={{
                      background: `${paymentConfig[booking.paymentStatus]?.color}18`,
                      color: paymentConfig[booking.paymentStatus]?.color,
                    }}
                  >
                    {paymentConfig[booking.paymentStatus]?.label}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                {[
                  { icon: <Package size={14} />, label: "Event Type", value: booking.eventType },
                  {
                    icon: <CalendarDays size={14} />,
                    label: "Event Date",
                    value: new Date(booking.eventDate).toLocaleDateString("en-AE", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }),
                  },
                  { icon: <MapPin size={14} />, label: "Venue", value: booking.venue },
                  { icon: <CheckCircle size={14} />, label: "Services", value: booking.services.join(" · ") },
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
            <div className="glass-card rounded-2xl p-8">
              <h3
                className="text-xl font-bold mb-6"
                style={{ fontFamily: "var(--font-display)", color: "#D6A84F" }}
              >
                Booking Timeline
              </h3>
              <div className="space-y-5">
                {booking.timeline.map((entry, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0 mt-1.5"
                      style={{
                        background:
                          entry.type === "success"
                            ? "#27AE60"
                            : entry.type === "warning"
                            ? "#EB5757"
                            : "#D6A84F",
                      }}
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

            {/* Location placeholder */}
            <div className="glass-card rounded-2xl p-8">
              <h3
                className="text-xl font-bold mb-2"
                style={{ fontFamily: "var(--font-display)", color: "#D6A84F" }}
              >
                Setup Team Location
              </h3>
              <p className="text-sm mb-4" style={{ color: "#A7A7B3" }}>
                Live team tracking is available on the day of your event. The map will appear here 24 hours before your setup begins.
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

            {/* Contact team */}
            <div className="glass-card rounded-2xl p-8">
              <h3
                className="text-xl font-bold mb-6"
                style={{ fontFamily: "var(--font-display)", color: "#D6A84F" }}
              >
                Contact Your Team
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a
                  href="tel:+971553320051"
                  className="flex items-center gap-3 rounded-xl p-4 transition-[background] duration-150 hover:bg-[rgba(214,168,79,0.08)]"
                  style={{ background: "rgba(17,17,24,0.8)", border: "1px solid rgba(214,168,79,0.12)" }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(214,168,79,0.15)" }}
                  >
                    <Phone size={16} style={{ color: "#D6A84F" }} />
                  </div>
                  <div>
                    <p className="text-xs mb-0.5" style={{ color: "#5A5A6E" }}>Call Setup Team</p>
                    <p className="text-sm font-semibold text-white">+971 55 332 0051</p>
                  </div>
                </a>
                <a
                  href={`https://wa.me/971553320051?text=${encodeURIComponent(`Hi, I'm calling about booking ${booking.referenceNumber}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl p-4 transition-[background] duration-150 hover:bg-[rgba(214,168,79,0.08)]"
                  style={{ background: "rgba(17,17,24,0.8)", border: "1px solid rgba(214,168,79,0.12)" }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(214,168,79,0.15)" }}
                  >
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
    </SiteShell>
  );
}
