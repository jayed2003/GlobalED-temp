# GlobalEd Website

Marketing website and admin panel for **GlobalEd**, a Bangladesh-based IELTS
and study-abroad consultancy. The site's main job is lead generation: free
consultation bookings, IELTS test bookings and contact enquiries.

- **Public site:** home, 13 study destinations, IELTS pages, services, courses,
  about, blogs, events, FAQs, contact, the consultation / IELTS booking form,
  and the legal pages (Privacy Policy, Terms & Conditions, Return and Refund
  Policy).
- **Admin panel** (`/admin`): a CMS for the whole site — every page's text and
  images, destinations, courses, blogs, events, services, FAQs, team, reviews,
  IELTS content, site settings and branches — with drafts and preview, plus
  leads, contact messages, a dashboard, an activity log and admin accounts.
  Layouts, buttons, menus and the legal pages stay in code. Non-technical
  editors: see the [Admin guide](#admin-guide-for-editors).

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
prisma/                 schema, migrations, seed script (sample content in seed-data/)
prisma.config.ts        Prisma 7 config (connection URL, seed command)
src/
  app/(site)/           public pages
  app/admin/            admin panel (login + dashboard)
  app/api/              leads, contact, auth and admin API routes
  components/           layout, sections, cards, forms, admin UI
  data/                 content kept in code: navigation and the legal pages
  lib/content/          cached database reads used by the public pages
  lib/pages/            the editable pages: each page's sections and fields
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
  events, IELTS page content, reviews, **site settings** (phone, email,
  WhatsApp, social links, key numbers, footer text, call-to-action banner),
  **branches**, **services**, **FAQs**, **team members**, and the **text and
  images of every page** (home, about, contact, consultation, listing pages,
  IELTS — Admin → Pages). Edits show on the site immediately; pages, and
  destinations, courses, events, services and blog posts saved as drafts,
  appear when published.
- **Hard-coded in `src/data/`:** navigation (`navigation.ts` — its
  Destinations, Courses and Services menus list the published items
  automatically) and the legal pages (`legal.ts`). Changing these means
  editing the file and redeploying. Page layouts, buttons and menus stay in
  code by design.

> **Editing from a local copy:** local `.env` points at the production
> database, but saving content locally only refreshes the *local* cache —
> the live site keeps showing what it had cached until something is saved
> through the live admin panel. Make real content changes on the live site.

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

Requires **Node.js 24** — pinned in `package.json` (`engines`), which is also
what Vercel runs.

> **Keep `isomorphic-dompurify` at exactly 2.26.0.** It provides the DOM for
> the blog HTML and SVG upload sanitizers. Later versions use jsdom 27+,
> whose dependencies are ESM-only; Vercel functions can't `require()` them,
> so blog post pages, blog saving and image uploads crash with
> `ERR_REQUIRE_ESM` / `FUNCTION_INVOCATION_FAILED`. DOMPurify itself (the
> actual sanitizer) still updates normally within 3.x.

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
> reloads the sample data from `prisma/seed-data/`. (Pages, site settings,
> branches, services, FAQs and team come pre-filled from the migrations.)
> It refuses to run:
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
- **Roles:** one master `ADMIN` account has full access, manages the other
  accounts and sees the Activity log. `EDITOR` accounts only see the sections
  they have been given: Pages, Blogs, Events, Destinations, Courses,
  Services, IELTS Content, Team, FAQs, Reviews, Leads, Contact Messages, and
  Site Settings & Branches (one permission each).
- **Sessions last 8 hours from login**, however active the admin is.
- Deleting an admin, or changing their permissions, takes effect on their next
  request.
- **Every list** (destinations, courses, blogs, events, services, FAQs,
  team, reviews, branches, leads, messages, admins) has a search box, a filter under each column, a date
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
- **Publishing a blog post:** *Publish now*, *Schedule for later* with a
  date and time (Bangladesh time, up to a year ahead; past dates and times
  can't be picked), or *Save as draft*. A scheduled post is hidden from the
  site, blog list and sitemap until its time, then appears on its own; a
  draft stays hidden until it's published. Both can be checked with
  **Preview**. Editing keeps the original date unless you choose otherwise
  (or *Move to drafts*). The Blogs list marks drafts and scheduled posts and
  can filter Published / Scheduled / Draft.
- **Drafts for destinations, courses and events:** each editor has a
  **Publishing** card — *Published* (on the site, in the menu and booking
  form) or *Draft* (hidden from visitors, viewable with **Preview**). New
  items start as drafts ("Save Draft"; switch to Published to go live
  straight away). Editing a published item saves it live; to work on it
  privately, move it back to Draft first. Lists show the status and filter
  by it. The booking form only offers published destinations and courses.
- **Search & sharing** for destinations, courses, events and services: SEO
  title, meta description and share image with a search preview. Empty
  fields fall back to the page's usual title, text and image.
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
- **Editing:** every editor has a save bar that stays in view, says when
  there are unsaved changes (or why a save failed), and saves with
  **Ctrl+S**. Leaving a page with unsaved changes asks first. After saving, a
  notification offers **View on site**. Lists of items inside a form
  (key points, universities, FAQs…) are reordered by dragging the handle —
  or with the keyboard: focus the handle, Space, arrow keys, Space.
- **Preview:** `/api/admin/preview?path=/some-page` shows the site with
  unpublished changes (Next.js draft mode) and a "Preview" banner with
  **Exit preview**. Only signed-in admins with access to that section can
  turn it on; visitors never see drafts.
- **Site settings** (Settings → Site Settings): brand name and tagline,
  hotline, email, WhatsApp number, social links (leave one empty to hide its
  icon), key numbers (students placed, partner universities, visa success,
  years), footer text and the call-to-action banner's title and text (its
  buttons stay as designed). Links are checked: social links must be
  https:// on the matching site.
- **Pages** (Content → Pages): the text and images of every page, in a
  fixed layout — headlines, intros, section headings, the home page steps and
  reasons (with icons), the About story, milestones, mission, vision and
  sister organizations, photos, and each page's **Search & sharing** (SEO
  title, description, share image). Home page sections can be hidden.
  **Save draft** keeps changes private, **Preview** shows them on the real
  site, **Publish** makes them live, **Discard draft** throws them away.
  Buttons and where they link stay as designed.
- **Branches** (Company → Branches): name, address, phone numbers, email,
  hours, a Google map (paste the "Embed a map" code; only Google Maps embeds
  are accepted) and **Shown on site**. Drag to reorder with **Reorder**. The
  booking form offers the shown branches, and the server checks against the
  same list. At least one branch must stay shown. Leads keep the branch
  *name*, so renaming or removing a branch never breaks old leads.
- **Services** (Content → Services): name, web address (slug), icon,
  summary, "How we help", benefits, process steps and Search & sharing. A new
  service starts as a **Draft** — hidden from visitors, the menu, footer and
  sitemap, but viewable with **Preview** — until it's set to **Published**.
  Drag to reorder with **Reorder** (menu, home page and services page follow).
- **FAQs** (Company → FAQs): question, answer, category (General / Study
  Abroad / IELTS), **Show on the FAQs page**, and **Also show on the Services
  page** (the "Common Questions" list there). Duplicate questions are refused.
- **Team** (Company → Team): name, role, photo with alt text, optional short
  bio, **Board of Directors** or **Team**, and **Show on the Our Team page**.
  Each group has its own order (**Reorder board** / **Reorder team**).
- **Dashboard:** a greeting and quick actions; unread leads, leads in the
  last 7 and 30 days and unread messages; a leads-per-week chart (12 weeks);
  **Needs attention** (past events still marked Upcoming, pages with
  unpublished changes, drafts, scheduled posts, posts without a meta
  description — each links to the right screen); recent activity; and how
  much content is live. Every part only shows the sections that admin can
  open.
- **Activity log** (Overview → Activity, master admin only): every create,
  edit, publish, delete, status change and sign-in (who, what, when), kept
  for 6 months (older entries are cleared automatically as new ones are
  logged), with search and filters by admin, action, section and date.
  Items that still exist link to their editor; deleting an admin keeps their
  name on past entries. Read-only.
- Errors are shown as plain messages on the form; an expired session sends
  you back to the login page.

## Admin guide (for editors)

How the GlobalEd team updates the website without a developer. Sign in at
`/admin` on the website with the account the master admin made for you — you
only see the sections you've been given.

### Where to change what

| To change… | Go to |
|---|---|
| Headlines, intros, photos and search text of a page (home, about, contact, IELTS…) | Content → Pages |
| Phone, email, WhatsApp, social links, the key numbers, footer text, the "book a consultation" banner | Settings → Site Settings |
| An office: address, phone numbers, hours, map | Company → Branches |
| A country page | Content → Destinations |
| A course, a service | Content → Courses / Services |
| Blog posts | Content → Blogs |
| Events (and marking them Previous once they're over) | Content → Events |
| The text on the IELTS pages (what IELTS is, reasons, GlobalEd's services, preparation, success stories) | Content → IELTS Content |
| The IELTS pages' header intros, the hub's card texts and their search text | Content → Pages (IELTS group) |
| Questions on the FAQs page | Company → FAQs |
| People on Our Team | Company → Team |
| Student reviews | Company → Reviews |
| Bookings and contact-form messages | Inbox → Leads / Messages |

The IELTS pages are the one place split in two: their text is in **IELTS
Content**, while the headers, card texts and search settings are in
**Pages**.

Menus, buttons, page layouts and the legal pages can't be changed here — ask
a developer.

### Saving, drafts and preview

- Save with the green button at the bottom of the form (or **Ctrl+S**). The
  bar tells you when there are unsaved changes, and leaving the page asks
  first.
- **Pages:** **Save draft** keeps your changes private, **Preview** opens the
  real page with them (only you see it), **Publish** puts them live, and
  **Discard draft** throws them away.
- **Destinations, courses, events and services:** new ones start as a
  **Draft**. Check it with **Preview** (top right), then set Publishing to
  **Published** and save. Saving something that's already published changes
  the live site straight away — to work on it privately, set it back to Draft
  first.
- **Blog posts:** **Publish now**, **Schedule for later** (it appears by
  itself at that time) or **Save as draft**.
- While previewing, a yellow bar at the bottom of the site says so — click
  **Exit preview** when you're done.

### Images

- JPG or WebP (SVG for logos), up to 5 MB. Keep **Optimized** unless a photo
  has to stay exactly as uploaded.
- Every image needs **alt text**: a short description of what's in it, e.g.
  "Students at the UK education fair in Dhaka". It's read aloud to blind
  visitors and used by Google.

### Search & sharing

Pages, posts, destinations, courses, events and services each have an SEO
title, a description and a share image (what Facebook and WhatsApp show; 1200
× 630 works best). Leave them empty to use the page's own title, summary and
picture — the search preview shows how it will look on Google.

### Order and visibility

- In a form, drag the ⋮⋮ handle to reorder items. In a list (services, FAQs,
  team, branches), **Reorder** changes the order on the site.
- Prefer hiding to deleting: FAQs, team members and branches have **Show on
  site**, and home page sections can be hidden in Pages → Home. Deleting
  can't be undone.

### The dashboard

**Needs attention** lists what to fix: events still marked Upcoming after
their date, pages with unpublished changes, drafts, scheduled posts, and posts
without a meta description. The master admin can see every change, by
everyone, in Overview → Activity.

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
  the six Team photos (Company → Team) are still placeholders.
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

### Full-site CMS (Sept 2026)

Every part of the site made editable from the admin panel, in phases
(page layouts, navigation, buttons and the legal pages stay in code).

**Phase 0 — foundations:**
- Admin sidebar grouped into Overview / Content / Company / Inbox / Settings,
  with the current section highlighted and a menu on phones and tablets.
- One editor look everywhere: page header with breadcrumb, status and
  **View on site**; sticky save bar with unsaved-changes indicator, Ctrl+S
  and a leave-page warning; success notifications.
- Drag-and-drop reordering (`@dnd-kit`, keyboard accessible) for lists
  inside forms; shared icon set (`src/lib/icons.ts`) and icon picker; shared
  SEO fields (`SeoFields.tsx`) used by the blog SEO panel.
- Activity log (`src/lib/activity.ts`) wired into every admin change and
  sign-in; preview mode (`src/lib/preview.ts`, `/api/admin/preview`).
- New permissions for the CMS sections: Pages, Services, FAQs, Team, Site
  Settings (each offered in the admin form once its section shipped).

Database migration `20260924000000_activity_log_and_cms_permissions`
(additive; already applied to production).

**Phase 1 — site settings and branches:**
- `SiteSettings` (one row) and `Branch` tables, edited under Settings → Site
  Settings and Company → Branches (new **Site Settings & Branches**
  permission). Top bar, footer, WhatsApp button, CTA banner, stats band,
  contact page, consultation page, home structured data and the default
  share image all read them (cached, refreshed on save).
- Booking form: `makeLeadSchema(branchNames)` — the form and `/api/leads`
  validate against the current, shown branches.
- Leads list: the branch filter lists current branches plus any older name
  still on a lead.
- Reusable **Reorder** dialog (drag or keyboard) and reorder endpoints.
- `src/data/site.ts` and `src/data/branches.ts` removed (their content now
  lives in the database, pre-filled by the migration).

Database migration `20260924010000_site_settings_and_branches` (additive,
pre-filled with the previous hard-coded values — the site looked identical
before and after; already applied to production).

**Phase 2 — pages:**
- `SitePage` table (one row per page: `published`, `draft`) and Admin →
  Pages. Each page is described once in `src/lib/pages/defs.ts` (sections →
  fields: text, long text, image + alt, icon, lists, repeating items); that
  one definition drives the validation, the generated editor
  (`PageEditor.tsx`) and the typed content the site reads (`getPage()` in
  `src/lib/content/pages.ts`, draft in preview). Adding a field = add it to
  the definition (with a migration if existing pages need a value).
- 18 pages: Home (11 sections, each can be hidden), About, Our Organization,
  Our Success, Our Team, Contact, Consultation, FAQs, Services, Blogs,
  Events, Destinations, Courses, IELTS and its four sub-pages.
- Every page's `<title>`, description and share image come from its Search &
  sharing fields. The contact page's description now names today's branches
  (Panthapath, Uttara, Banasree) instead of the old ones.
- Verified: all 18 pages' visible text, links, maps, titles, descriptions,
  share tags and canonical URLs matched the live site after the migration
  (only the corrected contact description differs).

Database migration `20260924020000_site_pages` (additive, pre-filled with
every page's current copy, validated against the page definitions; already
applied to production).

**Phase 3 — services, FAQs, team:**
- `Service`, `Faq` and `TeamMember` tables with admin lists (search,
  filters, bulk delete, **Reorder**), add/edit screens and APIs under
  `/api/admin/services`, `/faqs`, `/team` (new **Services**, **FAQs** and
  **Team** permissions, now offered in the admin form).
- Services have **Draft / Published** (`ContentStatus`) and their own
  Search & sharing fields; drafts are left out of the services pages, home
  grid, menu, footer and sitemap, and show only in preview.
- The Services page's "Common Questions" now come from FAQs marked **Also
  show on the Services page** (it used to take the last four by position).
- Public pages read them through cached getters (`src/lib/content/services.ts`,
  `faqs.ts`, `team.ts`); `src/data/services.ts`, `faqs.ts`, `team.ts` and
  `organization.ts` removed.
- Verified: home, services (index and all six), FAQs, Our Team, About and
  Contact matched the live site after the migration (visible text, links,
  menus, sitemap, titles and share tags).

Database migration `20260924030000_services_faqs_team` (additive, pre-filled
with the 6 services, 24 FAQs and 11 team members; already applied to
production).

**Phase 4 — drafts and SEO for existing content:**
- `publishStatus` (Draft / Published, default Published so nothing live
  changed) on destinations, courses, events and blog posts, plus SEO title,
  meta description and share image on destinations, courses and events.
- Public getters (`src/lib/content/*`) return published items only — or
  everything while an admin previews; the menu, footer, listing pages, home
  sections, IELTS preparation courses, booking form and sitemap follow.
  `/api/leads` links only published destinations and courses.
- Blog posts: *Save as draft* / *Move to drafts* in the Publishing panel;
  drafts and scheduled posts can be previewed.
- Shared admin pieces: `PublishStatusCard`, `PreviewLink`, a Draft /
  Published list column, `recordMetadata()` in `src/lib/seo.ts` for every
  record page's metadata, and `createdAction` / `savedAction` in
  `src/lib/activity.ts` (publishing and unpublishing are logged as such).
- Verified: home, listing and detail pages, consultation, IELTS preparation
  and the sitemap matched the live site after the migration.

Database migration `20260924040000_drafts_and_seo` (additive: new columns
with defaults; already applied to production).

**Phase 5 — dashboard and activity:**
- New dashboard (`src/app/admin/(dashboard)/page.tsx`, data in
  `src/lib/dashboard.ts`): stats, leads-per-week chart (`LeadsChart`, plain
  elements plus a screen-reader table), Needs attention, recent activity
  (`ActivityFeed`), content counts; permission-aware throughout; on phones the
  cards stack with Needs attention first.
- Activity page (`/admin/activity`) on the shared list tooling:
  `AdminTable` gained `readOnly` and `description`; links to still-existing
  items come from `src/lib/activity-links.ts`.
- Blogs list: an SEO filter for posts without a meta description.

**Phase 6 — cleanup and docs:**
- The sample content only the seed script uses moved from `src/data/` to
  `prisma/seed-data/`; `src/data/` now holds just what is deliberately kept in
  code (navigation and the legal pages).
- README: the admin panel as a CMS, permissions, drafts and preview, and an
  [Admin guide](#admin-guide-for-editors) for non-technical editors.
