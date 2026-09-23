/**
 * The site's public base URL (no trailing slash), used for canonical URLs,
 * Open Graph, the sitemap, robots.txt, structured data and email links.
 *
 * 1. NEXT_PUBLIC_SITE_URL — set this in Vercel (https://globaled.io at launch).
 * 2. VERCEL_PROJECT_PRODUCTION_URL — set automatically on Vercel, so previews
 *    and an unconfigured production still point at the real deployment.
 * 3. https://globaled.io — the company's domain.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "") ||
  "https://globaled.io"
).replace(/\/$/, "");
