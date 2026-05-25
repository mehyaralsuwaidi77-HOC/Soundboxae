-- =============================================================================
-- Soundbox Dubai — Initial Database Schema
-- Run this in Supabase SQL Editor or via `supabase db push`
-- =============================================================================

-- Extensions
create extension if not exists "pgcrypto";

-- =============================================================================
-- UTILITY FUNCTIONS
-- =============================================================================

-- Auto-update updated_at on any table
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =============================================================================
-- TABLE: admin_users
-- Profile linked to Supabase auth.users
-- =============================================================================
create table if not exists admin_users (
  id               uuid primary key default gen_random_uuid(),
  email            text unique not null,
  password_hash    text,          -- only used if NOT using Supabase Auth
  full_name        text,
  role             text not null default 'admin',
  is_active        boolean not null default true,
  last_login_at    timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create trigger trg_admin_users_updated_at
  before update on admin_users
  for each row execute function update_updated_at();

-- =============================================================================
-- TABLE: customers
-- =============================================================================
create table if not exists customers (
  id                 uuid primary key default gen_random_uuid(),
  full_name          text not null,
  email              text,
  phone              text,
  whatsapp           text,
  company_name       text,
  preferred_language text not null default 'en',
  notes              text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index if not exists idx_customers_email on customers(email);
create index if not exists idx_customers_phone on customers(phone);

create trigger trg_customers_updated_at
  before update on customers
  for each row execute function update_updated_at();

-- =============================================================================
-- TABLE: inquiries
-- =============================================================================
create table if not exists inquiries (
  id                   uuid primary key default gen_random_uuid(),
  customer_id          uuid references customers(id) on delete set null,
  source               text not null default 'website',
  event_date           date,
  event_type           text,
  guest_count          integer,
  services_requested   text[],
  message              text,
  status               text not null default 'new',
  priority             text not null default 'normal',
  assigned_to          uuid references admin_users(id) on delete set null,
  whatsapp_sent        boolean not null default false,
  email_sent           boolean not null default false,
  ai_chat_transcript   jsonb,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  constraint chk_inquiry_status check (
    status in ('new','contacted','quotation_sent','converted_to_booking','closed','lost')
  ),
  constraint chk_inquiry_priority check (
    priority in ('low','normal','high')
  )
);

create index if not exists idx_inquiries_status      on inquiries(status);
create index if not exists idx_inquiries_customer_id on inquiries(customer_id);
create index if not exists idx_inquiries_event_date  on inquiries(event_date);
create index if not exists idx_inquiries_created_at  on inquiries(created_at desc);

create trigger trg_inquiries_updated_at
  before update on inquiries
  for each row execute function update_updated_at();

-- =============================================================================
-- TABLE: bookings
-- =============================================================================
create table if not exists bookings (
  id                      uuid primary key default gen_random_uuid(),
  inquiry_id              uuid references inquiries(id) on delete set null,
  customer_id             uuid references customers(id) on delete set null,
  booking_reference       text unique,
  event_date              date,
  event_start_time        time,
  event_end_time          time,
  event_location          text,
  event_type              text,
  guest_count             integer,
  services                text[],
  status                  text not null default 'new_inquiry',
  payment_status          text not null default 'unpaid',
  total_amount            numeric(12,2),
  paid_amount             numeric(12,2),
  manager_phone           text not null default '+971553320051',
  setup_team_phone        text,
  setup_team_lat          numeric(10,7),
  setup_team_lng          numeric(10,7),
  estimated_arrival_time  timestamptz,
  internal_notes          text,
  customer_notes          text,
  confirmed_at            timestamptz,
  completed_at            timestamptz,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now(),
  constraint chk_booking_status check (
    status in (
      'new_inquiry','quotation_sent','awaiting_payment','confirmed',
      'preparing_equipment','team_on_the_way','setup_in_progress',
      'completed','cancelled'
    )
  ),
  constraint chk_payment_status check (
    payment_status in ('unpaid','deposit_pending','partially_paid','paid_100','refunded')
  )
);

create index if not exists idx_bookings_status     on bookings(status);
create index if not exists idx_bookings_reference  on bookings(booking_reference);
create index if not exists idx_bookings_event_date on bookings(event_date);
create index if not exists idx_bookings_created_at on bookings(created_at desc);

-- Auto-generate booking_reference when payment becomes paid_100
create or replace function auto_booking_reference()
returns trigger language plpgsql as $$
declare
  yr     text;
  seq    int;
  newref text;
begin
  if new.payment_status = 'paid_100' and new.booking_reference is null then
    yr  := 'SBX-' || extract(year from now())::text || '-';
    select coalesce(max(
      (regexp_match(booking_reference, 'SBX-\d{4}-(\d+)'))[1]::int
    ), 0) + 1
    into seq
    from bookings
    where booking_reference like yr || '%';
    newref := yr || lpad(seq::text, 4, '0');
    new.booking_reference := newref;
    new.confirmed_at := now();
  end if;
  if new.status = 'completed' and old.status <> 'completed' then
    new.completed_at := now();
  end if;
  return new;
end;
$$;

create trigger trg_booking_reference
  before update on bookings
  for each row execute function auto_booking_reference();

create trigger trg_bookings_updated_at
  before update on bookings
  for each row execute function update_updated_at();

-- =============================================================================
-- TABLE: booking_status_updates (timeline)
-- =============================================================================
create table if not exists booking_status_updates (
  id                    uuid primary key default gen_random_uuid(),
  booking_id            uuid not null references bookings(id) on delete cascade,
  status                text not null,
  title                 text,
  description           text,
  visible_to_customer   boolean not null default true,
  created_by            uuid references admin_users(id) on delete set null,
  created_at            timestamptz not null default now()
);

create index if not exists idx_bsu_booking_id on booking_status_updates(booking_id);
create index if not exists idx_bsu_created_at on booking_status_updates(created_at desc);

-- =============================================================================
-- TABLE: gallery_sections
-- =============================================================================
create table if not exists gallery_sections (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text unique not null,
  description text,
  sort_order  integer not null default 0,
  is_visible  boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger trg_gallery_sections_updated_at
  before update on gallery_sections
  for each row execute function update_updated_at();

-- =============================================================================
-- TABLE: gallery_items
-- =============================================================================
create table if not exists gallery_items (
  id            uuid primary key default gen_random_uuid(),
  section_id    uuid references gallery_sections(id) on delete set null,
  title         text,
  caption       text,
  event_date    date,
  image_url     text not null,
  storage_path  text,
  alt_text      text,
  is_featured   boolean not null default false,
  is_visible    boolean not null default true,
  sort_order    integer not null default 0,
  metadata      jsonb,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists idx_gallery_items_section_id on gallery_items(section_id);
create index if not exists idx_gallery_items_visible    on gallery_items(is_visible);

create trigger trg_gallery_items_updated_at
  before update on gallery_items
  for each row execute function update_updated_at();

-- =============================================================================
-- TABLE: client_logos
-- =============================================================================
create table if not exists client_logos (
  id            uuid primary key default gen_random_uuid(),
  client_name   text not null,
  logo_url      text not null,
  storage_path  text,
  website_url   text,
  sort_order    integer not null default 0,
  is_visible    boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create trigger trg_client_logos_updated_at
  before update on client_logos
  for each row execute function update_updated_at();

-- =============================================================================
-- TABLE: services
-- =============================================================================
create table if not exists services (
  id                uuid primary key default gen_random_uuid(),
  title             text not null,
  slug              text unique not null,
  short_description text,
  description       text,
  image_url         text,
  icon              text,
  is_visible        boolean not null default true,
  sort_order        integer not null default 0,
  seo_title         text,
  seo_description   text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create trigger trg_services_updated_at
  before update on services
  for each row execute function update_updated_at();

-- =============================================================================
-- TABLE: products
-- =============================================================================
create table if not exists products (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  slug        text unique not null,
  category    text,
  description text,
  specs       jsonb,
  image_url   text,
  is_bundle   boolean not null default false,
  is_visible  boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger trg_products_updated_at
  before update on products
  for each row execute function update_updated_at();

-- =============================================================================
-- TABLE: analytics_events
-- =============================================================================
create table if not exists analytics_events (
  id          uuid primary key default gen_random_uuid(),
  event_name  text not null,
  event_type  text,
  page_path   text,
  source      text,
  session_id  text,
  user_agent  text,
  ip_hash     text,
  metadata    jsonb,
  created_at  timestamptz not null default now()
);

create index if not exists idx_analytics_event_name  on analytics_events(event_name);
create index if not exists idx_analytics_created_at  on analytics_events(created_at desc);
create index if not exists idx_analytics_session     on analytics_events(session_id);

-- =============================================================================
-- TABLE: website_settings
-- =============================================================================
create table if not exists website_settings (
  id         uuid primary key default gen_random_uuid(),
  key        text unique not null,
  value      jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_website_settings_updated_at
  before update on website_settings
  for each row execute function update_updated_at();

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

-- Enable RLS on all tables
alter table admin_users           enable row level security;
alter table customers             enable row level security;
alter table inquiries             enable row level security;
alter table bookings              enable row level security;
alter table booking_status_updates enable row level security;
alter table gallery_sections      enable row level security;
alter table gallery_items         enable row level security;
alter table client_logos          enable row level security;
alter table services              enable row level security;
alter table products              enable row level security;
alter table analytics_events      enable row level security;
alter table website_settings      enable row level security;

-- ── Admin: full access when authenticated ────────────────────────────────────
create policy "admin_all_admin_users"      on admin_users           for all to authenticated using (true) with check (true);
create policy "admin_all_customers"        on customers             for all to authenticated using (true) with check (true);
create policy "admin_all_inquiries"        on inquiries             for all to authenticated using (true) with check (true);
create policy "admin_all_bookings"         on bookings              for all to authenticated using (true) with check (true);
create policy "admin_all_bsu"              on booking_status_updates for all to authenticated using (true) with check (true);
create policy "admin_all_gallery_sections" on gallery_sections      for all to authenticated using (true) with check (true);
create policy "admin_all_gallery_items"    on gallery_items         for all to authenticated using (true) with check (true);
create policy "admin_all_client_logos"     on client_logos          for all to authenticated using (true) with check (true);
create policy "admin_all_services"         on services              for all to authenticated using (true) with check (true);
create policy "admin_all_products"         on products              for all to authenticated using (true) with check (true);
create policy "admin_all_analytics"        on analytics_events      for all to authenticated using (true) with check (true);
create policy "admin_all_settings"         on website_settings      for all to authenticated using (true) with check (true);

-- ── Public: read visible content ─────────────────────────────────────────────
create policy "public_read_gallery_sections" on gallery_sections for select to anon using (is_visible = true);
create policy "public_read_gallery_items"    on gallery_items    for select to anon using (is_visible = true);
create policy "public_read_client_logos"     on client_logos     for select to anon using (is_visible = true);
create policy "public_read_services"         on services         for select to anon using (is_visible = true);
create policy "public_read_products"         on products         for select to anon using (is_visible = true);

-- ── Public: insert only (no read) ────────────────────────────────────────────
create policy "public_insert_inquiries"  on inquiries         for insert to anon with check (true);
create policy "public_insert_customers"  on customers         for insert to anon with check (true);
create policy "public_insert_analytics" on analytics_events  for insert to anon with check (true);

-- ── Public booking tracking: read by exact reference only ────────────────────
create policy "public_track_booking" on bookings
  for select to anon
  using (booking_reference is not null);

create policy "public_read_bsu" on booking_status_updates
  for select to anon
  using (visible_to_customer = true);

-- =============================================================================
-- STORAGE BUCKETS (run after enabling Storage in Supabase dashboard)
-- =============================================================================
-- These inserts require the storage extension to be enabled.
-- Run them after creating buckets in the dashboard, or uncomment if using
-- the Supabase CLI with storage support.
--
-- insert into storage.buckets (id, name, public) values
--   ('gallery',       'gallery',       true),
--   ('client-logos',  'client-logos',  true),
--   ('brand-assets',  'brand-assets',  true),
--   ('project-media', 'project-media', false)
-- on conflict (id) do nothing;
