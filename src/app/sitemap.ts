import type { MetadataRoute } from "next";
import { services } from "@/data/services";
import { getAllDestinations } from "@/lib/content/destinations";
import { getAllCourses } from "@/lib/content/courses";
import { getAllPosts } from "@/lib/content/blog";
import { getAllEvents } from "@/lib/content/events";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.globaled.com.bd";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [destinations, courses, posts, events] = await Promise.all([
    getAllDestinations(),
    getAllCourses(),
    getAllPosts(),
    getAllEvents(),
  ]);
  const staticRoutes = [
    "",
    "/destinations",
    "/ielts",
    "/ielts/what-is-ielts",
    "/ielts/why-ielts",
    "/ielts/with-globaled",
    "/ielts/preparation",
    "/services",
    "/courses",
    "/about",
    "/about/our-success",
    "/about/our-organization",
    "/about/our-team",
    "/blogs",
    "/events",
    "/faqs",
    "/contact",
    "/consultation",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  // Legal pages: public and indexable, but rarely updated.
  const legalRoutes = ["/privacy-policy", "/terms-and-conditions", "/return-and-refund-policy"].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "yearly" as const,
    priority: 0.3,
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

  return [...staticRoutes, ...dynamicRoutes, ...legalRoutes];
}
