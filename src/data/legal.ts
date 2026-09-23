/**
 * Privacy Policy and Terms & Conditions content.
 *
 * DRAFT — written to match what this website actually does (forms, database,
 * email, bot checks, hosting). It is not legal advice: GlobalEd management
 * (and ideally a lawyer familiar with Bangladeshi law) must review it before
 * launch — in particular the legal entity name, retention period, and the
 * fees/refunds wording.
 */

import { site } from "./site";
import { branches } from "./branches";

export interface LegalSection {
  heading: string;
  paragraphs?: string[];
  list?: string[];
  /** Shown after the list. */
  note?: string;
}

export interface LegalDocument {
  title: string;
  intro: string;
  lastUpdated: string; // YYYY-MM-DD
  sections: LegalSection[];
}

const headOffice = branches[0];
const contactLine = `Email ${site.email}, call ${site.phone}, or visit our head office at ${headOffice.address}.`;

export const privacyPolicy: LegalDocument = {
  title: "Privacy Policy",
  intro: `This policy explains what personal information ${site.brandName} collects through this website, why we collect it, who we share it with, and the choices you have.`,
  lastUpdated: "2026-09-23",
  sections: [
    {
      heading: "Information we collect",
      paragraphs: ["We only collect information you choose to give us through our forms, plus limited technical data needed to keep the website secure."],
      list: [
        "Free consultation and IELTS booking forms: your name, phone number, email address, nearest branch, preferred study destination, study level, IELTS status, funding plan, course of interest, preferred test date, and any message you write.",
        "Contact form: your name, email address, subject and message.",
        "Technical data: your IP address and basic browser information, used briefly to block spam and abuse (see “Security and spam protection” below).",
      ],
    },
    {
      heading: "How we use your information",
      list: [
        "To contact you about your enquiry and provide study abroad counselling, IELTS preparation and test booking services.",
        "To send you a confirmation email after you submit a form.",
        "To keep internal records of enquiries so our counsellors can follow up and serve you better.",
        "To protect the website from spam, automated abuse and attacks.",
      ],
      note: "We do not sell your personal information, and we do not use it for third-party advertising.",
    },
    {
      heading: "Who we share it with",
      paragraphs: [
        "Your information is seen only by authorised GlobalEd staff. To run this website we use a small number of service providers who process data on our behalf and only as needed to provide their service:",
      ],
      list: [
        "Vercel — website hosting.",
        "Neon — secure database storage for form submissions.",
        "Resend — sending confirmation and notification emails.",
        "Cloudflare Turnstile — checking that form submissions come from a real person.",
        "Upstash — short-lived counters (keyed by IP address) used to limit repeated submissions.",
        "Google Maps — the maps on our Contact page are loaded from Google, which may collect data under Google’s own privacy policy.",
      ],
    },
    {
      heading: "Universities and partners",
      paragraphs: [
        "If you become our student and ask us to apply to universities, test centres or other institutions on your behalf, we will share the information and documents needed for that application, with your agreement.",
      ],
    },
    {
      heading: "Cookies",
      paragraphs: [
        "This website does not use advertising or analytics tracking cookies. Cloudflare Turnstile and embedded Google Maps may set their own cookies or use similar technology to work. The admin area uses a secure session cookie for staff sign-in only.",
      ],
    },
    {
      heading: "Security and spam protection",
      paragraphs: [
        "All traffic to this website is encrypted (HTTPS). Form submissions are checked by Cloudflare Turnstile and limited per IP address to prevent spam. Access to stored enquiries is restricted to staff accounts with time-limited sessions.",
      ],
    },
    {
      heading: "How long we keep it",
      paragraphs: [
        "We keep enquiry records for as long as needed to handle your enquiry and provide our services, and to meet any legal obligations. After that we delete or anonymise them. You can ask us to delete your information sooner (see below).",
      ],
    },
    {
      heading: "Where your data is stored",
      paragraphs: [
        "Our service providers store and process data on servers outside Bangladesh, including in Singapore and the United States. We choose providers that protect data with industry-standard security.",
      ],
    },
    {
      heading: "Your choices and rights",
      list: [
        "Ask for a copy of the information we hold about you.",
        "Ask us to correct information that is wrong.",
        "Ask us to delete your information, or to stop contacting you.",
      ],
      note: `To make a request, contact us: ${contactLine}`,
    },
    {
      heading: "Children",
      paragraphs: [
        "Many of our students are completing school. If you are under 18, please make sure a parent or guardian knows and agrees before you submit your details.",
      ],
    },
    {
      heading: "Changes to this policy",
      paragraphs: [
        "We may update this policy from time to time. The “Last updated” date at the top shows when it last changed.",
      ],
    },
    {
      heading: "Contact us",
      paragraphs: [`Questions about this policy or your information? ${contactLine}`],
    },
  ],
};

export const termsAndConditions: LegalDocument = {
  title: "Terms & Conditions",
  intro: `These terms apply to your use of the ${site.brandName} website and to enquiries you make through it. By using the website you agree to them.`,
  lastUpdated: "2026-09-23",
  sections: [
    {
      heading: "Our services",
      paragraphs: [
        `${site.brandName} provides study abroad counselling, university admission and visa application support, and IELTS and language preparation courses. The specific services, fees and schedule for your case are confirmed with you in writing before you enrol.`,
      ],
    },
    {
      heading: "No guarantee of outcomes",
      paragraphs: [
        "Admission decisions, scholarships, visas and test scores are decided by universities, embassies, immigration authorities and test providers — not by us. We give our best professional guidance, but we cannot guarantee any admission, scholarship, visa or IELTS band score.",
      ],
    },
    {
      heading: "Your responsibilities",
      list: [
        "Give us accurate and complete information, and tell us promptly if anything changes.",
        "Provide only genuine documents. We will not submit documents we believe to be false or altered, and we may stop working with anyone who provides them.",
        "Keep to deadlines and appointments we agree with you.",
      ],
    },
    {
      heading: "Fees and refunds",
      paragraphs: [
        "Consultations booked through this website are free. Course and service fees are those published or agreed with you at enrolment. Fees charged by third parties — such as application, test, visa and tuition fees — are paid to them and are subject to their own refund rules. Our refund terms for courses and services are provided at enrolment.",
      ],
    },
    {
      heading: "Information on this website",
      paragraphs: [
        "Information about destinations, universities, tuition, living costs, scholarships and visa rules is provided for general guidance. These change often, so please confirm the current details with us or the official source before making decisions.",
      ],
    },
    {
      heading: "Acceptable use",
      list: [
        "Do not submit false, misleading or offensive information through our forms.",
        "Do not send spam, or use automated tools to submit forms or collect content from the website.",
        "Do not try to gain unauthorised access to the website, its admin area or its data, or interfere with how it works.",
      ],
    },
    {
      heading: "Intellectual property",
      paragraphs: [
        `The ${site.brandName} name, logo, text, images and design on this website belong to ${site.brandName} or are used with permission. You may view and share pages for personal use, but you may not copy or reuse them commercially without our written permission.`,
      ],
    },
    {
      heading: "Links to other websites",
      paragraphs: [
        "Our website links to external sites such as universities, test providers and social media. We are not responsible for their content or privacy practices.",
      ],
    },
    {
      heading: "Limitation of liability",
      paragraphs: [
        "We work hard to keep this website accurate and available, but we cannot promise it will always be error-free or uninterrupted. To the extent permitted by law, we are not liable for losses arising from use of this website or reliance on its general information.",
      ],
    },
    {
      heading: "Privacy",
      paragraphs: ["How we handle your personal information is explained in our Privacy Policy."],
    },
    {
      heading: "Governing law",
      paragraphs: ["These terms are governed by the laws of Bangladesh, and the courts of Dhaka have jurisdiction over any dispute."],
    },
    {
      heading: "Changes and contact",
      paragraphs: [
        "We may update these terms from time to time; the “Last updated” date shows when they last changed.",
        `Questions? ${contactLine}`,
      ],
    },
  ],
};
