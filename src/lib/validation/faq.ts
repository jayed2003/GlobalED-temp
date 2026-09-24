import { z } from "zod";
import { plainText } from "./public-forms";

export const FAQ_CATEGORIES = [
  { value: "GENERAL", label: "General", slug: "general" },
  { value: "STUDY_ABROAD", label: "Study abroad", slug: "study-abroad" },
  { value: "IELTS", label: "IELTS", slug: "ielts" },
] as const;

export const faqSchema = z.object({
  question: plainText({ min: 5, max: 300, minMessage: "Write the question" }),
  answer: plainText({ min: 5, max: 3000, minMessage: "Write the answer" }),
  category: z.enum(["GENERAL", "STUDY_ABROAD", "IELTS"], "Choose a category"),
  showOnServices: z.boolean(),
  shown: z.boolean(),
});

export type FaqFormValues = z.input<typeof faqSchema>;
