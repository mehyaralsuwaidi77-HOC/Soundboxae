-- Migration 003: Gallery video support + updated storage MIME types
-- Run this in Supabase SQL editor or via supabase db push
-- Idempotent: safe to run multiple times

-- ── gallery_items: add video fields if they don't already exist ───────────────

do $$
begin
  -- media_type: 'image' or 'video'
  if not exists (
    select 1 from information_schema.columns
    where table_name = 'gallery_items' and column_name = 'media_type'
  ) then
    alter table gallery_items add column media_type text not null default 'image';
  end if;

  -- video_url: public URL of the uploaded video
  if not exists (
    select 1 from information_schema.columns
    where table_name = 'gallery_items' and column_name = 'video_url'
  ) then
    alter table gallery_items add column video_url text;
  end if;

  -- thumbnail_url: poster image for video items
  if not exists (
    select 1 from information_schema.columns
    where table_name = 'gallery_items' and column_name = 'thumbnail_url'
  ) then
    alter table gallery_items add column thumbnail_url text;
  end if;

  -- thumbnail_storage_path: bucket path for thumbnail
  if not exists (
    select 1 from information_schema.columns
    where table_name = 'gallery_items' and column_name = 'thumbnail_storage_path'
  ) then
    alter table gallery_items add column thumbnail_storage_path text;
  end if;

  -- mime_type: e.g. video/mp4, image/jpeg
  if not exists (
    select 1 from information_schema.columns
    where table_name = 'gallery_items' and column_name = 'mime_type'
  ) then
    alter table gallery_items add column mime_type text;
  end if;

  -- file_size: in bytes
  if not exists (
    select 1 from information_schema.columns
    where table_name = 'gallery_items' and column_name = 'file_size'
  ) then
    alter table gallery_items add column file_size bigint;
  end if;

  -- duration_seconds: for video items
  if not exists (
    select 1 from information_schema.columns
    where table_name = 'gallery_items' and column_name = 'duration_seconds'
  ) then
    alter table gallery_items add column duration_seconds numeric;
  end if;

  -- image_url can now be nullable (videos have no image_url)
  -- Note: alter column nullability requires checking current constraint
  -- We handle this via application logic (video_url or image_url must exist)

end;
$$;

-- ── website_settings: ensure common keys exist with defaults ──────────────────

insert into website_settings (key, value)
values
  ('instagram_url',    '"https://www.instagram.com/soundboxdubai/"'),
  ('email_address',    '"info@soundboxdubai.com"'),
  ('minimum_order',    '"AED 500 including setup, delivery, and collection"'),
  ('tabby_available',  'true'),
  ('events_delivered', '"4000+"')
on conflict (key) do nothing;

-- ── analytics_events: ensure index on event_name for quick lookup ─────────────

create index if not exists idx_analytics_event_name on analytics_events (event_name);
create index if not exists idx_analytics_created_at on analytics_events (created_at desc);

-- ── inquiries: ensure requested_service column exists ────────────────────────

do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_name = 'inquiries' and column_name = 'requested_service'
  ) then
    alter table inquiries add column requested_service text;
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_name = 'inquiries' and column_name = 'email'
  ) then
    alter table inquiries add column email text;
  end if;
end;
$$;

-- ── Storage: update gallery bucket MIME type allowlist ───────────────────────
-- Run these in Supabase dashboard > Storage > gallery bucket > Policies
-- Or via Supabase Management API — not executable via SQL editor directly.
-- Allowed MIME types for 'gallery' bucket:
--   image/png, image/jpeg, image/webp, image/gif
--   video/mp4, video/webm
-- Max file size for videos: 100MB (update bucket settings in dashboard)
