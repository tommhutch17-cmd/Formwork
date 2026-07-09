# START HERE, TOM — easiest possible setup

Do one section at a time.

## What this version has

This version has 4 proper tools, not a huge fake list:

1. Construction Estimate Generator
2. Variation Tracker
3. Site Diary
4. Snagging List

It also has SEO basics added:

- page title aimed at “construction estimate generator”
- a dedicated `/estimate-generator` page
- `sitemap.xml`
- `robots.txt`
- clean public landing/pricing pages

---

# LEVEL 1 — run it on your laptop

You already did this once.

Open the inner folder:

`formwork-app`

Then in VS Code terminal:

```bash
npm.cmd install
npm.cmd run dev
```

Open:

`http://localhost:3000`

---

# LEVEL 2 — make login/database/logo upload work

You need Supabase for this.

1. Create a Supabase account
2. Create a project called Formwork
3. Go to SQL Editor
4. Open this file in VS Code:

`supabase/schema.sql`

5. Copy everything in it
6. Paste into Supabase SQL Editor
7. Click Run
8. Go to Project Settings > API
9. Copy the Project URL and anon key into `.env.local`
10. Copy service_role key into `.env.local` as well

Then stop the terminal with CTRL + C and restart:

```bash
npm.cmd run dev
```

---

# LEVEL 3 — get it live online

Use Vercel.

The simple route is:

1. Create GitHub account
2. Create Vercel account
3. Put this folder on GitHub
4. Import the GitHub repo into Vercel
5. Add the same environment variables in Vercel
6. Click Deploy

Once deployed, you will get a live URL like:

`https://formwork-something.vercel.app`

Later you can buy a proper domain like:

`formworktools.co.uk`

---

# LEVEL 4 — get it showing on Google

Google will not show it instantly just because it is live.

Do this after deployment:

1. Go to Google Search Console
2. Add your live website
3. Verify it
4. Submit this sitemap:

`https://your-domain.com/sitemap.xml`

The site already creates the sitemap for you.

---

# LEVEL 5 — payments

Do not do complicated Stripe webhooks first.

Use Stripe Payment Links first:

1. Create a Stripe account
2. Create product: Formwork Early Access
3. Price it at £49 or £9/month
4. Create a Payment Link
5. Put that link on the pricing button
6. Manually approve the first few users

Automated Stripe checkout can come later.
