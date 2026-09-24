import { z } from "zod";
import { imageAlt } from "./image-alt";
import { imageUrl } from "./image-url";

export const testimonialSchema = z.object({
  studentName: z.string().min(1, "Student name is required"),
  reviewImage: imageUrl("Review image is required"),
  reviewImageAlt: imageAlt(true),
  university: z.string().min(1, "University is required"),
  // Blank means "don't show a country".
  country: z.string(),
  sortOrder: z.number({ message: "Choose a display order" }).int("Order must be a whole number").min(0, "Order starts at 0"),
});

export type TestimonialFormValues = z.infer<typeof testimonialSchema>;

/**
 * Turns "fancy" pasted text (e.g. 𝐌𝐝 𝐀𝐧𝐢𝐬𝐮𝐫 — Unicode math-bold letters copied from
 * social media) into plain letters, and trims whitespace. Those look-alike characters
 * render in a fallback font, so the card styling can't control them.
 */
export function cleanText(value: string) {
  return value.normalize("NFKC").trim();
}
