/**
 * Bangla (Bengali script) helpers. Blog posts may be written in Bangla; the
 * page then marks that text lang="bn" so browsers pick Bengali line
 * breaking, screen readers use Bangla pronunciation, and search engines see
 * the right language.
 */

// Bengali Unicode block: U+0980 – U+09FF (code points, so no escapes needed).
const BENGALI_FIRST = 0x0980;
const BENGALI_LAST = 0x09ff;

function isLatinLetter(code: number): boolean {
  return (code >= 65 && code <= 90) || (code >= 97 && code <= 122);
}

/** True when the text has Bengali letters and at least as many as Latin ones. */
export function isMostlyBengali(text: string): boolean {
  let bengali = 0;
  let latin = 0;
  for (const ch of text) {
    const code = ch.codePointAt(0) ?? 0;
    if (code >= BENGALI_FIRST && code <= BENGALI_LAST) bengali++;
    else if (isLatinLetter(code)) latin++;
  }
  return bengali > 0 && bengali >= latin;
}

/** `lang` attribute value for a piece of content: "bn" for Bangla text, else undefined (inherits "en"). */
export function langOf(...texts: (string | undefined | null)[]): "bn" | undefined {
  return isMostlyBengali(texts.filter(Boolean).join(" ")) ? "bn" : undefined;
}
