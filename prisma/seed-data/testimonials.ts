import type { Testimonial } from "../../src/types";

/**
 * Student success stories, shown as review images.
 * PLACEHOLDER content — replace `reviewImage`, names and universities with the real ones.
 * `photo` (small avatar) is optional; initials are shown when it is omitted.
 */
export const testimonials: Testimonial[] = [
  {
    studentName: "Iftekar",
    reviewImage: "/images/testimonials/review-1.svg",
    university: "University of Manchester",
    country: "UK",
    course: "MSc Data Science",
  },
  {
    studentName: "Maisha Mostofa",
    reviewImage: "/images/testimonials/review-2.svg",
    university: "University of Toronto",
    country: "Canada",
    course: "BBA",
  },
  {
    studentName: "Yeamin Safat",
    reviewImage: "/images/testimonials/review-3.svg",
    university: "Monash University",
    country: "Australia",
    course: "Master of IT",
  },
  {
    studentName: "Tanvir Ahmed Polok",
    reviewImage: "/images/testimonials/review-4.svg",
    university: "Lund University",
    country: "Sweden",
    course: "MSc International Business",
  },
];
