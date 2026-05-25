import { NextRequest, NextResponse } from "next/server";
import { isServerConfigured, serverSupabase } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eventName, eventType, pagePath, source, sessionId, metadata } = body;

    if (!eventName) {
      return NextResponse.json({ error: "eventName is required" }, { status: 400 });
    }

    if (!isServerConfigured()) {
      // Silently drop if Supabase not configured
      return NextResponse.json({ success: true });
    }

    const db = serverSupabase();
    const ua = req.headers.get("user-agent") ?? undefined;

    await db.from("analytics_events").insert({
      event_name: eventName,
      event_type: eventType ?? null,
      page_path: pagePath ?? null,
      source: source ?? null,
      session_id: sessionId ?? null,
      user_agent: ua,
      metadata: metadata ?? null,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[POST /api/analytics]", err);
    // Never error loudly on analytics
    return NextResponse.json({ success: true });
  }
}
