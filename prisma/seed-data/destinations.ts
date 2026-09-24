import type { Destination } from "../../src/types";

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
    tagline: "Post-graduation work permits and a clear pathway to permanent residency.",
    heroImage: "/images/destinations/canada-hero.jpg",
    flagImage: "/images/flags/canada.svg",
    overview:
      "Canada is a vast, welcoming, and multicultural country made up of 10 provinces and 3 territories, with Ottawa as its capital. Eastern Canada is known for agriculture, forestry, and fisheries; Northern Canada for gas and oil exploration; and Ontario and Quebec for industry and manufacturing. Popular student cities include Vancouver (coastal beauty meets urban energy), Toronto (Canada's largest, most diverse metropolis), Montreal (a bilingual blend of European charm and North American drive), Halifax, Calgary, and Winnipeg. Canada offers three main intakes each year — September, January, and May.",
    whyStudyHere: [
      "Qualifications valued around the world",
      "Affordable education compared to other top study destinations",
      "A multicultural, inclusive society with healthy and safe communities",
      "Opportunities for paid internships while studying",
      "A Post-Graduation Work Permit (PGWP) and strong job prospects after graduation",
      "A genuine pathway to permanent residency",
    ],
    popularUniversities: [
      { name: "University of British Columbia (Okanagan)", city: "Kelowna, British Columbia" },
      { name: "University of Alberta", city: "Edmonton, Alberta" },
      { name: "University of Waterloo", city: "Waterloo, Ontario" },
      { name: "Queen's University", city: "Kingston, Ontario" },
      { name: "University of Ottawa", city: "Ottawa, Ontario" },
      { name: "University of Calgary", city: "Calgary, Alberta" },
      { name: "Dalhousie University", city: "Halifax, Nova Scotia" },
      { name: "Toronto Metropolitan University", city: "Toronto, Ontario" },
      { name: "Carleton University", city: "Ottawa, Ontario" },
      { name: "University of Manitoba", city: "Winnipeg, Manitoba" },
    ],
    tuitionRange: "CAD 15,000 – 35,000 / year",
    livingCost: "CAD 1,000 – 1,600 / month",
    scholarships: [
      "Highly competitive — scholarships in Canada are more limited than in the USA, UK, or Australia",
      "Merit-based — eligibility depends on outstanding academic grades and strong English proficiency (often IELTS 8.0+)",
      "Mostly awarded automatically by universities based on eligibility, though some institutions require a separate application",
      "Examples: Carleton University CAD 1,000–4,000, Brock University CAD 1,600–13,600, Lakehead University CAD 6,000–10,000 (Bachelor's); Seneca Polytechnic CAD 2,000–5,000, Sheridan College CAD 1,000–3,000 (all levels)",
    ],
    visaInfo: [
      "9-step process: language test (IELTS/TOEFL), application via the course finder, offer letter, arranging finances, tuition fee payment, PAL request (if applicable), optional GIC (CAD 22,895), medical exam, then visa submission",
      "Minimum language scores for a strong application: IELTS 6.0 overall (no band below 6.0), PTE 60 overall, TOEFL 83 overall (no section below 20) — higher scores strengthen your profile further",
      "Institutions with affordable tuition deposits from CAD 1,000 (University of Winnipeg, University of Regina, St. Francis Xavier) up to CAD 3,000 (UBC Okanagan)",
      "For visa purposes, paying the first semester's tuition fee is recommended to strengthen your application",
    ],
    faqs: [
      {
        q: "What are the main intakes for Canada?",
        a: "Canada offers multiple entry points throughout the year, with the main intakes in September, January, and May.",
      },
      {
        q: "What are the English language requirements?",
        a: "Requirements vary by program level. As a guide: Bachelor's and PG Diplomas need IELTS 6.5 (no band below 6.0), TOEFL 79, or PTE 62; Master's needs IELTS 6.5 (no band below 6.0), TOEFL 88, or PTE 62. For a strong visa application, aim for IELTS 6.0 overall with no band below 6.0.",
      },
      {
        q: "How long do different programs take?",
        a: "UG Certificates take 1 year, UG Diplomas 2–3 years, Bachelor's degrees 4 years, PG Diplomas/Graduate Certificates 1–2 years, Master's 1–2 years, and Doctoral/PhD programs 2–5 years.",
      },
      {
        q: "Are scholarships easy to get in Canada?",
        a: "Scholarships in Canada are more limited and competitive than in countries like the USA, UK, or Australia. They are merit-based, depend on outstanding grades and strong English scores (often IELTS 8.0+), and are mostly offered at entry level.",
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
    tagline:
      "Low tuition fees in an English-speaking European country with a Mediterranean lifestyle.",
    heroImage: "/images/destinations/malta-hero.jpg",
    flagImage: "/images/flags/malta.svg",
    overview:
      "Malta is a European Union member state located in the Mediterranean. English is an official language, making it an accessible destination for international students looking for an English-medium education in Europe. Students can find programmes across business, management, information technology, hospitality, tourism, health, engineering and other academic fields — including Business & Management, Information Technology, Hospitality & Tourism, Health & Social Care, Engineering, and professional diplomas.",
    whyStudyHere: [
      "European Education — study in an EU member state with institutions offering internationally oriented programmes",
      "English-Speaking — English is an official language and is widely used in higher education and everyday life",
      "Mediterranean Lifestyle — enjoy Malta's Mediterranean climate, coastal environment and multicultural lifestyle",
      "International Community — meet students and professionals from different countries while studying in Malta",
    ],
    popularUniversities: [
      { name: "University of Malta", city: "Msida" },
      { name: "Malta College of Arts, Science & Technology", city: "Paola" },
      { name: "American University of Malta", city: "Cospicua" },
      { name: "Global College Malta", city: "SmartCity Malta" },
      { name: "Malta Business School", city: "Malta" },
    ],
    tuitionRange: "€6,000 – €15,000+ / year",
    livingCost: "€750 – €1,200 / month",
    scholarships: [
      "University Scholarships — selected institutions may offer merit-based scholarships or tuition reductions for eligible students",
      "Merit-Based Awards — strong academic performance may qualify students for institution-specific awards",
      "Tuition Discounts — some colleges and institutions may provide promotional or programme-specific tuition discounts",
    ],
    visaInfo: [
      "Student visa process: offer/acceptance letter, enrolment and fee payment, visa documentation, application, biometrics, interview if requested, then travel to Malta after approval",
      "Common documents: valid passport, acceptance letter, academic certificates and transcripts, proof of accommodation, proof of financial means, health/travel insurance, and application forms and photographs",
      "Visa and financial requirements can change — always follow the latest instructions from the relevant Maltese authorities and the official visa application centre before submission",
      "GlobalEd provides guidance with admission documentation, financial-document preparation, application review and visa-file preparation for Bangladeshi students",
    ],
    faqs: [
      {
        q: "Can I study in Malta without IELTS?",
        a: "English-language requirements depend on the institution and programme. Some institutions may accept alternative evidence of English proficiency, depending on their admission policy. We assess each student's profile and identify suitable options.",
      },
      {
        q: "How much does it cost to study in Malta?",
        a: "Tuition varies according to the institution and programme. Many international programmes can fall within an approximate range of €6,000–€15,000+ per year, but the exact fee should always be confirmed with the institution.",
      },
      {
        q: "Can Bangladeshi students work while studying in Malta?",
        a: "Eligible third-country nationals may be permitted to work while studying subject to the applicable Maltese employment and immigration rules. Work permission and conditions should be confirmed before starting employment.",
      },
      {
        q: "Is Malta suitable for Bachelor's and Master's students?",
        a: "Yes. Malta offers Bachelor's, Master's and other higher education and professional qualification pathways, depending on the institution and programme.",
      },
      {
        q: "Is English widely spoken in Malta?",
        a: "Yes. English is one of Malta's two official languages alongside Maltese and is widely used in education, business and everyday communication.",
      },
      {
        q: "Can I bring my family to Malta as a student?",
        a: "Family reunification and dependant options depend on the student's residence status, programme and current Maltese immigration rules. Eligibility should be checked for the specific case before making plans.",
      },
      {
        q: "What documents are needed for a Malta student visa?",
        a: "Common documents include the passport, admission letter, financial evidence, accommodation evidence, insurance, academic documents, application forms and other supporting documents required for the applicant's circumstances.",
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
    tagline: "22 accredited universities, IELTS-based scholarships, and a fully funded GKS track.",
    heroImage: "/images/destinations/south-korea-hero.jpg",
    flagImage: "/images/flags/south-korea.svg",
    overview:
      "South Korea's higher-education landscape brings together globally recognized universities, innovative programs, advanced research, and career-focused education. From leading institutions in Seoul to specialized universities across the country, students can find programs that match their academic goals, career ambitions, budget, and preferred location — spanning the SKY universities, elite science and technology institutes like KAIST and UNIST, and strong regional national universities across cities including Daejeon, Busan, Suwon, Chuncheon, Cheongju, and Jeonju.",
    whyStudyHere: [
      "GKS: fully funded tuition, living allowance, and airfare through the Global Korea Scholarship",
      "World leaders in engineering, IT, and semiconductor research at institutes like KAIST and UNIST",
      "IELTS-tiered scholarships — many universities offer 30–100% tuition reductions scaled directly to your IELTS score",
      "Growing number of English-taught bachelor's and master's programs across business, engineering, and international studies",
    ],
    popularUniversities: [
      { name: "Seoul National University", city: "Seoul" },
      { name: "Yonsei University", city: "Seoul" },
      { name: "KAIST (Korea Advanced Institute of Science and Technology)", city: "Daejeon" },
      { name: "Sungkyunkwan University (SKKU)", city: "Seoul / Suwon" },
      { name: "Hanyang University", city: "Seoul" },
      { name: "Kyung Hee University", city: "Seoul" },
      { name: "Hankuk University of Foreign Studies", city: "Seoul" },
      { name: "UNIST (Ulsan National Institute of Science and Technology)", city: "Ulsan" },
      { name: "Gachon University", city: "Seongnam / Incheon" },
      { name: "Pusan National University", city: "Busan" },
      { name: "Ajou University", city: "Suwon" },
      { name: "Sejong University", city: "Seoul" },
      { name: "Kangwon National University", city: "Chuncheon" },
      { name: "Chungbuk National University", city: "Cheongju" },
      { name: "Jeonbuk National University", city: "Jeonju" },
      { name: "Dong-A University", city: "Busan" },
      { name: "Dongseo University", city: "Busan" },
      { name: "Kyungsung University", city: "Busan" },
      { name: "Dong-Eui University", city: "Busan" },
      { name: "Tongmyong University", city: "Busan" },
      { name: "Dongshin University", city: "Naju" },
      { name: "Halla University", city: "Wonju" },
    ],
    tuitionRange: "₩3,200,000 – 6,400,000 / year (varies by university and program)",
    livingCost: "₩700,000 – 1,000,000 / month",
    scholarships: [
      "Global Korea Scholarship (GKS) — fully funded",
      "IELTS-tiered university scholarships — e.g. Hanyang (IELTS 6.0–6.5 → 70–100% tuition), Sejong (5.5–8.0 → 30–80%), Halla (guaranteed 40% base plus IELTS-scaled top-ups)",
      "Interview-based scholarships at select universities — Kyung Hee guarantees 100% tuition for IELTS 7.0 with a strong interview",
      "Continuing scholarships from the 2nd semester onward, typically based on GPA once the entry-scholarship period ends",
    ],
    visaInfo: [
      "D-2 student visa with a Certificate of Admission",
      "Application fees vary by university, roughly 50,000–180,000 KRW (some quote in USD, e.g. KAIST $80, Dongseo $60–90)",
      "Alien registration required within 90 days of arrival",
      "Admission rounds run on a rolling basis across the year — most universities process 2–3 intake rounds, so confirm exact dates directly with your target university",
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
      {
        q: "How do IELTS-based scholarships work in South Korea?",
        a: "Many universities scale their tuition scholarship directly to your IELTS band — for example, a 6.0 might earn 20–40% off tuition while a 7.0+ can unlock 60–100%. A few universities, like Kyung Hee, guarantee a full scholarship at IELTS 7.0 combined with a strong interview. Exact tiers vary by university, so we match you to the best-fit options for your score.",
      },
      {
        q: "How many intake rounds does a Korean university have?",
        a: "Most universities run 1–3 rounds per year rather than fixed global intake dates — some process undergraduate and graduate applications separately, and a few (like UNIST or Dongseo) run a single annual round. We track each university's live application windows so you don't miss a deadline.",
      },
    ],
  },
  {
    slug: "malaysia",
    name: "Malaysia",
    tagline:
      "Affordable after SSC/O-Level — with credit transfer options to first-world countries (USA, Canada, UK, Australia).",
    heroImage: "/images/destinations/malaysia-hero.jpg",
    flagImage: "/images/flags/malaysia.svg",
    overview:
      "Malaysia offers international students access to quality higher education at comparatively affordable costs. Students can choose from public and private universities, international branch campuses and a wide range of English-medium programmes. Its multicultural environment, modern infrastructure and location in Asia make Malaysia an attractive destination for students looking for an internationally focused education.",
    whyStudyHere: [
      "Quality Universities — study at established Malaysian universities and international branch campuses",
      "Affordable Costs — tuition and living expenses can be more affordable than many popular Western study destinations",
      "Multicultural Environment — experience a diverse society with students and communities from around the world",
      "English-Taught Programmes — many Malaysian higher education programmes are delivered in English",
    ],
    popularUniversities: [
      { name: "University of Malaya", city: "Kuala Lumpur" },
      { name: "Universiti Teknologi Malaysia", city: "Johor Bahru / Kuala Lumpur" },
      { name: "Universiti Kebangsaan Malaysia", city: "Bangi" },
      { name: "Taylor's University", city: "Subang Jaya" },
      { name: "UCSI University", city: "Kuala Lumpur" },
    ],
    tuitionRange: "RM 20,000 – RM 60,000+ / year",
    livingCost: "RM 1,500 – RM 2,500 / month",
    scholarships: [
      "University Merit Scholarships — many Malaysian universities offer tuition discounts or merit-based awards for strong academic profiles",
      "International Student Awards — selected institutions provide scholarships or fee reductions specifically for international students",
      "Programme-Based Scholarships — certain programmes and faculties may offer additional financial support depending on eligibility",
    ],
    visaInfo: [
      "Student Pass process: offer letter, document submission, university/EMGS processing, visa approval, entry, post-arrival medical, and Student Pass endorsement",
      "Common documents: valid passport, offer letter, academic certificates and transcripts, passport photo, and health declaration",
      "Malaysia's Graduate Pass can give eligible graduates up to 12 months post-study, but Bangladesh is not currently on the eligible nationality list — Bangladeshi students should not assume they'll receive it",
      "International students may work part-time up to 20 hours/week during permitted semester breaks, with prior approval and subject to immigration rules",
    ],
    faqs: [
      {
        q: "Can I study in Malaysia without IELTS?",
        a: "English-language requirements vary by university and programme. Some institutions may accept alternative English proficiency evidence, including previous English-medium education or other recognised tests. We assess your profile and recommend suitable universities.",
      },
      {
        q: "How much does it cost to study in Malaysia?",
        a: "Tuition varies significantly by programme and institution. As a general planning range, international students may encounter annual tuition costs of around RM 20,000–RM 60,000+ for many programmes, while living costs can vary by city and lifestyle.",
      },
      {
        q: "Can Bangladeshi students work while studying?",
        a: "International students may work part-time for up to 20 hours per week during permitted semester breaks, subject to prior approval and Malaysian immigration rules.",
      },
      {
        q: "Is Malaysia suitable for Bachelor's and Master's students?",
        a: "Yes. Malaysia offers Bachelor's, Master's and doctoral programmes across business, computing, engineering, hospitality, health sciences, social sciences and many other disciplines.",
      },
      {
        q: "What is the Malaysia Student Pass?",
        a: "The Student Pass is the immigration permission used by international students to study in Malaysia. The application process involves the educational institution and EMGS before the relevant immigration endorsement.",
      },
      {
        q: "Can I bring my family to Malaysia?",
        a: "Dependant eligibility depends on the student's level of study, institution and current immigration rules. The requirements should be checked for the specific programme before making plans.",
      },
    ],
  },
];
