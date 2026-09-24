import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import type { Branch, SiteSettings } from "@/types";
import type { SiteSettings as SiteSettingsRow } from "@/generated/prisma/client";

/**
 * Site settings and branches, edited in the admin panel. Cached; the admin
 * API refreshes the "site-settings" / "branches" tags on every change.
 */

export function mapSiteSettings(row: SiteSettingsRow): SiteSettings {
  return {
    brandName: row.brandName,
    tagline: row.tagline,
    phone: row.phone,
    email: row.email,
    whatsapp: row.whatsapp,
    socials: {
      facebook: row.facebookUrl,
      instagram: row.instagramUrl,
      linkedin: row.linkedinUrl,
      youtube: row.youtubeUrl,
    },
    stats: {
      studentsPlaced: row.statStudentsPlaced,
      partnerUniversities: row.statPartnerUniversities,
      visaSuccessRate: row.statVisaSuccessRate,
      yearsOfExperience: row.statYearsOfExperience,
    },
    footerBlurb: row.footerBlurb,
    cta: { title: row.ctaTitle, text: row.ctaText },
    faqCta: { title: row.faqCtaTitle, text: row.faqCtaText },
  };
}

export const getSiteSettings = unstable_cache(
  async (): Promise<SiteSettings> => {
    const row = await prisma.siteSettings.findUnique({ where: { id: "main" } });
    // The row is created by the site_settings_and_branches migration.
    if (!row) throw new Error("Site settings are missing — run `npx prisma migrate deploy`.");
    return mapSiteSettings(row);
  },
  ["site-settings"],
  { tags: ["site-settings"] },
);

/** Branches shown on the site, in order. */
export const getBranches = unstable_cache(
  async (): Promise<Branch[]> => {
    const rows = await prisma.branch.findMany({ where: { shown: true }, orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] });
    return rows.map((b) => ({
      name: b.name,
      address: b.address,
      phones: b.phones,
      email: b.email,
      hours: b.hours,
      mapEmbedUrl: b.mapEmbedUrl,
    }));
  },
  ["branches-shown"],
  { tags: ["branches"] },
);

/** Names of the branches a visitor can choose in the booking form. */
export async function getBranchNames(): Promise<string[]> {
  return (await getBranches()).map((b) => b.name);
}

/** "019555 44772" → "tel:01955544772". */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/[\s-]/g, "")}`;
}
