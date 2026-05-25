-- =============================================================================
-- Soundbox Dubai — Seed Data
-- Run AFTER migrations. Safe to re-run (uses ON CONFLICT DO NOTHING).
-- =============================================================================

-- =============================================================================
-- SERVICES
-- =============================================================================
insert into services (title, slug, short_description, is_visible, sort_order) values
  ('Audio Systems',    'audio-systems',    'Professional line-array and point-source sound systems for any venue size.',       true,  1),
  ('Lighting Systems', 'lighting-systems', 'Stage wash, moving heads, LED uplighting and full concert lighting rigs.',        true,  2),
  ('LED Screens',      'led-screens',      'Indoor and outdoor LED video walls — P3 to P10 pitch, any custom size.',          true,  3),
  ('Stages',           'stages',           'Modular aluminum stages up to 20m wide for concerts, galas and corporate events.', true,  4),
  ('Rigging',          'rigging',          'Safe certified rigging solutions: roof truss, ground support and hanging systems.',true,  5),
  ('Trusses',          'trusses',          'Aluminium box and ladder trusses for any lighting or screen configuration.',       true,  6),
  ('DJ Equipment',     'dj-equipment',     'Pioneer CDJ-3000 / DJM-900NXS2 setups, booths and monitoring.',                  true,  7),
  ('Event Production', 'event-production', 'Full end-to-end AV production management from planning to strike.',               true,  8),
  ('Concert Setup',    'concert-setup',    'Complete concert infrastructure: FOH, monitors, backline, crew and logistics.',   true,  9),
  ('Wedding Setup',    'wedding-setup',    'Elegant AV for ceremonies and receptions — seamless, tasteful, reliable.',        true, 10),
  ('Corporate Events', 'corporate-events', 'Polished AV for conferences, product launches, award nights and galas.',          true, 11),
  ('Private Events',   'private-events',   'Premium DJ and AV packages for private parties, birthdays and VIP gatherings.',   true, 12)
on conflict (slug) do nothing;

-- =============================================================================
-- GALLERY SECTIONS
-- =============================================================================
insert into gallery_sections (name, slug, description, sort_order, is_visible) values
  ('All Events',       'all',           'Complete portfolio of Soundbox Dubai events.',         0, true),
  ('Corporate Events', 'corporate',     'Conferences, product launches, award nights and galas.', 1, true),
  ('Weddings',         'wedding',       'Elegant audio-visual setups for weddings.',              2, true),
  ('Concerts',         'concert',       'Full concert and live music productions.',               3, true),
  ('Private Parties',  'private-party', 'VIP and private event setups.',                         4, true),
  ('LED Setups',       'led-setup',     'Custom LED video wall installations.',                   5, true),
  ('Stage Setups',     'stage-setup',   'Stage and rigging configurations.',                      6, true)
on conflict (slug) do nothing;

-- =============================================================================
-- WEBSITE SETTINGS
-- =============================================================================
insert into website_settings (key, value) values
  ('whatsapp_number',          '"971553320051"'),
  ('manager_phone',            '"+971553320051"'),
  ('setup_team_phone',         '"+971553320051"'),
  ('company_name',             '"Soundbox Electronic Equipment Rental"'),
  ('company_address',          '"Dubai, United Arab Emirates"'),
  ('website_url',              '"https://www.soundboxdubai.com"'),
  ('notification_email',       '"info@soundboxdubai.com"'),
  ('default_language',         '"en"'),
  ('admin_notification_email', '"admin@soundboxdubai.com"')
on conflict (key) do nothing;

-- =============================================================================
-- ADMIN USER PROFILE
-- NOTE: The actual auth user must be created via Supabase Auth first.
-- Run `npm run admin:create` or use the Supabase dashboard.
-- This row is inserted by the create-admin script, not here.
-- =============================================================================
