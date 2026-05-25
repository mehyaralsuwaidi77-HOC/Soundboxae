"use client";

// ── Types ─────────────────────────────────────────────────────────────────────

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
  source?: string; // "ai-chat" | "contact-form" | "whatsapp"
  createdAt: string;
  status: LeadStatus;
}

export type LeadStatus =
  | "new"
  | "contacted"
  | "quoted"
  | "confirmed"
  | "closed";

export interface Booking {
  id: string;
  referenceNumber: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  managerPhone?: string;
  setupTeamPhone?: string;
  eventType: string;
  eventDate: string;
  venue: string;
  services: string[];
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  eta?: string;
  setupTeamLocation?: string;
  notes?: string;
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;
  timeline: BookingTimelineEntry[];
}

export type BookingStatus =
  | "new-inquiry"
  | "quotation-sent"
  | "awaiting-payment"
  | "confirmed"
  | "preparing-equipment"
  | "team-on-the-way"
  | "setup-in-progress"
  | "completed"
  | "cancelled";

export type PaymentStatus = "unpaid" | "deposit" | "partial" | "paid";

export interface BookingTimelineEntry {
  time: string;
  message: string;
  type: "info" | "success" | "warning";
}

export interface AdminSettings {
  managerPhone: string;
  setupTeamPhone: string;
  whatsappNumber: string;
  notificationEmail: string;
  companyName: string;
  companyAddress: string;
  websiteUrl: string;
}

// ── Human-readable labels ─────────────────────────────────────────────────────

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  "new-inquiry": "New Inquiry",
  "quotation-sent": "Quotation Sent",
  "awaiting-payment": "Awaiting Payment",
  confirmed: "Confirmed",
  "preparing-equipment": "Preparing Equipment",
  "team-on-the-way": "Team On The Way",
  "setup-in-progress": "Setup In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  unpaid: "Unpaid",
  deposit: "Deposit Paid",
  partial: "Partial Payment",
  paid: "Paid in Full",
};

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  quoted: "Quoted",
  confirmed: "Confirmed",
  closed: "Closed",
};

// ── Storage keys ─────────────────────────────────────────────────────────────

const KEYS = {
  leads: "sbx_leads",
  bookings: "sbx_bookings",
  settings: "sbx_settings",
} as const;

// ── Helpers ───────────────────────────────────────────────────────────────────

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function readKey<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeKey<T>(key: string, value: T): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage quota exceeded or private browsing
  }
}

// ── Leads ─────────────────────────────────────────────────────────────────────

export function getLeads(): Lead[] {
  return readKey<Lead[]>(KEYS.leads, []);
}

export function saveLead(
  lead: Omit<Lead, "id" | "createdAt" | "status">
): Lead {
  const leads = getLeads();
  const newLead: Lead = {
    ...lead,
    id: `lead_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
    status: "new",
  };
  leads.unshift(newLead);
  writeKey(KEYS.leads, leads);
  return newLead;
}

export function updateLead(id: string, patch: Partial<Lead>): void {
  const leads = getLeads();
  const idx = leads.findIndex((l) => l.id === id);
  if (idx !== -1) {
    leads[idx] = { ...leads[idx], ...patch };
    writeKey(KEYS.leads, leads);
  }
}

export function updateLeadStatus(id: string, status: LeadStatus): void {
  updateLead(id, { status });
}

export function deleteLead(id: string): void {
  const leads = getLeads().filter((l) => l.id !== id);
  writeKey(KEYS.leads, leads);
}

// ── Bookings ──────────────────────────────────────────────────────────────────

export function getBookings(): Booking[] {
  return readKey<Booking[]>(KEYS.bookings, []);
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
    id: `booking_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    referenceNumber: generateBookingRef(),
    createdAt: now,
    updatedAt: now,
    timeline: [
      {
        time: now,
        message: "Booking created and awaiting review.",
        type: "info",
      },
    ],
  };
  bookings.unshift(newBooking);
  writeKey(KEYS.bookings, bookings);
  return newBooking;
}

export function updateBooking(id: string, patch: Partial<Booking>): void {
  const bookings = getBookings();
  const idx = bookings.findIndex((b) => b.id === id);
  if (idx !== -1) {
    bookings[idx] = {
      ...bookings[idx],
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    writeKey(KEYS.bookings, bookings);
  }
}

export function addTimelineEntry(
  id: string,
  message: string,
  type: BookingTimelineEntry["type"] = "info"
): void {
  const bookings = getBookings();
  const idx = bookings.findIndex((b) => b.id === id);
  if (idx !== -1) {
    bookings[idx].timeline.push({ time: new Date().toISOString(), message, type });
    bookings[idx].updatedAt = new Date().toISOString();
    writeKey(KEYS.bookings, bookings);
  }
}

export function updateBookingStatus(
  id: string,
  status: BookingStatus,
  note?: string
): void {
  const bookings = getBookings();
  const idx = bookings.findIndex((b) => b.id === id);
  if (idx !== -1) {
    bookings[idx].status = status;
    bookings[idx].updatedAt = new Date().toISOString();
    const message =
      note ??
      `Status updated to: ${BOOKING_STATUS_LABELS[status]}.`;
    bookings[idx].timeline.push({
      time: new Date().toISOString(),
      message,
      type: status === "cancelled" ? "warning" : status === "completed" ? "success" : "info",
    });
    writeKey(KEYS.bookings, bookings);
  }
}

export function updatePaymentStatus(
  id: string,
  paymentStatus: PaymentStatus
): void {
  const bookings = getBookings();
  const idx = bookings.findIndex((b) => b.id === id);
  if (idx !== -1) {
    bookings[idx].paymentStatus = paymentStatus;
    bookings[idx].updatedAt = new Date().toISOString();
    bookings[idx].timeline.push({
      time: new Date().toISOString(),
      message:
        paymentStatus === "paid"
          ? "Payment confirmed in full. Booking reference activated."
          : `Payment status updated to: ${PAYMENT_STATUS_LABELS[paymentStatus]}.`,
      type: paymentStatus === "paid" ? "success" : "info",
    });
    writeKey(KEYS.bookings, bookings);
  }
}

export function deleteBooking(id: string): void {
  const bookings = getBookings().filter((b) => b.id !== id);
  writeKey(KEYS.bookings, bookings);
}

export function getBookingByRef(ref: string): Booking | undefined {
  return getBookings().find(
    (b) => b.referenceNumber.toLowerCase() === ref.trim().toLowerCase()
  );
}

// ── Admin Settings ────────────────────────────────────────────────────────────

const DEFAULT_SETTINGS: AdminSettings = {
  managerPhone: "+971553320051",
  setupTeamPhone: "+971553320051",
  whatsappNumber: "971553320051",
  notificationEmail: "info@soundboxdubai.com",
  companyName: "Soundbox Electronic Equipment Rental",
  companyAddress: "Dubai, United Arab Emirates",
  websiteUrl: "https://www.soundboxdubai.com",
};

export function getAdminSettings(): AdminSettings {
  return readKey<AdminSettings>(KEYS.settings, DEFAULT_SETTINGS);
}

export function saveAdminSettings(settings: AdminSettings): void {
  writeKey(KEYS.settings, settings);
}

// ── Gallery (admin-managed) ───────────────────────────────────────────────────

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image: string;
  location: string;
  year: number;
  tags: string[];
  featured: boolean;
  visible: boolean;
  altText: string;
  caption?: string;
  createdAt: string;
}

const GALLERY_KEY = "sbx_gallery";

export function getAdminGallery(): GalleryItem[] {
  return readKey<GalleryItem[]>(GALLERY_KEY, []);
}

export function saveGalleryItem(
  item: Omit<GalleryItem, "id" | "createdAt">
): GalleryItem {
  const items = getAdminGallery();
  const newItem: GalleryItem = {
    ...item,
    id: `gal_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
  };
  items.unshift(newItem);
  writeKey(GALLERY_KEY, items);
  return newItem;
}

export function updateGalleryItem(id: string, patch: Partial<GalleryItem>): void {
  const items = getAdminGallery();
  const idx = items.findIndex((g) => g.id === id);
  if (idx !== -1) {
    items[idx] = { ...items[idx], ...patch };
    writeKey(GALLERY_KEY, items);
  }
}

export function deleteGalleryItem(id: string): void {
  const items = getAdminGallery().filter((g) => g.id !== id);
  writeKey(GALLERY_KEY, items);
}
