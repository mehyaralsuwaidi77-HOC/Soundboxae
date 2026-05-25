"use client";

import { useEffect, useState } from "react";
import { Trash2, RefreshCw, Plus } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { getBookings, saveBooking, updateBookingStatus, updatePaymentStatus, deleteBooking } from "@/lib/storage";
import type { DbBooking, BookingStatus, PaymentStatus } from "@/lib/supabase/types";
import { BOOKING_STATUS_LABELS, BOOKING_STATUS_COLORS, PAYMENT_STATUS_LABELS, PAYMENT_STATUS_COLORS } from "@/lib/supabase/types";

const STATUS_OPTIONS  = Object.keys(BOOKING_STATUS_LABELS) as BookingStatus[];
const PAYMENT_OPTIONS = Object.keys(PAYMENT_STATUS_LABELS) as PaymentStatus[];

const emptyForm = { clientName: "", clientEmail: "", clientPhone: "", eventType: "", eventDate: "", venue: "", services: "" };

export default function BookingsPage() {
  const [bookings, setBookings] = useState<DbBooking[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState(emptyForm);
  const [creating, setCreating] = useState(false);
  const [loading, setLoading]   = useState(true);

  async function load() {
    setLoading(true);
    if (isSupabaseConfigured) {
      const { data } = await supabase
        .from("bookings")
        .select("*, customer:customers(full_name, email, phone), status_updates:booking_status_updates(id, status, title, description, visible_to_customer, created_at)")
        .order("created_at", { ascending: false });
      setBookings((data ?? []) as DbBooking[]);
    } else {
      // Adapt localStorage bookings
      const bkns = getBookings();
      setBookings(
        bkns.map((b) => ({
          id: b.id,
          booking_reference: b.referenceNumber ?? undefined,
          event_type: b.eventType,
          event_date: b.eventDate,
          event_location: b.venue,
          services: b.services,
          status: b.status.replace(/-/g, "_") as BookingStatus,
          payment_status: (b.paymentStatus === "paid" ? "paid_100" : b.paymentStatus) as PaymentStatus,
          manager_phone: b.managerPhone ?? "+971553320051",
          setup_team_phone: b.setupTeamPhone,
          internal_notes: b.internalNotes,
          customer_notes: b.notes,
          created_at: b.createdAt,
          updated_at: b.updatedAt,
          customer: { id: b.id, full_name: b.clientName, email: b.clientEmail, phone: b.clientPhone, preferred_language: "en", created_at: b.createdAt, updated_at: b.updatedAt },
          status_updates: b.timeline.map((t, i) => ({
            id: `${b.id}_${i}`, booking_id: b.id, status: b.status,
            description: t.message, visible_to_customer: true, created_at: t.time,
          })),
        }))
      );
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleCreate() {
    if (!form.clientName || !form.eventDate) return;
    setCreating(true);
    if (isSupabaseConfigured) {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: form.clientName, clientEmail: form.clientEmail, clientPhone: form.clientPhone,
          eventType: form.eventType, eventDate: form.eventDate, venue: form.venue,
          services: form.services.split(",").map((s) => s.trim()).filter(Boolean),
        }),
      });
      const json = await res.json();
      if (json.success) { await load(); alert(`Booking created: ${json.reference ?? json.id}`); }
    } else {
      const b = saveBooking({ clientName: form.clientName, clientEmail: form.clientEmail, clientPhone: form.clientPhone, eventType: form.eventType, eventDate: form.eventDate, venue: form.venue, services: form.services.split(",").map((s) => s.trim()).filter(Boolean), status: "new-inquiry", paymentStatus: "unpaid" });
      await load();
      alert(`Booking created: ${b.referenceNumber}`);
    }
    setForm(emptyForm);
    setShowForm(false);
    setCreating(false);
  }

  async function handleStatusChange(id: string, status: BookingStatus) {
    if (isSupabaseConfigured) {
      await supabase.from("bookings").update({ status }).eq("id", id);
      await supabase.from("booking_status_updates").insert({ booking_id: id, status, title: BOOKING_STATUS_LABELS[status], visible_to_customer: true });
      setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status } : b));
    } else {
      updateBookingStatus(id, status.replace(/_/g, "-") as Parameters<typeof updateBookingStatus>[1]);
      await load();
    }
  }

  async function handlePaymentChange(id: string, payment_status: PaymentStatus) {
    if (isSupabaseConfigured) {
      await supabase.from("bookings").update({ payment_status }).eq("id", id);
      setBookings((prev) => prev.map((b) => b.id === id ? { ...b, payment_status } : b));
    } else {
      updatePaymentStatus(id, payment_status === "paid_100" ? "paid" : (payment_status as "unpaid" | "deposit" | "partial"));
      await load();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this booking?")) return;
    if (isSupabaseConfigured) {
      await supabase.from("bookings").delete().eq("id", id);
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } else {
      deleteBooking(id);
      await load();
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Bookings</h1>
          <p className="text-sm" style={{ color: "#A7A7B3" }}>{bookings.length} total booking{bookings.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={load} className="p-2 rounded-lg glass-card" style={{ color: "#D6A84F" }}><RefreshCw size={15} /></button>
          <button onClick={() => setShowForm(!showForm)} className="btn-gold inline-flex items-center gap-2"><Plus size={14} /> New Booking</button>
        </div>
      </div>

      {showForm && (
        <div className="glass-card rounded-xl p-6 space-y-4">
          <h3 className="font-bold text-lg" style={{ fontFamily: "var(--font-display)" }}>Create New Booking</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[{ key: "clientName", label: "Client Name *" }, { key: "clientEmail", label: "Email" }, { key: "clientPhone", label: "Phone" }, { key: "eventType", label: "Event Type" }, { key: "eventDate", label: "Event Date *", type: "date" }, { key: "venue", label: "Venue" }].map(({ key, label, type }) => (
              <div key={key}>
                <label className="block text-xs mb-1" style={{ color: "#A7A7B3" }}>{label}</label>
                <input type={type ?? "text"} value={form[key as keyof typeof form]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="w-full bg-[#181824] rounded-lg px-3 py-2 text-sm border outline-none" style={{ color: "#FFF", borderColor: "rgba(214,168,79,0.2)" }} />
              </div>
            ))}
            <div className="sm:col-span-2">
              <label className="block text-xs mb-1" style={{ color: "#A7A7B3" }}>Services (comma-separated)</label>
              <input type="text" value={form.services} onChange={(e) => setForm({ ...form, services: e.target.value })} placeholder="Sound System, Lighting, LED Screen" className="w-full bg-[#181824] rounded-lg px-3 py-2 text-sm border outline-none" style={{ color: "#FFF", borderColor: "rgba(214,168,79,0.2)" }} />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleCreate} disabled={creating} className="btn-gold">Create Booking</button>
            <button onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="glass-card rounded-xl p-12 text-center"><div className="w-5 h-5 rounded-full border-2 border-[#D6A84F] border-t-transparent animate-spin mx-auto" /></div>
      ) : bookings.length === 0 ? (
        <div className="glass-card rounded-xl p-12 text-center"><p style={{ color: "#5A5A6E" }}>No bookings yet.</p></div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="glass-card rounded-xl p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <p className="font-bold text-lg" style={{ fontFamily: "var(--font-display)", color: "#D6A84F" }}>
                      {booking.booking_reference ?? <span style={{ color: "#5A5A6E", fontSize: "0.75rem" }}>Ref pending payment</span>}
                    </p>
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: `${BOOKING_STATUS_COLORS[booking.status] ?? "#A7A7B3"}18`, color: BOOKING_STATUS_COLORS[booking.status] ?? "#A7A7B3" }}>
                      {BOOKING_STATUS_LABELS[booking.status] ?? booking.status}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: `${PAYMENT_STATUS_COLORS[booking.payment_status] ?? "#A7A7B3"}18`, color: PAYMENT_STATUS_COLORS[booking.payment_status] ?? "#A7A7B3" }}>
                      {PAYMENT_STATUS_LABELS[booking.payment_status] ?? booking.payment_status}
                    </span>
                  </div>
                  <p className="text-white font-medium">{booking.customer?.full_name ?? "—"}</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span style={{ color: "#A7A7B3" }}>📅 {booking.event_date ?? "—"}</span>
                    <span style={{ color: "#A7A7B3" }}>📍 {booking.event_location ?? "—"}</span>
                    {booking.customer?.phone && <span style={{ color: "#A7A7B3" }}>📞 {booking.customer.phone}</span>}
                    {booking.customer?.email && <span style={{ color: "#A7A7B3" }}>✉️ {booking.customer.email}</span>}
                  </div>
                  {booking.services && booking.services.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {booking.services.map((s) => <span key={s} className="text-xs px-2 py-0.5 rounded" style={{ background: "rgba(214,168,79,0.08)", color: "#A7A7B3" }}>{s}</span>)}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-3 md:items-end">
                  <div>
                    <label className="block text-xs mb-1" style={{ color: "#5A5A6E" }}>Booking Status</label>
                    <select value={booking.status} onChange={(e) => handleStatusChange(booking.id, e.target.value as BookingStatus)} className="rounded-lg px-3 py-2 text-xs border outline-none" style={{ background: "#181824", color: "#FFF", borderColor: "rgba(214,168,79,0.2)" }}>
                      {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{BOOKING_STATUS_LABELS[s]}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs mb-1" style={{ color: "#5A5A6E" }}>Payment Status</label>
                    <select value={booking.payment_status} onChange={(e) => handlePaymentChange(booking.id, e.target.value as PaymentStatus)} className="rounded-lg px-3 py-2 text-xs border outline-none" style={{ background: "#181824", color: "#FFF", borderColor: "rgba(214,168,79,0.2)" }}>
                      {PAYMENT_OPTIONS.map((s) => <option key={s} value={s}>{PAYMENT_STATUS_LABELS[s]}</option>)}
                    </select>
                  </div>
                  <button onClick={() => handleDelete(booking.id)} className="flex items-center gap-1.5 text-xs hover:text-white" style={{ color: "#EB5757" }}>
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>

              {booking.status_updates && booking.status_updates.length > 0 && (
                <div className="mt-4 pt-4 border-t space-y-2" style={{ borderColor: "rgba(214,168,79,0.08)" }}>
                  {booking.status_updates.slice(-3).map((u) => (
                    <div key={u.id} className="flex items-start gap-2 text-xs">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-1" style={{ background: "#D6A84F" }} />
                      <span style={{ color: "#A7A7B3" }}>{u.description ?? u.title ?? u.status}</span>
                      <span className="ml-auto shrink-0" style={{ color: "#5A5A6E" }}>{new Date(u.created_at).toLocaleDateString("en-AE")}</span>
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
