/**
 * Serving uploaded images. Uploads chosen as "Original" are stored as
 * uploads/orig-<id>.<ext> and must reach the visitor untouched, so they skip
 * Next.js image optimization; everything else (optimized uploads, files in
 * /images) goes through it — responsive sizes and WebP/AVIF.
 */
/** The Optimized / Original choice made when uploading. */
export type UploadMode = "optimized" | "original";

export const ORIGINAL_UPLOAD_PREFIX = "orig-";

export function isOriginalUpload(src: string | null | undefined): boolean {
  return !!src && src.includes(`/uploads/${ORIGINAL_UPLOAD_PREFIX}`);
}
