import { z } from "zod";
import { noDuplicates } from "./normalize";

export const eventSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and hyphens only"),
  title: z.string().min(1, "Title is required"),
  status: z.enum(["upcoming", "previous"]),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  venue: z.string().min(1, "Venue is required"),
  bannerImage: z.string().min(1, "Banner image is required"),
  description: z.string().min(1, "Description is required"),
  gallery: z.array(z.string().min(1)).superRefine(noDuplicates((s: string) => s, "photo")),
});

export type EventFormValues = z.infer<typeof eventSchema>;
