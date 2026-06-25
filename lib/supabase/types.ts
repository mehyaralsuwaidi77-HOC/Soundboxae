// ── Core DB types matching schema exactly ─────────────────────────────────────

export type InquiryStatus =
  | "new"
  | "contacted"
  | "quotation_sent"
  | "converted_to_booking"
  | "closed"
  | "lost";

export type BookingStatus =
  | "new_inquiry"
  | "quotation_sent"
  | "awaiting_payment"
  | "confirmed"
  | "preparing_equipment"
  | "team_on_the_way"
  | "setup_in_progress"
  | "completed"
  | "cancelled";

export type PaymentStatus =
  | "unpaid"
  | "deposit_pending"
  | "partially_paid"
  | "paid_100"
  | "refunded";

// ── Tables ────────────────────────────────────────────────────────────────────

export interface DbCustomer {
  id: string;
  full_name: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  company_name?: string;
  preferred_language: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface DbInquiry {
  id: string;
  customer_id?: string;
  source: string;
  event_date?: string;
  event_type?: string;
  guest_count?: number;
  services_requested?: string[];
  message?: string;
  status: InquiryStatus;
  priority: "low" | "normal" | "high";
  assigned_to?: string;
  whatsapp_sent: boolean;
  email_sent: boolean;
  ai_chat_transcript?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  customer?: DbCustomer;
}

export interface DbBooking {
  id: string;
  inquiry_id?: string;
  customer_id?: string;
  booking_reference?: string;
  event_date?: string;
  event_start_time?: string;
  event_end_time?: string;
  event_location?: string;
  event_type?: string;
  guest_count?: number;
  services?: string[];
  status: BookingStatus;
  payment_status: PaymentStatus;
  total_amount?: number;
  paid_amount?: number;
  manager_phone: string;
  setup_team_phone?: string;
  setup_team_lat?: number;
  setup_team_lng?: number;
  estimated_arrival_time?: string;
  internal_notes?: string;
  customer_notes?: string;
  confirmed_at?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
  customer?: DbCustomer;
  status_updates?: DbBookingStatusUpdate[];
}

export interface DbBookingStatusUpdate {
  id: string;
  booking_id: string;
  status: string;
  title?: string;
  description?: string;
  visible_to_customer: boolean;
  created_by?: string;
  created_at: string;
}

export interface DbGallerySection {
  id: string;
  name: string;
  slug: string;
  description?: string;
  sort_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbGalleryItem {
  id: string;
  section_id?: string;
  title?: string;
  caption?: string;
  event_date?: string;
  image_url: string;
  storage_path?: string;
  alt_text?: string;
  is_featured: boolean;
  is_visible: boolean;
  sort_order: number;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  // Instagram / multi-source import fields (added by migration 002)
  category?: string;
  source?: string;
  source_url?: string;
  instagram_media_id?: string;
  instagram_permalink?: string;
  media_type?: string;
  imported_at?: string;
  section?: DbGallerySection;
  // Video support fields (added by migration 003)
  video_url?: string;
  thumbnail_url?: string;
  thumbnail_storage_path?: string;
  mime_type?: string;
  file_size?: number;
  duration_seconds?: number;
}

export interface DbClientLogo {
  id: string;
  client_name: string;
  logo_url: string;
  storage_path?: string;
  website_url?: string;
  sort_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbService {
  id: string;
  title: string;
  slug: string;
  short_description?: string;
  description?: string;
  image_url?: string;
  icon?: string;
  is_visible: boolean;
  sort_order: number;
  seo_title?: string;
  seo_description?: string;
  created_at: string;
  updated_at: string;
}

export interface DbAnalyticsEvent {
  id: string;
  event_name: string;
  event_type?: string;
  page_path?: string;
  source?: string;
  session_id?: string;
  user_agent?: string;
  ip_hash?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface DbProduct {
  id: string;
  title: string;
  slug: string;
  category?: string;
  description?: string;
  specs?: Record<string, unknown>;
  image_url?: string;
  storage_path?: string;
  is_bundle: boolean;
  is_featured: boolean;
  is_visible: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface DbWebsiteSetting {
  id: string;
  key: string;
  value: unknown;
  created_at: string;
  updated_at: string;
}

// ── Human-readable labels ─────────────────────────────────────────────────────

export const INQUIRY_STATUS_LABELS: Record<InquiryStatus, string> = {
  new: "New",
  contacted: "Contacted",
  quotation_sent: "Quotation Sent",
  converted_to_booking: "Converted",
  closed: "Closed",
  lost: "Lost",
};

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  new_inquiry: "New Inquiry",
  quotation_sent: "Quotation Sent",
  awaiting_payment: "Awaiting Payment",
  confirmed: "Confirmed",
  preparing_equipment: "Preparing Equipment",
  team_on_the_way: "Team On The Way",
  setup_in_progress: "Setup In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  unpaid: "Unpaid",
  deposit_pending: "Deposit Pending",
  partially_paid: "Partially Paid",
  paid_100: "Paid in Full",
  refunded: "Refunded",
};

export const BOOKING_STATUS_COLORS: Record<BookingStatus, string> = {
  new_inquiry: "#F2994A",
  quotation_sent: "#2F80ED",
  awaiting_payment: "#F2C94C",
  confirmed: "#D6A84F",
  preparing_equipment: "#9B51E0",
  team_on_the_way: "#56CCF2",
  setup_in_progress: "#27AE60",
  completed: "#219653",
  cancelled: "#EB5757",
};

export const PAYMENT_STATUS_COLORS: Record<PaymentStatus, string> = {
  unpaid: "#EB5757",
  deposit_pending: "#F2994A",
  partially_paid: "#F2C94C",
  paid_100: "#27AE60",
  refunded: "#A7A7B3",
};
