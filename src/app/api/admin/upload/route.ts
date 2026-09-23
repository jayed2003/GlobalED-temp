import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { requireSession } from "@/lib/authz";
import { sanitizeImageUpload, UploadRejectedError } from "@/lib/upload-sanitize";
import { checkRateLimit, tooManyRequests } from "@/lib/rate-limit";

// sharp and DOMPurify (jsdom) need the Node.js runtime.
export const runtime = "nodejs";

const MAX_SIZE = 5 * 1024 * 1024;

export async function POST(request: Request) {
  const session = await requireSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const limit = await checkRateLimit("upload", session.user.id);
  if (!limit.success) return tooManyRequests(limit.retryAfter);

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
  }

  // The declared MIME type and file name are ignored: the sanitizer decides
  // the type from the bytes and re-encodes / cleans the image.
  let image;
  try {
    image = await sanitizeImageUpload(Buffer.from(await file.arrayBuffer()));
  } catch (err) {
    if (err instanceof UploadRejectedError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    throw err;
  }

  // Server-generated name — never the uploader's file name.
  const blob = await put(`uploads/${randomUUID()}.${image.extension}`, image.buffer, {
    access: "public",
    contentType: image.contentType,
  });
  return NextResponse.json({ url: blob.url });
}
