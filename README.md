# Soundbox Dubai — Premium Audio Visual Rental Website

Premium Next.js website for **Soundbox Electronic Equipment Rental**, Dubai's leading AV rental company.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React |
| Fonts | Playfair Display + Inter (Google Fonts) |
| Storage | localStorage (upgrade path: Supabase/Firebase) |
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
# Edit .env.local with your values

# 4. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in the values:

| Variable | Description | Required |
|---|---|---|
| `NEXT_PUBLIC_ADMIN_PASSWORD` | Admin dashboard password | Yes |
| `SMTP_HOST` | SMTP server for email notifications | No |
| `SMTP_USER` | SMTP username | No |
| `SMTP_PASS` | SMTP app password | No |
| `NOTIFY_EMAIL` | Email to receive lead alerts | No |
| `WHATSAPP_API_TOKEN` | Meta WhatsApp Business API token | No |
| `WHATSAPP_PHONE_ID` | WhatsApp Business phone number ID | No |
| `NOTIFY_WHATSAPP` | Admin WhatsApp number for alerts | No |
| `DATABASE_URL` | Database connection string (Supabase etc.) | No |
| `STRIPE_SECRET_KEY` | Stripe secret key for payments | No |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | No |

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
| `/tracking` | Client booking portal |
| `/admin` | Admin dashboard (password protected) |
| `/admin/leads` | Lead management |
| `/admin/bookings` | Booking management |
| `/admin/gallery` | Gallery management |
| `/admin/analytics` | Analytics overview |
| `/api/leads` | POST — submit a lead |
| `/api/bookings` | POST — create a booking |
| `/api/tracking` | GET — track by reference |

---

## WhatsApp Integration

The site uses WhatsApp deep links for all inquiry CTAs. The integration works as follows:

1. **Product inquiry** — clicking "Inquire via WhatsApp" on any product opens:
   ```
   https://wa.me/971553320051?text=Hi+Soundbox+Dubai...
   ```

2. **Booking request** — "WhatsApp Us" on homepage opens with a pre-filled message.

3. **AI Chat** — after the booking assistant collects event details, it generates a WhatsApp link with all the collected data pre-filled for quick submission.

4. **Lead notifications** — configure `WHATSAPP_API_TOKEN` to receive instant alerts when leads are submitted via the API route `/api/leads`.

WhatsApp number: **+971 55 332 0051**

---

## Admin Dashboard

Access at `/admin`. Default password: `soundbox2025` (change via `NEXT_PUBLIC_ADMIN_PASSWORD`).

**Features:**
- Overview dashboard with KPI cards
- Lead management (view, update status, reply via WhatsApp)
- Booking management (create, update status, track payment, generate SBX reference)
- Gallery management (add/remove portfolio items)
- Analytics (monthly leads, top services, booking conversion)

**Booking Reference Format:** `SBX-YYYY-NNNN` (e.g. `SBX-2025-0001`)
Generated automatically when a booking is created in the admin panel.

> ⚠️ Current storage is localStorage — data is browser-local. Connect a database (see `DATABASE_URL`) for production use.

---

## Adding Client Logos

1. Place new logo files in `public/client-logos/` (JPEG, PNG, WebP).
2. Update `data/clients.ts` — add a new entry:
   ```ts
   { id: "c11", name: "Client Name", logo: "/client-logos/your-file.jpeg" }
   ```
3. The logo will appear automatically on `/clients` and the homepage strip.

---

## Adding Gallery / Portfolio Items

**Via Admin Panel:**
1. Go to `/admin/gallery`
2. Click "Add Photo"
3. Fill in title, image URL, category, location, and tags

**Via Code (data file):**
1. Open `data/gallery.ts`
2. Add a new entry to the `galleryItems` array
3. Use `https://placehold.co/` for placeholders or provide a real image URL

---

## i18n (Arabic Support)

Translation strings are defined in `lib/i18n.ts` for both English (`en`) and Arabic (`ar`).
The Arabic strings support RTL layout. To enable language switching:
1. Add a language switcher component
2. Use `useContext` or a cookie/URL param to detect the current language
3. Apply `dir="rtl"` to the `<html>` tag when Arabic is active

---

## Deployment

### Vercel (recommended)
```bash
# Push to GitHub and import the repo in Vercel
# Add all environment variables in Vercel dashboard
```

### Self-hosted
```bash
npm run build
npm run start
```

---

## Project Structure

```
repo-clone/
├── app/
│   ├── layout.tsx              # Root layout (fonts, metadata)
│   ├── page.tsx                # Homepage
│   ├── globals.css             # Brand theme + Tailwind v4
│   ├── services/               # Services pages
│   ├── products/               # Products & bundles
│   ├── clients/                # Clients page
│   ├── gallery/                # Portfolio gallery
│   ├── tracking/               # Client booking portal
│   ├── admin/                  # Admin dashboard (protected)
│   ├── api/                    # API routes (leads, bookings, tracking)
│   ├── sitemap.ts              # Auto-generated sitemap
│   └── robots.ts               # robots.txt
├── components/
│   ├── layout/                 # Header, Footer, SiteShell
│   ├── home/                   # Homepage section components
│   ├── ui/                     # Reusable UI components
│   └── AIChat.tsx              # AI booking assistant widget
├── data/
│   ├── services.ts             # Service definitions
│   ├── products.ts             # Product/bundle catalog
│   ├── gallery.ts              # Gallery items
│   └── clients.ts              # Client logos
├── lib/
│   ├── whatsapp.ts             # WhatsApp link helpers
│   ├── storage.ts              # localStorage data layer
│   └── i18n.ts                 # EN/AR translations
├── public/
│   ├── logos/                  # Soundbox brand logos
│   └── client-logos/           # Client company logos (client-1.jpeg ... client-10.jpeg)
└── .env.local.example          # Environment variable template
```

---

## License

© 2025 Soundbox Electronic Equipment Rental LLC. All rights reserved.
