-- =============================================================================
-- Migration 002: Add missing columns
-- Run in Supabase SQL Editor
-- Idempotent — safe to re-run
-- =============================================================================

-- ── products table: add is_featured and storage_path ─────────────────────────
-- These columns exist in the TypeScript type but were missing from the table,
-- causing "Internal server error" when admin tries to add/edit products.

alter table products
  add column if not exists is_featured  boolean not null default false,
  add column if not exists storage_path text;

create index if not exists idx_products_is_featured
  on products(is_featured) where is_featured = true;

-- ── gallery_items: add category + Instagram import fields ─────────────────────
-- category: standalone category for items not linked to a gallery_section
-- source: 'admin' | 'instagram' | 'instagram_manual'
-- Instagram-related fields for manual/API import

alter table gallery_items
  add column if not exists category            text,
  add column if not exists source              text not null default 'admin',
  add column if not exists source_url          text,
  add column if not exists instagram_media_id  text,
  add column if not exists instagram_permalink text,
  add column if not exists media_type          text not null default 'IMAGE',
  add column if not exists imported_at         timestamptz;

create index if not exists idx_gallery_items_source
  on gallery_items(source);

create index if not exists idx_gallery_items_instagram_id
  on gallery_items(instagram_media_id) where instagram_media_id is not null;

-- ── inquiries: add missing fields used by WhatsApp lead modal ────────────────
alter table inquiries
  add column if not exists source_page text,
  add column if not exists metadata    jsonb default '{}'::jsonb;

-- ── Ensure analytics_events metadata is not null ─────────────────────────────
update analytics_events set metadata = '{}'::jsonb where metadata is null;
alter table analytics_events alter column metadata set default '{}'::jsonb;

-- ── Ensure gallery_items metadata is not null ────────────────────────────────
update gallery_items set metadata = '{}'::jsonb where metadata is null;
alter table gallery_items alter column metadata set default '{}'::jsonb;

-- =============================================================================
-- Done. Re-run migration 001 if tables do not exist yet.
-- =============================================================================
