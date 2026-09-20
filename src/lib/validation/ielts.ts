import { z } from "zod";

const uspSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});

const freeServiceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  points: z.array(z.string().min(1, "Cannot be empty")).min(1, "Add at least one point"),
  ctaLabel: z.string().min(1, "Button label is required"),
});

const skillAreaSchema = z.object({
  skill: z.string().min(1, "Skill name is required"),
  points: z.array(z.string().min(1, "Cannot be empty")).min(1, "Add at least one point"),
});

const achievementSchema = z.object({
  band: z.string().min(1, "Band score is required"),
  outcome: z.string().min(1, "Outcome is required"),
});

export const ieltsContentSchema = z.object({
  whatIsIelts: z.object({
    title: z.string().min(1, "Title is required"),
    body: z.string().min(1, "Body is required"),
    points: z.array(z.string().min(1, "Cannot be empty")).min(1, "Add at least one point"),
  }),
  whyIelts: z.object({
    title: z.string().min(1, "Title is required"),
    body: z.string().min(1, "Body is required"),
    reasons: z.array(uspSchema).min(1, "Add at least one reason"),
  }),
  whyGlobaled: z.object({
    title: z.string().min(1, "Title is required"),
    body: z.string().min(1, "Body is required"),
    usps: z.array(uspSchema).min(1, "Add at least one USP"),
    freeServices: z.array(freeServiceSchema).min(1, "Add at least one free service"),
  }),
  preparation: z.object({
    title: z.string().min(1, "Title is required"),
    body: z.string().min(1, "Body is required"),
    skillAreas: z.array(skillAreaSchema).min(1, "Add at least one skill area"),
    courseSlugs: z.array(z.string()),
  }),
  progressTracker: z.object({
    title: z.string().min(1, "Title is required"),
    body: z.string().min(1, "Body is required"),
    trackItems: z.array(z.string().min(1, "Cannot be empty")).min(1, "Add at least one item"),
    benefits: z.array(z.string().min(1, "Cannot be empty")).min(1, "Add at least one benefit"),
  }),
  successStories: z.object({
    title: z.string().min(1, "Title is required"),
    body: z.string().min(1, "Body is required"),
    achievements: z.array(achievementSchema).min(1, "Add at least one achievement"),
    quotes: z.array(z.string().min(1, "Cannot be empty")).min(1, "Add at least one quote"),
  }),
});

export type IeltsContentFormValues = z.infer<typeof ieltsContentSchema>;
