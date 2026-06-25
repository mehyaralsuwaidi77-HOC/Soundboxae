-- Migration 004: Make image_url nullable so video-only gallery items can be saved
-- Run in Supabase SQL editor. Safe to run multiple times (DROP NOT NULL is idempotent).

ALTER TABLE gallery_items ALTER COLUMN image_url DROP NOT NULL;
