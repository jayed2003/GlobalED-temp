import type { IeltsContent } from "@/types";

/** IELTS hub page content from globaled.io */
export const ielts: IeltsContent = {
  whatIsIelts: {
    title: "What is IELTS?",
    body: "IELTS (International English Language Testing System) is the world's most widely accepted English proficiency test for study, work, and migration. It is jointly owned by the British Council, IDP, and Cambridge, and is recognized by over 12,000 organizations across 140+ countries.",
    points: [
      "Two formats: Academic (for university admission) and General Training (for work and migration)",
      "Four modules: Listening, Reading, Writing, and Speaking",
      "Scored on a 0–9 band scale; most universities require 6.0–7.0",
      "Results valid for 2 years; paper and computer formats available",
    ],
  },
  whyGlobaled: {
    title: "Why take IELTS with GlobalEd?",
    usps: [
      {
        title: "British Council Authorized Testing Center",
        description:
          "We are a British Council Authorized Testing Center, where you can take your IELTS exam after proper preparation.",
      },
      {
        title: "JPT Authorized Registration Center",
        description:
          "We are a JPT Authorized Registration Center. After completing your language courses, you can register and take the JPT exam right here at our center.",
      },
      {
        title: "Band 7+ Instructors",
        description:
          "Learn from certified instructors who have scored band 8+ themselves and trained thousands of students.",
      },
      {
        title: "Real Mock Tests",
        description:
          "Weekly full-format mock tests that mirror the official exam — with same-day band score estimates.",
      },
      {
        title: "Small Batches",
        description:
          "Maximum 15 students per batch, so every student gets individual writing correction and speaking practice.",
      },
      {
        title: "Test Booking Support",
        description:
          "We handle your official IELTS test registration and help you choose the right date, format, and venue.",
      },
    ],
  },
  preparation: {
    title: "IELTS Preparation at GlobalEd",
    body: "Whether you're a beginner or retaking for a higher band, we have a format that fits your schedule — regular batches, executive evening classes, and an intensive master class for band 7+ candidates.",
    courseSlugs: ["ielts-regular", "ielts-executive-class", "ielts-master-class"],
  },
};
