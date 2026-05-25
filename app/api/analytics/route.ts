import { NextRequest, NextResponse } from "next/server";
import { isServerConfigured, serverSupabase } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Accept both snake_case (from AnalyticsTracker) and camelCase (from AIChat, etc.)
    const eventName  = body.event_name  ?? body.eventName;
    const eventType  = body.event_type  ?? body.eventType;
    const pagePath   = body.page_path   ?? body.pagePath;
    const source     = body.source;
    const sessionId  = body.session_id  ?? body.sessionId;
    const metadata   = body.metadata;

    if (!eventName) {
      return NextResponse.json({ error: "event_name is required" }, { status: 400 });
    }

    if (!isServerConfigured()) {
      return NextResponse.json({ success: true });
    }

    const db = await serverSupabase();
    const ua = req.headers.get("user-agent") ?? undefined;
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? undefined;

    // Enrich metadata with device type inferred from user-agent
    const isMobile = ua ? /Mobile|Android|iPhone|iPad/i.test(ua) : false;
    const enriched = {
      ...metadata,
      device_type: isMobile ? "mobile" : "desktop",
      ip_hint: ip ? ip.slice(0, ip.lastIndexOf(".")) + ".x" : undefined,
    };

    await db.from("analytics_events").insert({
      event_name: eventName,
      event_type: eventType ?? null,
      page_path:  pagePath  ?? null,
      source:     source    ?? null,
      session_id: sessionId ?? null,
      user_agent: ua        ?? null,
      metadata:   enriched,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[POST /api/analytics]", err);
    return NextResponse.json({ success: true });
  }
}
