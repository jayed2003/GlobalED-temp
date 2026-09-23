import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { adminRoute, ApiError } from "@/lib/api/admin-route";
import { sanitizeImageUpload, UploadRejectedError } from "@/lib/upload-sanitize";
import { ORIGINAL_UPLOAD_PREFIX, type UploadMode } from "@/lib/images";
import { checkRateLimit, tooManyRequests } from "@/lib/rate-limit";

// sharp and DOMPurify (jsdom) need the Node.js runtime.
export const runtime = "nodejs";

const MAX_SIZE = 5 * 1024 * 1024;

export const POST = adminRoute({ anyAdmin: true }, async ({ request, session }) => {
  const limit = await checkRateLimit("upload", session.user.id);
  if (!limit.success) return tooManyRequests(limit.retryAfter);

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");
  const mode: UploadMode = formData?.get("mode") === "original" ? "original" : "optimized";
  if (!(file instanceof File)) throw new ApiError(400, "No file provided");
  if (file.size > MAX_SIZE) throw new ApiError(413, "File too large (max 5 MB)");

  // The declared MIME type and file name are ignored: the sanitizer decides
  // the type from the bytes and re-encodes / cleans the image.
  let image;
  try {
    image = await sanitizeImageUpload(Buffer.from(await file.arrayBuffer()), mode);
  } catch (err) {
    if (err instanceof UploadRejectedError) throw new ApiError(400, err.message);
    throw err;
  }

  // Server-generated name — never the uploader's file name. The prefix records
  // the mode: "orig-" files are served as-is, others through Next.js image
  // optimization (see src/lib/images.ts).
  const prefix = mode === "original" ? ORIGINAL_UPLOAD_PREFIX : "opt-";
  const blob = await put(`uploads/${prefix}${randomUUID()}.${image.extension}`, image.buffer, {
    access: "public",
    contentType: image.contentType,
  });
  return NextResponse.json({ url: blob.url });
});
