import type { Organization } from "@/types";

/** Placeholder organization story — replace with the company's real history. */
export const organization: Organization = {
  history: [
    "GlobalEd began in 2013 as a small IELTS coaching centre in Dhanmondi, Dhaka, with a single classroom and a big promise: honest, transparent guidance for Bangladeshi students dreaming of studying abroad.",
    "As our IELTS students asked for admission support, we grew into a full study abroad consultancy — adding university partnerships, visa documentation teams, and dedicated counsellors for every major destination.",
    "Today, GlobalEd serves students from three branches across Bangladesh and has guided thousands of students into universities across the UK, USA, Canada, Australia, Europe, and Asia.",
  ],
  mission:
    "To make world-class education accessible to every Bangladeshi student through honest counselling, expert IELTS training, and end-to-end study abroad support.",
  vision:
    "To be Bangladesh's most trusted education consultancy — measured not by the number of files we process, but by the number of dreams we deliver.",
  timeline: [
    { year: "2013", milestone: "Founded as an IELTS coaching centre in Dhanmondi" },
    { year: "2016", milestone: "Launched full study abroad consultancy services" },
    { year: "2019", milestone: "Opened Banani branch; crossed 1,000 student placements" },
    { year: "2022", milestone: "Opened Chattogram branch; added Japanese language courses" },
    { year: "2025", milestone: "Reached 5,000+ students placed across 13 destinations" },
  ],
  sisterOrganizations: [
    {
      name: "GlobalEd Language Club",
      description:
        "Our language training wing offering IELTS, Spoken English, and Japanese language programs.",
      logo: "/images/logos/sister-language-club.svg",
    },
    {
      name: "GlobalEd Foundation",
      description:
        "A non-profit initiative providing free counselling and scholarship support to underprivileged students.",
      logo: "/images/logos/sister-foundation.svg",
    },
  ],
};
