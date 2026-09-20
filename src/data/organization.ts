import type { Organization } from "@/types";

/** Organization story from globaled.io */
export const organization: Organization = {
  history: [
    "GlobalEd is a sister concern of Global Citizen Limited, an organization officially authorized by the British Council. Global Citizen Limited has been playing a vital role in IELTS registration and testing, ensuring a smooth and reliable process in coordination with the British Council.",
    "As a sub-brand of Global Citizen Limited, GlobalEd focuses on delivering a broader range of services, including online courses, skill-based training, career counseling, corporate workshops, and visa/admission guidance. With a vision to empower learners and professionals, GlobalEd is dedicated to building pathways toward global education, career growth, and international opportunities.",
    "Global Citizen Limited and GlobalEd work together to prepare students and professionals for global opportunities. Global Citizen Limited is an authorized partner of the British Council, providing official IELTS registration and testing services. Through GlobalEd, we offer online courses and certification programs, career counseling, visa and admission support, as well as corporate training and workshops, enabling students and professionals to gain international-level knowledge and skills.",
  ],
  mission:
    "Preparing Bangladeshi students and professionals through world-class education, modern training, and expert guidance, so they can confidently pursue global opportunities, competitive careers, and international-level success.",
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
      name: "Global Citizen Limited (GCL)",
      description:
        "Our parent organization — British Council authorized for IELTS registration and testing.",
      logo: "/images/logos/sister-gcl.svg",
    },
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
  boardOfDirectors: [
    {
      name: "Professor Shamim Ara Hassan",
      designation: "Chairman, Global Citizen LTD.",
      photo: "/images/board/shamim-ara-hassan.webp",
    },
    {
      name: "Engr. Abdul Aziz",
      designation: "Managing Director, Global Citizen LTD.",
      photo: "/images/board/abdul-aziz.webp",
    },
    {
      name: "Engr. Abdul Alim",
      designation: "Director, Global Citizen LTD.",
      photo: "/images/board/abdul-alim.webp",
    },
    {
      name: "Advocate Umme Salma",
      designation: "Director, Global Citizen LTD.",
      photo: "/images/board/umme-salma.jpg",
    },
    {
      name: "Ln. Mir Abdul Alim",
      designation: "Director, Global Citizen LTD.",
      photo: "/images/board/mir-abdul-alim.webp",
    },
  ],
};
