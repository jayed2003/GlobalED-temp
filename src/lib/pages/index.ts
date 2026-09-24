import * as defs from "./defs";
import type { PageDef, PageValue, Section } from "./fields";

/**
 * All editable pages, by key. `PageContent<"home">` is the typed content a
 * public page reads (see src/lib/content/pages.ts).
 */
export const PAGES = {
  home: defs.homePage,
  about: defs.aboutPage,
  "about-organization": defs.organizationPage,
  "about-success": defs.successPage,
  "about-team": defs.teamPage,
  contact: defs.contactPage,
  consultation: defs.consultationPage,
  faqs: defs.faqsPage,
  services: defs.servicesPage,
  blogs: defs.blogsPage,
  events: defs.eventsPage,
  destinations: defs.destinationsPage,
  courses: defs.coursesPage,
  ielts: defs.ieltsPage,
  "ielts-what": defs.ieltsWhatPage,
  "ielts-why": defs.ieltsWhyPage,
  "ielts-with-globaled": defs.ieltsWithPage,
  "ielts-preparation": defs.ieltsPreparationPage,
} as const;

export type PageKey = keyof typeof PAGES;
type SectionsOf<P> = P extends PageDef<infer S extends Record<string, Section>> ? S : never;
export type PageContent<K extends PageKey> = PageValue<SectionsOf<(typeof PAGES)[K]>>;

export const PAGE_KEYS = Object.keys(PAGES) as PageKey[];

export function isPageKey(key: string): key is PageKey {
  return Object.hasOwn(PAGES, key);
}

/** Loosely typed access for generic code (the editor, the API). */
export function pageDef(key: PageKey): PageDef {
  return PAGES[key] as unknown as PageDef;
}

/** Eyebrow + title + intro above a block of content (see headingFields in defs.ts). */
export interface HeadingContent {
  eyebrow: string;
  title: string;
  description: string;
}
