import { NextRequest, NextResponse } from "next/server";
import { isServerConfigured, serverSupabase } from "@/lib/supabase/server";

export async function GET() {
  if (!isServerConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }
  try {
    const db = await serverSupabase();
    const { data, error } = await db
      .from("products")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) {
      console.error("[GET /api/admin/products] DB error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ data });
  } catch (err: unknown) {
    console.error("[GET /api/admin/products]", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!isServerConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }
  try {
    const body = await req.json();
    const db = await serverSupabase();
    const { data, error } = await db
      .from("products")
      .insert(body)
      .select()
      .single();
    if (error) {
      console.error("[POST /api/admin/products] DB error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ data });
  } catch (err: unknown) {
    console.error("[POST /api/admin/products]", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!isServerConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }
  try {
    const body = await req.json();
    const { id, ...updates } = body;
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    const db = await serverSupabase();
    const { data, error } = await db
      .from("products")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (error) {
      console.error("[PUT /api/admin/products] DB error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ data });
  } catch (err: unknown) {
    console.error("[PUT /api/admin/products]", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!isServerConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    const db = await serverSupabase();
    const { error } = await db.from("products").delete().eq("id", id);
    if (error) {
      console.error("[DELETE /api/admin/products] DB error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("[DELETE /api/admin/products]", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Internal server error" }, { status: 500 });
  }
}
