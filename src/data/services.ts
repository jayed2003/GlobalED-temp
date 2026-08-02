import type { Service } from "@/types";

/** The 6 services from the company requirements. */
export const services: Service[] = [
  {
    slug: "university-admission-support",
    title: "University Admission Support",
    icon: "GraduationCap",
    shortDescription:
      "End-to-end application support — from shortlisting universities to securing your offer letter.",
    description:
      "Our counsellors match your academic profile, budget, and career goals with the right universities, then manage your entire application — documents, SOP review, submission, and offer follow-up.",
    benefits: [
      "Personalized university shortlisting based on your profile",
      "SOP and recommendation letter review",
      "Direct liaison with 300+ partner universities",
      "Application fee waivers at selected partners",
    ],
    process: [
      { step: "Profile assessment", description: "We evaluate your academics, English score, and budget." },
      { step: "Shortlisting", description: "You receive a tailored list of universities and courses." },
      { step: "Application", description: "We prepare and submit complete, error-free applications." },
      { step: "Offer letter", description: "We follow up until your conditional or unconditional offer arrives." },
    ],
  },
  {
    slug: "scholarship-guidance",
    title: "Scholarship Guidance",
    icon: "Award",
    shortDescription:
      "Find and win scholarships that reduce your tuition — from merit awards to country-specific funds.",
    description:
      "We track scholarship opportunities across all 13 destinations — university merit awards, government schemes like Chevening and GKS, and destination-specific funds — then help you apply with a strong case.",
    benefits: [
      "Scholarship matching based on your grades and destination",
      "Application essay and interview preparation",
      "Up-to-date deadline tracking",
      "Partial to full-funding options identified early",
    ],
    process: [
      { step: "Eligibility check", description: "We identify every scholarship you qualify for." },
      { step: "Documentation", description: "We prepare transcripts, essays, and references." },
      { step: "Submission", description: "Applications go out before deadlines — never last minute." },
      { step: "Award follow-up", description: "We negotiate and confirm your award with the university." },
    ],
  },
  {
    slug: "documentation-guideline",
    title: "Documentation Guideline",
    icon: "FileCheck",
    shortDescription:
      "Get every document right the first time — transcripts, financials, SOPs, and embassy formats.",
    description:
      "Most visa refusals trace back to documentation errors. Our compliance team double-checks every page of your file — academic records, bank statements, affidavits, and translations — against the exact embassy checklist.",
    benefits: [
      "Country-specific document checklists",
      "Financial document and bank statement guidance",
      "Translation and notarization support",
      "Double cross-check before every submission",
    ],
    process: [
      { step: "Checklist", description: "You receive a document list for your destination." },
      { step: "Collection", description: "We help you gather and format each document." },
      { step: "Verification", description: "Two senior officers review your complete file." },
      { step: "Submission-ready", description: "Your file is sealed and submitted with confidence." },
    ],
  },
  {
    slug: "visa-application",
    title: "Visa Application",
    icon: "Plane",
    shortDescription:
      "Step-by-step visa filing with mock interviews — the reason behind our 97% visa success rate.",
    description:
      "From filling embassy forms to preparing for credibility interviews, our visa team handles the complete process. We run mock interviews, review your financial story, and file your application with precision.",
    benefits: [
      "Complete visa form filling and appointment booking",
      "One-to-one mock interview sessions",
      "Financial documentation strategy",
      "97% visa success rate across all destinations",
    ],
    process: [
      { step: "Visa file preparation", description: "We assemble your complete visa file." },
      { step: "Mock interview", description: "Practice sessions with real embassy-style questions." },
      { step: "Submission", description: "Your application is filed and tracked." },
      { step: "Decision", description: "We support you until the visa is in your passport." },
    ],
  },
  {
    slug: "pre-post-departure-guidance",
    title: "Pre & Post Departure Guidance",
    icon: "Luggage",
    shortDescription:
      "Briefings before you fly and support after you land — accommodation, banking, and settling in.",
    description:
      "Our support doesn't end at the visa. Before departure we brief you on travel, packing, forex, and airport procedures. After arrival we help with accommodation, local registration, banking, and staying connected.",
    benefits: [
      "Pre-departure briefing sessions with alumni",
      "Accommodation and airport pickup assistance",
      "Guidance on banking, SIM, and local registration",
      "Ongoing student support community abroad",
    ],
    process: [
      { step: "Briefing", description: "Country-specific session on what to expect." },
      { step: "Travel prep", description: "Ticketing, forex, and packing guidance." },
      { step: "Arrival support", description: "Airport pickup and initial settling-in help." },
      { step: "Ongoing care", description: "Stay connected with our student community." },
    ],
  },
  {
    slug: "language-support",
    title: "Language Support",
    icon: "Languages",
    shortDescription:
      "IELTS, Spoken English, and Japanese language training under one roof.",
    description:
      "Strong language scores unlock better universities and bigger scholarships. Our language wing offers IELTS preparation in three formats, Spoken English for confidence, and Japanese for students targeting Japan or language-club careers.",
    benefits: [
      "Three IELTS course formats for every schedule",
      "British Council-format mock tests",
      "Small batch sizes with individual feedback",
      "Japanese language from certified instructors",
    ],
    process: [
      { step: "Free assessment", description: "We test your current level and target band." },
      { step: "Course placement", description: "You join the batch that fits your goal." },
      { step: "Mock tests", description: "Regular full-format tests with band feedback." },
      { step: "Test booking", description: "We book your official IELTS test when you're ready." },
    ],
  },
];
