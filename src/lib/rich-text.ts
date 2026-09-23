/**
 * Helpers for blog post bodies, safe to use in the browser and on the server.
 * Posts are stored as HTML from the rich text editor; posts written before
 * the editor existed are plain text with blank lines between paragraphs.
 */

const HTML_BLOCK = /<\/?(p|h[1-6]|ul|ol|li|blockquote|img|br|hr|strong|em|a)\b/i;

export function isHtml(content: string): boolean {
  return HTML_BLOCK.test(content);
}

function escapeText(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** Legacy plain text -> <p> paragraphs (single line breaks kept). HTML is returned as-is. */
export function contentToHtml(content: string): string {
  if (!content.trim() || isHtml(content)) return content;
  return content
    .split(/\n\s*\n/)
    .map((para) => para.trim())
    .filter(Boolean)
    .map((para) => `<p>${escapeText(para).replace(/\n/g, "<br>")}</p>`)
    .join("");
}

/** Visible text of an HTML body (for "is it empty?" checks and summaries). */
export function htmlToText(html: string): string {
  return html
    .replace(/<(br|\/p|\/h[1-6]|\/li|\/blockquote)[^>]*>/gi, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&(amp|lt|gt|quot|#39);/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
