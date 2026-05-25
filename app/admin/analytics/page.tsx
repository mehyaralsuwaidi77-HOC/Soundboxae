"use client";

import { useEffect, useState } from "react";
import { getLeads, getBookings, BOOKING_STATUS_LABELS, PAYMENT_STATUS_LABELS, LEAD_STATUS_LABELS } from "@/lib/storage";

export default function AnalyticsPage() {
  const [data, setData] = useState({
    totalLeads: 0,
    confirmedBookings: 0,
    pendingBookings: 0,
    paidBookings: 0,
    topServices: [] as { service: string; count: number }[],
    monthlyLeads: [] as { month: string; count: number }[],
    leadsByStatus: [] as { status: string; count: number }[],
  });

  useEffect(() => {
    const leads = getLeads();
    const bookings = getBookings();

    // Top services from leads
    const serviceMap: Record<string, number> = {};
    leads.forEach((l) => {
      l.services.forEach((s) => {
        serviceMap[s] = (serviceMap[s] ?? 0) + 1;
      });
    });
    const topServices = Object.entries(serviceMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([service, count]) => ({ service, count }));

    // Monthly leads (last 6 months)
    const monthMap: Record<string, number> = {};
    leads.forEach((l) => {
      const d = new Date(l.createdAt);
      const key = d.toLocaleString("en-AE", { month: "short", year: "2-digit" });
      monthMap[key] = (monthMap[key] ?? 0) + 1;
    });
    const monthlyLeads = Object.entries(monthMap)
      .slice(-6)
      .map(([month, count]) => ({ month, count }));

    // Leads by status
    const statusMap: Record<string, number> = {};
    leads.forEach((l) => {
      statusMap[l.status] = (statusMap[l.status] ?? 0) + 1;
    });
    const leadsByStatus = Object.entries(statusMap).map(([status, count]) => ({ status, count }));

    setData({
      totalLeads: leads.length,
      confirmedBookings: bookings.filter((b) => b.status === "confirmed").length,
      pendingBookings: bookings.filter((b) =>
        b.status === "new-inquiry" || b.status === "awaiting-payment" || b.status === "quotation-sent"
      ).length,
      paidBookings: bookings.filter((b) => b.paymentStatus === "paid").length,
      topServices,
      monthlyLeads,
      leadsByStatus,
    });
  }, []);

  const maxLeads = Math.max(...data.monthlyLeads.map((m) => m.count), 1);
  const maxService = Math.max(...data.topServices.map((s) => s.count), 1);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
          Analytics
        </h1>
        <p className="text-sm" style={{ color: "#A7A7B3" }}>Business intelligence overview</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Leads", value: data.totalLeads, color: "#D6A84F" },
          { label: "Confirmed Bookings", value: data.confirmedBookings, color: "#27AE60" },
          { label: "Open Inquiries", value: data.pendingBookings, color: "#F2994A" },
          { label: "Paid in Full", value: data.paidBookings, color: "#2F80ED" },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="glass-card rounded-xl p-5 text-center"
          >
            <p
              className="text-3xl font-bold"
              style={{ fontFamily: "var(--font-display)", color: kpi.color }}
            >
              {kpi.value}
            </p>
            <p className="text-xs mt-1 uppercase tracking-wider" style={{ color: "#5A5A6E" }}>
              {kpi.label}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly leads chart */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="font-bold mb-6" style={{ fontFamily: "var(--font-display)" }}>
            Monthly Lead Inquiries
          </h3>
          {data.monthlyLeads.length === 0 ? (
            <p className="text-sm" style={{ color: "#5A5A6E" }}>No data yet.</p>
          ) : (
            <div className="flex items-end gap-3 h-32">
              {data.monthlyLeads.map((m) => (
                <div key={m.month} className="flex flex-col items-center gap-2 flex-1">
                  <div
                    className="w-full rounded-t-md transition-[height] duration-300"
                    style={{
                      height: `${(m.count / maxLeads) * 100}%`,
                      background: "linear-gradient(to top, #D6A84F, #F2D28A)",
                      minHeight: "4px",
                    }}
                  />
                  <span className="text-xs" style={{ color: "#5A5A6E" }}>
                    {m.month}
                  </span>
                  <span className="text-xs font-semibold" style={{ color: "#D6A84F" }}>
                    {m.count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top services */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="font-bold mb-6" style={{ fontFamily: "var(--font-display)" }}>
            Top Requested Services
          </h3>
          {data.topServices.length === 0 ? (
            <p className="text-sm" style={{ color: "#5A5A6E" }}>No data yet.</p>
          ) : (
            <div className="space-y-3">
              {data.topServices.map((s) => (
                <div key={s.service} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: "#A7A7B3" }}>{s.service}</span>
                    <span className="text-sm font-semibold" style={{ color: "#D6A84F" }}>
                      {s.count}
                    </span>
                  </div>
                  <div
                    className="h-1.5 rounded-full"
                    style={{ background: "#1A1A24" }}
                  >
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
          <h3 className="font-bold mb-6" style={{ fontFamily: "var(--font-display)" }}>
            Leads by Status
          </h3>
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
                    {LEAD_STATUS_LABELS[s.status as keyof typeof LEAD_STATUS_LABELS] ?? s.status}
                  </span>
                  <span className="text-sm font-semibold text-white">{s.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info card */}
        <div
          className="rounded-xl p-6 flex flex-col justify-center"
          style={{
            background: "linear-gradient(135deg, rgba(214,168,79,0.1), rgba(214,168,79,0.03))",
            border: "1px solid rgba(214,168,79,0.2)",
          }}
        >
          <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "#D6A84F" }}>
            Upgrade Available
          </p>
          <h3 className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
            Connect a Database
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: "#A7A7B3" }}>
            Current data is stored in browser localStorage. To persist data across
            devices, integrate with Supabase, Firebase, or a custom API. Set
            <code className="mx-1 px-1 rounded text-xs" style={{ background: "#181824", color: "#D6A84F" }}>
              DATABASE_URL
            </code>
            in your .env.local to enable.
          </p>
        </div>
      </div>
    </div>
  );
}
