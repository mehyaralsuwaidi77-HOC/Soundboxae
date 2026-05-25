import { NextRequest, NextResponse } from "next/server";
import { isServerConfigured, serverSupabase } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { clientName, clientEmail, clientPhone, eventType, eventDate, venue, services, inquiryId } = body;

    if (!clientName || !eventDate) {
      return NextResponse.json({ error: "clientName and eventDate are required" }, { status: 400 });
    }

    if (!isServerConfigured()) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    const db = await serverSupabase();

    // Upsert customer
    let customerId: string | undefined;
    if (clientEmail || clientPhone) {
      const filter = clientPhone ? `phone.eq.${clientPhone}` : `email.eq.${clientEmail}`;
      const { data: existing } = await db
        .from("customers")
        .select("id")
        .or(filter)
        .limit(1)
        .maybeSingle();

      if (existing) {
        customerId = existing.id;
      } else {
        const { data: c } = await db
          .from("customers")
          .insert({ full_name: clientName, email: clientEmail ?? null, phone: clientPhone ?? null })
          .select("id")
          .single();
        customerId = c?.id;
      }
    }

    // Create booking
    const { data: booking, error } = await db
      .from("bookings")
      .insert({
        inquiry_id: inquiryId ?? null,
        customer_id: customerId ?? null,
        event_type: eventType ?? null,
        event_date: eventDate,
        event_location: venue ?? null,
        services: Array.isArray(services) ? services : [],
        status: "new_inquiry",
        payment_status: "unpaid",
        manager_phone: "+971553320051",
      })
      .select("id, booking_reference")
      .single();

    if (error) throw error;

    // Initial timeline
    await db.from("booking_status_updates").insert({
      booking_id: booking.id,
      status: "new_inquiry",
      title: "Booking Created",
      description: "Booking received and under review.",
      visible_to_customer: true,
    });

    return NextResponse.json({ success: true, id: booking.id, reference: booking.booking_reference });
  } catch (err) {
    console.error("[POST /api/bookings]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
