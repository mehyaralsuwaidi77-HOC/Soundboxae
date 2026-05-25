import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.clientName || !body.eventDate) {
      return NextResponse.json(
        { error: "clientName and eventDate are required" },
        { status: 400 }
      );
    }

    // In a real backend implementation:
    // 1. Save to database
    // 2. Generate booking reference (SBX-YYYY-NNNN)
    // 3. Send confirmation email
    // 4. Notify admin via WhatsApp

    const year = new Date().getFullYear();
    const ref = `SBX-${year}-${String(Math.floor(Math.random() * 9000) + 1000)}`;

    return NextResponse.json({
      success: true,
      referenceNumber: ref,
      message: "Booking created successfully.",
    });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
