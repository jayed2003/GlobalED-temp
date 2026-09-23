# GlobalEd Website

Marketing website and admin panel for **GlobalEd**, a Bangladesh-based IELTS
and study-abroad consultancy. The site's main job is lead generation: free
consultation bookings, IELTS test bookings and contact enquiries.

- **Public site:** home, 13 study destinations, IELTS pages, services, courses,
  about, blogs, events, FAQs, contact, the consultation / IELTS booking form,
  and the legal pages (Privacy Policy, Terms & Conditions, Return and Refund
  Policy).
- **Admin panel** (`/admin`): manage destinations, courses, blogs, events, IELTS
  content, reviews, leads and contact messages, plus admin accounts.

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
  lib/api/              admin API wrapper (auth, JSON parsing, error responses)
  lib/                  auth, db, email, rate limiting, Turnstile, upload and HTML sanitizers
  proxy.ts              request proxy: admin login gate, admin rate limit, CSP
  generated/prisma/     Prisma client (generated on install, not committed)
```

### Where content lives

- **Editable in the admin panel (database):** destinations, courses, blogs,
  events, IELTS page content and reviews. Edits show on the site immediately.
- **Hard-coded in `src/data/`:** services, team, organization history,
  branches, FAQs, phone / email / WhatsApp, homepage stats, navigation labels
  and the legal pages (`legal.ts`). Changing these means editing the file and
  redeploying.

### Legal pages

`/privacy-policy`, `/terms-and-conditions` and `/return-and-refund-policy`,
content in `src/data/legal.ts`. They follow Global Citizen Limited /
GlobalEd's published policies on globaled.io, with these changes:

- Terms & Conditions: "Website" means globaled.io (the original said
  www.gcledu.com). Clause 3.1 about customer accounts is kept, as accounts
  are planned.
- Privacy Policy: added clauses on what this website collects, the service
  providers that process it, overseas storage, cookies, security measures,
  correction/deletion requests, children, and contact details (2.6, 3.3–3.4,
  4.3, 5.2–5.4, 6.3, 7.3–7.4, 11, 12). The original clauses are unchanged.

All three are linked in the footer and listed in the sitemap.

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

Copy `.env.example` to `.env` and fill it in — the template (with comments
for every variable) is committed; `.env` itself is never committed.

| Variable | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | Yes | Pooled Postgres connection, used by the app |
| `DIRECT_URL` | Yes | Direct Postgres connection, used by Prisma migrations |
| `AUTH_SECRET` | Yes | Signs admin session tokens |
| `BLOB_READ_WRITE_TOKEN` | Yes | Vercel Blob store for uploads (must be a public store) |
| `RESEND_API_KEY` | For email | Without it, emails are skipped but leads and messages still save |
| `RESEND_FROM_EMAIL`, `COMPANY_NOTIFY_EMAIL` | For email | Sender, and where new-lead alerts and contact messages are emailed. The sender must be on a domain verified in Resend, or Resend only delivers to the account owner. |
| `KV_REST_API_URL`, `KV_REST_API_TOKEN` | In production | Upstash Redis for rate limiting (set automatically by the Vercel integration) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | In production | Cloudflare Turnstile keys |
| `NEXT_PUBLIC_SITE_URL` | In production | Public URL used in the sitemap, robots.txt, metadata and links in admin emails |
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
- **Leads and Messages:** consultation / IELTS bookings and contact-form
  messages are saved and listed here. Each new lead is also emailed to
  `COMPANY_NOTIFY_EMAIL`. The sidebar shows how many are still New (refreshed
  every minute); set an item to Contacted / Replied / Closed to clear it.
- **Blog posts** are written in a rich text editor (headings, lists, links,
  images). The HTML is sanitized on save and on display.
- **Content rules:** duplicate names/titles/slugs and repeated list entries
  are refused; dates must be real and sensible (no future blog dates; an
  event's date must match its Upcoming / Previous status).
- Errors are shown as plain messages on the form; an expired session sends
  you back to the login page.

## Security

| Protection | Details |
|---|---|
| Rate limiting | Consultation and contact forms: 5 per 10 min and 20 per day per IP. Admin login: 5 per 15 min per email+IP, 20 per 15 min per IP. Uploads: 30 per 10 min per admin. Other admin changes: 60 per minute per admin. |
| Bot protection | Cloudflare Turnstile on the contact and consultation forms, verified server-side. Production refuses submissions if the keys are missing. |
| Input validation | Public forms accept plain-text strings only. HTML, script links, unknown fields and invalid dropdown values are rejected on the client and the server. Visitor text is escaped in emails. |
| Security headers | HSTS, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, and a strict per-request nonce-based Content-Security-Policy (set in `src/proxy.ts`). |
| Structured data | JSON-LD output is encoded so content can't break out of its `<script>` tag. |
| Search engines | `robots.txt` and `sitemap.xml` are public. The admin panel is excluded from the sitemap and marked `noindex`. Unknown URLs return a real 404. |
| Admin API | Every admin route shares one wrapper (`src/lib/api/admin-route.ts`): permission check, JSON-only bodies up to 1 MB, schema validation, and consistent JSON errors. |

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

## Change log

### Security and platform (Sept 2026)

1. **Dependencies upgraded:** Next.js 16, React 19.3, Prisma 7 (driver
   adapter, `prisma.config.ts`), latest Zod, React Hook Form, Tailwind, etc.;
   `npm audit` clean. Middleware renamed to `src/proxy.ts` (Next 16).
2. **Rate limiting** with Upstash Redis on the public forms, admin login,
   uploads and admin changes (limits in the Security table above).
3. **Cloudflare Turnstile** bot check on the contact and consultation forms,
   verified server-side.
4. **Plain-text-only public forms:** HTML/script input, unknown fields and
   invalid pick-list values are rejected; visitor text is escaped in emails.
5. **Upload sanitizer:** JPG, WebP and SVG only (no PNG), type detected from
   the file bytes, images re-encoded to strip metadata, SVGs cleaned.
6. **8-hour admin sessions**, counted from sign-in.
7. **Deleted admins lose access immediately;** permission changes apply on
   the next request.
8. **Security headers:** HSTS, X-Frame-Options, X-Content-Type-Options,
   Referrer-Policy, Permissions-Policy and a nonce-based CSP.
9. **JSON-LD output encoded** so content can't break out of its script tag.
10. **robots.txt and sitemap.xml public;** the admin panel is excluded and
    `noindex`.

### Admin and content (Sept 2026)

1. **Catch-all 404:** every unknown URL shows the branded 404 page with a
   real 404 status (the old loading skeleton made them return 200).
2. **Legal pages:** Privacy Policy, Terms & Conditions and Return and Refund
   Policy (see "Legal pages" above), linked in the footer and sitemap.
3. **New-lead alerts:** each consultation / IELTS booking is emailed to
   `COMPANY_NOTIFY_EMAIL`; the admin sidebar shows live counts of new leads
   and messages.
4. **Contact messages saved** to the database (`ContactMessage` model,
   migration `20260923172253_contact_messages`) and managed under Admin →
   Messages, with a new "Contact Messages" permission for editors.
5. **Rich text editor** (Tiptap) for blog content; HTML is sanitized on save
   and on display; older plain-text posts still work.
6. **Valid dates only:** no impossible or future blog dates, event dates must
   match their Upcoming / Previous status, IELTS bookings within 12 months.
7. **Common error handling** for every admin API route and page (invalid
   JSON, oversized requests, deleted items, expired sessions, server errors).
8. **Duplicate protection** for blogs, destinations, courses, events, IELTS
   content, reviews and admins: same slug, name/title or email (ignoring case
   and spacing), repeated list entries, and double-clicked submits.

Also fixed along the way: dashboard cards now respect editor permissions,
the IELTS form shows its list errors, blog pages use their intended reading
width, and `.env.example` is committed with every variable documented.
