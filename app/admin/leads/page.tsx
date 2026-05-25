"use client";

import { useEffect, useState } from "react";
import { MessageCircle, Phone, RefreshCw } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { getLeads, updateLeadStatus, deleteLead } from "@/lib/storage";
import type { DbInquiry, InquiryStatus } from "@/lib/supabase/types";
import { INQUIRY_STATUS_LABELS } from "@/lib/supabase/types";

const STATUS_COLORS: Record<string, string> = {
  new: "#D6A84F", contacted: "#2F80ED", quotation_sent: "#9B51E0",
  converted_to_booking: "#27AE60", closed: "#5A5A6E", lost: "#EB5757",
};
const STATUS_OPTIONS = Object.keys(INQUIRY_STATUS_LABELS) as InquiryStatus[];

export default function LeadsPage() {
  const [inquiries, setInquiries] = useState<DbInquiry[]>([]);
  const [filter, setFilter]       = useState<string>("all");
  const [loading, setLoading]     = useState(true);

  async function load() {
    setLoading(true);
    if (isSupabaseConfigured) {
      const { data } = await supabase
        .from("inquiries")
        .select("*, customer:customers(full_name, email, phone)")
        .order("created_at", { ascending: false });
      setInquiries((data ?? []) as DbInquiry[]);
    } else {
      const leads = getLeads();
      setInquiries(
        leads.map((l) => ({
          id: l.id,
          source: l.source ?? "website",
          event_date: l.eventDate,
          event_type: l.eventType,
          guest_count: l.guests,
          services_requested: l.services,
          message: l.notes,
          status: (l.status === "quoted" ? "quotation_sent" : l.status) as InquiryStatus,
          priority: "normal" as const,
          whatsapp_sent: false,
          email_sent: false,
          created_at: l.createdAt,
          updated_at: l.createdAt,
          customer: { id: l.id, full_name: l.name, email: l.email, phone: l.phone, preferred_language: "en", created_at: l.createdAt, updated_at: l.createdAt },
        }))
      );
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleStatusChange(id: string, status: InquiryStatus) {
    if (isSupabaseConfigured) {
      await supabase.from("inquiries").update({ status }).eq("id", id);
      setInquiries((prev) => prev.map((i) => i.id === id ? { ...i, status } : i));
    } else {
      updateLeadStatus(id, status === "quotation_sent" ? "quoted" : (status as "new" | "contacted" | "confirmed" | "closed"));
      await load();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this inquiry?")) return;
    if (isSupabaseConfigured) {
      await supabase.from("inquiries").delete().eq("id", id);
      setInquiries((prev) => prev.filter((i) => i.id !== id));
    } else {
      deleteLead(id);
      await load();
    }
  }

  const filtered = filter === "all" ? inquiries : inquiries.filter((i) => i.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Leads & Inquiries</h1>
          <p className="text-sm" style={{ color: "#A7A7B3" }}>{inquiries.length} total · {inquiries.filter((i) => i.status === "new").length} new</p>
        </div>
        <div className="flex items-center gap-3">
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="bg-[#181824] rounded-lg px-3 py-2 text-sm border outline-none" style={{ color: "#FFF", borderColor: "rgba(214,168,79,0.2)" }}>
            <option value="all">All Statuses</option>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{INQUIRY_STATUS_LABELS[s]}</option>)}
          </select>
          <button onClick={load} className="p-2 rounded-lg glass-card" style={{ color: "#D6A84F" }}><RefreshCw size={15} /></button>
        </div>
      </div>

      {loading ? (
        <div className="glass-card rounded-xl p-12 text-center"><div className="w-5 h-5 rounded-full border-2 border-[#D6A84F] border-t-transparent animate-spin mx-auto" /></div>
      ) : filtered.length === 0 ? (
        <div className="glass-card rounded-xl p-12 text-center"><p style={{ color: "#5A5A6E" }}>No inquiries yet. Leads from the AI chat will appear here.</p></div>
      ) : (
        <div className="space-y-4">
          {filtered.map((inquiry) => (
            <div key={inquiry.id} className="glass-card rounded-xl p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <p className="font-bold text-white">{inquiry.customer?.full_name ?? "Unknown"}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: `${STATUS_COLORS[inquiry.status] ?? "#A7A7B3"}18`, color: STATUS_COLORS[inquiry.status] ?? "#A7A7B3" }}>
                      {INQUIRY_STATUS_LABELS[inquiry.status] ?? inquiry.status}
                    </span>
                    <span className="text-xs" style={{ color: "#5A5A6E" }}>{inquiry.source}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span style={{ color: "#A7A7B3" }}>📅 {inquiry.event_date ?? "—"}</span>
                    <span style={{ color: "#A7A7B3" }}>🎉 {inquiry.event_type ?? "—"}</span>
                    <span style={{ color: "#A7A7B3" }}>👥 {inquiry.guest_count ?? "—"} guests</span>
                    {inquiry.customer?.phone && <span style={{ color: "#A7A7B3" }}>📞 {inquiry.customer.phone}</span>}
                  </div>
                  {inquiry.services_requested && inquiry.services_requested.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {inquiry.services_requested.map((s) => <span key={s} className="text-xs px-2 py-0.5 rounded" style={{ background: "rgba(214,168,79,0.08)", color: "#A7A7B3" }}>{s}</span>)}
                    </div>
                  )}
                  {inquiry.message && <p className="text-sm italic" style={{ color: "#5A5A6E" }}>&ldquo;{inquiry.message}&rdquo;</p>}
                  <p className="text-xs" style={{ color: "#3A3A4E" }}>{new Date(inquiry.created_at).toLocaleString("en-AE")}</p>
                </div>

                <div className="flex flex-col gap-3 md:items-end">
                  <div>
                    <label className="block text-xs mb-1" style={{ color: "#5A5A6E" }}>Status</label>
                    <select value={inquiry.status} onChange={(e) => handleStatusChange(inquiry.id, e.target.value as InquiryStatus)} className="rounded-lg px-3 py-2 text-xs border outline-none" style={{ background: "#181824", color: "#FFF", borderColor: "rgba(214,168,79,0.2)" }}>
                      {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{INQUIRY_STATUS_LABELS[s]}</option>)}
                    </select>
                  </div>
                  <div className="flex gap-2">
                    {inquiry.customer?.phone && (
                      <a href={`https://wa.me/${inquiry.customer.phone.replace(/\D/g,"")}?text=${encodeURIComponent(`Hi ${inquiry.customer.full_name}, thank you for contacting Soundbox Dubai!`)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs px-2 py-1.5 rounded-lg" style={{ background: "rgba(37,211,102,0.12)", color: "#25D366" }}>
                        <MessageCircle size={12} /> WhatsApp
                      </a>
                    )}
                    {inquiry.customer?.phone && (
                      <a href={`tel:${inquiry.customer.phone}`} className="flex items-center gap-1 text-xs px-2 py-1.5 rounded-lg" style={{ background: "rgba(47,128,237,0.12)", color: "#2F80ED" }}>
                        <Phone size={12} /> Call
                      </a>
                    )}
                    <button onClick={() => handleDelete(inquiry.id)} className="text-xs px-2 py-1.5 rounded-lg hover:text-white" style={{ color: "#EB5757" }}>Delete</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
