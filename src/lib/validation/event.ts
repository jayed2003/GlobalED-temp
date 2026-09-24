import { z } from "zod";
import { noDuplicates } from "./normalize";
import { imageAlt } from "./image-alt";
import { imageUrl } from "./image-url";
import { addYears, dateField, EARLIEST_CONTENT_DATE, isRealDate, todayInDhaka } from "./dates";

export const eventSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and hyphens only"),
  title: z.string().min(1, "Title is required"),
  status: z.enum(["upcoming", "previous"]),
  date: dateField({
    required: "Date is required",
    min: () => EARLIEST_CONTENT_DATE,
    max: () => addYears(todayInDhaka(), 3),
    maxMessage: () => "Events can be scheduled up to 3 years ahead.",
  }),
  time: z.string().min(1, "Time is required"),
  venue: z.string().min(1, "Venue is required"),
  bannerImage: imageUrl("Banner image is required"),
  bannerImageAlt: imageAlt(true),
  description: z.string().min(1, "Description is required"),
  gallery: z.array(imageUrl("Gallery photo is missing")).superRefine(noDuplicates((s: string) => s, "photo")),
  // One alt text per gallery photo, same order as `gallery`.
  galleryAlts: z.array(imageAlt(false)),
})
  // The status must agree with the date, and every gallery photo needs alt text.
  .superRefine((event, ctx) => {
    event.gallery.forEach((_, i) => {
      if (!event.galleryAlts[i]?.trim()) {
        ctx.addIssue({ code: "custom", path: ["galleryAlts"], message: `Describe gallery photo ${i + 1} (alt text)` });
      }
    });
    if (!isRealDate(event.date)) return;
    const today = todayInDhaka();
    if (event.status === "upcoming" && event.date < today) {
      ctx.addIssue({
        code: "custom",
        path: ["date"],
        message: "This event is marked Upcoming but the date has passed. Pick today or a later date, or set the status to Previous.",
      });
    }
    if (event.status === "previous" && event.date > today) {
      ctx.addIssue({
        code: "custom",
        path: ["date"],
        message: "This event is marked Previous but the date is in the future. Pick today or an earlier date, or set the status to Upcoming.",
      });
    }
  });

export type EventFormValues = z.infer<typeof eventSchema>;
