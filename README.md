# GlobalEd Website

Marketing website and admin panel for **GlobalEd**, a Bangladesh-based IELTS
and study-abroad consultancy. The site's main job is lead generation: free
consultation bookings, IELTS test bookings and contact enquiries.

- **Public site:** home, 13 study destinations, IELTS pages, services, courses,
  about, blogs, events, FAQs, contact, and the consultation / IELTS booking form.
- **Admin panel** (`/admin`): manage destinations, courses, blogs, events, IELTS
  content, reviews and leads, plus admin accounts.

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4 |
| Database | PostgreSQL on Neon, via Prisma 7 (`@prisma/adapter-pg`) |
| Auth | Auth.js v5 (credentials, JWT sessions) |
| File storage | Vercel Blob (admin image uploads) |
| Email | Resend |
| Rate limiting | Upstash Redis (`@upstash/ratelimit`) |
| Bot protection | Cloudflare Turnstile |
| Forms | React Hook Form + Zod |
| Hosting | Vercel |

## Project structure

```
prisma/                 schema, migrations, seed script
prisma.config.ts        Prisma 7 config (connection URL, seed command)
src/
  app/(site)/           public pages
  app/admin/            admin panel (login + dashboard)
  app/api/              leads, contact, auth and admin API routes
  components/           layout, sections, cards, forms, admin UI
  data/                 content that is still hard-coded (see below)
  lib/content/          cached database reads used by the public pages
  lib/validation/       Zod schemas (shared by forms and API routes)
  lib/                  auth, db, email, rate limiting, Turnstile, upload sanitizer
  proxy.ts              request proxy: admin login gate, admin rate limit, CSP
  generated/prisma/     Prisma client (generated on install, not committed)
```

### Where content lives

- **Editable in the admin panel (database):** destinations, courses, blogs,
  events, IELTS page content and reviews. Edits show on the site immediately.
- **Hard-coded in `src/data/`:** services, team, organization history,
  branches, FAQs, phone / email / WhatsApp, homepage stats and navigation
  labels. Changing these means editing the file and redeploying.

## Local development

Requires Node.js 20.9 or newer.

```bash
npm install          # also generates the Prisma client
cp .env.example .env # then fill in the values (see below)
npm run dev          # http://localhost:3000
```

| Script | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | ESLint |
| `npx prisma migrate deploy` | Apply database migrations |
| `npx prisma db seed` | Seed the database (read the warning below first) |

> **Warning: the seed script deletes content.** `prisma/seed.ts` wipes all
> leads, destinations, courses, blogs, events and reviews, then reloads the
> sample data from `src/data/`. Only run it against an empty or throwaway
> database, never against production. It creates the first master admin from
> `SEED_ADMIN_*`, but never changes the password of an admin who already exists.

## Environment variables

See `.env.example` for the full list with comments.

| Variable | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | Yes | Pooled Postgres connection, used by the app |
| `DIRECT_URL` | Yes | Direct Postgres connection, used by Prisma migrations |
| `AUTH_SECRET` | Yes | Signs admin session tokens |
| `BLOB_READ_WRITE_TOKEN` | Yes | Vercel Blob store for uploads (must be a public store) |
| `RESEND_API_KEY` | For email | Without it, emails are skipped but leads still save |
| `RESEND_FROM_EMAIL`, `COMPANY_NOTIFY_EMAIL` | For email | Sender, and where contact enquiries go |
| `KV_REST_API_URL`, `KV_REST_API_TOKEN` | In production | Upstash Redis for rate limiting (set automatically by the Vercel integration) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | In production | Cloudflare Turnstile keys |
| `NEXT_PUBLIC_SITE_URL` | In production | Public URL used in the sitemap, robots.txt and metadata |
| `SEED_ADMIN_NAME`, `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD` | Seed only | First master admin account |

In local development, Turnstile falls back to Cloudflare's always-pass test
keys and rate limiting falls back to in-memory counters, so neither service is
needed to run the site.

## Admin panel

- Log in at `/admin/login`.
- **Roles:** one master `ADMIN` account has full access and manages the other
  accounts. `EDITOR` accounts only see the sections they have been given.
- **Sessions last 8 hours from login**, however active the admin is.
- Deleting an admin, or changing their permissions, takes effect on their next
  request.
- Image uploads accept **JPG, WebP and SVG only** (max 5 MB). JPG and WebP are
  re-encoded to strip metadata such as GPS location. SVGs are cleaned of
  scripts and external links.

## Security

| Protection | Details |
|---|---|
| Rate limiting | Consultation and contact forms: 5 per 10 min and 20 per day per IP. Admin login: 5 per 15 min per email+IP, 20 per 15 min per IP. Uploads: 30 per 10 min per admin. Other admin changes: 60 per minute per admin. |
| Bot protection | Cloudflare Turnstile on the contact and consultation forms, verified server-side. Production refuses submissions if the keys are missing. |
| Input validation | Public forms accept plain-text strings only. HTML, script links, unknown fields and invalid dropdown values are rejected on the client and the server. Visitor text is escaped in emails. |
| Security headers | HSTS, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, and a strict per-request nonce-based Content-Security-Policy (set in `src/proxy.ts`). |
| Structured data | JSON-LD output is encoded so content can't break out of its `<script>` tag. |
| Search engines | `robots.txt` and `sitemap.xml` are public. The admin panel is excluded from the sitemap and marked `noindex`. |

Because the CSP nonce is new on every request, all pages are rendered per
request. Database content is still cached, so pages stay fast.

## Deploying on Vercel

1. Add the environment variables in **Project → Settings → Environment Variables**.
   - Mark `NEXT_PUBLIC_TURNSTILE_SITE_KEY` as a normal (Config) variable. It is
     public by design, and Vercel warns if a `NEXT_PUBLIC_` variable is marked
     sensitive.
   - For the **Preview** environment, use Cloudflare's test keys
     (`1x00000000000000000000AA` and `1x0000000000000000000000000000000AA`),
     because preview URLs are not in the Turnstile widget's hostname list.
2. Add Upstash Redis from **Storage → Marketplace** and connect it to the
   project. Leave the variable prefix at its default.
3. `NEXT_PUBLIC_` variables are built into the page code, so **redeploy after
   changing them**, with the build cache turned off.
4. Recommended: put Vercel Functions, Upstash and Neon in the same region
   (Singapore) to keep database and Redis calls fast.

### Going live on globaled.io

- Set `NEXT_PUBLIC_SITE_URL` to `https://globaled.io`.
- Make sure `globaled.io` is in the Turnstile widget's hostname list.
- HSTS makes browsers require HTTPS on `globaled.io` **and all its
  subdomains** for two years. Before switching, confirm that every subdomain in
  use (for example `mail.`, `webmail.`, `cpanel.`) works over HTTPS.
