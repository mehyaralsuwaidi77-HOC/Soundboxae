import { NextResponse } from "next/server";
import { isServerConfigured, serverSupabase } from "@/lib/supabase/server";

const TABLES = [
  "client_logos",
  "gallery_sections",
  "gallery_items",
  "products",
  "inquiries",
  "customers",
  "bookings",
  "booking_status_updates",
  "analytics_events",
  "website_settings",
];

const BUCKETS = ["gallery", "client-logos", "product-images", "brand-assets", "project-media"];

export async function GET() {
  const configured = isServerConfigured();

  if (!configured) {
    return NextResponse.json({
      configured: false,
      error: "NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set",
      tables: [],
      buckets: [],
    });
  }

  let db: Awaited<ReturnType<typeof serverSupabase>>;
  try {
    db = await serverSupabase();
  } catch (e: unknown) {
    return NextResponse.json(
      { configured: true, error: e instanceof Error ? e.message : "Failed to create Supabase client" },
      { status: 500 }
    );
  }

  // Check tables in parallel
  const tableChecks = await Promise.all(
    TABLES.map(async (table) => {
      try {
        const { error, count } = await db
          .from(table)
          .select("*", { count: "exact", head: true });
        if (error) return { table, ok: false, error: error.message, count: null };
        return { table, ok: true, error: null, count };
      } catch (e: unknown) {
        return { table, ok: false, error: e instanceof Error ? e.message : "Unknown", count: null };
      }
    })
  );

  // Check buckets individually — listBuckets() can silently return empty with SSR client
  const bucketChecks = await Promise.all(
    BUCKETS.map(async (name) => {
      try {
        const { data, error } = await db.storage.getBucket(name);
        return { bucket: name, exists: !!data && !error, error: error?.message ?? null };
      } catch (e: unknown) {
        return { bucket: name, exists: false, error: e instanceof Error ? e.message : "Unknown" };
      }
    })
  );

  return NextResponse.json({
    configured: true,
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    tables: tableChecks,
    buckets: bucketChecks,
    timestamp: new Date().toISOString(),
  });
}
