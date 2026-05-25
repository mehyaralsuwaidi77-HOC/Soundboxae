import { NextResponse } from "next/server";
import { isServerConfigured, serverSupabase } from "@/lib/supabase/server";

const BUCKETS: { id: string; public: boolean; fileSizeLimit: number }[] = [
  { id: "gallery",        public: true,  fileSizeLimit: 10 * 1024 * 1024 },
  { id: "client-logos",   public: true,  fileSizeLimit: 5  * 1024 * 1024 },
  { id: "product-images", public: true,  fileSizeLimit: 10 * 1024 * 1024 },
  { id: "brand-assets",   public: true,  fileSizeLimit: 10 * 1024 * 1024 },
  { id: "project-media",  public: false, fileSizeLimit: 50 * 1024 * 1024 },
];

const ALLOWED_MIME = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif"];

export async function POST() {
  if (!isServerConfigured()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const db = await serverSupabase();
  const results: { bucket: string; status: "created" | "exists" | "error"; message?: string }[] = [];

  for (const bucket of BUCKETS) {
    try {
      const { error } = await db.storage.createBucket(bucket.id, {
        public: bucket.public,
        fileSizeLimit: bucket.fileSizeLimit,
        allowedMimeTypes: ALLOWED_MIME,
      });

      if (!error) {
        results.push({ bucket: bucket.id, status: "created" });
      } else if (
        error.message?.toLowerCase().includes("already exists") ||
        error.message?.toLowerCase().includes("duplicate")
      ) {
        results.push({ bucket: bucket.id, status: "exists" });
      } else {
        results.push({ bucket: bucket.id, status: "error", message: error.message });
      }
    } catch (e: unknown) {
      results.push({
        bucket: bucket.id,
        status: "error",
        message: e instanceof Error ? e.message : "Unknown error",
      });
    }
  }

  const hasErrors = results.some((r) => r.status === "error");
  return NextResponse.json({ results }, { status: hasErrors ? 207 : 200 });
}

export async function GET() {
  if (!isServerConfigured()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const db = await serverSupabase();
  const { data: buckets, error } = await db.storage.listBuckets();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const existing = new Set((buckets ?? []).map((b) => b.name));
  const status = BUCKETS.map((b) => ({
    bucket: b.id,
    exists: existing.has(b.id),
    public: b.public,
  }));

  return NextResponse.json({ status });
}
