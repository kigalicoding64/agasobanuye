# Deployment Guide

## 1. Database

Pick one (all have free tiers suitable for starting out):
- **Neon** (neon.tech) - serverless Postgres, easiest to pair with Vercel
- **Railway** (railway.app) - Postgres + can also host background jobs later
- **Supabase** - Postgres + extra features you may not need yet

Copy the connection string into `DATABASE_URL`.

Run migrations against the real database before first deploy:
```
npx prisma migrate deploy
npm run db:seed   # optional - remove or change the admin password after
```

## 2. Hosting the app

Vercel is the simplest choice since this is a single Next.js project (it hosts
both the frontend and the `/api` backend together):

1. Push this repo to GitHub.
2. Import it in Vercel.
3. Add every variable from `.env.example` (with real values) under
   Project Settings -> Environment Variables.
4. Deploy. Vercel gives you a `*.vercel.app` URL immediately.

## 3. Domain name

1. Register a domain (e.g. via Namecheap, or a Rwandan registrar if you want a
   `.rw` extension - those go through RICTA, https://www.ricta.org.rw).
2. In Vercel: Project Settings -> Domains -> add your domain, then update
   your registrar's nameservers or A/CNAME records as Vercel instructs.
3. Update `NEXT_PUBLIC_SITE_URL` to the real domain and redeploy.

## 4. Flutterwave (Mobile Money + Cards)

1. Create an account at https://dashboard.flutterwave.com and select Rwanda
   as your business country.
2. Complete their KYC/business verification - required before LIVE keys will
   move real money. TEST keys work immediately for development.
3. Dashboard -> Settings -> API Keys: copy the Secret Key into
   `FLUTTERWAVE_SECRET_KEY`.
4. Dashboard -> Settings -> Webhooks: set the URL to
   `https://yourdomain.com/api/payments/webhook`, and copy the secret hash
   shown there into `FLUTTERWAVE_SECRET_HASH`.
5. Test a mobile money charge in TEST mode using Flutterwave's documented
   test phone numbers before going live:
   https://developer.flutterwave.com/docs/mobile-money-rwanda
6. Switch to LIVE keys once your account is approved and you've tested the
   full flow end-to-end (charge -> webhook -> subscription activated).

## 5. Video storage (Cloudflare R2)

1. Create a Cloudflare account, enable R2, create a bucket (e.g. `iwacu-movies-videos`).
2. Generate an R2 API token with read/write access to that bucket.
3. Fill in `S3_ENDPOINT`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`,
   `S3_BUCKET_NAME` in `.env`.
4. (Optional but recommended for "automatic quality adjustment") Either:
   - Use **Cloudflare Stream** instead, which auto-transcodes uploads into an
     adaptive HLS manifest - no extra encoding work on your side, or
   - Run your own transcoding step (e.g. with ffmpeg, triggered by an upload
     webhook) to produce 1080p/720p/480p/360p renditions and feed their URLs
     into the `qualityRenditions` prop already wired up in `VideoPlayer.tsx`.

## 6. Going live checklist

- [ ] Real domain pointed at the deployment
- [ ] Postgres provisioned and migrated
- [ ] Flutterwave LIVE keys set and webhook verified
- [ ] Admin seed password changed
- [ ] At least one piece of content you have legal rights to uploaded
- [ ] Privacy policy + terms of service pages added (required for payment processors)
- [ ] Google Search Console set up with the sitemap at `/sitemap.xml`
