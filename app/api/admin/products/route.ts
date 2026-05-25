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
    if (error) throw error;
    return NextResponse.json({ data });
  } catch (err) {
    console.error("[GET /api/admin/products]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
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
    if (error) throw error;
    return NextResponse.json({ data });
  } catch (err) {
    console.error("[POST /api/admin/products]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
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
    if (error) throw error;
    return NextResponse.json({ data });
  } catch (err) {
    console.error("[PUT /api/admin/products]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
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
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/admin/products]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
