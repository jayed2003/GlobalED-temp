/**
 * GlobalEd — central content type definitions.
 * These mirror the models in CONTENT.md 1:1 and are designed so a future
 * CMS/backend can replace the placeholder data files without UI changes.
 */

// ---------- Site ----------

export interface SiteStats {
  studentsPlaced: string;
  partnerUniversities: string;
  visaSuccessRate: string;
  yearsOfExperience: string;
}

export interface SiteSettings {
  brandName: string;
  tagline: string;
  phone: string;
  email: string;
  whatsapp: string;
  /** Profile links; an empty one hides that icon. */
  socials: {
    facebook: string;
    instagram: string;
    linkedin: string;
    youtube: string;
  };
  stats: SiteStats;
  footerBlurb: string;
  /** The call-to-action banner near the bottom of most pages. */
  cta: { title: string; text: string };
  /** Its variant on the home page, pointing to the FAQs. */
  faqCta: { title: string; text: string };
}

// ---------- Destination ----------

export interface University {
  name: string;
  city: string;
}

export type FaqCategory = "general" | "study-abroad" | "ielts";

export interface Faq {
  q: string;
  a: string;
  /** Only set on the central FAQ page dataset; per-destination FAQs omit this. */
  category?: FaqCategory;
}

export interface Destination {
  slug: string;
  name: string;
  tagline: string;
  heroImage: string;
  heroImageAlt?: string;
  flagImage: string;
  flagImageAlt?: string;
  overview: string;
  whyStudyHere: string[];
  popularUniversities: University[];
  tuitionRange: string;
  livingCost: string;
  scholarships: string[];
  visaInfo: string[];
  faqs: Faq[];
}

// ---------- Service ----------

export interface ServiceStep {
  step: string;
  description: string;
}

export interface Service {
  slug: string;
  title: string;
  /** Lucide icon name, e.g. "GraduationCap" */
  icon: string;
  shortDescription: string;
  description: string;
  benefits: string[];
  process: ServiceStep[];
  /** SEO overrides; empty means use the title / summary. */
  seoTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  ogImageAlt?: string;
}

// ---------- Course ----------

export type CourseCategory = "ielts" | "english" | "other-languages";

export interface Course {
  slug: string;
  title: string;
  category: CourseCategory;
  image: string;
  imageAlt?: string;
  overview: string;
  curriculum: string[];
  duration: string;
  schedule: string;
  price: string;
  badge?: string;
}

// ---------- IELTS page ----------

export interface IeltsUsp {
  title: string;
  description: string;
}

export interface IeltsSkillArea {
  skill: string;
  points: string[];
}

export interface IeltsFreeService {
  title: string;
  description: string;
  points: string[];
  ctaLabel: string;
}

export interface IeltsAchievement {
  band: string;
  outcome: string;
}

export interface IeltsContent {
  whatIsIelts: {
    title: string;
    body: string;
    points: string[];
  };
  whyIelts: {
    title: string;
    body: string;
    reasons: IeltsUsp[];
  };
  whyGlobaled: {
    title: string;
    body: string;
    usps: IeltsUsp[];
    freeServices: IeltsFreeService[];
  };
  preparation: {
    title: string;
    body: string;
    skillAreas: IeltsSkillArea[];
    /** Course slugs linked from the preparation section */
    courseSlugs: string[];
  };
  progressTracker: {
    title: string;
    body: string;
    trackItems: string[];
    benefits: string[];
  };
  successStories: {
    title: string;
    body: string;
    achievements: IeltsAchievement[];
    quotes: string[];
  };
}

// ---------- Blog ----------

export type BlogCategory = "country-wise" | "scholarships" | "ielts" | "english";

export interface BlogPost {
  slug: string;
  title: string;
  category: BlogCategory;
  coverImage: string;
  coverImageAlt?: string;
  excerpt: string;
  content: string;
  author: string;
  /** Publish date in Bangladesh time, YYYY-MM-DD (for display). */
  publishedAt: string;
  /** Exact publish moment, ISO 8601 — posts are hidden until then. */
  publishedAtIso?: string;
  featured?: boolean;
  /** SEO overrides; empty means use the title / excerpt / cover image. */
  seoTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  ogImageAlt?: string;
}

// ---------- Event ----------

export interface EventItem {
  slug: string;
  title: string;
  status: "upcoming" | "previous";
  /** ISO date string */
  date: string;
  time: string;
  venue: string;
  bannerImage: string;
  bannerImageAlt?: string;
  description: string;
  gallery?: string[];
  galleryAlts?: string[];
}

// ---------- Team ----------

export interface TeamMember {
  name: string;
  designation: string;
  photo: string;
  /** Alt text for the photo (falls back to "Name, role at GlobalEd"). */
  photoAlt?: string;
  bio?: string;
}

// ---------- Branch ----------

export interface Branch {
  name: string;
  address: string;
  phones: string[];
  email: string;
  hours: string;
  /** Google Maps embed src (iframe, no API key required) */
  mapEmbedUrl: string;
}

// ---------- Testimonial ----------

export interface Testimonial {
  studentName: string;
  /** The review, shown as a landscape (16:9) image on the card. */
  reviewImage: string;
  reviewImageAlt?: string;
  university: string;
  country?: string;
  course?: string;
}
