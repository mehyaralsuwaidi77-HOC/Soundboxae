"use client";

import { useEffect, useState } from "react";
import {
  getBookings,
  saveBooking,
  updateBookingStatus,
  updatePaymentStatus,
  type Booking,
} from "@/lib/storage";

const STATUS_OPTIONS: Booking["status"][] = [
  "pending",
  "confirmed",
  "in-progress",
  "completed",
  "cancelled",
];
const PAYMENT_OPTIONS: Booking["paymentStatus"][] = [
  "unpaid",
  "deposit",
  "partial",
  "paid",
];

const statusColors: Record<Booking["status"], string> = {
  pending: "#F2994A",
  confirmed: "#D6A84F",
  "in-progress": "#2F80ED",
  completed: "#27AE60",
  cancelled: "#EB5757",
};

const paymentColors: Record<Booking["paymentStatus"], string> = {
  unpaid: "#EB5757",
  deposit: "#F2994A",
  partial: "#F2C94C",
  paid: "#27AE60",
};

const emptyForm = {
  clientName: "",
  clientEmail: "",
  clientPhone: "",
  eventType: "",
  eventDate: "",
  venue: "",
  services: "",
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    setBookings(getBookings());
  }, []);

  function handleCreate() {
    if (!form.clientName || !form.eventDate) return;
    setCreating(true);
    const b = saveBooking({
      clientName: form.clientName,
      clientEmail: form.clientEmail,
      clientPhone: form.clientPhone,
      eventType: form.eventType,
      eventDate: form.eventDate,
      venue: form.venue,
      services: form.services.split(",").map((s) => s.trim()).filter(Boolean),
      status: "pending",
      paymentStatus: "unpaid",
    });
    setBookings(getBookings());
    setForm(emptyForm);
    setShowForm(false);
    setCreating(false);
    alert(`Booking created: ${b.referenceNumber}`);
  }

  function handleStatusChange(id: string, status: Booking["status"]) {
    updateBookingStatus(id, status, `Status changed to ${status}.`);
    setBookings(getBookings());
  }

  function handlePaymentChange(id: string, paymentStatus: Booking["paymentStatus"]) {
    updatePaymentStatus(id, paymentStatus);
    setBookings(getBookings());
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
            Bookings
          </h1>
          <p className="text-sm" style={{ color: "#A7A7B3" }}>
            {bookings.length} total bookings
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-gold">
          + New Booking
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="glass-card rounded-xl p-6 space-y-4">
          <h3 className="font-bold text-lg" style={{ fontFamily: "var(--font-display)" }}>
            Create New Booking
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { key: "clientName", label: "Client Name *" },
              { key: "clientEmail", label: "Email" },
              { key: "clientPhone", label: "Phone" },
              { key: "eventType", label: "Event Type" },
              { key: "eventDate", label: "Event Date *", type: "date" },
              { key: "venue", label: "Venue" },
            ].map(({ key, label, type }) => (
              <div key={key}>
                <label className="block text-xs mb-1" style={{ color: "#A7A7B3" }}>
                  {label}
                </label>
                <input
                  type={type ?? "text"}
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="w-full bg-[#181824] rounded-lg px-3 py-2 text-sm border outline-none"
                  style={{ color: "#FFF", borderColor: "rgba(214,168,79,0.2)" }}
                />
              </div>
            ))}
            <div className="sm:col-span-2">
              <label className="block text-xs mb-1" style={{ color: "#A7A7B3" }}>
                Services (comma-separated)
              </label>
              <input
                type="text"
                value={form.services}
                onChange={(e) => setForm({ ...form, services: e.target.value })}
                placeholder="Sound System, Lighting, LED Screen"
                className="w-full bg-[#181824] rounded-lg px-3 py-2 text-sm border outline-none"
                style={{ color: "#FFF", borderColor: "rgba(214,168,79,0.2)" }}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleCreate} disabled={creating} className="btn-gold">
              Create Booking
            </button>
            <button onClick={() => setShowForm(false)} className="btn-ghost">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Bookings list */}
      {bookings.length === 0 ? (
        <div className="glass-card rounded-xl p-12 text-center">
          <p style={{ color: "#5A5A6E" }}>No bookings yet. Create a booking above.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="glass-card rounded-xl p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <p
                      className="font-bold text-lg"
                      style={{ fontFamily: "var(--font-display)", color: "#D6A84F" }}
                    >
                      {booking.referenceNumber}
                    </p>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-semibold"
                      style={{
                        background: `${statusColors[booking.status]}18`,
                        color: statusColors[booking.status],
                      }}
                    >
                      {booking.status}
                    </span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-semibold"
                      style={{
                        background: `${paymentColors[booking.paymentStatus]}18`,
                        color: paymentColors[booking.paymentStatus],
                      }}
                    >
                      {booking.paymentStatus}
                    </span>
                  </div>
                  <p className="text-white font-medium">{booking.clientName}</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span style={{ color: "#A7A7B3" }}>📅 {booking.eventDate}</span>
                    <span style={{ color: "#A7A7B3" }}>📍 {booking.venue}</span>
                    <span style={{ color: "#A7A7B3" }}>📞 {booking.clientPhone}</span>
                    <span style={{ color: "#A7A7B3" }}>✉️ {booking.clientEmail}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {booking.services.map((s) => (
                      <span
                        key={s}
                        className="text-xs px-2 py-0.5 rounded"
                        style={{ background: "rgba(214,168,79,0.08)", color: "#A7A7B3" }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3 md:items-end">
                  <div>
                    <label className="block text-xs mb-1" style={{ color: "#5A5A6E" }}>
                      Booking Status
                    </label>
                    <select
                      value={booking.status}
                      onChange={(e) =>
                        handleStatusChange(booking.id, e.target.value as Booking["status"])
                      }
                      className="rounded-lg px-3 py-2 text-xs border outline-none"
                      style={{ background: "#181824", color: "#FFF", borderColor: "rgba(214,168,79,0.2)" }}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs mb-1" style={{ color: "#5A5A6E" }}>
                      Payment Status
                    </label>
                    <select
                      value={booking.paymentStatus}
                      onChange={(e) =>
                        handlePaymentChange(
                          booking.id,
                          e.target.value as Booking["paymentStatus"]
                        )
                      }
                      className="rounded-lg px-3 py-2 text-xs border outline-none"
                      style={{ background: "#181824", color: "#FFF", borderColor: "rgba(214,168,79,0.2)" }}
                    >
                      {PAYMENT_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              {booking.timeline.length > 0 && (
                <div
                  className="mt-4 pt-4 border-t space-y-2"
                  style={{ borderColor: "rgba(214,168,79,0.08)" }}
                >
                  {booking.timeline.map((entry, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs">
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0 mt-1"
                        style={{
                          background:
                            entry.type === "success"
                              ? "#27AE60"
                              : entry.type === "warning"
                              ? "#EB5757"
                              : "#D6A84F",
                        }}
                      />
                      <span style={{ color: "#A7A7B3" }}>{entry.message}</span>
                      <span className="ml-auto shrink-0" style={{ color: "#5A5A6E" }}>
                        {new Date(entry.time).toLocaleDateString("en-AE")}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
