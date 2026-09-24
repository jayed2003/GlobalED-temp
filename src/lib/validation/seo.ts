import { z } from "zod";
import { plainText } from "./public-forms";
import { imageAlt } from "./image-alt";
import { optionalImageUrl } from "./image-url";

/**
 * SEO columns shared by content records (services, destinations, courses,
 * events): the full title shown in Google, the description, and a share
 * image. All optional — empty ones fall back to the record's own title,
 * summary and image.
 */
export const seoRecordFields = {
  seoTitle: plainText({ max: 70, maxMessage: "Keep the SEO title under 70 characters (search engines show about 60)" }),
  metaDescription: plainText({ max: 200, maxMessage: "Keep the meta description under 200 characters (search engines show about 156)" }),
  ogImage: optionalImageUrl().refine((url) => !/\.svg(\?|$)/i.test(url), "Social networks don't show SVG images — upload a JPG or WebP"),
  ogImageAlt: imageAlt(false),
};

/** Use in a schema's superRefine: a share image needs alt text. */
export function checkSeoImageAlt(value: { ogImage: string; ogImageAlt: string }, ctx: z.RefinementCtx) {
  if (value.ogImage && !value.ogImageAlt) {
    ctx.addIssue({ code: "custom", path: ["ogImageAlt"], message: "Describe the image (alt text) for visitors who can't see it" });
  }
}
