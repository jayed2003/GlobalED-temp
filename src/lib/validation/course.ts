import { z } from "zod";
import { imageAlt } from "./image-alt";
import { noDuplicates } from "./normalize";

export const courseSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and hyphens only"),
  title: z.string().min(1, "Title is required"),
  category: z.enum(["ielts", "english", "other-languages"]),
  image: z.string().min(1, "Course image is required"),
  imageAlt: imageAlt(true),
  overview: z.string().min(1, "Overview is required"),
  curriculum: z
    .array(z.string().min(1, "Cannot be empty"))
    .min(1, "Add at least one point")
    .superRefine(noDuplicates((s: string) => s, "point")),
  duration: z.string().min(1, "Duration is required"),
  schedule: z.string().min(1, "Schedule is required"),
  price: z.string().min(1, "Price is required"),
  badge: z.string().optional(),
});

export type CourseFormValues = z.infer<typeof courseSchema>;
