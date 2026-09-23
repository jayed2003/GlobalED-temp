import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";

// Public and crawlable. The admin panel is intentionally not listed here
// (that would reveal its path); it is kept out of search via noindex instead.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
