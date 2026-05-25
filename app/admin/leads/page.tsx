"use client";

import { useEffect, useState } from "react";
import { MessageCircle, User, Calendar, Users } from "lucide-react";
import { getLeads, updateLeadStatus, type Lead } from "@/lib/storage";
import { whatsappBookingRequest } from "@/lib/whatsapp";

const STATUS_OPTIONS: Lead["status"][] = ["new", "contacted", "quoted", "confirmed", "closed"];

const statusColors: Record<Lead["status"], string> = {
  new: "#D6A84F",
  contacted: "#2F80ED",
  quoted: "#9B51E0",
  confirmed: "#27AE60",
  closed: "#5A5A6E",
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filter, setFilter] = useState<Lead["status"] | "all">("all");

  useEffect(() => {
    setLeads(getLeads());
  }, []);

  function handleStatusChange(id: string, status: Lead["status"]) {
    updateLeadStatus(id, status);
    setLeads(getLeads());
  }

  const filtered = filter === "all" ? leads : leads.filter((l) => l.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
            Leads
          </h1>
          <p className="text-sm" style={{ color: "#A7A7B3" }}>
            {leads.length} total · {leads.filter((l) => l.status === "new").length} new
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {(["all", ...STATUS_OPTIONS] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className="px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-[background,color] duration-200"
            style={{
              background:
                filter === s
                  ? "linear-gradient(135deg, #D6A84F, #B8852A)"
                  : "rgba(17,17,24,0.8)",
              color: filter === s ? "#050505" : "#A7A7B3",
              border: `1px solid ${filter === s ? "transparent" : "rgba(214,168,79,0.15)"}`,
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Leads list */}
      {filtered.length === 0 ? (
        <div className="glass-card rounded-xl p-12 text-center">
          <p style={{ color: "#5A5A6E" }}>No leads in this category yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((lead) => (
            <div
              key={lead.id}
              className="glass-card rounded-xl p-6"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      <User size={14} style={{ color: "#D6A84F" }} />
                      <span className="font-semibold text-white">{lead.name}</span>
                    </div>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-semibold"
                      style={{
                        background: `${statusColors[lead.status]}18`,
                        color: statusColors[lead.status],
                        border: `1px solid ${statusColors[lead.status]}30`,
                      }}
                    >
                      {lead.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="flex items-center gap-2">
                      <Calendar size={13} style={{ color: "#5A5A6E" }} />
                      <span className="text-sm" style={{ color: "#A7A7B3" }}>
                        {lead.eventDate || "—"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={13} style={{ color: "#5A5A6E" }} />
                      <span className="text-sm" style={{ color: "#A7A7B3" }}>
                        {lead.guests} guests
                      </span>
                    </div>
                    <div>
                      <span className="text-sm" style={{ color: "#A7A7B3" }}>
                        {lead.eventType}
                      </span>
                    </div>
                  </div>

                  {lead.services.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {lead.services.map((s) => (
                        <span
                          key={s}
                          className="text-xs px-2 py-0.5 rounded"
                          style={{ background: "rgba(214,168,79,0.08)", color: "#A7A7B3" }}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="text-xs" style={{ color: "#5A5A6E" }}>
                    Received: {new Date(lead.createdAt).toLocaleString("en-AE")}
                  </p>
                </div>

                <div className="flex flex-col gap-3 md:items-end">
                  {/* Status selector */}
                  <select
                    value={lead.status}
                    onChange={(e) =>
                      handleStatusChange(lead.id, e.target.value as Lead["status"])
                    }
                    className="rounded-lg px-3 py-2 text-xs border outline-none"
                    style={{
                      background: "#181824",
                      color: "#FFFFFF",
                      borderColor: "rgba(214,168,79,0.2)",
                    }}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>

                  {/* WhatsApp reply */}
                  <a
                    href={whatsappBookingRequest({
                      eventType: lead.eventType,
                      date: lead.eventDate,
                      guests: lead.guests,
                      services: lead.services,
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs btn-ghost"
                  >
                    <MessageCircle size={12} />
                    Reply via WhatsApp
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
