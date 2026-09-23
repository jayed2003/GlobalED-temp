import { z } from "zod";
import { noDuplicates } from "./normalize";
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
  bannerImage: z.string().min(1, "Banner image is required"),
  description: z.string().min(1, "Description is required"),
  gallery: z.array(z.string().min(1)).superRefine(noDuplicates((s: string) => s, "photo")),
})
  // The status must agree with the date.
  .superRefine((event, ctx) => {
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
