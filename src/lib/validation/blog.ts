import { z } from "zod";
import { imageAlt } from "./image-alt";
import { imageUrl, optionalImageUrl } from "./image-url";
import { htmlToText } from "@/lib/rich-text";
import { addYears, fromDhaka, isRealDate, isRealTime, todayInDhaka } from "./dates";

export const blogSchema = z
  .object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and hyphens only"),
  title: z.string().min(1, "Title is required"),
  category: z.enum(["country-wise", "scholarships", "ielts", "english"]),
  coverImage: imageUrl("Cover image is required"),
  coverImageAlt: imageAlt(true),
  excerpt: z.string().min(1, "Excerpt is required"),
  // HTML from the rich text editor. "Required" means some actual text — an
  // empty editor still produces markup like <p></p>.
  content: z
    .string()
    .max(200_000, "The post is too long")
    .refine((html) => htmlToText(html).length > 0, "Content is required"),
  author: z.string().min(1, "Author is required"),
  /**
   * When the post goes live:
   *   now      — immediately (the server stamps the current time)
   *   schedule — at publishDate + publishTime, Bangladesh time; hidden from
   *              the public site until then. Past dates/times are refused.
   *   keep     — (editing only) leave the existing publish date/time — and
   *              draft / published — as it is
   *   draft    — hidden from the public site whatever the date; admins can
   *              preview it. Publish it later with "now" or "schedule".
   */
  publishMode: z.enum(["now", "schedule", "keep", "draft"]),
  publishDate: z.string().trim(),
  publishTime: z.string().trim(),
  featured: z.boolean(),

  // SEO (optional — empty falls back to the title, excerpt and cover image)
  focusKeyword: z.string().trim().max(100, "Keep the focus keyword under 100 characters"),
  seoTitle: z.string().trim().max(70, "Keep the SEO title under 70 characters (search engines show about 60)"),
  metaDescription: z
    .string()
    .trim()
    .max(200, "Keep the meta description under 200 characters (search engines show about 156)"),
  ogImage: optionalImageUrl().refine((url) => !/\.svg(\?|$)/i.test(url), "Social networks don't show SVG images — upload a JPG or WebP"),
  ogImageAlt: imageAlt(false),
})
  .superRefine((post, ctx) => {
    if (post.ogImage && !post.ogImageAlt) {
      ctx.addIssue({ code: "custom", path: ["ogImageAlt"], message: "Describe the image (alt text) for visitors who can't see it" });
    }
    if (post.publishMode !== "schedule") return;
    const issue = (path: "publishDate" | "publishTime", message: string) =>
      ctx.addIssue({ code: "custom", path: [path], message });

    if (!isRealDate(post.publishDate)) return issue("publishDate", "Pick the date to publish on");
    if (post.publishDate < todayInDhaka()) return issue("publishDate", "Past dates can't be used — pick today or a later date");
    if (post.publishDate > addYears(todayInDhaka(), 1)) return issue("publishDate", "Posts can be scheduled up to 1 year ahead");
    if (!isRealTime(post.publishTime)) return issue("publishTime", "Pick the time to publish at");
    if (fromDhaka(post.publishDate, post.publishTime).getTime() <= Date.now()) {
      issue("publishTime", "That time has already passed — pick a later time, or choose \"Publish now\"");
    }
  });

export type BlogFormValues = z.infer<typeof blogSchema>;
