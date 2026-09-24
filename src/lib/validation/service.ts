import { z } from "zod";
import { plainText } from "./public-forms";
import { noDuplicates } from "./normalize";
import { checkSeoImageAlt, seoRecordFields } from "./seo";
import { isSiteIcon } from "@/lib/icons";

export const serviceSchema = z
  .object({
    slug: z
      .string()
      .trim()
      .min(1, "Slug is required")
      .max(80)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Lowercase letters, numbers and single hyphens only"),
    title: plainText({ min: 2, max: 100, minMessage: "Enter the service name" }),
    icon: z.string().refine(isSiteIcon, "Choose an icon"),
    shortDescription: plainText({ min: 10, max: 250, minMessage: "Write a one-line summary (shown on the cards)" }),
    description: plainText({ min: 10, max: 3000, minMessage: "Describe how GlobalEd helps" }),
    benefits: z
      .array(plainText({ min: 1, max: 200, minMessage: "Fill in or remove the empty benefit" }))
      .min(1, "Add at least one benefit")
      .max(12, "Up to 12 benefits")
      .superRefine(noDuplicates((b: string) => b, "benefit")),
    process: z
      .array(
        z.object({
          step: plainText({ min: 1, max: 80, minMessage: "Name the step" }),
          description: plainText({ min: 1, max: 300, minMessage: "Describe the step" }),
        }),
      )
      .min(1, "Add at least one step")
      .max(10, "Up to 10 steps"),
    status: z.enum(["DRAFT", "PUBLISHED"]),
    ...seoRecordFields,
  })
  .superRefine(checkSeoImageAlt);

export type ServiceFormValues = z.input<typeof serviceSchema>;
