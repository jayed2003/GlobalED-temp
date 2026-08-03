import type { EventItem } from "@/types";

/** Placeholder events — replace with the company's real event calendar. */
export const events: EventItem[] = [
  {
    slug: "global-education-expo-2026",
    title: "Global Education Expo 2026 — Dhaka",
    status: "upcoming",
    date: "2026-09-12",
    time: "10:00 AM – 5:00 PM",
    venue: "GlobalEd Dhanmondi Branch, Dhaka",
    bannerImage: "/images/events/expo-2026.svg",
    description:
      "Meet representatives from 40+ partner universities across the UK, Canada, Australia, and Europe. On-spot assessments, scholarship guidance, and free IELTS counselling — all under one roof.",
  },
  {
    slug: "ielts-mock-test-day-sep-2026",
    title: "Free IELTS Mock Test Day",
    status: "upcoming",
    date: "2026-09-20",
    time: "9:00 AM – 1:00 PM",
    venue: "GlobalEd Banani Branch, Dhaka",
    bannerImage: "/images/events/mock-test.svg",
    description:
      "Sit a full British Council-format IELTS mock test (Listening, Reading, Writing) and receive a same-day band score estimate with one-to-one feedback from our chief instructor.",
  },
  {
    slug: "uk-admission-day-jul-2026",
    title: "UK Admission Day 2026",
    status: "previous",
    date: "2026-07-18",
    time: "11:00 AM – 4:00 PM",
    venue: "GlobalEd Dhanmondi Branch, Dhaka",
    bannerImage: "/images/events/uk-admission-day.svg",
    description:
      "Over 200 students met delegates from 15 UK universities, with on-spot conditional offers issued to eligible candidates.",
    gallery: ["/images/events/uk-day-1.svg", "/images/events/uk-day-2.svg"],
  },
  {
    slug: "australia-education-fair-jun-2026",
    title: "Australia Education Fair 2026",
    status: "previous",
    date: "2026-06-27",
    time: "10:00 AM – 5:00 PM",
    venue: "GlobalEd Chattogram Branch",
    bannerImage: "/images/events/aus-fair.svg",
    description:
      "Our Chattogram branch hosted 10 Australian university representatives for a day of counselling, application fee waivers, and scholarship assessments.",
    gallery: ["/images/events/aus-fair-1.svg", "/images/events/aus-fair-2.svg"],
  },
];
