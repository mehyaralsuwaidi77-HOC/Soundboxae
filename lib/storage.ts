"use client";

export interface Lead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  eventType: string;
  eventDate: string;
  guests: number;
  services: string[];
  notes?: string;
  createdAt: string;
  status: "new" | "contacted" | "quoted" | "confirmed" | "closed";
}

export interface Booking {
  id: string;
  referenceNumber: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  eventType: string;
  eventDate: string;
  venue: string;
  services: string[];
  status: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled";
  paymentStatus: "unpaid" | "deposit" | "partial" | "paid";
  notes?: string;
  createdAt: string;
  updatedAt: string;
  timeline: BookingTimelineEntry[];
}

export interface BookingTimelineEntry {
  time: string;
  message: string;
  type: "info" | "success" | "warning";
}

const LEADS_KEY = "sbx_leads";
const BOOKINGS_KEY = "sbx_bookings";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

// ── Leads ─────────────────────────────────────────────────────────────────────

export function getLeads(): Lead[] {
  if (!isBrowser()) return [];
  try {
    return JSON.parse(localStorage.getItem(LEADS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveLead(lead: Omit<Lead, "id" | "createdAt" | "status">): Lead {
  const leads = getLeads();
  const newLead: Lead = {
    ...lead,
    id: `lead_${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: "new",
  };
  leads.unshift(newLead);
  if (isBrowser()) localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
  return newLead;
}

export function updateLeadStatus(id: string, status: Lead["status"]): void {
  const leads = getLeads();
  const idx = leads.findIndex((l) => l.id === id);
  if (idx !== -1) {
    leads[idx].status = status;
    if (isBrowser()) localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
  }
}

// ── Bookings ──────────────────────────────────────────────────────────────────

export function getBookings(): Booking[] {
  if (!isBrowser()) return [];
  try {
    return JSON.parse(localStorage.getItem(BOOKINGS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function generateBookingRef(): string {
  const year = new Date().getFullYear();
  const existing = getBookings();
  const yearBookings = existing.filter((b) =>
    b.referenceNumber.startsWith(`SBX-${year}-`)
  );
  const seq = String(yearBookings.length + 1).padStart(4, "0");
  return `SBX-${year}-${seq}`;
}

export function saveBooking(
  booking: Omit<Booking, "id" | "referenceNumber" | "createdAt" | "updatedAt" | "timeline">
): Booking {
  const bookings = getBookings();
  const now = new Date().toISOString();
  const newBooking: Booking = {
    ...booking,
    id: `booking_${Date.now()}`,
    referenceNumber: generateBookingRef(),
    createdAt: now,
    updatedAt: now,
    timeline: [
      {
        time: now,
        message: "Booking created and pending review.",
        type: "info",
      },
    ],
  };
  bookings.unshift(newBooking);
  if (isBrowser()) localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
  return newBooking;
}

export function updateBookingStatus(
  id: string,
  status: Booking["status"],
  note?: string
): void {
  const bookings = getBookings();
  const idx = bookings.findIndex((b) => b.id === id);
  if (idx !== -1) {
    bookings[idx].status = status;
    bookings[idx].updatedAt = new Date().toISOString();
    if (note) {
      bookings[idx].timeline.push({
        time: new Date().toISOString(),
        message: note,
        type: status === "cancelled" ? "warning" : "success",
      });
    }
    if (isBrowser()) localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
  }
}

export function updatePaymentStatus(
  id: string,
  paymentStatus: Booking["paymentStatus"]
): void {
  const bookings = getBookings();
  const idx = bookings.findIndex((b) => b.id === id);
  if (idx !== -1) {
    bookings[idx].paymentStatus = paymentStatus;
    bookings[idx].updatedAt = new Date().toISOString();
    if (paymentStatus === "paid") {
      bookings[idx].timeline.push({
        time: new Date().toISOString(),
        message: "Payment confirmed in full. Booking reference activated.",
        type: "success",
      });
    }
    if (isBrowser()) localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
  }
}

export function getBookingByRef(ref: string): Booking | undefined {
  return getBookings().find(
    (b) => b.referenceNumber.toLowerCase() === ref.toLowerCase()
  );
}
