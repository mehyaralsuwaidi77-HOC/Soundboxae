"use client";

import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { getLeads, getBookings, LEAD_STATUS_LABELS } from "@/lib/storage";
import { INQUIRY_STATUS_LABELS, BOOKING_STATUS_LABELS } from "@/lib/supabase/types";
import type { DbInquiry, DbBooking, DbAnalyticsEvent } from "@/lib/supabase/types";

interface AnalyticsData {
  totalLeads: number;
  confirmedBookings: number;
  pendingBookings: number;
  paidBookings: number;
  whatsappClicks: number;
  aiCompletions: number;
  topServices: { service: string; count: number }[];
  monthlyLeads: { month: string; count: number }[];
  leadsByStatus: { status: string; label: string; count: number }[];
  topEvents: { name: string; count: number }[];
}

const EMPTY: AnalyticsData = {
  totalLeads: 0, confirmedBookings: 0, pendingBookings: 0, paidBookings: 0,
  whatsappClicks: 0, aiCompletions: 0,
  topServices: [], monthlyLeads: [], leadsByStatus: [], topEvents: [],
};

export default function AnalyticsPage() {
  const [data, setData]       = useState<AnalyticsData>(EMPTY);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    if (isSupabaseConfigured) {
      const [
        { data: inquiries },
        { data: bookings },
        { data: analytics },
      ] = await Promise.all([
        supabase.from("inquiries").select("status, services_requested, created_at"),
        supabase.from("bookings").select("status, payment_status"),
        supabase.from("analytics_events").select("event_name, created_at"),
      ]);

      const inq = (inquiries ?? []) as Pick<DbInquiry, "status" | "services_requested" | "created_at">[];
      const bkn = (bookings ?? []) as Pick<DbBooking, "status" | "payment_status">[];
      const evt = (analytics ?? []) as Pick<DbAnalyticsEvent, "event_name" | "created_at">[];

      // Top services
      const svcMap: Record<string, number> = {};
      inq.forEach((i) => (i.services_requested ?? []).forEach((s) => {
        svcMap[s] = (svcMap[s] ?? 0) + 1;
      }));
      const topServices = Object.entries(svcMap).sort((a, b) => b[1] - a[1]).slice(0, 6)
        .map(([service, count]) => ({ service, count }));

      // Monthly leads
      const monthMap: Record<string, number> = {};
      inq.forEach((i) => {
        const key = new Date(i.created_at).toLocaleString("en-AE", { month: "short", year: "2-digit" });
        monthMap[key] = (monthMap[key] ?? 0) + 1;
      });
      const monthlyLeads = Object.entries(monthMap).slice(-6).map(([month, count]) => ({ month, count }));

      // Leads by status
      const statusMap: Record<string, number> = {};
      inq.forEach((i) => { statusMap[i.status] = (statusMap[i.status] ?? 0) + 1; });
      const leadsByStatus = Object.entries(statusMap).map(([status, count]) => ({
        status,
        label: INQUIRY_STATUS_LABELS[status as keyof typeof INQUIRY_STATUS_LABELS] ?? status,
        count,
      }));

      // Top analytics events
      const evtMap: Record<string, number> = {};
      evt.forEach((e) => { evtMap[e.event_name] = (evtMap[e.event_name] ?? 0) + 1; });
      const topEvents = Object.entries(evtMap).sort((a, b) => b[1] - a[1]).slice(0, 8)
        .map(([name, count]) => ({ name, count }));

      setData({
        totalLeads:        inq.length,
        confirmedBookings: bkn.filter((b) => b.status === "confirmed").length,
        pendingBookings:   bkn.filter((b) => ["new_inquiry","quotation_sent","awaiting_payment"].includes(b.status)).length,
        paidBookings:      bkn.filter((b) => b.payment_status === "paid_100").length,
        whatsappClicks:    evt.filter((e) => e.event_name === "whatsapp_click").length,
        aiCompletions:     evt.filter((e) => e.event_name === "ai_chat_completed").length,
        topServices, monthlyLeads, leadsByStatus, topEvents,
      });
    } else {
      const leads    = getLeads();
      const bookings = getBookings();

      const svcMap: Record<string, number> = {};
      leads.forEach((l) => l.services.forEach((s) => { svcMap[s] = (svcMap[s] ?? 0) + 1; }));
      const topServices = Object.entries(svcMap).sort((a, b) => b[1] - a[1]).slice(0, 6)
        .map(([service, count]) => ({ service, count }));

      const monthMap: Record<string, number> = {};
      leads.forEach((l) => {
        const key = new Date(l.createdAt).toLocaleString("en-AE", { month: "short", year: "2-digit" });
        monthMap[key] = (monthMap[key] ?? 0) + 1;
      });
      const monthlyLeads = Object.entries(monthMap).slice(-6).map(([month, count]) => ({ month, count }));

      const statusMap: Record<string, number> = {};
      leads.forEach((l) => { statusMap[l.status] = (statusMap[l.status] ?? 0) + 1; });
      const leadsByStatus = Object.entries(statusMap).map(([status, count]) => ({
        status,
        label: LEAD_STATUS_LABELS[status as keyof typeof LEAD_STATUS_LABELS] ?? status,
        count,
      }));

      setData({
        totalLeads:        leads.length,
        confirmedBookings: bookings.filter((b) => b.status === "confirmed").length,
        pendingBookings:   bookings.filter((b) => ["new-inquiry","quotation-sent","awaiting-payment"].includes(b.status)).length,
        paidBookings:      bookings.filter((b) => b.paymentStatus === "paid").length,
        whatsappClicks:    0, aiCompletions: 0,
        topServices, monthlyLeads, leadsByStatus, topEvents: [],
      });
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const maxLeads   = Math.max(...data.monthlyLeads.map((m) => m.count), 1);
  const maxService = Math.max(...data.topServices.map((s) => s.count), 1);
  const maxEvent   = Math.max(...data.topEvents.map((e) => e.count), 1);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Analytics</h1>
          <p className="text-sm" style={{ color: "#A7A7B3" }}>
            {isSupabaseConfigured ? "Live data from Supabase" : "localStorage — configure Supabase for production data"}
          </p>
        </div>
        <button onClick={load} className="p-2 rounded-lg glass-card" style={{ color: "#D6A84F" }}>
          <RefreshCw size={15} />
        </button>
      </div>

      {/* KPI cards */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card rounded-xl p-5 h-20 animate-pulse" style={{ background: "#181824" }} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: "Total Leads",          value: data.totalLeads,        color: "#D6A84F" },
            { label: "Confirmed Bookings",   value: data.confirmedBookings, color: "#27AE60" },
            { label: "Open Inquiries",       value: data.pendingBookings,   color: "#F2994A" },
            { label: "Paid in Full",         value: data.paidBookings,      color: "#2F80ED" },
            { label: "WhatsApp Clicks",      value: data.whatsappClicks,    color: "#25D366" },
            { label: "AI Chat Completions",  value: data.aiCompletions,     color: "#9B51E0" },
          ].map((kpi) => (
            <div key={kpi.label} className="glass-card rounded-xl p-5 text-center">
              <p className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: kpi.color }}>
                {kpi.value}
              </p>
              <p className="text-xs mt-1 uppercase tracking-wider" style={{ color: "#5A5A6E" }}>{kpi.label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly leads */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="font-bold mb-6" style={{ fontFamily: "var(--font-display)" }}>Monthly Lead Inquiries</h3>
          {data.monthlyLeads.length === 0 ? (
            <p className="text-sm" style={{ color: "#5A5A6E" }}>No data yet.</p>
          ) : (
            <div className="flex items-end gap-3 h-32">
              {data.monthlyLeads.map((m) => (
                <div key={m.month} className="flex flex-col items-center gap-2 flex-1">
                  <div
                    className="w-full rounded-t-md"
                    style={{
                      height: `${(m.count / maxLeads) * 100}%`,
                      background: "linear-gradient(to top, #D6A84F, #F2D28A)",
                      minHeight: "4px",
                      transition: "height 0.6s ease",
                    }}
                  />
                  <span className="text-xs" style={{ color: "#5A5A6E" }}>{m.month}</span>
                  <span className="text-xs font-semibold" style={{ color: "#D6A84F" }}>{m.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top services */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="font-bold mb-6" style={{ fontFamily: "var(--font-display)" }}>Top Requested Services</h3>
          {data.topServices.length === 0 ? (
            <p className="text-sm" style={{ color: "#5A5A6E" }}>No data yet.</p>
          ) : (
            <div className="space-y-3">
              {data.topServices.map((s) => (
                <div key={s.service} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: "#A7A7B3" }}>{s.service}</span>
                    <span className="text-sm font-semibold" style={{ color: "#D6A84F" }}>{s.count}</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: "#1A1A24" }}>
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(s.count / maxService) * 100}%`,
                        background: "linear-gradient(to right, #D6A84F, #F2D28A)",
                        transition: "width 0.6s ease",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Leads by status */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="font-bold mb-6" style={{ fontFamily: "var(--font-display)" }}>Leads by Status</h3>
          {data.leadsByStatus.length === 0 ? (
            <p className="text-sm" style={{ color: "#5A5A6E" }}>No data yet.</p>
          ) : (
            <div className="space-y-3">
              {data.leadsByStatus.map((s) => (
                <div key={s.status} className="flex items-center justify-between">
                  <span
                    className="text-sm px-3 py-1 rounded-full"
                    style={{ background: "rgba(214,168,79,0.1)", color: "#D6A84F" }}
                  >
                    {s.label}
                  </span>
                  <span className="text-sm font-semibold text-white">{s.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Analytics events (Supabase only) or upgrade prompt */}
        {isSupabaseConfigured ? (
          <div className="glass-card rounded-xl p-6">
            <h3 className="font-bold mb-6" style={{ fontFamily: "var(--font-display)" }}>Top Analytics Events</h3>
            {data.topEvents.length === 0 ? (
              <p className="text-sm" style={{ color: "#5A5A6E" }}>No events tracked yet.</p>
            ) : (
              <div className="space-y-3">
                {data.topEvents.map((e) => (
                  <div key={e.name} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-mono" style={{ color: "#A7A7B3" }}>{e.name}</span>
                      <span className="text-sm font-semibold" style={{ color: "#9B51E0" }}>{e.count}</span>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background: "#1A1A24" }}>
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(e.count / maxEvent) * 100}%`,
                          background: "linear-gradient(to right, #9B51E0, #C57FFF)",
                          transition: "width 0.6s ease",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div
            className="rounded-xl p-6 flex flex-col justify-center"
            style={{
              background: "linear-gradient(135deg, rgba(214,168,79,0.1), rgba(214,168,79,0.03))",
              border: "1px solid rgba(214,168,79,0.2)",
            }}
          >
            <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "#D6A84F" }}>Connect Supabase</p>
            <h3 className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>Live Analytics</h3>
            <p className="text-sm leading-relaxed" style={{ color: "#A7A7B3" }}>
              Configure{" "}
              <code className="mx-1 px-1 rounded text-xs" style={{ background: "#181824", color: "#D6A84F" }}>
                NEXT_PUBLIC_SUPABASE_URL
              </code>
              to unlock real-time event tracking, WhatsApp click counts, AI chat completions, and more.
            </p>
          </div>
        )}
      </div>

      {/* Booking status breakdown (Supabase) */}
      {isSupabaseConfigured && (
        <div className="glass-card rounded-xl p-6">
          <h3 className="font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>Booking Status Distribution</h3>
          <p className="text-xs mb-1" style={{ color: "#5A5A6E" }}>Data refreshes on page load.</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {Object.entries(BOOKING_STATUS_LABELS).map(([status, label]) => (
              <span
                key={status}
                className="text-xs px-3 py-1 rounded-full"
                style={{ background: "rgba(214,168,79,0.08)", color: "#A7A7B3" }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
