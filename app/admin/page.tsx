"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, CalendarCheck, TrendingUp, Clock, ArrowRight, MessageCircle, BarChart3 } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { getLeads, getBookings, BOOKING_STATUS_LABELS, LEAD_STATUS_LABELS } from "@/lib/storage";
import type { DbInquiry, DbBooking } from "@/lib/supabase/types";

interface Stats {
  totalLeads: number; newLeads: number; leadsToday: number;
  totalBookings: number; confirmedBookings: number; openInquiries: number; paidBookings: number;
  whatsappClicks: number; aiCompletions: number;
}

const EMPTY_STATS: Stats = {
  totalLeads: 0, newLeads: 0, leadsToday: 0,
  totalBookings: 0, confirmedBookings: 0, openInquiries: 0, paidBookings: 0,
  whatsappClicks: 0, aiCompletions: 0,
};

export default function AdminDashboard() {
  const [stats, setStats]                 = useState<Stats>(EMPTY_STATS);
  const [recentLeads, setRecentLeads]     = useState<DbInquiry[]>([]);
  const [recentBookings, setRecentBookings] = useState<DbBooking[]>([]);
  const [loading, setLoading]             = useState(true);

  useEffect(() => {
    async function load() {
      if (isSupabaseConfigured) {
        const today = new Date().toISOString().split("T")[0];
        const [
          { data: inquiries },
          { data: bookings },
          { data: analytics },
        ] = await Promise.all([
          supabase.from("inquiries").select("id, status, created_at, customer:customers(full_name, phone), event_type, event_date, services_requested").order("created_at", { ascending: false }),
          supabase.from("bookings").select("id, booking_reference, event_type, event_date, event_location, status, payment_status, customer:customers(full_name), status_updates:booking_status_updates(id)").order("created_at", { ascending: false }),
          supabase.from("analytics_events").select("event_name").in("event_name", ["whatsapp_click", "ai_chat_completed"]),
        ]);

        const inq = (inquiries ?? []) as unknown as DbInquiry[];
        const bkn = (bookings ?? []) as unknown as DbBooking[];
        const evt = analytics ?? [];

        setStats({
          totalLeads:        inq.length,
          newLeads:          inq.filter((i) => i.status === "new").length,
          leadsToday:        inq.filter((i) => i.created_at?.startsWith(today)).length,
          totalBookings:     bkn.length,
          confirmedBookings: bkn.filter((b) => b.status === "confirmed").length,
          openInquiries:     inq.filter((i) => ["new","contacted","quotation_sent"].includes(i.status)).length,
          paidBookings:      bkn.filter((b) => b.payment_status === "paid_100").length,
          whatsappClicks:    evt.filter((e) => e.event_name === "whatsapp_click").length,
          aiCompletions:     evt.filter((e) => e.event_name === "ai_chat_completed").length,
        });
        setRecentLeads(inq.slice(0, 5));
        setRecentBookings(bkn.slice(0, 5));
      } else {
        // localStorage fallback
        const leads    = getLeads();
        const bookings = getBookings();
        const today    = new Date().toISOString().split("T")[0];
        setStats({
          totalLeads:        leads.length,
          newLeads:          leads.filter((l) => l.status === "new").length,
          leadsToday:        leads.filter((l) => l.createdAt.startsWith(today)).length,
          totalBookings:     bookings.length,
          confirmedBookings: bookings.filter((b) => b.status === "confirmed").length,
          openInquiries:     bookings.filter((b) => ["new-inquiry","quotation-sent","awaiting-payment"].includes(b.status)).length,
          paidBookings:      bookings.filter((b) => b.paymentStatus === "paid").length,
          whatsappClicks:    0,
          aiCompletions:     0,
        });
      }
      setLoading(false);
    }
    load();
  }, []);

  const kpiCards = [
    { label: "Total Leads",        value: stats.totalLeads,        sub: `${stats.newLeads} new · ${stats.leadsToday} today`,   icon: <Users size={20} />,        href: "/admin/leads",    color: "#D6A84F" },
    { label: "Total Bookings",     value: stats.totalBookings,     sub: `${stats.confirmedBookings} confirmed`,                 icon: <CalendarCheck size={20} />, href: "/admin/bookings", color: "#2F80ED" },
    { label: "Open Inquiries",     value: stats.openInquiries,     sub: "Awaiting action",                                     icon: <Clock size={20} />,        href: "/admin/leads",    color: "#F2994A" },
    { label: "Paid in Full",       value: stats.paidBookings,      sub: "Payment confirmed",                                   icon: <TrendingUp size={20} />,   href: "/admin/bookings", color: "#27AE60" },
    { label: "WhatsApp Clicks",    value: stats.whatsappClicks,    sub: "All time",                                            icon: <MessageCircle size={20} />, href: "/admin/analytics",color: "#25D366" },
    { label: "AI Chat Completions",value: stats.aiCompletions,     sub: "Completed inquiries",                                 icon: <BarChart3 size={20} />,    href: "/admin/analytics",color: "#9B51E0" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "var(--font-display)" }}>
          Dashboard Overview
        </h1>
        <p className="text-sm" style={{ color: "#A7A7B3" }}>
          {isSupabaseConfigured ? "Live data from Supabase" : "Using localStorage — configure Supabase for production data"}
        </p>
      </div>

      {/* KPI grid */}
      {loading ? (
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card rounded-xl p-6 h-24 animate-pulse" style={{ background: "#181824" }} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
          {kpiCards.map((card) => (
            <Link
              key={card.label}
              href={card.href}
              className="glass-card rounded-xl p-5 flex flex-col gap-3 transition-[transform] duration-200 hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${card.color}18`, color: card.color }}>
                  {card.icon}
                </div>
                <ArrowRight size={13} style={{ color: "#3A3A4E" }} />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: card.color }}>{card.value}</p>
                <p className="text-xs text-white mt-0.5">{card.label}</p>
                <p className="text-xs mt-0.5" style={{ color: "#5A5A6E" }}>{card.sub}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent leads */}
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold" style={{ fontFamily: "var(--font-display)" }}>Recent Leads</h3>
            <Link href="/admin/leads" className="text-xs" style={{ color: "#D6A84F" }}>View all →</Link>
          </div>
          {recentLeads.length === 0 && !loading ? (
            <p className="text-sm" style={{ color: "#5A5A6E" }}>No leads yet.</p>
          ) : (
            <div className="space-y-3">
              {recentLeads.map((lead) => (
                <div key={lead.id} className="flex items-start justify-between gap-3 py-3 border-b last:border-0" style={{ borderColor: "rgba(214,168,79,0.08)" }}>
                  <div>
                    <p className="text-sm font-medium text-white">{lead.customer?.full_name ?? "Unknown"}</p>
                    <p className="text-xs mt-0.5" style={{ color: "#A7A7B3" }}>{lead.event_type} · {lead.event_date ?? "—"}</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full shrink-0" style={{ background: lead.status === "new" ? "rgba(214,168,79,0.15)" : "rgba(42,42,56,0.5)", color: lead.status === "new" ? "#D6A84F" : "#5A5A6E" }}>
                    {isSupabaseConfigured ? lead.status : LEAD_STATUS_LABELS[lead.status as keyof typeof LEAD_STATUS_LABELS] ?? lead.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent bookings */}
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold" style={{ fontFamily: "var(--font-display)" }}>Recent Bookings</h3>
            <Link href="/admin/bookings" className="text-xs" style={{ color: "#D6A84F" }}>View all →</Link>
          </div>
          {recentBookings.length === 0 && !loading ? (
            <p className="text-sm" style={{ color: "#5A5A6E" }}>No bookings yet.</p>
          ) : (
            <div className="space-y-3">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-start justify-between gap-3 py-3 border-b last:border-0" style={{ borderColor: "rgba(214,168,79,0.08)" }}>
                  <div>
                    <p className="text-sm font-medium" style={{ color: "#D6A84F" }}>{booking.booking_reference ?? "Pending ref"}</p>
                    <p className="text-xs text-white">{booking.customer?.full_name ?? "—"}</p>
                    <p className="text-xs mt-0.5" style={{ color: "#A7A7B3" }}>{booking.event_type} · {booking.event_date ?? "—"}</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full shrink-0" style={{ background: "rgba(214,168,79,0.1)", color: "#D6A84F" }}>
                    {BOOKING_STATUS_LABELS[booking.status as keyof typeof BOOKING_STATUS_LABELS] ?? booking.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
