import { z } from "zod";
import { plainText } from "./public-forms";
import { displayPhone } from "./settings";
import { noDuplicates } from "./normalize";

/**
 * Google Maps embed for a branch. Admins paste either the whole
 * <iframe …> code from Google Maps (Share → Embed a map) or just its link;
 * only the map address is kept, and it must be a Google Maps embed — the
 * contact page frames it, and the site's security policy only allows
 * google.com frames.
 */
export function extractMapSrc(input: string): string {
  const trimmed = input.trim();
  const fromIframe = trimmed.match(/<iframe\b[^>]*\ssrc\s*=\s*["']([^"']+)["']/i);
  return (fromIframe ? fromIframe[1] : trimmed).replace(/&amp;/g, "&");
}

export function isGoogleMapsEmbed(src: string): boolean {
  let url: URL;
  try {
    url = new URL(src);
  } catch {
    return false;
  }
  if (url.protocol !== "https:" || !["www.google.com", "maps.google.com"].includes(url.hostname)) return false;
  return url.pathname.startsWith("/maps/embed") || (url.pathname === "/maps" && url.searchParams.get("output") === "embed");
}

const mapEmbed = z
  .string()
  .max(3000, "That map code is too long — copy it again from Google Maps")
  .transform(extractMapSrc)
  .refine((src) => src === "" || isGoogleMapsEmbed(src), "Paste the map code from Google Maps: Share → Embed a map → Copy HTML");

export const branchSchema = z.object({
  name: plainText({ min: 2, max: 80, minMessage: "Enter the branch name" }),
  address: plainText({ min: 5, max: 200, minMessage: "Enter the address" }),
  phones: z
    .array(displayPhone)
    .min(1, "Add at least one phone number")
    .max(4, "Up to 4 phone numbers")
    .superRefine(noDuplicates((p: string) => p.replace(/[\s-]/g, ""), "phone number")),
  email: z.string().trim().max(254).email("Enter a valid email address"),
  hours: plainText({ min: 1, max: 80, minMessage: "Enter the opening hours" }),
  mapEmbedUrl: mapEmbed,
  shown: z.boolean(),
});

export type BranchFormValues = z.input<typeof branchSchema>;
