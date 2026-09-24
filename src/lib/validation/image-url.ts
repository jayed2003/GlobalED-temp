import { z } from "zod";

/**
 * An image we host: a file under /images or an upload in our Vercel Blob
 * store. Admin image fields are filled by the upload button, so anything else
 * (javascript: or data: URLs, outside trackers, odd paths) is refused —
 * the same rule the blog sanitizer applies to images inside a post.
 */
export const SAFE_IMAGE_URL =
  /^(\/images\/[^\s"'<>]+|https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\/[^\s"'<>]+)$/i;

const NOT_OURS = "Use the Upload button — images must be uploaded here, not linked from elsewhere";

/** A required image field (the upload button fills it). */
export function imageUrl(requiredMessage: string) {
  return z.string().trim().min(1, requiredMessage).max(500).regex(SAFE_IMAGE_URL, NOT_OURS);
}

/** An optional image field: empty, or one of ours. */
export function optionalImageUrl() {
  return z
    .string()
    .trim()
    .max(500)
    .refine((url) => url === "" || SAFE_IMAGE_URL.test(url), NOT_OURS);
}
