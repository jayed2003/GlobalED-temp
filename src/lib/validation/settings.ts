import { z } from "zod";
import { plainText } from "./public-forms";

/**
 * Site settings (Admin → Settings → Site settings). Text is plain (no HTML);
 * links are checked so a typo or a pasted script can't end up in the header
 * or footer.
 */

/** Bangladeshi mobile number as displayed ("019555 44772", "+880 1955-544772"). */
const BD_PHONE = /^(\+?880|0)1[3-9]\d{8}$/;
export const digitsOnly = (value: string) => value.replace(/[\s-]/g, "");

export const displayPhone = z
  .string()
  .trim()
  .min(1, "Enter a phone number")
  .max(30)
  .refine((v) => BD_PHONE.test(digitsOnly(v)), "Enter a valid Bangladeshi number, e.g. 019555 44772");

const SOCIAL_HOSTS = {
  facebookUrl: ["facebook.com", "fb.com"],
  instagramUrl: ["instagram.com"],
  linkedinUrl: ["linkedin.com"],
  youtubeUrl: ["youtube.com", "youtu.be"],
} as const;

/** Optional https link to a profile on one particular site. Empty hides that icon. */
function socialUrl(hosts: readonly string[], siteName: string) {
  return z
    .string()
    .trim()
    .max(300)
    .refine((v) => {
      if (v === "") return true;
      try {
        const url = new URL(v);
        const host = url.hostname.replace(/^(www|m)\./, "");
        return url.protocol === "https:" && hosts.includes(host);
      } catch {
        return false;
      }
    }, `Paste the full https:// link to the ${siteName} page (or leave empty to hide it)`);
}

const stat = (label: string) =>
  plainText({ min: 1, max: 12, minMessage: `Enter the ${label}`, maxMessage: "Keep it short, e.g. 500+ or 90%" });

export const siteSettingsSchema = z.object({
  brandName: plainText({ min: 1, max: 60, minMessage: "Enter the brand name" }),
  tagline: plainText({ min: 1, max: 100, minMessage: "Enter a tagline" }),
  phone: displayPhone,
  email: z.string().trim().max(254).email("Enter a valid email address"),
  whatsapp: z
    .string()
    .trim()
    .transform((v) => v.replace(/[\s+-]/g, ""))
    .pipe(z.string().regex(/^8801[3-9]\d{8}$/, "Enter the WhatsApp number with country code, e.g. 8801955544772")),
  facebookUrl: socialUrl(SOCIAL_HOSTS.facebookUrl, "Facebook"),
  instagramUrl: socialUrl(SOCIAL_HOSTS.instagramUrl, "Instagram"),
  linkedinUrl: socialUrl(SOCIAL_HOSTS.linkedinUrl, "LinkedIn"),
  youtubeUrl: socialUrl(SOCIAL_HOSTS.youtubeUrl, "YouTube"),
  footerBlurb: plainText({ max: 300 }),
  statStudentsPlaced: stat("number of students placed"),
  statPartnerUniversities: stat("number of partner universities"),
  statVisaSuccessRate: stat("visa success rate"),
  statYearsOfExperience: stat("years of experience"),
  ctaTitle: plainText({ min: 1, max: 80, minMessage: "Enter a title" }),
  ctaText: plainText({ min: 1, max: 250, minMessage: "Enter a short text" }),
  faqCtaTitle: plainText({ min: 1, max: 80, minMessage: "Enter a title" }),
  faqCtaText: plainText({ min: 1, max: 250, minMessage: "Enter a short text" }),
});

export type SiteSettingsFormValues = z.input<typeof siteSettingsSchema>;
