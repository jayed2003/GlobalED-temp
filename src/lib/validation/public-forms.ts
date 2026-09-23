import { z } from "zod";
import { branches } from "@/data/branches";
import { addYears, isRealDate, todayInDhaka } from "./dates";

/**
 * Validation for the public (unauthenticated) forms — consultation / IELTS
 * booking and contact. Shared by the client forms and the API routes so the
 * rules can't drift apart; the server copy is the one that actually counts.
 *
 * Every field is a plain string. Free-text fields are trimmed, stripped of
 * control characters, and rejected if they contain anything that looks like
 * HTML or a script URL — a visitor never has a reason to send markup, so we
 * refuse it outright rather than trying to "clean" it. Output is still
 * escaped wherever it's rendered (React on the admin pages, escapeHtml() in
 * emails); this is defence in depth, not the only line.
 */

export const STUDY_LEVELS = ["HSC / A-Level completed", "Bachelor's", "Master's", "PhD"] as const;
export const IELTS_STATUSES = [
  "I have my score",
  "Exam scheduled / awaiting result",
  "Not taken yet",
  "Planning to retake",
] as const;
export const FUNDING_OPTIONS = ["Self-funded", "Family-funded", "Education loan", "Seeking scholarship"] as const;

export const phoneRegex = /^(\+?880|0)1[3-9]\d{8}$/;

const HTML_ERROR = "Please remove any HTML or code from this field";

// Opening/closing tags, comments, doctype, processing instructions: "<" followed
// by a letter, "/", "!" or "?". A bare "<" or ">" (e.g. "band > 6.5") is fine.
const TAG_PATTERN = /<\s*[a-z!/?]/i;
const SCRIPT_URL_PATTERN = /\b(?:javascript|vbscript)\s*:|\bdata\s*:\s*text\/html/i;

/** Drop ASCII control characters except tab, newline and carriage return. */
function stripControlChars(value: string): string {
  let out = "";
  for (const ch of value) {
    const code = ch.charCodeAt(0);
    if (code === 9 || code === 10 || code === 13 || (code >= 32 && code !== 127)) out += ch;
  }
  return out;
}

export function containsMarkup(value: string): boolean {
  return TAG_PATTERN.test(value) || SCRIPT_URL_PATTERN.test(value);
}

/** Free text: trimmed, control chars removed, no markup, length-checked. */
export function plainText(opts: { min?: number; max: number; minMessage?: string; maxMessage?: string }) {
  let inner = z.string();
  if (opts.min) inner = inner.min(opts.min, opts.minMessage ?? `Please enter at least ${opts.min} characters`);
  inner = inner.max(opts.max, opts.maxMessage ?? `Please keep this under ${opts.max} characters`);
  return z
    .string()
    .transform((v) => stripControlChars(v).trim())
    .pipe(inner.refine((v) => !containsMarkup(v), HTML_ERROR));
}

/** Pick-list value: must be one of the known options (or empty when optional). */
function oneOf(options: readonly string[], message: string, required: boolean) {
  return z
    .string()
    .trim()
    .refine((v) => (v === "" ? !required : options.includes(v)), message);
}

// Destination / course values are slugs (plus the "not-sure" / "no-course"
// sentinels); the API resolves them against the database.
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
function slug(message: string, required: boolean) {
  return z
    .string()
    .trim()
    .max(80)
    .refine((v) => (v === "" ? !required : SLUG_PATTERN.test(v)), message);
}

// Preferred IELTS test date: a real date from today up to a year ahead.
function isoDate(message: string, required: boolean) {
  return z
    .string()
    .trim()
    .superRefine((v, ctx) => {
      if (v === "") {
        if (required) ctx.addIssue({ code: "custom", message });
        return;
      }
      if (!isRealDate(v)) {
        ctx.addIssue({ code: "custom", message: "Enter a real date." });
        return;
      }
      const today = todayInDhaka();
      if (v < today) ctx.addIssue({ code: "custom", message: "Please choose today or a later date." });
      else if (v > addYears(today, 1)) ctx.addIssue({ code: "custom", message: "Please choose a date within the next 12 months." });
    });
}

const branchNames = branches.map((b) => b.name);

/** Building blocks for leadSchema below. */
const leadFields = {
  name: plainText({ min: 2, max: 100, minMessage: "Please enter your full name" }),
  phone: z.string().trim().regex(phoneRegex, "Enter a valid BD number (e.g. 017XXXXXXXX)"),
  email: z.string().trim().max(254).email("Enter a valid email address"),
  branch: oneOf(branchNames, "Please choose your nearest branch", true),
  message: plainText({ max: 1000, maxMessage: "Message must be under 1000 characters" }),
  destination: (required: boolean) => slug("Please choose a destination", required),
  course: (required: boolean) => slug("Please choose a course", required),
  studyLevel: (required: boolean) => oneOf(STUDY_LEVELS, "Please choose your study level", required),
  ieltsStatus: oneOf(IELTS_STATUSES, "Please choose a valid IELTS status", false),
  funding: oneOf(FUNDING_OPTIONS, "Please choose a valid funding option", false),
  preferredDate: (required: boolean) => isoDate("Please pick a preferred date", required),
};

/** Building blocks for contactSchema below. */
const contactFields = {
  name: plainText({ min: 2, max: 100, minMessage: "Please enter your name" }),
  email: z.string().trim().max(254).email("Enter a valid email address"),
  subject: plainText({ min: 2, max: 200, minMessage: "Please enter a subject" }),
  message: plainText({ min: 10, max: 1000, minMessage: "Please write a short message" }),
};

// ---------------------------------------------------------------------------
// The request schemas. Each is ONE schema object, imported by both the form
// (react-hook-form resolver) and the API route — so the browser and the
// server validate exactly the same thing.
// ---------------------------------------------------------------------------

// Cloudflare Turnstile token and the honeypot aren't typed by the visitor;
// the form adds them when it submits. Both default to "".
const botFields = {
  // Honeypot — hidden from humans; any value means a bot.
  company: z.string().max(200).default(""),
  // Cloudflare Turnstile response token (verified server-side in the API route).
  turnstileToken: z.string().max(2048).default(""),
};

// .prefault("") runs a missing field through its own rules, so the visitor
// (or API caller) gets "Please enter your full name", not a type error.
const leadCommon = {
  name: leadFields.name.prefault(""),
  phone: leadFields.phone.prefault(""),
  email: leadFields.email.prefault(""),
  branch: leadFields.branch.prefault(""),
  ieltsStatus: leadFields.ieltsStatus.default(""),
  funding: leadFields.funding.default(""),
  message: leadFields.message.default(""),
  consent: z.literal(true, "Please agree to be contacted"),
  ...botFields,
};

/**
 * Consultation / IELTS booking — the only lead schema. Each flow has its own
 * required fields: a free consultation needs a destination and study level,
 * an IELTS booking needs a course and a preferred date. Strict: unknown keys
 * and non-string values (other than the consent checkbox) are rejected.
 */
export const leadSchema = z.discriminatedUnion("formType", [
  z.strictObject({
    formType: z.literal("GENERAL"),
    ...leadCommon,
    destination: leadFields.destination(true).prefault(""),
    studyLevel: leadFields.studyLevel(true).prefault(""),
    course: leadFields.course(false).default(""),
    preferredDate: leadFields.preferredDate(false).default(""),
  }),
  z.strictObject({
    formType: z.literal("IELTS"),
    ...leadCommon,
    destination: leadFields.destination(false).default(""),
    studyLevel: leadFields.studyLevel(false).default(""),
    course: leadFields.course(true).prefault(""),
    preferredDate: leadFields.preferredDate(true).prefault(""),
  }),
]);

/** What the form fields hold (before defaults / cleaning). */
export type LeadFormInput = z.input<typeof leadSchema>;
/** What the API receives after validation. */
export type LeadData = z.output<typeof leadSchema>;

/** Contact form — the only contact schema (form and /api/contact). */
export const contactSchema = z.strictObject({
  name: contactFields.name.prefault(""),
  email: contactFields.email.prefault(""),
  subject: contactFields.subject.prefault(""),
  message: contactFields.message.prefault(""),
  ...botFields,
});

export type ContactFormInput = z.input<typeof contactSchema>;
