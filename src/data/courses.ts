import type { Course } from "@/types";

/** The 7 courses from the company requirements. Prices are placeholders. */
export const courses: Course[] = [
  {
    slug: "ielts-regular",
    title: "IELTS Regular Course",
    category: "ielts",
    image: "/images/courses/ielts-regular.jpg",
    overview:
      "Our flagship IELTS preparation program covering all four modules — Listening, Reading, Writing, and Speaking — with weekly mock tests and individual feedback.",
    curriculum: [
      "Diagnostic test and personalized study plan",
      "Module-wise strategy classes (L/R/W/S)",
      "Weekly full-format mock tests",
      "Writing task correction with band feedback",
      "Speaking one-to-one practice sessions",
    ],
    duration: "3 months",
    schedule: "Sat–Thu, morning & evening batches",
    price: "BDT 12,000",
    badge: "Popular",
  },
  {
    slug: "ielts-executive-class",
    title: "IELTS Executive Class",
    category: "ielts",
    image: "/images/courses/ielts-executive.jpg",
    overview:
      "Designed for working professionals — the same complete IELTS preparation compressed into evening and weekend sessions that fit around your job.",
    curriculum: [
      "Evening and weekend-only schedule",
      "All four modules with executive pacing",
      "Bi-weekly mock tests",
      "Flexible makeup classes",
      "One-to-one speaking practice",
    ],
    duration: "3 months",
    schedule: "Fri–Sat + weekday evenings",
    price: "BDT 15,000",
  },
  {
    slug: "ielts-master-class",
    title: "IELTS Master Class",
    category: "ielts",
    image: "/images/courses/ielts-master.jpg",
    overview:
      "An intensive band 7+ bootcamp for students who already have the basics — advanced techniques, daily practice, and mentor-led review sessions.",
    curriculum: [
      "Advanced Writing Task 2 masterclass",
      "Reading speed and accuracy drills",
      "Listening trap identification",
      "Daily speaking clubs with examiners' feedback",
      "Four full mock tests with detailed analysis",
    ],
    duration: "6 weeks",
    schedule: "Sat–Thu, intensive evening batch",
    price: "BDT 10,000",
    badge: "Band 7+ focus",
  },
  {
    slug: "spoken-english",
    title: "Spoken English",
    category: "english",
    image: "/images/courses/spoken-english.jpg",
    overview:
      "Build real speaking confidence for interviews, presentations, and everyday conversation — from nervous beginner to fluent communicator.",
    curriculum: [
      "Everyday conversation practice",
      "Pronunciation and fluency drills",
      "Public speaking and presentation skills",
      "Interview English (university & job)",
      "Group discussions and role plays",
    ],
    duration: "4 months",
    schedule: "3 days per week, multiple batches",
    price: "BDT 8,000",
  },
  {
    slug: "one-to-one",
    title: "One-to-One",
    category: "english",
    image: "/images/courses/one-to-one.jpg",
    overview:
      "Private, fully personalized English or IELTS coaching with a dedicated instructor — your schedule, your pace, your goals.",
    curriculum: [
      "Personal needs analysis",
      "Custom lesson plans",
      "Flexible scheduling",
      "Progress tracking every session",
      "Direct mentor access between classes",
    ],
    duration: "Flexible",
    schedule: "By appointment",
    price: "BDT 800 / session",
  },
  {
    slug: "language-club",
    title: "Language Club",
    category: "english",
    image: "/images/courses/language-club.jpg",
    overview:
      "A weekly practice community for learners who want to keep their English sharp — debates, movie discussions, book clubs, and games.",
    curriculum: [
      "Weekly speaking clubs",
      "Debate and extempore sessions",
      "Movie and book discussions",
      "Vocabulary-building games",
      "Guest sessions with alumni abroad",
    ],
    duration: "Ongoing membership",
    schedule: "Fridays, 4:00 – 6:00 PM",
    price: "BDT 1,500 / month",
  },
  {
    slug: "japanese-language",
    title: "Japanese Language",
    category: "other-languages",
    image: "/images/courses/japanese.jpg",
    overview:
      "JLPT-focused Japanese courses from N5 to N3 — for students targeting Japan, and professionals working with Japanese companies.",
    curriculum: [
      "JLPT N5 / N4 / N3 structured levels",
      "Hiragana, Katakana, and Kanji foundations",
      "Listening and conversation practice",
      "JLPT mock examinations",
      "Japan study and work culture orientation",
    ],
    duration: "6 months per level",
    schedule: "Sat–Thu, morning & evening batches",
    price: "BDT 14,000 / level",
    badge: "New",
  },
];
