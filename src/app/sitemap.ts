import type { MetadataRoute } from "next";
import { destinations } from "@/data/destinations";
import { services } from "@/data/services";
import { courses } from "@/data/courses";
import { posts } from "@/data/posts";
import { events } from "@/data/events";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.globaled.com.bd";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/destinations",
    "/ielts",
    "/services",
    "/courses",
    "/about",
    "/blogs",
    "/events",
    "/contact",
    "/consultation",
    "/get-started",
    "/ielts-registration",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const dynamicRoutes = [
    ...destinations.map((d) => `/destinations/${d.slug}`),
    ...services.map((s) => `/services/${s.slug}`),
    ...courses.map((c) => `/courses/${c.slug}`),
    ...posts.map((p) => `/blogs/${p.slug}`),
    ...events.map((e) => `/events/${e.slug}`),
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...dynamicRoutes];
}
