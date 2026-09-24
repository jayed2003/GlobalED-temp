/**
 * Page-by-page lists on the public site (?page=2). Page 1 is the plain URL.
 */

/** The ?page value as a page number: missing → 1, anything that isn't a page number → null. */
export function parsePage(value: string | string[] | undefined): number | null {
  if (value === undefined || value === "") return 1;
  if (typeof value !== "string" || !/^[1-9]\d{0,3}$/.test(value)) return null;
  return Number(value);
}

export function paginate<T>(items: T[], page: number, perPage: number) {
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  return { items: items.slice((page - 1) * perPage, page * perPage), totalPages };
}

/** Page numbers to show: first, last and two either side of the current one, with gaps as "…". */
export function pageList(page: number, totalPages: number): (number | "…")[] {
  const shown = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (n) => n === 1 || n === totalPages || Math.abs(n - page) <= 2,
  );
  return shown.flatMap((n, i) => (i > 0 && n - shown[i - 1] > 1 ? (["…", n] as const) : [n]));
}
