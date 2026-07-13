# Iwacu Movies

A Rwandan/African movie & series streaming platform: free + VIP (subscription) +
pay-per-view content, Mobile Money payments (MTN MoMo, Airtel Money), card and
PayPal support, an admin/creator upload dashboard, and SEO-friendly pages built
with Next.js.

**This is a production-structured starter codebase, not a deployed product.**
It will not process real payments or stream real video until you connect your
own Flutterwave merchant account and video storage credentials (see below).

## Tech Stack

- **Frontend + Backend:** Next.js 14 (App Router) - one codebase, deploys as one Vercel project
- **Database:** PostgreSQL via Prisma ORM
- **Auth:** JWT stored in an httpOnly cookie, bcrypt password hashing
- **Payments:** Flutterwave (covers MTN MoMo Rwanda, Airtel Money Rwanda, and cards in one API)
- **Video storage:** Cloudflare R2 (S3-compatible, no egress fees) via presigned upload URLs
- **Styling:** Tailwind CSS with a custom imigongo-inspired dark theme

## Folder Structure

```
src/
  app/
    page.tsx                 Homepage (hero + category rows)
    movie/[slug]/page.tsx     Movie detail page
    watch/[slug]/page.tsx     Player page, gated by canAccessMovie()
    login/, register/         Auth pages
    pricing/page.tsx           Plans + checkout
    admin/                     Admin dashboard + upload form
    search/page.tsx            Search results
    api/                       All backend routes (see API_DOCS.md)
    sitemap.ts, globals.css
  components/                 Navbar, Hero, MovieCard, VideoPlayer, AccessGate, etc.
  lib/
    db.ts                      Prisma client
    auth.ts                    JWT + password helpers
    access.ts                  THE access-control rule (free/VIP/PPV gating)
    storage.ts                 Presigned upload URLs for R2/S3
    payments/flutterwave.ts    Mobile Money + card charge calls
  middleware.ts                Protects /admin and /api/admin by role
prisma/
  schema.prisma                Database schema
  seed.ts                      Sample movies + admin account for local dev
```

## Local Setup

1. `npm install`
2. Copy `.env.example` to `.env` and fill in a local Postgres `DATABASE_URL`
   and a `JWT_SECRET` (generate one with `openssl rand -base64 32`). Payment
   and storage variables can stay blank until you're ready to test them.
3. `npx prisma migrate dev --name init`
4. `npm run db:seed` - creates sample movies and an admin login
   (`admin@iwacumovies.com` / `Admin123!` - change this immediately in a real deployment)
5. `npm run dev` - visit http://localhost:3000

## Connecting Mobile Money (MTN / Airtel)

See `DEPLOYMENT.md` for the full walkthrough. Short version: create a
Flutterwave Rwanda merchant account, get your API keys from their dashboard,
put them in `.env` as `FLUTTERWAVE_SECRET_KEY` / `FLUTTERWAVE_SECRET_HASH`,
and point a webhook at `/api/payments/webhook`. Flutterwave's mobile_money_rwanda
charge type already handles both MTN and Airtel - you don't need separate
integrations for each network.

**Security note:** keep any personal or business phone numbers used for
payouts in environment variables only - never commit them into source files
that might end up in a public GitHub repository.

## What still needs real infrastructure before this is "live"

- A registered domain + DNS pointed at your hosting
- A provisioned Postgres database (Railway, Neon, Supabase, or DigitalOcean all work)
- A verified Flutterwave (or Paypack Rwanda) merchant account - approval can take a few days
- A Cloudflare R2 bucket (or Cloudflare Stream if you want automatic adaptive
  bitrate without building your own transcoding pipeline)
- Actual movie files you own or are licensed to distribute
