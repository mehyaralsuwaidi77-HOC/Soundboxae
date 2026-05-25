import { NextRequest, NextResponse } from "next/server";
import { isServerConfigured, serverSupabase } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, eventType, eventDate, guests, services, notes, source, transcript } = body;

    if (!name || !eventType) {
      return NextResponse.json({ error: "name and eventType are required" }, { status: 400 });
    }

    // ── Supabase path ─────────────────────────────────────────────────────────
    if (isServerConfigured()) {
      const db = serverSupabase();

      // Upsert customer
      let customerId: string | undefined;
      if (phone || email) {
        const filter = phone ? `phone.eq.${phone}` : `email.eq.${email}`;
        const { data: existing } = await db
          .from("customers")
          .select("id")
          .or(filter)
          .limit(1)
          .maybeSingle();

        if (existing) {
          customerId = existing.id;
        } else {
          const { data: c, error: custErr } = await db
            .from("customers")
            .insert({
              full_name: name,
              email: email ?? null,
              phone: phone ?? null,
              whatsapp: phone ?? null,
              preferred_language: "en",
            })
            .select("id")
            .single();
          if (custErr) throw custErr;
          customerId = c.id;
        }
      }

      // Create inquiry
      const { data: inquiry, error: inqErr } = await db
        .from("inquiries")
        .insert({
          customer_id: customerId ?? null,
          source: source ?? "website",
          event_type: eventType,
          event_date: eventDate ?? null,
          guest_count: guests ? Number(guests) : null,
          services_requested: Array.isArray(services) ? services : [],
          message: notes ?? null,
          status: "new",
          priority: "normal",
          ai_chat_transcript: transcript ?? null,
        })
        .select("id")
        .single();
      if (inqErr) throw inqErr;

      // Track
      await db.from("analytics_events").insert({
        event_name: "inquiry_created",
        event_type: "conversion",
        source: source ?? "website",
        metadata: { inquiry_id: inquiry.id, event_type: eventType },
      });

      return NextResponse.json({ success: true, id: inquiry.id });
    }

    // ── Fallback ──────────────────────────────────────────────────────────────
    console.warn("[leads] Supabase not configured — inquiry not persisted.");
    return NextResponse.json({ success: true, warning: "Database not configured" });
  } catch (err) {
    console.error("[POST /api/leads]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
