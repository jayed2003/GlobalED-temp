import type { z } from "zod";

/**
 * Comparison key for "is this the same thing?" checks: Unicode-normalised,
 * trimmed, inner whitespace collapsed, case-insensitive.
 * "  Study in  the UK " and "study in the uk" produce the same key.
 */
export function normalizeKey(value: string): string {
  return value.normalize("NFKC").trim().replace(/\s+/g, " ").toLowerCase();
}

/**
 * Zod superRefine for arrays: rejects the list if two items have the same
 * key, naming the repeated value. The issue is attached to the list itself,
 * which is where the admin list fields show their error.
 *
 *   z.array(z.string()).superRefine(noDuplicates((s) => s))
 *   z.array(faqSchema).superRefine(noDuplicates((f) => f.q, "question"))
 */
export function noDuplicates<T>(keyOf: (item: T) => string, what = "item") {
  return (items: T[], ctx: z.RefinementCtx) => {
    const seen = new Set<string>();
    for (const item of items) {
      const raw = keyOf(item);
      const key = normalizeKey(raw);
      if (!key) continue;
      if (seen.has(key)) {
        const shown = raw.trim().length > 60 ? `${raw.trim().slice(0, 57)}…` : raw.trim();
        ctx.addIssue({ code: "custom", message: `The ${what} "${shown}" is listed more than once. Remove the duplicate.` });
        return;
      }
      seen.add(key);
    }
  };
}
