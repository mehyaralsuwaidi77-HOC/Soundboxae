-- ── Gallery Sections ──────────────────────────────────────────────────────────

INSERT INTO gallery_sections (name, slug, description, sort_order, is_visible) VALUES
  ('Corporate Events',  'corporate',     'Professional AV setups for conferences, galas, and product launches.',   1, true),
  ('Weddings',          'weddings',      'Elegant audio visual setups for unforgettable wedding ceremonies.',       2, true),
  ('Concerts',          'concerts',      'Full concert production for live music, festivals, and large events.',    3, true),
  ('Private Parties',   'private-party', 'Premium DJ and AV setups for private parties and celebrations.',         4, true),
  ('LED Setups',        'led-setup',     'Stunning LED video walls and backdrops for maximum visual impact.',      5, true),
  ('Stage Setups',      'stage-setup',   'Professional staging, trussing, and rigging for any scale event.',      6, true)
ON CONFLICT (slug) DO NOTHING;

-- ── Gallery Items ──────────────────────────────────────────────────────────────

INSERT INTO gallery_items (section_id, title, caption, event_date, image_url, alt_text, is_featured, is_visible, sort_order)
SELECT
  gs.id,
  item.title,
  item.caption,
  item.event_date::date,
  item.image_url,
  item.alt_text,
  item.is_featured,
  true,
  item.sort_order
FROM (VALUES
  ('corporate',     'Grand Corporate Gala — JW Marriott',    'Full LED wall, stage, and lighting production for a 500-guest gala.',          '2025-03-15', '/Category%20BG/Corporate%20Events%20BG.png',   'Corporate gala AV setup',        true,  1),
  ('corporate',     'Corporate Product Launch — DIFC',        'Crisp projection, stage monitors, and branded LED backdrop.',                  '2025-01-20', '/Category%20BG/Corporate%20Events%20BG.png',   'Product launch stage setup',     false, 2),
  ('weddings',      'Luxury Wedding — Atlantis The Palm',     'Elegant RGBW uplighting, wireless microphones, and ambient sound design.',     '2025-04-12', '/Category%20BG/Wedding%20Setup%20BG.png',      'Wedding setup Atlantis Dubai',   true,  1),
  ('weddings',      'Desert Wedding Ceremony',                'Outdoor PA, wireless mics, and LED uplighting in the Dubai desert.',           '2025-02-28', '/Category%20BG/Wedding%20Setup%20BG.png',      'Outdoor desert wedding audio',   false, 2),
  ('concerts',      'Outdoor Concert — Dubai Media City',     'Full line array hang, 4× subwoofer stacks, and 16-fixture moving head rig.',   '2024-11-08', '/Category%20BG/Concert%20Setup%20BG.png',      'Outdoor concert Dubai stage',    true,  1),
  ('concerts',      'New Year''s Eve Concert — Downtown Dubai', 'Full festival production: PA, LED, lighting, and stage for 3,000 attendees.','2025-01-01', '/Category%20BG/Concert%20Setup%20BG.png',      'New Year concert production',    false, 2),
  ('private-party', 'Private Villa Party — Palm Jumeirah',    'DJ setup, line array speakers, LED uplighting, and haze machine.',             '2025-05-03', '/Category%20BG/Event%20Production%20BG.png',   'Private villa party AV Dubai',   true,  1),
  ('private-party', 'Rooftop Pool Party — Downtown',          'Outdoor DJ booth, subwoofers, and waterproof uplighting.',                    '2025-03-22', '/Category%20BG/DJ%20Equipment%20BG.png',       'Rooftop party DJ equipment',     false, 2),
  ('led-setup',     'P4 LED Backdrop — Awards Night',         'Custom 8m × 4m P4 indoor LED wall with seamless content playback.',            '2025-02-14', '/Category%20BG/LED%20Screens%20BG.png',        'LED wall awards night Dubai',    true,  1),
  ('led-setup',     'Curved LED Backdrop — Fashion Show',     'Curved LED wall configuration for a high-fashion runway event.',              '2024-10-05', '/Category%20BG/LED%20Screens%20BG.png',        'Curved LED screen fashion show', false, 2),
  ('stage-setup',   'Festival Stage — Global Village',        '10m × 8m aluminum stage with full roof structure and truss rigging.',          '2024-12-20', '/Category%20BG/Stages%20BG.png',               'Festival stage Global Village',  true,  1),
  ('stage-setup',   'Concert Stage — Coca-Cola Arena',        '16m × 12m main stage with delay towers and full rigging grid.',               '2025-04-18', '/Category%20BG/Rigging%20BG.png',              'Arena concert stage rigging',    false, 2)
) AS item(section_slug, title, caption, event_date, image_url, alt_text, is_featured, sort_order)
JOIN gallery_sections gs ON gs.slug = item.section_slug
ON CONFLICT DO NOTHING;
