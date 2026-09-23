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
  socials: {
    facebook: string;
    instagram: string;
    linkedin: string;
    youtube: string;
  };
  stats: SiteStats;
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
  flagImage: string;
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
}

// ---------- Course ----------

export type CourseCategory = "ielts" | "english" | "other-languages";

export interface Course {
  slug: string;
  title: string;
  category: CourseCategory;
  image: string;
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
  excerpt: string;
  content: string;
  author: string;
  /** ISO date string, e.g. "2026-07-15" */
  publishedAt: string;
  featured?: boolean;
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
  description: string;
  gallery?: string[];
}

// ---------- Team ----------

export interface TeamMember {
  name: string;
  designation: string;
  photo: string;
  bio?: string;
  socials?: {
    linkedin?: string;
    facebook?: string;
  };
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
  university: string;
  country?: string;
  course?: string;
}

// ---------- Organization (About) ----------

export interface TimelineEntry {
  year: string;
  milestone: string;
}

export interface SisterOrganization {
  name: string;
  description: string;
  /** Optional — the card shows just the name until a logo file is added. */
  logo?: string;
}

export interface BoardMember {
  name: string;
  designation: string;
  photo: string;
}

export interface Organization {
  history: string[];
  mission: string;
  vision: string;
  timeline: TimelineEntry[];
  sisterOrganizations: SisterOrganization[];
  boardOfDirectors: BoardMember[];
}
