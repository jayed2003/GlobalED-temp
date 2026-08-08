import type { Faq } from "@/types";

/** Central FAQ dataset from globaled.io (About + Study Abroad + Services pages) */
export const faqs: Faq[] = [
  // From About Us page
  {
    category: "general",
    q: "How to Get in Touch with GlobalEd?",
    a: "Call our hotline at 019555 44772 or email us at info@globaled.io. You are also welcome to visit our office in person at 69/E Panthapath, Dhaka-1205 or Hossain Tower, Level-05, Sector-07, Uttara, Dhaka-1230.",
  },
  {
    category: "general",
    q: "What Services Does GlobalEd Offer?",
    a: "We provide services for study abroad, IELTS preparation and testing, language courses in English, Japanese, and Korean, skill-based training programs, as well as guidance for overseas employment opportunities.",
  },
  {
    category: "general",
    q: "Where is the GlobalEd Office Located?",
    a: "Our offices are located in Panthapath (69/E Panthapath, Dhaka-1205) and Uttara (Hossain Tower, Level-05, Sector-07, Uttara, Dhaka-1230). For detailed addresses, please visit the Contact page.",
  },
  {
    category: "general",
    q: "What Are the Office Working Hours?",
    a: "Our offices are open from 9:00 AM to 8:00 PM, Saturday through Friday.",
  },

  // From Study Abroad page
  {
    category: "study-abroad",
    q: "How Do I Discover the Perfect Program for Me?",
    a: "It only takes a few minutes to share your academic goals and career aspirations with GlobalEd. Tell us what you want to study and where you dream of living, and we'll match you with the best study programs tailored to your needs.",
  },
  {
    category: "study-abroad",
    q: "What's the Application Process Like?",
    a: "At GlobalEd, we've designed the application process to be smooth, transparent, and fully online. From choosing the right program to securing your visa, our expert team will guide you through every step. To begin, simply create a free account, explore your study options, and start your application at any time. With our efficient systems, you can save time and focus on preparing for your global academic journey.",
  },
  {
    category: "study-abroad",
    q: "Why Should I Choose GlobalEd?",
    a: "Trust and guidance. GlobalEd has built a reputation for helping students turn their study abroad dreams into reality. The process of applying to universities and navigating visa requirements can feel overwhelming, but our experienced team ensures every detail is handled with care. From application to admission, we support you step-by-step — minimizing mistakes and maximizing your chances of success. With GlobalEd by your side, you can move forward with confidence.",
  },
  {
    category: "study-abroad",
    q: "Which Countries Can I Study In?",
    a: "GlobalEd connects you with leading universities across the world's most popular study destinations, including UK, USA, Canada, Australia, New Zealand, Sweden, Finland, Denmark, Greece, Malta, Cyprus, South Korea, and Malaysia. Through our global network, you'll have access to diverse opportunities that match your academic and career goals.",
  },
  {
    category: "study-abroad",
    q: "What Happens After I Apply?",
    a: "Once you submit your application, GlobalEd will coordinate with the university or college as they review your documents and make a decision. If you receive an offer, you may need to pay a tuition deposit to confirm your place. After that, our expert team will guide you through the student visa process and any additional requirements. Finally, you can celebrate and get ready to begin your study abroad journey with confidence — knowing GlobalEd is with you every step of the way.",
  },

  // From Services page (general service FAQs)
  {
    category: "study-abroad",
    q: "Is GlobalEd's counselling really free?",
    a: "Yes — counselling, university shortlisting, and application support are completely free for students. We are compensated by our partner universities, never by hidden charges to you.",
  },
  {
    category: "study-abroad",
    q: "Which countries does GlobalEd cover?",
    a: "We cover 13 destinations: UK, USA, Canada, Australia, New Zealand, Sweden, Finland, Denmark, Greece, Malta, Cyprus, South Korea, and Malaysia.",
  },
  {
    category: "study-abroad",
    q: "Can you help if I have a study gap?",
    a: "Yes. Many of our successful students had study gaps. We build a strong, honest case around your work experience and motivation.",
  },
  {
    category: "study-abroad",
    q: "How long does the whole process take?",
    a: "Typically 3–6 months from first counselling to visa decision, depending on your destination and intake. Starting early always helps.",
  },

  // IELTS — placeholder, verify against current IELTS page content before launch
  {
    category: "ielts",
    q: "What IELTS courses does GlobalEd offer?",
    a: "We offer IELTS Regular, Executive, and Master courses, each designed around your target band score and available study time. See the Courses page for full details.",
  },
  {
    category: "ielts",
    q: "Do you offer official IELTS test booking?",
    a: "Yes — our team handles official IELTS test registration for you, alongside course placement and a free level assessment.",
  },
  {
    category: "ielts",
    q: "How long does IELTS preparation take?",
    a: "Most students prepare in 4–8 weeks depending on their starting level and target band score. We recommend a free assessment first to set the right timeline.",
  },
  {
    category: "ielts",
    q: "Do you provide mock tests?",
    a: "Yes — every IELTS course includes real mock tests under exam conditions, with detailed band-score feedback from our instructors.",
  },
];