# Formwork App Starter

This is the real starter codebase for Formwork: a Next.js app with Supabase auth/database/storage, Stripe Checkout, company branding, projects, estimate builder, branded print/PDF view, and proper `.xlsx` export.

It is not just a single HTML demo. This is the structure you can upload to GitHub and deploy to Vercel.

## What is built

- Landing page using the Formwork construction-paperwork brand
- Supabase email/password auth
- Company profile page
- Company logo upload to Supabase Storage
- Project creation
- EST-01 estimate generator
- Save estimate rows to database
- Branded print / save-as-PDF view
- Proper `.xlsx` export using ExcelJS
- Stripe Checkout route for one-off and monthly pricing
- Stripe webhook route to unlock/update subscription status
- Supabase RLS SQL schema

## Tech stack

- Next.js App Router
- Supabase Auth + Postgres + Storage
- Stripe Checkout
- ExcelJS for real XLSX generation
- Vercel for deployment

## Local setup

1. Install Node.js LTS.
2. Create a Supabase project.
3. In Supabase SQL Editor, run `supabase/schema.sql`.
4. Copy `.env.example` to `.env.local` and fill in your keys.
5. Install dependencies:

```bash
npm install
```

6. Run locally:

```bash
npm run dev
```

Then open `http://localhost:3000`.

## Supabase setup

In Supabase:

1. Create a new project.
2. Go to SQL Editor.
3. Paste and run `supabase/schema.sql`.
4. Go to Authentication > Providers.
5. Enable Email provider.
6. For local testing, you can disable email confirmations so signup logs in faster.
7. Go to Storage and confirm the `company-logos` bucket exists.

## Stripe setup

In Stripe test mode:

1. Create product: `Formwork Early Access`.
2. Add one-off price, for example £49.
3. Copy the price ID to `STRIPE_PRICE_FULL_PACK`.
4. Create product: `Formwork Pro Monthly`.
5. Add recurring monthly price, for example £9/month.
6. Copy the price ID to `STRIPE_PRICE_MONTHLY`.
7. Add your Stripe secret key to `.env.local`.
8. Add a webhook endpoint:

```text
https://your-domain.com/api/stripe/webhook
```

Listen for:

```text
checkout.session.completed
customer.subscription.updated
customer.subscription.deleted
```

9. Copy the webhook secret into `STRIPE_WEBHOOK_SECRET`.

## Deploy to Vercel

1. Push this folder to GitHub.
2. Import the GitHub repo into Vercel.
3. Add all environment variables in Vercel Project Settings.
4. Deploy.
5. Update `NEXT_PUBLIC_SITE_URL` to your live Vercel/domain URL.
6. Update the Stripe webhook URL to your live URL.

## MVP advice

Do not build all 10 tools before selling.

Sell this as:

> Create branded construction estimates with your logo, company details, VAT and payment terms in minutes.

First MVP:

- Company profile
- Project setup
- Estimate generator
- PDF print view
- XLSX export
- Stripe payment

Then add:

1. Variation tracker
2. Site diary
3. Snagging list
4. Interim valuation tracker
5. Final account tracker

## Important notes

- The app uses Supabase RLS so users can only access their own company, project and estimate data.
- The Stripe webhook uses the Supabase service role key. Keep that key private and never expose it in the browser.
- The current PDF path is a professional print view. Users can press print and save as PDF. A later version could generate server-side PDFs with a dedicated PDF library.
- The XLSX export is a real `.xlsx` file, not fake `.xls`/CSV.
