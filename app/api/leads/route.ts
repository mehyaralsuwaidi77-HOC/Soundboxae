import { NextRequest, NextResponse } from "next/server";

interface LeadPayload {
  name: string;
  email?: string;
  phone?: string;
  eventType: string;
  eventDate: string;
  guests: number;
  services: string[];
  notes?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: LeadPayload = await request.json();

    if (!body.name || !body.eventType) {
      return NextResponse.json(
        { error: "name and eventType are required" },
        { status: 400 }
      );
    }

    // ── Email notification (optional) ─────────────────────────────────────────
    // Configure SMTP_HOST, SMTP_USER, SMTP_PASS, NOTIFY_EMAIL in .env.local
    // Uncomment and implement when ready:
    //
    // if (process.env.SMTP_HOST) {
    //   await sendEmail({
    //     to: process.env.NOTIFY_EMAIL!,
    //     subject: `New Lead: ${body.name} — ${body.eventType}`,
    //     body: JSON.stringify(body, null, 2),
    //   });
    // }

    // ── WhatsApp notification (optional) ──────────────────────────────────────
    // Configure WHATSAPP_API_TOKEN and WHATSAPP_PHONE_ID in .env.local
    // Uncomment and implement when ready (uses Meta Cloud API or Twilio):
    //
    // if (process.env.WHATSAPP_API_TOKEN) {
    //   await sendWhatsAppMessage({
    //     to: process.env.NOTIFY_WHATSAPP!,
    //     message: `New lead from ${body.name}: ${body.eventType} on ${body.eventDate}`,
    //   });
    // }

    return NextResponse.json({
      success: true,
      message: "Lead received. Team will be in touch shortly.",
      lead: {
        ...body,
        id: `lead_${Date.now()}`,
        createdAt: new Date().toISOString(),
        status: "new",
      },
    });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

export async function GET() {
  // Protected — requires auth header
  // Implement JWT/session check here before returning data
  return NextResponse.json({ message: "Use /admin/leads to view leads." }, { status: 200 });
}
