import { NextRequest, NextResponse } from "next/server";
import { isServerConfigured, serverSupabase } from "@/lib/supabase/server";

// ── Manual Instagram Post Import ──────────────────────────────────────────────
// This endpoint handles manual Instagram post imports.
// Automatic sync via Instagram Basic Display API requires:
//   INSTAGRAM_ACCESS_TOKEN and INSTAGRAM_USER_ID env vars.
// Without those, manual import (Option B) is the only path.

export async function POST(req: NextRequest) {
  if (!isServerConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  try {
    const body = await req.json();
    const {
      title,
      caption,
      image_url,
      storage_path,
      event_date,
      category,
      section_id,
      instagram_permalink,
      instagram_media_id,
      media_type = "IMAGE",
      source = "instagram_manual",
    } = body;

    if (!image_url) {
      return NextResponse.json({ error: "image_url is required" }, { status: 400 });
    }

    const db = await serverSupabase();

    const { data, error } = await db
      .from("gallery_items")
      .insert({
        title: title ?? null,
        caption: caption ?? null,
        image_url,
        storage_path: storage_path ?? null,
        event_date: event_date ?? null,
        category: category ?? null,
        section_id: section_id ?? null,
        instagram_permalink: instagram_permalink ?? null,
        instagram_media_id: instagram_media_id ?? null,
        media_type,
        source,
        imported_at: new Date().toISOString(),
        is_featured: false,
        is_visible: true,
        sort_order: 0,
        metadata: { instagramImport: true },
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ data });
  } catch (err: unknown) {
    console.error("[POST /api/admin/instagram]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}

// ── Check Instagram API availability ─────────────────────────────────────────
export async function GET() {
  const hasToken = !!(process.env.INSTAGRAM_ACCESS_TOKEN && process.env.INSTAGRAM_USER_ID);
  return NextResponse.json({
    automatic_sync_available: hasToken,
    message: hasToken
      ? "Instagram API credentials configured. Automatic sync is available."
      : "Instagram API credentials not configured. Manual import only. Set INSTAGRAM_ACCESS_TOKEN and INSTAGRAM_USER_ID to enable automatic sync.",
    setup_instructions: hasToken ? null : {
      step1: "Go to developers.facebook.com and create a Meta App",
      step2: "Add Instagram Basic Display product",
      step3: "Get a long-lived access token for the @soundboxdubai account",
      step4: "Add to .env.local: INSTAGRAM_ACCESS_TOKEN=your_token",
      step5: "Add to .env.local: INSTAGRAM_USER_ID=your_instagram_user_id",
      step6: "Add the same env vars to your Vercel project settings",
    },
  });
}
