import { NextRequest, NextResponse } from "next/server";
import { isServerConfigured, serverSupabase } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const ref = req.nextUrl.searchParams.get("ref")?.trim().toUpperCase();
  if (!ref) {
    return NextResponse.json({ error: "ref is required" }, { status: 400 });
  }

  if (!isServerConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  try {
    const db = await serverSupabase();

    const { data: booking, error } = await db
      .from("bookings")
      .select(`
        id, booking_reference, event_date, event_start_time,
        event_type, event_location, guest_count, services,
        status, payment_status,
        manager_phone, setup_team_phone,
        setup_team_lat, setup_team_lng,
        estimated_arrival_time, customer_notes,
        confirmed_at, created_at, updated_at,
        customer:customers(full_name, phone),
        status_updates:booking_status_updates(
          id, status, title, description, visible_to_customer, created_at
        )
      `)
      .eq("booking_reference", ref)
      .maybeSingle();

    if (error) throw error;
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ booking });
  } catch (err) {
    console.error("[GET /api/tracking]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
