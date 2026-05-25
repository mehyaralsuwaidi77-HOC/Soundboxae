-- =============================================================================
-- Migration 003: Storage Buckets
-- Run in Supabase SQL Editor AFTER enabling Storage in your Supabase project.
--
-- If you get "relation storage.buckets does not exist", go to:
--   Supabase Dashboard → Storage → Enable Storage
-- then re-run this migration.
--
-- Alternatively use the /admin/system-health page → "Create Storage Buckets"
-- button which creates buckets via the Supabase JS client automatically.
-- =============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'gallery',
    'gallery',
    true,
    10485760,
    array['image/png','image/jpeg','image/jpg','image/webp','image/gif']
  ),
  (
    'client-logos',
    'client-logos',
    true,
    5242880,
    array['image/png','image/jpeg','image/jpg','image/webp','image/gif']
  ),
  (
    'product-images',
    'product-images',
    true,
    10485760,
    array['image/png','image/jpeg','image/jpg','image/webp','image/gif']
  ),
  (
    'brand-assets',
    'brand-assets',
    true,
    10485760,
    array['image/png','image/jpeg','image/jpg','image/webp','image/gif','image/svg+xml']
  ),
  (
    'project-media',
    'project-media',
    false,
    52428800,
    array['image/png','image/jpeg','image/jpg','image/webp','video/mp4','video/quicktime']
  )
on conflict (id) do update set
  public             = excluded.public,
  file_size_limit    = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- ── Storage RLS Policies ──────────────────────────────────────────────────────
-- Allow public read from public buckets
-- Allow authenticated admin to upload/update/delete

-- gallery bucket
create policy "gallery_public_select"
  on storage.objects for select
  using ( bucket_id = 'gallery' );

create policy "gallery_auth_insert"
  on storage.objects for insert
  to authenticated
  with check ( bucket_id = 'gallery' );

create policy "gallery_auth_update"
  on storage.objects for update
  to authenticated
  using ( bucket_id = 'gallery' );

create policy "gallery_auth_delete"
  on storage.objects for delete
  to authenticated
  using ( bucket_id = 'gallery' );

-- client-logos bucket
create policy "client_logos_public_select"
  on storage.objects for select
  using ( bucket_id = 'client-logos' );

create policy "client_logos_auth_insert"
  on storage.objects for insert
  to authenticated
  with check ( bucket_id = 'client-logos' );

create policy "client_logos_auth_update"
  on storage.objects for update
  to authenticated
  using ( bucket_id = 'client-logos' );

create policy "client_logos_auth_delete"
  on storage.objects for delete
  to authenticated
  using ( bucket_id = 'client-logos' );

-- product-images bucket
create policy "product_images_public_select"
  on storage.objects for select
  using ( bucket_id = 'product-images' );

create policy "product_images_auth_insert"
  on storage.objects for insert
  to authenticated
  with check ( bucket_id = 'product-images' );

create policy "product_images_auth_update"
  on storage.objects for update
  to authenticated
  using ( bucket_id = 'product-images' );

create policy "product_images_auth_delete"
  on storage.objects for delete
  to authenticated
  using ( bucket_id = 'product-images' );

-- brand-assets bucket
create policy "brand_assets_public_select"
  on storage.objects for select
  using ( bucket_id = 'brand-assets' );

create policy "brand_assets_auth_insert"
  on storage.objects for insert
  to authenticated
  with check ( bucket_id = 'brand-assets' );

create policy "brand_assets_auth_delete"
  on storage.objects for delete
  to authenticated
  using ( bucket_id = 'brand-assets' );
