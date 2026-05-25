const DEFAULT_NUMBER = "971553320051";

function base(n = DEFAULT_NUMBER) {
  return `https://wa.me/${n}`;
}

export function whatsappLink(message: string, number = DEFAULT_NUMBER): string {
  return `${base(number)}?text=${encodeURIComponent(message)}`;
}

export function whatsappInquiry(productName: string, number = DEFAULT_NUMBER): string {
  const msg =
    `Hi Soundbox Dubai! I'm interested in renting: *${productName}*. ` +
    `Could you please provide availability and details? Thank you.`;
  return whatsappLink(msg, number);
}

export function whatsappBookingRequest(
  details: { eventType: string; date: string; guests: number; services: string[] },
  number = DEFAULT_NUMBER
): string {
  const serviceList = details.services.join(", ");
  const msg =
    `Hi Soundbox Dubai! I'd like to submit a booking request:\n\n` +
    `📅 *Event Date:* ${details.date}\n` +
    `🎉 *Event Type:* ${details.eventType}\n` +
    `👥 *Guests:* ${details.guests}\n` +
    `🎛️ *Services Needed:* ${serviceList}\n\n` +
    `Please confirm availability. Thank you!`;
  return whatsappLink(msg, number);
}

export function whatsappGeneral(number = DEFAULT_NUMBER): string {
  return whatsappLink(
    "Hi Soundbox Dubai! I'd like to enquire about your AV rental services.",
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
