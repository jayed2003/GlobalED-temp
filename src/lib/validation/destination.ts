import { z } from "zod";
import { imageAlt } from "./image-alt";
import { imageUrl } from "./image-url";
import { noDuplicates } from "./normalize";

export const universitySchema = z.object({
  name: z.string().min(1, "University name is required"),
  city: z.string().min(1, "City is required"),
});

export const destinationFaqSchema = z.object({
  q: z.string().min(1, "Question is required"),
  a: z.string().min(1, "Answer is required"),
});

export const destinationSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and hyphens only"),
  name: z.string().min(1, "Country name is required"),
  tagline: z.string().min(1, "Tagline is required"),
  heroImage: imageUrl("Hero image is required"),
  heroImageAlt: imageAlt(true),
  flagImage: imageUrl("Flag image is required"),
  // Optional: defaults to "Flag of {country}".
  flagImageAlt: imageAlt(false),
  overview: z.string().min(1, "Overview is required"),
  whyStudyHere: z
    .array(z.string().min(1, "Cannot be empty"))
    .min(1, "Add at least one point")
    .superRefine(noDuplicates((s: string) => s, "point")),
  tuitionRange: z.string().min(1, "Tuition range is required"),
  livingCost: z.string().min(1, "Living cost is required"),
  scholarships: z
    .array(z.string().min(1, "Cannot be empty"))
    .min(1, "Add at least one scholarship")
    .superRefine(noDuplicates((s: string) => s, "scholarship")),
  visaInfo: z
    .array(z.string().min(1, "Cannot be empty"))
    .min(1, "Add at least one visa info point")
    .superRefine(noDuplicates((s: string) => s, "point")),
  popularUniversities: z
    .array(universitySchema)
    .min(1, "Add at least one university")
    .superRefine(noDuplicates((u: { name: string }) => u.name, "university")),
  faqs: z
    .array(destinationFaqSchema)
    .min(1, "Add at least one FAQ")
    .superRefine(noDuplicates((f: { q: string }) => f.q, "question")),
});

export type DestinationFormValues = z.infer<typeof destinationSchema>;
