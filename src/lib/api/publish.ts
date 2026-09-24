import { ApiError } from "@/lib/api/admin-route";
import { fromDhaka } from "@/lib/validation/dates";

/**
 * The moment a blog post goes live, from the form's publish choice.
 * `current` is the post's existing publish time (when editing).
 */
export function publishTimestamp(
  post: { publishMode: "now" | "schedule" | "keep" | "draft"; publishDate: string; publishTime: string },
  current?: Date,
): Date {
  if (post.publishMode === "now") return new Date();
  // A draft keeps its date until it's published ("now" or "schedule").
  if (post.publishMode === "draft") return current ?? new Date();
  if (post.publishMode === "schedule") return fromDhaka(post.publishDate, post.publishTime);
  if (!current) throw new ApiError(400, 'Choose "Publish now" or schedule a date and time', "publishMode");
  return current;
}

/** A record's Search & sharing columns (alt text is dropped when there's no share image). */
export function recordSeoFields(data: { seoTitle: string; metaDescription: string; ogImage: string; ogImageAlt: string }) {
  return {
    seoTitle: data.seoTitle,
    metaDescription: data.metaDescription,
    ogImage: data.ogImage,
    ogImageAlt: data.ogImage ? data.ogImageAlt : "",
  };
}

/** The post's SEO columns. */
export function seoFields(post: {
  focusKeyword: string;
  seoTitle: string;
  metaDescription: string;
  ogImage: string;
  ogImageAlt: string;
}) {
  return { focusKeyword: post.focusKeyword, ...recordSeoFields(post) };
}
