import { ApiError } from "@/lib/api/admin-route";
import { normalizeKey } from "@/lib/validation/normalize";

/**
 * Throw a 409 if another record already has the same value once normalised
 * (case, spacing and look-alike Unicode ignored). `rows` are the candidates
 * to compare against; the record being edited is skipped via `excludeId`.
 * The content tables are small, so comparing in memory keeps the rule exact
 * (a database equality check can't collapse inner whitespace).
 */
export function assertNotDuplicate(
  rows: { id: string; value: string }[],
  candidate: string,
  opts: { excludeId?: string; message: string; field: string },
): void {
  const key = normalizeKey(candidate);
  const clash = rows.find((row) => row.id !== opts.excludeId && normalizeKey(row.value) === key);
  if (clash) throw new ApiError(409, opts.message, opts.field);
}
