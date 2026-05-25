"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, CalendarCheck, TrendingUp, Clock, ArrowRight } from "lucide-react";
import { getLeads, getBookings, BOOKING_STATUS_LABELS, LEAD_STATUS_LABELS } from "@/lib/storage";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalLeads: 0,
    newLeads: 0,
    totalBookings: 0,
    confirmedBookings: 0,
    pendingBookings: 0,
    paidBookings: 0,
  });
  const [recentLeads, setRecentLeads] = useState<ReturnType<typeof getLeads>>([]);
  const [recentBookings, setRecentBookings] = useState<ReturnType<typeof getBookings>>([]);

  useEffect(() => {
    const leads = getLeads();
    const bookings = getBookings();
    setStats({
      totalLeads: leads.length,
      newLeads: leads.filter((l) => l.status === "new").length,
      totalBookings: bookings.length,
      confirmedBookings: bookings.filter((b) => b.status === "confirmed").length,
      pendingBookings: bookings.filter((b) =>
        b.status === "new-inquiry" || b.status === "awaiting-payment" || b.status === "quotation-sent"
      ).length,
      paidBookings: bookings.filter((b) => b.paymentStatus === "paid").length,
    });
    setRecentLeads(leads.slice(0, 5));
    setRecentBookings(bookings.slice(0, 5));
  }, []);

  const cards = [
    {
      label: "Total Leads",
      value: stats.totalLeads,
      sub: `${stats.newLeads} new`,
      icon: <Users size={20} />,
      href: "/admin/leads",
      color: "#D6A84F",
    },
    {
      label: "Total Bookings",
      value: stats.totalBookings,
      sub: `${stats.confirmedBookings} confirmed`,
      icon: <CalendarCheck size={20} />,
      href: "/admin/bookings",
      color: "#2F80ED",
    },
    {
      label: "Pending Bookings",
      value: stats.pendingBookings,
      sub: "Awaiting review",
      icon: <Clock size={20} />,
      href: "/admin/bookings",
      color: "#F2994A",
    },
    {
      label: "Paid Bookings",
      value: stats.paidBookings,
      sub: "Full payment received",
      icon: <TrendingUp size={20} />,
      href: "/admin/bookings",
      color: "#27AE60",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1
          className="text-2xl font-bold mb-1"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Dashboard Overview
        </h1>
        <p className="text-sm" style={{ color: "#A7A7B3" }}>
          Welcome back. Here&apos;s a summary of your Soundbox operations.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="glass-card rounded-xl p-6 flex flex-col gap-4 transition-[transform] duration-200 hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: `${card.color}18`, color: card.color }}
              >
                {card.icon}
              </div>
              <ArrowRight size={14} style={{ color: "#3A3A4E" }} />
            </div>
            <div>
              <p
                className="text-3xl font-bold"
                style={{ fontFamily: "var(--font-display)", color: card.color }}
              >
                {card.value}
              </p>
              <p className="text-sm mt-0.5 text-white">{card.label}</p>
              <p className="text-xs mt-0.5" style={{ color: "#5A5A6E" }}>{card.sub}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent leads */}
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold" style={{ fontFamily: "var(--font-display)" }}>
              Recent Leads
            </h3>
            <Link href="/admin/leads" className="text-xs" style={{ color: "#D6A84F" }}>
              View all →
            </Link>
          </div>
          {recentLeads.length === 0 ? (
            <p className="text-sm" style={{ color: "#5A5A6E" }}>
              No leads yet. Leads from the AI chat will appear here.
            </p>
          ) : (
            <div className="space-y-3">
              {recentLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-start justify-between gap-3 py-3 border-b last:border-0"
                  style={{ borderColor: "rgba(214,168,79,0.08)" }}
                >
                  <div>
                    <p className="text-sm font-medium text-white">{lead.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: "#A7A7B3" }}>
                      {lead.eventType} · {lead.eventDate}
                    </p>
                  </div>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full shrink-0"
                    style={{
                      background: lead.status === "new" ? "rgba(214,168,79,0.15)" : "rgba(42,42,56,0.5)",
                      color: lead.status === "new" ? "#D6A84F" : "#5A5A6E",
                    }}
                  >
                    {LEAD_STATUS_LABELS[lead.status] ?? lead.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent bookings */}
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold" style={{ fontFamily: "var(--font-display)" }}>
              Recent Bookings
            </h3>
            <Link href="/admin/bookings" className="text-xs" style={{ color: "#D6A84F" }}>
              View all →
            </Link>
          </div>
          {recentBookings.length === 0 ? (
            <p className="text-sm" style={{ color: "#5A5A6E" }}>
              No bookings yet. Create bookings from confirmed leads.
            </p>
          ) : (
            <div className="space-y-3">
              {recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-start justify-between gap-3 py-3 border-b last:border-0"
                  style={{ borderColor: "rgba(214,168,79,0.08)" }}
                >
                  <div>
                    <p className="text-sm font-medium" style={{ color: "#D6A84F" }}>
                      {booking.referenceNumber}
                    </p>
                    <p className="text-xs text-white">{booking.clientName}</p>
                    <p className="text-xs mt-0.5" style={{ color: "#A7A7B3" }}>
                      {booking.eventType} · {booking.eventDate}
                    </p>
                  </div>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full shrink-0"
                    style={{
                      background: "rgba(214,168,79,0.1)",
                      color: "#D6A84F",
                    }}
                  >
                    {BOOKING_STATUS_LABELS[booking.status] ?? booking.status}
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
