/** Shared display labels for content categories. */

export const blogCategoryLabels: Record<string, string> = {
  "country-wise": "Country-wise",
  scholarships: "Scholarships",
  ielts: "IELTS",
  english: "English",
};

export const courseCategoryLabels: Record<string, string> = {
  ielts: "IELTS",
  english: "English",
  "other-languages": "Other Languages",
};

/** "2026-07-20" → "20 Jul 2026" */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
