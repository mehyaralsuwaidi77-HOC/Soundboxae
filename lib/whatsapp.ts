const WA_NUMBER = "971553320051";
const WA_BASE = `https://wa.me/${WA_NUMBER}`;

export function whatsappLink(message: string): string {
  return `${WA_BASE}?text=${encodeURIComponent(message)}`;
}

export function whatsappInquiry(productName: string): string {
  const msg = `Hi Soundbox Dubai! I'm interested in renting: *${productName}*. Could you please provide availability and details? Thank you.`;
  return whatsappLink(msg);
}

export function whatsappBookingRequest(details: {
  eventType: string;
  date: string;
  guests: number;
  services: string[];
}): string {
  const serviceList = details.services.join(", ");
  const msg =
    `Hi Soundbox Dubai! I'd like to submit a booking request:\n\n` +
    `📅 *Event Date:* ${details.date}\n` +
    `🎉 *Event Type:* ${details.eventType}\n` +
    `👥 *Guests:* ${details.guests}\n` +
    `🎛️ *Services Needed:* ${serviceList}\n\n` +
    `Please confirm availability. Thank you!`;
  return whatsappLink(msg);
}

export function whatsappGeneral(): string {
  return whatsappLink("Hi Soundbox Dubai! I'd like to enquire about your AV rental services.");
}

export const WHATSAPP_NUMBER_DISPLAY = "+971 55 332 0051";
