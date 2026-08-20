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

  // IELTS — from GlobalEd-IELTS-related content.pdf
  {
    category: "ielts",
    q: "How do I register for IELTS through GlobalEd?",
    a: "As a British Council Authorized IELTS Registration Centre, GlobalEd handles your registration directly — simply visit our Panthapath or Uttara centre, or book a free consultation, and our team will guide you through choosing a test date, format, and package.",
  },
  {
    category: "ielts",
    q: "What's the difference between Academic and General Training IELTS?",
    a: "Academic IELTS is for university admission and professional registration, while General Training is typically for migration, work, and secondary education abroad. Our counsellors can help you confirm which one your target institution or country requires.",
  },
  {
    category: "ielts",
    q: "What does IELTS exam day look like at GlobalEd?",
    a: "GlobalEd currently offers Computer-Delivered IELTS only. Listening, Reading, and Writing are completed in one sitting on the same day (around 2 hours 40 minutes with no breaks between sections); Speaking is usually scheduled the same day too, though it can occasionally be moved to within a week before or after. Bring the same valid ID used at registration — your photo is taken at the centre as an extra security check, and this is exactly the environment our Computer-Delivered mock tests are designed to mirror.",
  },
  {
    category: "ielts",
    q: "When and how will I get my results?",
    a: "Computer-Delivered IELTS results are typically released within 1–5 days of your test date. You'll receive an email as soon as your Test Report Form (TRF) is ready, and you can view or download it through your official IELTS candidate portal.",
  },
  {
    category: "ielts",
    q: "What is an Enquiry on Results (EOR)?",
    a: "If you feel a section score doesn't reflect your performance, you can apply for an EOR (remark) within 6 weeks of your test date. A senior examiner re-checks the section(s) you select, and the enquiry fee is refunded if your score improves. Outcomes can arrive the same day or take up to a few weeks.",
  },
  {
    category: "ielts",
    q: "What is One Skill Retake (OSR)?",
    a: "OSR lets you retake just one section — Listening, Reading, Writing, or Speaking — instead of sitting the full test again, within 60 days of your original Computer-Delivered IELTS. Your new score for that section replaces the old one on a fresh TRF, while your other three scores stay locked in. If you're also applying for an EOR on the same test, you'll need to wait for the EOR outcome before booking your OSR.",
  },
  {
    category: "ielts",
    q: "Which package is right for me — Essential, Advanced, or Premium?",
    a: "It depends on how much practice and mentoring support you need. Essential suits students who are already fairly confident, Advanced adds one-to-one support for steady improvement, and Premium is built for students aiming for the highest band scores with unlimited practice and priority mentoring.",
  },
  {
    category: "ielts",
    q: "Can beginners join GlobalEd, or do I need a certain level first?",
    a: "Absolutely — our programs are designed for all proficiency levels. Starting with the Free IELTS Level Assessment helps us place you on the right track from day one.",
  },
  {
    category: "ielts",
    q: "How long does IELTS preparation usually take?",
    a: "This varies by your current level and target band score. Your Free Level Assessment includes a recommended preparation duration, and your Progress Tracker keeps you updated as you improve.",
  },
  {
    category: "ielts",
    q: "Will someone monitor my progress throughout the course?",
    a: "Yes. Our trainers regularly evaluate your performance, identify weaker areas, and adjust your study plan — all visible through your personal Progress Tracker.",
  },
  {
    category: "ielts",
    q: "What if I need to reschedule a mock test or session?",
    a: "Speak with your assigned trainer or our front desk as early as possible; we'll help you find the next available slot.",
  },
];