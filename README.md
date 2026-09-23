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
  lib/admin-list/       admin list search, filters, date ranges and paging
  lib/                  auth, db, email, rate limiting, Turnstile, upload and HTML
                        sanitizers, page SEO metadata (seo.ts), blog SEO analysis
                        (seo-analysis.ts)
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

- Terms & Conditions: "Website" means globaled.io. Clause 3.1 about customer accounts is kept, as accounts
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
| `SEED_ADMIN_ONLY=1 npx prisma db seed` | Create the master admin only — deletes nothing (safe on any database) |
| `npx prisma db seed` | Full reset with sample content — empty databases only (see below) |

> **The full seed deletes content, so it protects itself.** `prisma/seed.ts`
> wipes all leads, destinations, courses, blogs, events and reviews, then
> reloads the sample data from `src/data/`. It refuses to run:
>
> - in a production environment (`NODE_ENV=production` or on Vercel) — ever;
> - on a database that already has any content, leads, contact messages or
>   more than one admin — unless you set `SEED_CONFIRM_RESET` to that
>   database's exact host name (the script prints it).
>
> To create the first master admin on a real database, use
> `SEED_ADMIN_ONLY=1 npx prisma db seed`. An existing admin is left unchanged
> unless you also set `SEED_ADMIN_RESET_PASSWORD=1` (resets its password to
> `SEED_ADMIN_PASSWORD` — useful if you're locked out).

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
| `NEXT_PUBLIC_SITE_URL` | In production | Public URL for canonical links, share metadata, the sitemap, robots.txt and links in admin emails. If unset, Vercel's production URL is used, then `https://globaled.io` |
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
- **Every list** (destinations, courses, blogs, events, reviews, leads,
  messages, admins) has a search box, a filter under each column, a date
  filter (last hour / 24 hours / 7 days / custom range), row checkboxes with
  "select all" and "Delete selected". Filters live in the URL, so a filtered
  view can be bookmarked or shared. Leads, messages and reviews show 10 per
  page; Leads has **Download CSV** (all leads matching the current filters,
  opens correctly in Excel, Bangla included).
- **Image uploads** accept **JPG, WebP and SVG only** (max 5 MB), and every
  image needs **alt text** (a short description for screen readers and
  search engines). Choose **Optimized** (default: resized to fit 1920px,
  compressed, served in the best size/format for each visitor) or
  **Original** (full size and quality, served exactly as uploaded). Images
  inserted into a blog post and blog OG images are always optimized. Metadata
  such as GPS location is always stripped; SVGs are cleaned of scripts.
- **Leads and Messages:** consultation / IELTS bookings and contact-form
  messages are saved and listed here. Each new lead is also emailed to
  `COMPANY_NOTIFY_EMAIL`. A red **New** badge (and the sidebar count) shows
  what nobody has opened yet — it goes away once you open the item, and
  "Mark as unread" brings it back. The status (Pending / Contacted or
  Replied / Closed) is set separately.
- **Blog posts** are written in a rich text editor (headings, lists, links,
  images with alt text) and can be written in **Bangla** — it's shown in a
  proper Bengali font and marked as Bangla for browsers and search engines.
  The HTML is sanitized on save and on display. The cover image has a large
  16:9 preview (the shape it's shown in on the site); you can drop an image
  onto it.
- **Publishing a blog post:** *Publish now*, or *Schedule for later* with a
  date and time (Bangladesh time, up to a year ahead; past dates and times
  can't be picked). A scheduled post is hidden from the site, blog list and
  sitemap until its time, then appears on its own. Editing keeps the
  original date unless you choose otherwise. The Blogs list marks
  scheduled posts and can filter Published / Scheduled.
- **Blog SEO panel** (under the content): focus keyword, SEO title (counter
  /60), meta description (counter /156), an **OG image** for social shares
  (JPG/WebP, 1200 × 630 recommended; falls back to the cover image) and a
  Google-style **search preview**. Next to it, a live **SEO analysis** and
  **Readability** score out of 100 with a checklist (keyword placement and
  density, title/description length, word count, links, alt text; Flesch
  reading ease, long sentences, passive voice, transition words, paragraph
  and subheading lengths). Readability is scored for English posts only.
  Empty SEO fields fall back to the post title, excerpt and cover.
- **Content rules:** duplicate names/titles/slugs and repeated list entries
  are refused; dates must be real and sensible (no past blog publish dates;
  an event's date must match its Upcoming / Previous status).
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
| Search engines | `robots.txt` and `sitemap.xml` are public. The admin panel is excluded from the sitemap and marked `noindex`. Unknown URLs return a real 404. Every page has a canonical URL and Open Graph / Twitter share metadata (`src/lib/seo.ts`); the default share image is `/share-image.png`. |
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
5. **Database changes are not applied by the build.** Run
   `npx prisma migrate deploy` against the production database before (or
   right after) deploying code that needs a new migration. Every migration in
   `prisma/migrations/` so far is already applied to production, and all of
   them only add columns or tables, so the live site keeps working in
   between.

### Going live on globaled.io

- Set `NEXT_PUBLIC_SITE_URL` to `https://globaled.io`.
- Make sure `globaled.io` is in the Turnstile widget's hostname list.
- HSTS makes browsers require HTTPS on `globaled.io` **and all its
  subdomains** for two years. Before switching, confirm that every subdomain in
  use (for example `mail.`, `webmail.`, `cpanel.`) works over HTTPS.

### Still to do before launch

- **Email:** verify a sending domain in Resend and set `RESEND_FROM_EMAIL` to
  an address on it. Until then Resend only delivers to the account owner, so
  lead alerts don't reach `COMPANY_NOTIFY_EMAIL`.
- **Real photos:** course images, blog covers, event images, two reviews and
  the team photos (`src/data/team.ts`) are still placeholders.
- **Events:** "Global Education Expo 2026 — Dhaka" (12 Sept) and "Free IELTS
  Mock Test Day" (20 Sept) are in the past but still marked Upcoming — edit
  them to Previous in the admin panel.
- **Existing blog posts:** fill in their SEO fields (focus keyword, meta
  description, OG image) — the old sample covers are SVGs, which social
  networks don't show, so shares use the default GlobalEd card until an OG
  image or a JPG/WebP cover is uploaded.

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
6. **Valid dates only:** no impossible dates, event dates must match their
   Upcoming / Previous status, IELTS bookings within 12 months. (Blog dates
   were later replaced by scheduled publishing — see below.)
7. **Common error handling** for every admin API route and page (invalid
   JSON, oversized requests, deleted items, expired sessions, server errors).
8. **Duplicate protection** for blogs, destinations, courses, events, IELTS
   content, reviews and admins: same slug, name/title or email (ignoring case
   and spacing), repeated list entries, and double-clicked submits.

Also fixed along the way: dashboard cards now respect editor permissions,
the IELTS form shows its list errors, blog pages use their intended reading
width, and `.env.example` is committed with every variable documented.

### Admin tools, images and SEO (Sept 2026)

1. **Seed protection:** the destructive seed refuses to run in production or on
   any database with content (override only by typing the database host);
   `SEED_ADMIN_ONLY=1` creates the admin without deleting anything.
2. **One lead schema:** the booking form and `/api/leads` validate with the
   same `leadSchema` object (and the contact form with `contactSchema`).
3. **Unused images removed:** 28 files nothing referenced; fixed a broken
   sister-organization logo. Placeholders still shown on the site (course
   images, blog covers, event images, 2 reviews, team photos) remain until
   real photos are uploaded.
4. **Admin list search and filters:** global search, per-column filters, date
   filters and select-all/bulk delete on every list.
5. **Pagination:** 10 per page on leads, messages and reviews.
6. **Lead CSV download** that follows the active filters.
7. **Read/unread:** the New badge goes away once a lead or message is opened.
8. **GlobalEd logo** on the admin login page and sidebar (logo files also
   shrunk from ~1.3 MB to ~30 KB each).
9. **Image optimization:** Optimized (default) / Original per upload; images
   in blog posts are served through Next.js image optimization too.
10. **Share image and metadata:** 1200×630 `/share-image.png` plus full Open
    Graph / Twitter tags on every page.
11. **Canonical URLs** on every page (without query strings).
12. **Bangla blog posts:** Noto Sans Bengali font and `lang="bn"` marking.
13. **Alt text** required for every content image, editable in the editor.

Database migration `20260923193802_leads_read_and_image_alts` (additive;
already applied to production) adds read/unread and the alt-text columns.

Follow-up to this batch:

- **Scheduled publishing:** blog posts are published now or scheduled for a
  date and time; past dates can't be chosen.
- **Blog editor:** the Optimized / Original buttons were removed from the
  content toolbar (images in the body are always optimized); the cover
  image has a large 16:9 preview and drop zone.
- **SEO panel** with OG image, search preview, and SEO / readability scores
  (`src/lib/seo-analysis.ts`, `src/components/admin/SeoPanel.tsx`). The
  public post uses the SEO title, meta description and OG image when set.

Database migration `20260923201131_blog_seo_fields` (additive; already
applied to production) adds the blog SEO columns.
