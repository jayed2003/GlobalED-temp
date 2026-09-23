import DOMPurify from "isomorphic-dompurify";
import { contentToHtml } from "@/lib/rich-text";
import { isOriginalUpload } from "@/lib/images";

/**
 * Server-side cleaner for blog post HTML from the rich text editor. Runs when
 * a post is saved and again when it's rendered, so whatever reaches a
 * visitor's browser is only this small, known-safe set of formatting:
 *
 *   paragraphs, H2/H3, bold, italic, underline, strike, links, lists,
 *   quotes, images, line breaks, horizontal rules.
 *
 * Scripts, event handlers, styles, iframes, forms and anything else are
 * removed. Links may only be http(s), mailto or site-relative; images only
 * from our own /images folder or our Vercel Blob upload store.
 */

const ALLOWED_TAGS = ["p", "h2", "h3", "strong", "em", "u", "s", "a", "ul", "ol", "li", "blockquote", "img", "br", "hr"];
const ALLOWED_ATTR = ["href", "target", "rel", "src", "alt", "title"];

const SAFE_LINK = /^(https?:\/\/|mailto:|\/(?!\/)|#)/i;
const SAFE_IMAGE = /^(\/images\/[^\s"'<>]+|https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\/[^\s"'<>]+)$/i;

function isExternal(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

export function sanitizeBlogHtml(html: string): string {
  const hook = (node: Element) => {
    if (node.tagName === "A") {
      const href = node.getAttribute("href")?.trim() ?? "";
      if (!SAFE_LINK.test(href)) {
        node.removeAttribute("href");
      } else if (isExternal(href)) {
        node.setAttribute("target", "_blank");
        node.setAttribute("rel", "noopener noreferrer nofollow");
      } else {
        node.removeAttribute("target");
        node.removeAttribute("rel");
      }
    }
    if (node.tagName === "IMG") {
      const src = node.getAttribute("src")?.trim() ?? "";
      if (!SAFE_IMAGE.test(src)) {
        node.remove();
        return;
      }
      node.setAttribute("loading", "lazy");
    }
  };

  // Synchronous, so adding/removing the hook around it can't leak into
  // another request (the same pattern as the SVG upload sanitizer).
  DOMPurify.addHook("afterSanitizeAttributes", hook);
  try {
    return DOMPurify.sanitize(contentToHtml(html), {
      ALLOWED_TAGS,
      ALLOWED_ATTR: [...ALLOWED_ATTR, "loading"],
      ALLOW_DATA_ATTR: false,
    })
      // The editor leaves an empty paragraph after lists/images; drop empty ones at the ends.
      .replace(/^(\s*<p>\s*(<br>)?\s*<\/p>)+|(<p>\s*(<br>)?\s*<\/p>\s*)+$/g, "")
      .trim();
  } finally {
    DOMPurify.removeHook("afterSanitizeAttributes");
  }
}

// Widths offered to the browser for images inside a post (all in Next.js's
// default deviceSizes, and 75 is its default allowed quality).
const BODY_IMAGE_WIDTHS = [640, 828, 1200, 1920];

function nextImageUrl(src: string, width: number): string {
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=75`;
}

/**
 * For display only (never stored): route images inside a sanitized post body
 * through Next.js image optimization — a responsive srcset, WebP/AVIF, lazy
 * loading. Skipped for "Original" uploads (served as uploaded) and for SVG
 * (vector, nothing to optimize).
 */
export function optimizeBodyImages(html: string): string {
  return html.replace(/<img\b([^>]*?)\ssrc="([^"]+)"([^>]*)>/g, (tag, before: string, src: string, after: string) => {
    const decoded = src.replace(/&amp;/g, "&");
    if (isOriginalUpload(decoded) || /\.svg(\?|$)/i.test(decoded)) return tag;
    const srcset = BODY_IMAGE_WIDTHS.map((w) => `${nextImageUrl(decoded, w)} ${w}w`).join(", ");
    return (
      `<img${before} src="${nextImageUrl(decoded, 1200).replace(/&/g, "&amp;")}"` +
      ` srcset="${srcset.replace(/&/g, "&amp;")}" sizes="(max-width: 768px) 100vw, 768px"${after}>`
    );
  });
}
