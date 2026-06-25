const DEFAULT_NUMBER = "971553320051";

function base(n = DEFAULT_NUMBER) {
  return `https://wa.me/${n}`;
}

export function whatsappLink(message: string, number = DEFAULT_NUMBER): string {
  return `${base(number)}?text=${encodeURIComponent(message)}`;
}

export function whatsappInquiry(
  _serviceName: string,
  number = DEFAULT_NUMBER
): string {
  const msg =
    `Hi Soundbox Dubai! I'm interested in renting Audio Visual Equipment for my event. ` +
    `Could you please provide availability.`;
  return whatsappLink(msg, number);
}

export function whatsappServiceInquiry(
  details: {
    name?: string;
    phone?: string;
    eventType?: string;
    eventDate?: string;
    guests?: string;
    notes?: string;
  },
  number = DEFAULT_NUMBER
): string {
  const lines: string[] = [
    `Hi Soundbox Dubai! I'm interested in renting Audio Visual Equipment for my event. Could you please provide availability.`,
    ``,
    `Details of Event-`,
  ];
  if (details.name)      lines.push(`Name: ${details.name}`);
  if (details.phone)     lines.push(`Phone: ${details.phone}`);
  if (details.eventType) lines.push(`Event type: ${details.eventType}`);
  if (details.eventDate) lines.push(`Event Date: ${details.eventDate}`);
  if (details.guests)    lines.push(`Guests: ${details.guests}`);
  if (details.notes)     lines.push(`Additional notes: ${details.notes}`);
  return whatsappLink(lines.join("\n"), number);
}

export function whatsappBookingRequest(
  details: { eventType: string; date: string; guests: number; services: string[] },
  number = DEFAULT_NUMBER
): string {
  const serviceList = details.services.join(", ");
  const msg =
    `Hi Soundbox Dubai! I'm interested in renting Audio Visual Equipment for my event. Could you please provide availability.\n\n` +
    `Details of Event-\n` +
    `Event type: ${details.eventType}\n` +
    `Event Date: ${details.date}\n` +
    `Guests: ${details.guests}\n` +
    (serviceList ? `Required equipment: ${serviceList}\n` : ``);
  return whatsappLink(msg, number);
}

export function whatsappGeneral(number = DEFAULT_NUMBER): string {
  return whatsappLink(
    "Hi Soundbox Dubai! I'm interested in renting Audio Visual Equipment for my event.",
    number
  );
}

export function whatsappQuickQuote(number = DEFAULT_NUMBER): string {
  return whatsappLink(
    "Hi Soundbox Dubai! I'm interested in renting Audio Visual Equipment for my event.",
    number
  );
}

export const WHATSAPP_NUMBER_DISPLAY = "+971 55 332 0051";

export function formatWhatsappDisplay(raw: string): string {
  const clean = raw.replace(/\D/g, "");
  if (clean.startsWith("971") && clean.length === 12) {
    return `+971 ${clean.slice(3, 5)} ${clean.slice(5, 8)} ${clean.slice(8)}`;
  }
  return raw.startsWith("+") ? raw : `+${raw}`;
}
