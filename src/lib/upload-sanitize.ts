import sharp from "sharp";
import DOMPurify from "isomorphic-dompurify";
import type { UploadMode } from "@/lib/images";

/**
 * Server-side sanitizer for admin image uploads. Only JPG, WebP and SVG are
 * accepted, and the type is decided from the file's actual bytes — the
 * browser-supplied MIME type and file name are ignored, since both are
 * trivially spoofed.
 *
 * - JPG / WebP are decoded and re-encoded with sharp. That strips all metadata
 *   (EXIF, GPS location, camera serials) and destroys anything smuggled in a
 *   "polyglot" file that is also valid HTML/JS/ZIP.
 * - SVG is XML that can carry scripts, so it is run through DOMPurify's SVG
 *   profile, and every link is limited to in-document "#id" references.
 */

export class UploadRejectedError extends Error {}

export interface SanitizedImage {
  buffer: Buffer;
  contentType: "image/jpeg" | "image/webp" | "image/svg+xml";
  extension: "jpg" | "webp" | "svg";
}

type Kind = "jpeg" | "webp" | "svg";

/**
 * "optimized" (default): photos are scaled down to fit 1920×1920 and
 *   compressed (quality 80) — right for almost everything on the site.
 * "original": full dimensions, high quality (95) — for images where detail
 *   matters (e.g. a certificate or a screenshot someone needs to read).
 * Both are still re-encoded, so metadata is stripped either way.
 */
const OPTIMIZED_MAX_PX = 1920;

const MAX_INPUT_PIXELS = 40_000_000; // ~ 7700 x 5200; blocks decompression bombs
const MAX_SVG_BYTES = 1024 * 1024;
const ALLOWED_MESSAGE = "Only JPG, WebP or SVG images are allowed.";

function detectKind(buf: Buffer): Kind | "png" | null {
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpeg";
  if (buf.length >= 12 && buf.toString("latin1", 0, 4) === "RIFF" && buf.toString("latin1", 8, 12) === "WEBP") {
    return "webp";
  }
  if (buf.length >= 8 && buf[0] === 0x89 && buf.toString("latin1", 1, 4) === "PNG") return "png";

  // SVG is text: allow a UTF-8 BOM, whitespace, an XML declaration, comments
  // or a doctype before the <svg> root.
  const head = buf.subarray(0, 2048).toString("utf8").replace(/^\s+/, "");
  const withoutBom = head.charCodeAt(0) === 0xfeff ? head.slice(1).replace(/^\s+/, "") : head;
  if (/^(<\?xml[^>]*>\s*)?(<!--[\s\S]*?-->\s*)*(<!DOCTYPE[^>]*>\s*)?<svg[\s>]/i.test(withoutBom)) return "svg";
  return null;
}

async function sanitizeRaster(buf: Buffer, kind: "jpeg" | "webp", mode: UploadMode): Promise<SanitizedImage> {
  try {
    const image = sharp(buf, { limitInputPixels: MAX_INPUT_PIXELS, failOn: "error" });
    const meta = await image.metadata();
    if (meta.format !== kind) throw new UploadRejectedError(ALLOWED_MESSAGE);

    // rotate() bakes the EXIF orientation into the pixels before the metadata
    // is dropped (sharp drops all metadata unless told to keep it).
    let pipeline = image.rotate();
    if (mode === "optimized") {
      pipeline = pipeline.resize({ width: OPTIMIZED_MAX_PX, height: OPTIMIZED_MAX_PX, fit: "inside", withoutEnlargement: true });
    }
    const quality = mode === "optimized" ? 80 : 95;
    const buffer =
      kind === "jpeg"
        ? await pipeline.jpeg({ quality, mozjpeg: true }).toBuffer()
        : await pipeline.webp({ quality }).toBuffer();

    return kind === "jpeg"
      ? { buffer, contentType: "image/jpeg", extension: "jpg" }
      : { buffer, contentType: "image/webp", extension: "webp" };
  } catch (err) {
    if (err instanceof UploadRejectedError) throw err;
    throw new UploadRejectedError("This image is damaged or too large to process. Please re-export it and try again.");
  }
}

function sanitizeSvg(buf: Buffer): SanitizedImage {
  if (buf.length > MAX_SVG_BYTES) throw new UploadRejectedError("SVG files must be under 1 MB.");
  const source = buf.toString("utf8");
  if (source.includes(String.fromCharCode(0))) throw new UploadRejectedError(ALLOWED_MESSAGE);

  // Links may only point inside the document (#id — gradients, <use>, masks).
  // External URLs (tracking pixels, remote images) and javascript: are dropped.
  const hook = (_node: Element, data: { attrName: string; attrValue: string; keepAttr: boolean }) => {
    const name = data.attrName.toLowerCase();
    if ((name === "href" || name === "xlink:href") && !data.attrValue.trim().startsWith("#")) {
      data.keepAttr = false;
    }
  };

  // DOMPurify.sanitize is synchronous, so adding and removing the hook around
  // it can't leak into another request.
  DOMPurify.addHook("uponSanitizeAttribute", hook);
  let clean: string;
  try {
    clean = DOMPurify.sanitize(source, {
      USE_PROFILES: { svg: true, svgFilters: true },
      ADD_TAGS: ["use"],
      FORBID_TAGS: ["script", "foreignObject", "iframe", "embed", "object"],
    });
  } finally {
    DOMPurify.removeHook("uponSanitizeAttribute");
  }

  clean = clean.trim();
  if (!/^<svg[\s>]/i.test(clean) || !/xmlns="http:\/\/www\.w3\.org\/2000\/svg"/.test(clean)) {
    throw new UploadRejectedError("This SVG couldn't be read. Please re-export it as a standard SVG file.");
  }
  return { buffer: Buffer.from(clean, "utf8"), contentType: "image/svg+xml", extension: "svg" };
}

/** Validate and clean an uploaded image. Throws UploadRejectedError with a user-facing message. */
export async function sanitizeImageUpload(buf: Buffer, mode: UploadMode = "optimized"): Promise<SanitizedImage> {
  const kind = detectKind(buf);
  if (kind === "png") throw new UploadRejectedError("PNG isn't allowed. Please upload a JPG, WebP or SVG instead.");
  if (!kind) throw new UploadRejectedError(ALLOWED_MESSAGE);
  return kind === "svg" ? sanitizeSvg(buf) : sanitizeRaster(buf, kind, mode);
}
