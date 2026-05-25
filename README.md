# Soundbox Dubai — Premium Audio Visual Rental Website

Premium Next.js website for **Soundbox Electronic Equipment Rental**, Dubai's leading AV rental company.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React |
| Fonts | Playfair Display + Inter (Google Fonts) |
| Database | Supabase (PostgreSQL) with localStorage fallback |
| Auth | Supabase Auth (email + password) |
| Storage | Supabase Storage (gallery, client-logos, brand-assets) |
| Hosting | Vercel (recommended) |

---

## Running Locally

```bash
# 1. Clone the repo
git clone https://github.com/mehyaralsuwaidi77-HOC/Soundboxae.git
cd Soundboxae

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your values (see Supabase Setup below)

# 4. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Supabase Setup

The site uses Supabase as its production database and auth provider. All features work with a localStorage fallback when Supabase is not configured — making local development possible without any database.

### Step 1 — Create a Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com) and create a new project
2. Note your **Project URL** and **API keys** from: Project Settings → API

### Step 2 — Configure Environment Variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and fill in:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...your-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJh...your-service-role-key

ADMIN_EMAIL=admin@soundboxdubai.com
ADMIN_INITIAL_PASSWORD=your-secure-password
```

> **Security:** `SUPABASE_SERVICE_ROLE_KEY` is server-side only. It is used exclusively in `/app/api/` routes and `scripts/`. Never expose it to the browser.

### Step 3 — Run the Database Migration

In your Supabase project, go to **SQL Editor** and run the migration file:

```
supabase/migrations/001_initial_schema.sql
```

This creates all tables: `inquiries`, `bookings`, `gallery_items`, `client_logos`, `analytics_events`, `website_settings`.

### Step 4 — Seed Initial Data (optional)

In the Supabase SQL Editor, run:

```
supabase/seed.sql
```

This inserts default service and settings values.

### Step 5 — Create the Admin User

```bash
npm run admin:create
```

This script reads `ADMIN_EMAIL` and `ADMIN_INITIAL_PASSWORD` from `.env.local` and creates an auth user in Supabase with email confirmation pre-approved. Run it once — it will fail gracefully if the user already exists.

### Step 6 — Create Storage Buckets

In Supabase → Storage, create three **public** buckets:

| Bucket name | Purpose |
|---|---|
| `gallery` | Portfolio/gallery images uploaded from admin |
| `client-logos` | Client company logos uploaded from admin |
| `brand-assets` | Brand materials |

---

## Environment Variables

| Variable | Description | Required |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | For production |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key | For production |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) | For production |
| `ADMIN_EMAIL` | Admin account email for `npm run admin:create` | For production |
| `ADMIN_INITIAL_PASSWORD` | Initial admin password for `npm run admin:create` | For production |
| `NEXT_PUBLIC_ADMIN_PASSWORD` | Legacy fallback password (no Supabase) | Optional |
| `NEXT_PUBLIC_SITE_URL` | Public site URL (used for SEO/sitemap) | Optional |
| `SMTP_HOST` | SMTP server for email notifications | Optional |
| `SMTP_PORT` | SMTP port (default 587) | Optional |
| `SMTP_USER` | SMTP username | Optional |
| `SMTP_PASS` | SMTP app password | Optional |
| `NOTIFY_EMAIL` | Email to receive lead/booking alerts | Optional |
| `WHATSAPP_API_TOKEN` | Meta WhatsApp Business API token | Optional |
| `WHATSAPP_PHONE_ID` | WhatsApp Business phone number ID | Optional |
| `NOTIFY_WHATSAPP` | Admin WhatsApp number for alerts | Optional |
| `STRIPE_SECRET_KEY` | Stripe secret key for payments | Optional |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | Optional |

---

## Admin Access

**URL:** [https://www.soundboxdubai.com/admin](https://www.soundboxdubai.com/admin)

**Login credentials:**
- Email: `admin@soundboxdubai.com`
- Password: *(set via `ADMIN_INITIAL_PASSWORD` in `.env.local`, then run `npm run admin:create`)*

> Change the password immediately after first login via Supabase Dashboard → Authentication → Users.

When Supabase is configured, login uses **Supabase Auth** (email + password, sessions managed server-side). When Supabase is not configured (local dev without `.env.local`), a legacy password fallback is used via `NEXT_PUBLIC_ADMIN_PASSWORD`.

**Admin features:**
- Overview dashboard — KPI cards (leads, bookings, revenue, conversions)
- Lead management — view, update status, reply via WhatsApp
- Booking management — create, update status, payment tracking, SBX reference generation
- Gallery management — upload images to Supabase Storage, manage portfolio
- Client logos — upload client logos to Supabase Storage
- Analytics — event tracking, WhatsApp clicks, AI chat completions, monthly trends
- Settings — manage phone numbers, addresses, social links stored in Supabase

---

## Booking Tracking System

Clients can track their booking status at `/track?ref=SBX-YYYY-NNNN`.

### Booking Reference Format

References follow the pattern `SBX-YYYY-NNNN` (e.g. `SBX-2025-0001`). The number is auto-incremented per year. References are generated automatically by a PostgreSQL trigger when a booking's `payment_status` changes to `paid_100`.

### Booking Status Flow

```
new_inquiry → quotation_sent → awaiting_payment → confirmed
    → preparing_equipment → team_on_the_way → setup_in_progress
    → completed
```

Cancelled is a terminal state reachable from any stage.

### Payment Status

| Status | Meaning |
|---|---|
| `unpaid` | No payment received yet |
| `deposit_pending` | Deposit invoice sent, awaiting payment |
| `partially_paid` | Deposit paid, balance outstanding |
| `paid_100` | Fully paid — triggers SBX reference generation |
| `refunded` | Payment returned |

### How It Works

1. **Admin creates a booking** via `/admin/bookings` and assigns a client name, service, and event date.
2. **Client receives their SBX reference** once payment is confirmed (`paid_100`). The reference is shared via WhatsApp or email.
3. **Client visits `/track`** and enters their reference number.
4. **The page fetches booking data** from `/api/tracking?ref=SBX-YYYY-NNNN` (Supabase) or from localStorage (fallback).
5. **Status is displayed** with a visual progress timeline, contact details for the setup team, and the next milestone.

### Data Sources

| Mode | Data source | When active |
|---|---|---|
| Production (Supabase) | `bookings` table via `/api/tracking` | When `NEXT_PUBLIC_SUPABASE_URL` is set |
| Development (fallback) | `localStorage` via `lib/storage.ts` | When Supabase is not configured |

---

## Pages & Routes

| Route | Description |
|---|---|
| `/` | Homepage (Hero, Services, Gallery, CTA) |
| `/services` | All services overview |
| `/services/[slug]` | Individual service page (11 services) |
| `/products` | Products & bundles with WhatsApp inquiry |
| `/gallery` | Portfolio with category filtering |
| `/clients` | Client logos grid |
| `/track` | Client booking tracking portal |
| `/admin` | Admin dashboard (protected) |
| `/admin/leads` | Lead management |
| `/admin/bookings` | Booking management |
| `/admin/gallery` | Gallery management (Supabase Storage upload) |
| `/admin/clients` | Client logo management (Supabase Storage upload) |
| `/admin/analytics` | Analytics overview |
| `/admin/settings` | Site settings management |
| `/api/leads` | POST — submit a lead |
| `/api/bookings` | POST — create a booking |
| `/api/tracking` | GET — track booking by reference |
| `/api/analytics` | POST — record analytics event |

---

## WhatsApp Integration

The site uses WhatsApp deep links for all inquiry CTAs.

1. **Product inquiry** — clicking "Inquire via WhatsApp" opens `wa.me/971553320051` with a pre-filled message.
2. **Service inquiry** — "Inquire Now" on each service page pre-fills the service name.
3. **AI Chat** — after the booking assistant collects event details, it generates a WhatsApp link with all collected data pre-filled.
4. **Lead notifications** — configure `WHATSAPP_API_TOKEN` to receive instant alerts when leads are submitted via `/api/leads`.

**WhatsApp number:** +971 55 332 0051

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run admin:create` | Create initial admin user in Supabase Auth |
| `npm run db:setup` | Instructions for running the DB migration |
| `npm run db:seed` | Instructions for running the seed file |

---

## Project Structure

```
├── app/
│   ├── layout.tsx              # Root layout (fonts, metadata)
│   ├── page.tsx                # Homepage
│   ├── globals.css             # Brand theme + Tailwind v4
│   ├── services/               # Services pages
│   ├── products/               # Products & bundles
│   ├── clients/                # Clients page
│   ├── gallery/                # Portfolio gallery
│   ├── track/                  # Client booking tracking portal
│   ├── admin/                  # Admin dashboard (Supabase Auth protected)
│   └── api/                    # API routes (leads, bookings, tracking, analytics)
├── components/
│   ├── layout/                 # Header, Footer, SiteShell
│   ├── home/                   # Homepage section components
│   ├── ui/                     # Reusable UI components
│   └── AIChat.tsx              # AI booking assistant widget
├── data/
│   ├── services.ts             # Service definitions (with bgImage paths)
│   ├── products.ts             # Product/bundle catalog
│   ├── gallery.ts              # Gallery items (seed data)
│   └── clients.ts              # Client logos (seed data)
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Browser Supabase client
│   │   └── server.ts           # Server-side Supabase client (service role)
│   ├── whatsapp.ts             # WhatsApp link helpers
│   ├── storage.ts              # localStorage data layer (dev fallback)
│   └── i18n.ts                 # EN/AR translations
├── scripts/
│   └── create-admin.mjs        # One-time script to create admin Supabase user
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql  # Full DB schema
│   └── seed.sql                # Default data seed
├── public/
│   ├── logos/                  # Soundbox brand logos
│   ├── Category BG/            # Service category background images (11 images)
│   └── client-logos/           # Client company logos
└── .env.local.example          # Environment variable template
```

---

## Deployment

### Vercel (recommended)

1. Push to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Add all environment variables in Vercel Dashboard → Settings → Environment Variables
4. Deploy

### Self-hosted

```bash
npm run build
npm run start
```

---

## License

© 2025 Soundbox Electronic Equipment Rental LLC. All rights reserved.
