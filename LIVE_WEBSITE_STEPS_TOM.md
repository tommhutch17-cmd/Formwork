# Make Formwork live — click-by-click version

## Part A — get the app online with Vercel

### 1. Make a GitHub account
Search Google for:

`GitHub sign up`

Create an account.

### 2. Download GitHub Desktop
Search Google for:

`GitHub Desktop download`

Install it.

### 3. Add the Formwork folder to GitHub Desktop
Open GitHub Desktop.

Click:

`File > Add local repository`

Pick the inner folder called:

`formwork-app`

If it says it is not a repository, click:

`create a repository`

Name it:

`formwork-app`

Click:

`Publish repository`

Keep it private for now.

### 4. Make a Vercel account
Search Google for:

`Vercel sign up`

Sign in with GitHub.

### 5. Import the project
In Vercel click:

`Add New > Project`

Choose:

`formwork-app`

Click:

`Import`

### 6. Add environment variables
Before deploy, add these from your `.env.local`:

`NEXT_PUBLIC_SUPABASE_URL`
`NEXT_PUBLIC_SUPABASE_ANON_KEY`
`SUPABASE_SERVICE_ROLE_KEY`
`NEXT_PUBLIC_SITE_URL`

For `NEXT_PUBLIC_SITE_URL`, use your Vercel URL first. Later change it to your real domain.

### 7. Deploy
Click:

`Deploy`

When it finishes, Vercel gives you a live link.

---

## Part B — get Google to find it

Once the site is live:

1. Open Google Search Console
2. Add property
3. Choose URL prefix
4. Paste your live website URL
5. Verify ownership
6. Go to Sitemaps
7. Submit:

`/sitemap.xml`

The search phrase I would aim for first is not just “estimate generator”. That is too broad.

Aim for:

- construction estimate generator
- contractor estimate generator
- building estimate generator UK
- branded estimate generator for contractors
- variation tracker for contractors
- site diary app for small contractors

---

## Part C — what not to do yet

Do not run paid ads yet.
Do not build 10 tools yet.
Do not stress about the perfect domain yet.

Get this live, get 5 people to test it, then improve it.
