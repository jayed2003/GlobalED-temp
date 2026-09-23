import { z } from "zod";
import { dateField, EARLIEST_CONTENT_DATE, todayInDhaka } from "./dates";

export const blogSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and hyphens only"),
  title: z.string().min(1, "Title is required"),
  category: z.enum(["country-wise", "scholarships", "ielts", "english"]),
  coverImage: z.string().min(1, "Cover image is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().min(1, "Content is required"),
  author: z.string().min(1, "Author is required"),
  // Posts go live as soon as they're saved (there's no scheduling), so the
  // publish date can't be in the future.
  publishedAt: dateField({
    required: "Publish date is required",
    min: () => EARLIEST_CONTENT_DATE,
    max: todayInDhaka,
    maxMessage: () => "The publish date can't be in the future. Use today or an earlier date.",
  }),
  featured: z.boolean(),
});

export type BlogFormValues = z.infer<typeof blogSchema>;
