// Built from char codes so no raw U+2028/2029 ever appears in this source file.
const LINE_SEPARATOR = new RegExp(String.fromCharCode(0x2028), "g");
const PARAGRAPH_SEPARATOR = new RegExp(String.fromCharCode(0x2029), "g");

/**
 * Serialize structured data for an inline <script type="application/ld+json">.
 *
 * JSON.stringify alone is not safe inside a script tag: a value such as
 * `</script><script>alert(1)</script>` (e.g. an admin-entered blog title)
 * would close the tag early and inject markup. Escaping <, > and & as \uXXXX
 * keeps the JSON identical once parsed but gives the HTML parser nothing to
 * act on. U+2028/U+2029 are escaped too — valid in JSON, but line
 * terminators in older JavaScript parsers.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(LINE_SEPARATOR, "\\u2028")
    .replace(PARAGRAPH_SEPARATOR, "\\u2029");
}
