import type { Destination } from "@/types";

/**
 * The 13 study destinations from the company requirements.
 * Placeholder content — figures are indicative and must be reviewed before launch.
 */
export const destinations: Destination[] = [
  {
    slug: "uk",
    name: "United Kingdom",
    tagline: "One-year master's degrees and a 2-year post-study work visa.",
    heroImage: "/images/destinations/uk-hero.jpg",
    flagImage: "/images/flags/uk.svg",
    overview:
      "The UK is the most popular destination for Bangladeshi students — home to world-ranked universities, one-year master's programs, and the Graduate Route that lets you work for two years after graduation.",
    whyStudyHere: [
      "Globally ranked universities with centuries of academic excellence",
      "One-year master's degrees — save a full year of tuition and living costs",
      "Graduate Route: 2-year post-study work visa",
      "Large, welcoming Bangladeshi community across all major cities",
    ],
    popularUniversities: [
      { name: "University of Manchester", city: "Manchester" },
      { name: "University of Birmingham", city: "Birmingham" },
      { name: "University of Leeds", city: "Leeds" },
      { name: "University of Greenwich", city: "London" },
      { name: "Coventry University", city: "Coventry" },
    ],
    tuitionRange: "£12,000 – £25,000 / year",
    livingCost: "£900 – £1,400 / month",
    scholarships: [
      "Chevening Scholarship (fully funded)",
      "GREAT Scholarships (£10,000)",
      "University merit awards (£2,000 – £6,000)",
    ],
    visaInfo: [
      "Student Route visa with CAS from a licensed sponsor",
      "Financial proof: tuition + 9 months of living costs held 28 days",
      "Credibility interview preparation included in our visa service",
    ],
    faqs: [
      {
        q: "Can I study in the UK without IELTS?",
        a: "Many universities accept alternatives like PTE, Duolingo, or MOI (Medium of Instruction) letters. We assess your profile and recommend the best route.",
      },
      {
        q: "How much bank balance do I need for a UK student visa?",
        a: "You must show first-year tuition plus living costs (£1,334/month in London, £1,023/month outside London for up to 9 months) held for 28 consecutive days.",
      },
    ],
  },
  {
    slug: "usa",
    name: "United States",
    tagline: "The world's largest selection of universities and research funding.",
    heroImage: "/images/destinations/usa-hero.jpg",
    flagImage: "/images/flags/usa.svg",
    overview:
      "The USA offers unmatched variety — 4,000+ universities, generous assistantships for graduate students, and Optional Practical Training (OPT) that lets you work after graduation.",
    whyStudyHere: [
      "Home to most of the world's top-ranked universities",
      "Research and teaching assistantships that fund graduate study",
      "OPT: 12 months of work authorization (36 months for STEM)",
      "Flexible curricula — choose majors and minors across fields",
    ],
    popularUniversities: [
      { name: "Arizona State University", city: "Tempe, AZ" },
      { name: "Northeastern University", city: "Boston, MA" },
      { name: "University of Texas at Arlington", city: "Arlington, TX" },
      { name: "New York Institute of Technology", city: "New York, NY" },
      { name: "Wichita State University", city: "Wichita, KS" },
    ],
    tuitionRange: "$20,000 – $45,000 / year",
    livingCost: "$1,000 – $1,800 / month",
    scholarships: [
      "Fulbright Foreign Student Program",
      "University merit scholarships ($5,000 – full tuition)",
      "Graduate assistantships (tuition waiver + stipend)",
    ],
    visaInfo: [
      "F-1 student visa with I-20 from a SEVP-certified school",
      "DS-160 form, SEVIS fee, and embassy interview in Dhaka",
      "Our mock interviews prepare you for the visa interview",
    ],
    faqs: [
      {
        q: "Is the US visa interview difficult?",
        a: "Most refusals come from unclear study plans or weak financial ties. Our mock interview sessions train you to answer confidently and honestly.",
      },
      {
        q: "Can I work while studying in the USA?",
        a: "Yes — up to 20 hours per week on campus during semesters, and full-time during breaks. OPT allows full-time work after graduation.",
      },
    ],
  },
  {
    slug: "canada",
    name: "Canada",
    tagline: "Post-graduation work permits and a clear pathway to PR.",
    heroImage: "/images/destinations/canada-hero.jpg",
    flagImage: "/images/flags/canada.svg",
    overview:
      "Canada combines world-class education with immigration-friendly policies — the Post-Graduation Work Permit and Express Entry make it a top choice for students planning a future abroad.",
    whyStudyHere: [
      "PGWP: work in Canada for up to 3 years after graduation",
      "Clear, points-based permanent residency pathways",
      "Safe, multicultural cities with large Bangladeshi communities",
      "Co-op programs that pay you while you study",
    ],
    popularUniversities: [
      { name: "University of Toronto", city: "Toronto, ON" },
      { name: "University of British Columbia", city: "Vancouver, BC" },
      { name: "University of Manitoba", city: "Winnipeg, MB" },
      { name: "Yorkville University", city: "Toronto, ON" },
      { name: "Thompson Rivers University", city: "Kamloops, BC" },
    ],
    tuitionRange: "CAD 15,000 – 35,000 / year",
    livingCost: "CAD 1,000 – 1,600 / month",
    scholarships: [
      "University entrance scholarships (CAD 2,000 – 20,000)",
      "Provincial graduate scholarships",
      "Vanier Canada Graduate Scholarships (PhD)",
    ],
    visaInfo: [
      "Study permit with a Letter of Acceptance from a DLI",
      "GIC of CAD 20,635 plus first-year tuition for SDS applicants",
      "Biometrics and medical exam required for Bangladeshi applicants",
    ],
    faqs: [
      {
        q: "What is the SDS stream?",
        a: "The Student Direct Stream offers faster visa processing for applicants who pay first-year tuition upfront, purchase a GIC, and meet the IELTS requirement of 6.0 in each band.",
      },
      {
        q: "Can my spouse accompany me to Canada?",
        a: "Yes — spouses of full-time students at eligible institutions can apply for an open work permit.",
      },
    ],
  },
  {
    slug: "australia",
    name: "Australia",
    tagline: "Globally ranked universities with strong post-study work rights.",
    heroImage: "/images/destinations/australia-hero.jpg",
    flagImage: "/images/flags/australia.svg",
    overview:
      "Australia welcomes over half a million international students with high-ranking universities, a great climate, and Temporary Graduate visas offering 2–4 years of post-study work.",
    whyStudyHere: [
      "7 universities in the world's top 100",
      "Temporary Graduate visa: 2–4 years of post-study work",
      "Part-time work rights — 48 hours per fortnight during semesters",
      "High quality of life and safe, student-friendly cities",
    ],
    popularUniversities: [
      { name: "University of Melbourne", city: "Melbourne, VIC" },
      { name: "Monash University", city: "Melbourne, VIC" },
      { name: "University of Queensland", city: "Brisbane, QLD" },
      { name: "Victoria University", city: "Melbourne, VIC" },
      { name: "University of Newcastle", city: "Newcastle, NSW" },
    ],
    tuitionRange: "AUD 20,000 – 38,000 / year",
    livingCost: "AUD 1,500 – 2,000 / month",
    scholarships: [
      "Australia Awards (fully funded)",
      "University international scholarships (15% – 50% tuition)",
      "Destination Australia scholarships for regional study",
    ],
    visaInfo: [
      "Subclass 500 student visa with CoE from your university",
      "Genuine Student (GS) requirement — we help you write a strong statement",
      "OSHC health cover required for the full visa duration",
    ],
    faqs: [
      {
        q: "What is the Genuine Student requirement?",
        a: "Australia assesses whether your primary intention is genuinely to study. We prepare your GS statement to clearly connect your background, course choice, and career plan.",
      },
      {
        q: "How much funds do I need to show?",
        a: "Currently you must demonstrate access to around AUD 29,710 for living costs plus tuition and travel — we structure this with your sponsors.",
      },
    ],
  },
  {
    slug: "new-zealand",
    name: "New Zealand",
    tagline: "High-quality education in one of the world's safest countries.",
    heroImage: "/images/destinations/new-zealand-hero.jpg",
    flagImage: "/images/flags/new-zealand.svg",
    overview:
      "New Zealand's eight universities are all globally ranked, and its post-study work visa of up to 3 years makes it an excellent choice for students seeking quality and peace of mind.",
    whyStudyHere: [
      "All 8 universities ranked in the world's top 3%",
      "Post-study work visa for up to 3 years",
      "Consistently ranked among the world's safest countries",
      "Stunning environment with a relaxed, welcoming culture",
    ],
    popularUniversities: [
      { name: "University of Auckland", city: "Auckland" },
      { name: "University of Otago", city: "Dunedin" },
      { name: "Victoria University of Wellington", city: "Wellington" },
      { name: "University of Canterbury", city: "Christchurch" },
      { name: "Massey University", city: "Palmerston North" },
    ],
    tuitionRange: "NZD 22,000 – 35,000 / year",
    livingCost: "NZD 1,200 – 1,700 / month",
    scholarships: [
      "New Zealand Excellence Awards",
      "University international scholarships (NZD 5,000 – 10,000)",
      "Commonwealth Scholarships",
    ],
    visaInfo: [
      "Fee-paying student visa with an offer of place",
      "Funds of NZD 20,000 per year for living costs",
      "Medical and police clearance required",
    ],
    faqs: [
      {
        q: "Can I work while studying in New Zealand?",
        a: "Yes — up to 20 hours per week during semesters and full-time during scheduled holidays.",
      },
      {
        q: "Is New Zealand good for PR?",
        a: "Post-study work experience can lead to residence through the Skilled Migrant Category, especially in green-list occupations.",
      },
    ],
  },
  {
    slug: "sweden",
    name: "Sweden",
    tagline: "Innovative universities with generous scholarships for internationals.",
    heroImage: "/images/destinations/sweden-hero.jpg",
    flagImage: "/images/flags/sweden.svg",
    overview:
      "Sweden offers English-taught programs at world-class universities, strong industry links, and scholarships that can cover up to 100% of tuition for Bangladeshi students.",
    whyStudyHere: [
      "Home of innovation — IKEA, Spotify, Ericsson, Volvo",
      "English-taught bachelor's and master's across all fields",
      "Spouse can accompany with full work rights",
      "Scholarships covering 25–100% of tuition fees",
    ],
    popularUniversities: [
      { name: "Lund University", city: "Lund" },
      { name: "Uppsala University", city: "Uppsala" },
      { name: "KTH Royal Institute of Technology", city: "Stockholm" },
      { name: "University of Gothenburg", city: "Gothenburg" },
      { name: "Stockholm University", city: "Stockholm" },
    ],
    tuitionRange: "SEK 80,000 – 140,000 / year",
    livingCost: "SEK 9,000 – 11,000 / month",
    scholarships: [
      "Swedish Institute Scholarship (fully funded)",
      "University tuition waivers (25% – 100%)",
      "Bilateral program scholarships",
    ],
    visaInfo: [
      "Residence permit for studies via Migrationsverket",
      "Proof of funds: SEK 10,314 per month for the permit period",
      "Apply online after paying the first tuition instalment",
    ],
    faqs: [
      {
        q: "Can I bring my family to Sweden?",
        a: "Yes — spouses and children can apply for residence permits alongside you, and spouses receive full work rights.",
      },
      {
        q: "Is there an application fee?",
        a: "Yes — SEK 900 covers applications to up to four programs through universityadmissions.se.",
      },
    ],
  },
  {
    slug: "finland",
    name: "Finland",
    tagline: "The world's best education system with early-bird scholarships.",
    heroImage: "/images/destinations/finland-hero.jpg",
    flagImage: "/images/flags/finland.svg",
    overview:
      "Finland's universities are famous for teaching quality and student wellbeing. Early-bird discounts and merit scholarships make it surprisingly affordable for Bangladeshi students.",
    whyStudyHere: [
      "Ranked among the world's best education systems",
      "Early-bird tuition discounts of 30–50% at many universities",
      "Safe, clean, and English-friendly society",
      "2-year post-study residence permit to find work",
    ],
    popularUniversities: [
      { name: "University of Helsinki", city: "Helsinki" },
      { name: "Aalto University", city: "Espoo" },
      { name: "Tampere University", city: "Tampere" },
      { name: "University of Turku", city: "Turku" },
      { name: "University of Oulu", city: "Oulu" },
    ],
    tuitionRange: "€8,000 – 15,000 / year",
    livingCost: "€700 – 1,000 / month",
    scholarships: [
      "University merit scholarships (50% – 100% tuition)",
      "Early-bird discounts (€2,000 – 5,000)",
      "Finland Scholarship for doctoral researchers",
    ],
    visaInfo: [
      "Residence permit for studies via Enter Finland",
      "Proof of funds: €800 per month (€9,600 / year)",
      "First-year tuition must be paid before applying for the permit",
    ],
    faqs: [
      {
        q: "Are scholarships automatic in Finland?",
        a: "Many universities automatically consider you for merit scholarships when you apply for admission — no separate application needed.",
      },
      {
        q: "Can I stay in Finland after graduation?",
        a: "Yes — graduates receive a 2-year post-study residence permit to seek employment or start a business.",
      },
    ],
  },
  {
    slug: "denmark",
    name: "Denmark",
    tagline: "Innovation-driven education in the world's happiest country.",
    heroImage: "/images/destinations/denmark-hero.jpg",
    flagImage: "/images/flags/denmark.svg",
    overview:
      "Denmark offers problem-based learning at globally respected universities, with strong career links in engineering, business, and life sciences.",
    whyStudyHere: [
      "Project-based learning with real industry collaboration",
      "Consistently ranked among the world's happiest countries",
      "English-taught programs across all major fields",
      "Part-time work rights and post-study job-seeking period",
    ],
    popularUniversities: [
      { name: "University of Copenhagen", city: "Copenhagen" },
      { name: "Aarhus University", city: "Aarhus" },
      { name: "Technical University of Denmark (DTU)", city: "Lyngby" },
      { name: "Aalborg University", city: "Aalborg" },
      { name: "Copenhagen Business School", city: "Frederiksberg" },
    ],
    tuitionRange: "€6,000 – 16,000 / year",
    livingCost: "€900 – 1,200 / month",
    scholarships: [
      "Danish government scholarships for non-EU students",
      "University tuition waivers and grants",
      "Erasmus Mundus joint programs",
    ],
    visaInfo: [
      "ST1 residence permit for higher education",
      "Proof of funds: approximately DKK 6,800 per month",
      "Part-time work allowed: 20 hours per week during semesters",
    ],
    faqs: [
      {
        q: "Is Danish required to study in Denmark?",
        a: "No — hundreds of programs are taught entirely in English, and most Danes speak excellent English.",
      },
      {
        q: "Can I stay after my studies?",
        a: "Yes — Denmark offers an establishment card allowing graduates to stay and seek work for up to 3 years.",
      },
    ],
  },
  {
    slug: "greece",
    name: "Greece",
    tagline: "Affordable European degrees with a Mediterranean lifestyle.",
    heroImage: "/images/destinations/greece-hero.jpg",
    flagImage: "/images/flags/greece.svg",
    overview:
      "Greece is an emerging destination offering low tuition, English-taught programs, and a Schengen visa — an affordable gateway into European education.",
    whyStudyHere: [
      "Some of the lowest tuition fees in Europe",
      "Growing number of English-taught bachelor's and master's",
      "Schengen visa — travel across 27 European countries",
      "Warm climate and low cost of living",
    ],
    popularUniversities: [
      { name: "National and Kapodistrian University of Athens", city: "Athens" },
      { name: "Aristotle University of Thessaloniki", city: "Thessaloniki" },
      { name: "University of Patras", city: "Patras" },
      { name: "Athens University of Economics and Business", city: "Athens" },
      { name: "University of Crete", city: "Heraklion" },
    ],
    tuitionRange: "€1,500 – 5,000 / year",
    livingCost: "€500 – 800 / month",
    scholarships: [
      "IKY (State Scholarships Foundation) programs",
      "University merit scholarships",
      "Erasmus Mundus joint programs",
    ],
    visaInfo: [
      "National D-type student visa for Greece",
      "Proof of funds: approximately €400 – 500 per month",
      "Acceptance letter from a Greek public university required",
    ],
    faqs: [
      {
        q: "Are Greek degrees recognized internationally?",
        a: "Yes — Greek public universities are EU-accredited, and their degrees are recognized across Europe and beyond.",
      },
      {
        q: "Can I work while studying?",
        a: "Yes — international students can work part-time up to 20 hours per week during semesters.",
      },
    ],
  },
  {
    slug: "malta",
    name: "Malta",
    tagline: "English-speaking EU destination with affordable tuition.",
    heroImage: "/images/destinations/malta-hero.jpg",
    flagImage: "/images/flags/malta.svg",
    overview:
      "Malta is Europe's English-speaking island nation — no language barrier, EU-recognized degrees, and a booming economy in iGaming, finance, and tourism.",
    whyStudyHere: [
      "English is an official language — no language barrier",
      "EU and Schengen member state",
      "Lower tuition and living costs than Western Europe",
      "Growing job market in finance, gaming, and hospitality",
    ],
    popularUniversities: [
      { name: "University of Malta", city: "Msida" },
      { name: "Malta College of Arts, Science & Technology", city: "Paola" },
      { name: "American University of Malta", city: "Cospicua" },
      { name: "Global College Malta", city: "SmartCity" },
      { name: "STC Higher Education", city: "Pembroke" },
    ],
    tuitionRange: "€6,000 – 12,000 / year",
    livingCost: "€700 – 1,000 / month",
    scholarships: [
      "University of Malta international scholarships",
      "Government of Malta scholarships",
      "Institution-specific merit awards",
    ],
    visaInfo: [
      "Maltese national visa for study purposes",
      "Proof of funds: approximately €700 per month",
      "Health insurance required for the full stay",
    ],
    faqs: [
      {
        q: "Is IELTS required for Malta?",
        a: "Requirements vary by institution — several accept Medium of Instruction letters or internal English tests. We check your eligibility first.",
      },
      {
        q: "Can I work in Malta as a student?",
        a: "Yes — after the first 90 days, students can work up to 20 hours per week with an employment license.",
      },
    ],
  },
  {
    slug: "cyprus",
    name: "Cyprus",
    tagline: "Budget-friendly European education with easy admission.",
    heroImage: "/images/destinations/cyprus-hero.jpg",
    flagImage: "/images/flags/cyprus.svg",
    overview:
      "Cyprus offers internationally recognized degrees at very affordable fees, with flexible entry requirements — a practical first step into European higher education.",
    whyStudyHere: [
      "Among the lowest tuition fees in the EU",
      "Flexible entry requirements for Bangladeshi students",
      "English-taught programs at private and public universities",
      "Safe Mediterranean island with a large student community",
    ],
    popularUniversities: [
      { name: "University of Cyprus", city: "Nicosia" },
      { name: "Cyprus University of Technology", city: "Limassol" },
      { name: "University of Nicosia", city: "Nicosia" },
      { name: "European University Cyprus", city: "Nicosia" },
      { name: "Frederick University", city: "Nicosia" },
    ],
    tuitionRange: "€3,500 – 9,000 / year",
    livingCost: "€400 – 700 / month",
    scholarships: [
      "University merit-based tuition reductions (up to 50%)",
      "Early-payment discounts",
      "Government scholarships for postgraduate study",
    ],
    visaInfo: [
      "Student visa issued through the university's international office",
      "Attested academic documents and financial proof required",
      "Visa processing typically takes 4–6 weeks",
    ],
    faqs: [
      {
        q: "Is Cyprus good for Bangladeshi students on a budget?",
        a: "Yes — total annual costs including living can stay under €8,000, making it one of the most affordable European options.",
      },
      {
        q: "Can I transfer from Cyprus to another EU country?",
        a: "Yes — ECTS credits earned in Cyprus are transferable to other European universities, subject to each institution's policy.",
      },
    ],
  },
  {
    slug: "south-korea",
    name: "South Korea",
    tagline: "High-tech education with the fully funded GKS scholarship.",
    heroImage: "/images/destinations/south-korea-hero.jpg",
    flagImage: "/images/flags/south-korea.svg",
    overview:
      "South Korea combines cutting-edge technology universities with one of Asia's best scholarships — the Global Korea Scholarship (GKS) — plus a vibrant culture students love.",
    whyStudyHere: [
      "GKS: fully funded tuition, living allowance, and airfare",
      "World leaders in engineering, IT, and semiconductor research",
      "Growing number of English-taught programs",
      "Safe, modern, and culturally exciting country",
    ],
    popularUniversities: [
      { name: "Seoul National University", city: "Seoul" },
      { name: "KAIST", city: "Daejeon" },
      { name: "Yonsei University", city: "Seoul" },
      { name: "Korea University", city: "Seoul" },
      { name: "Hanyang University", city: "Seoul" },
    ],
    tuitionRange: "₩4,000,000 – 9,000,000 / semester",
    livingCost: "₩700,000 – 1,000,000 / month",
    scholarships: [
      "Global Korea Scholarship (GKS) — fully funded",
      "University merit scholarships (30% – 100% tuition)",
      "TOPIK-based scholarships for Korean language proficiency",
    ],
    visaInfo: [
      "D-2 student visa with a Certificate of Admission",
      "Proof of funds: approximately $10,000 – 20,000 depending on program",
      "Alien registration required within 90 days of arrival",
    ],
    faqs: [
      {
        q: "Do I need to know Korean to study in South Korea?",
        a: "Not for admission to English-taught programs — but learning Korean improves scholarships and job prospects. GKS includes a free language year.",
      },
      {
        q: "When does the GKS application open?",
        a: "GKS undergraduate applications typically open in September, and graduate applications in February, through the Korean Embassy in Dhaka.",
      },
    ],
  },
  {
    slug: "malaysia",
    name: "Malaysia",
    tagline: "World-recognized degrees at a fraction of Western costs.",
    heroImage: "/images/destinations/malaysia-hero.jpg",
    flagImage: "/images/flags/malaysia.svg",
    overview:
      "Malaysia is the smart budget choice — English-taught programs, twinning degrees with UK and Australian universities, and total costs a Bangladeshi family can realistically afford.",
    whyStudyHere: [
      "Tuition from BDT 4–6 lakh per year — highly affordable",
      "Twinning programs with UK and Australian universities",
      "Muslim-friendly country, close to Bangladesh",
      "Straightforward student pass process with high approval rates",
    ],
    popularUniversities: [
      { name: "University of Malaya (UM)", city: "Kuala Lumpur" },
      { name: "Universiti Putra Malaysia (UPM)", city: "Serdang" },
      { name: "Taylor's University", city: "Subang Jaya" },
      { name: "Sunway University", city: "Subang Jaya" },
      { name: "Multimedia University (MMU)", city: "Cyberjaya" },
    ],
    tuitionRange: "MYR 15,000 – 35,000 / year",
    livingCost: "MYR 1,200 – 1,800 / month",
    scholarships: [
      "University international student scholarships",
      "Malaysian International Scholarship (MIS)",
      "Merit-based tuition waivers up to 50%",
    ],
    visaInfo: [
      "Student pass via EMGS (Education Malaysia Global Services)",
      "Offer letter plus medical screening required",
      "Dependents allowed for postgraduate students",
    ],
    faqs: [
      {
        q: "What is a twinning program?",
        a: "You study 1–2 years in Malaysia and transfer to a partner university in the UK or Australia to graduate — earning a Western degree at a much lower total cost.",
      },
      {
        q: "Is IELTS mandatory for Malaysia?",
        a: "Many universities accept IELTS 5.5–6.0, and some offer their own English placement tests. We match you to the right option.",
      },
    ],
  },
];

export function getDestinationBySlug(slug: string): Destination | undefined {
  return destinations.find((d) => d.slug === slug);
}
