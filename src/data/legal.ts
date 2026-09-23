/**
 * Legal pages: Privacy Policy, Terms & Conditions, Return and Refund Policy.
 *
 * Text is taken from the company's current policies on globaled.io
 * (/privacy-policy-2/, /terms-and-conditions/, /return-and-refund-policy/),
 * issued by Global Citizen Limited / GlobalEd. Keep wording changes in sync
 * with management — these are the company's legal terms, not website copy.
 */

export type LegalBlock = { p: string } | { list: string[] } | { subheading: string };

export interface LegalSection {
  heading: string;
  blocks: LegalBlock[];
}

export interface LegalDocument {
  title: string;
  /** Optional lead paragraph above the first section. */
  intro?: string;
  lastUpdated: string; // YYYY-MM-DD
  sections: LegalSection[];
}

export const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
  { label: "Return and Refund Policy", href: "/return-and-refund-policy" },
];

export const privacyPolicy: LegalDocument = {
  title: "Privacy Policy",
  lastUpdated: "2025-09-15",
  sections: [
    {
      heading: "1. Introduction",
      blocks: [
        {
          p: "Your privacy is important to us. This Privacy Policy explains how Global Citizen Limited / GlobalEd collects, uses, shares, and protects your personal information when you use our website, services, or interact with us.",
        },
      ],
    },
    {
      heading: "2. Information Collection",
      blocks: [
        { p: "2.1. Before or at the time of collecting personal information, we will identify the purposes for which information is being collected." },
        { p: "2.2. We collect personal information only to fulfill the purposes specified by us and for other compatible purposes, unless we obtain consent from the individual or as required by law." },
        { p: "2.3. We retain personal data only as long as necessary for the fulfillment of those purposes." },
        { p: "2.4. Information will be collected by lawful and fair means, and, where appropriate, with the knowledge or consent of the individual concerned." },
        { p: "2.5. Collected personal data should be relevant to the purposes for which it is to be used, and to the extent necessary, accurate, complete, and kept up-to-date." },
      ],
    },
    {
      heading: "3. Use of Information",
      blocks: [
        { p: "3.1. We use personal information to provide and improve our services, communicate updates, respond to inquiries, and ensure smooth operation of our website." },
        { p: "3.2. Personal information will not be used for purposes other than those stated without your consent, unless required by law." },
      ],
    },
    {
      heading: "4. Information Protection",
      blocks: [
        { p: "4.1. Global Citizen Limited / GlobalEd will take appropriate security measures to protect personal information from loss, theft, unauthorized access, disclosure, copying, use, or modification." },
        { p: "4.2. Despite reasonable measures, we cannot guarantee absolute security of data transmitted over the Internet." },
      ],
    },
    {
      heading: "5. Sharing of Information",
      blocks: [
        { p: "5.1. Personal data will not be sold, rented, or disclosed to third parties without your consent, except:" },
        {
          list: [
            "Where required by law;",
            "To trusted service providers assisting in delivering our services;",
            "To protect rights, property, or safety of Global Citizen Limited / GlobalEd and its users.",
          ],
        },
      ],
    },
    {
      heading: "6. Access to Personal Data",
      blocks: [
        { p: "6.1. Individuals may request access to the personal data we hold about them by contacting us at info@globaled.io or +8801955-544772." },
        { p: "6.2. We will provide access in a timely manner, subject to legal and privacy constraints." },
      ],
    },
    {
      heading: "7. Cookies and Tracking",
      blocks: [
        { p: "7.1. We may collect non-personal information such as browser type, operating system, IP address, and usage patterns to improve our website and services." },
        { p: "7.2. Cookies may be used to enhance your browsing experience." },
      ],
    },
    {
      heading: "8. Third-Party Links",
      blocks: [
        { p: "8.1. Our website may contain links to third-party websites. Global Citizen Limited / GlobalEd is not responsible for the privacy practices or content of third-party websites." },
      ],
    },
    {
      heading: "9. Updates to Privacy Policy",
      blocks: [
        { p: "9.1. We may update this Privacy Policy from time to time without prior notice." },
        { p: "9.2. By continuing to use our website or services, you agree to the updated Privacy Policy." },
      ],
    },
    {
      heading: "10. Governing Law",
      blocks: [
        { p: "10.1. This Privacy Policy is governed by the laws of Bangladesh. Any disputes shall be subject to the exclusive jurisdiction of the Bangladeshi courts." },
      ],
    },
  ],
};

export const termsAndConditions: LegalDocument = {
  title: "Terms & Conditions",
  lastUpdated: "2025-09-15",
  sections: [
    {
      heading: "1. Definitions",
      blocks: [
        {
          list: [
            "“Confidential Information” means information provided by one party to the other in written, graphic, recorded, machine-readable or other form concerning the business, clients, suppliers, finances and other areas of the other party’s business or products, including, without limitation, Course Materials, but does not include information in the public domain other than through the default of the disclosing party, information required to be disclosed by any court or regulatory authority, or any information already in the possession or control of the disclosing party.",
            "“Course Materials” means the information provided by Global Citizen Limited or its sub-brand GlobalEd to accompany a course provided as part of the Services in hard copy or electronic form.",
            "“Fees” means the fees paid by you to Global Citizen Limited / GlobalEd for the Services.",
            "“Intellectual Property Rights” means copyright, rights in or relating to databases, patent rights, performers’ rights, designs and registered designs, trademarks, rights in or relating to Confidential Information and other intellectual property rights (registered or unregistered) throughout the world.",
            "“Online Course” means the delivery by us of an online course pursuant to which you learn course materials remotely.",
            "“Services” means the provision of the Online Course and/or the Taught Course and/or the Course Materials together with such other services as agreed from time to time and purchased by you through the Website or by telephone.",
            "“Taught Course” means a course taught by us in a classroom setting to which you attend in person.",
            // As published on globaled.io — confirm with management whether this should now be globaled.io.
            "“Website” means www.gcledu.com",
            "“You” means the individual purchasing the Services.",
          ],
        },
      ],
    },
    {
      heading: "2. The Services",
      blocks: [
        { p: "2.1. A description of the Services together with the dates on which the Services will begin are available on our Website. We will provide the Services with reasonable care and skill in accordance with the description set out on the Website." },
        { p: "2.2. We reserve the right to vary or withdraw any of the Services described on the Website without notice." },
        { p: "2.3. We expect you to confirm that the Services you are purchasing will meet your needs. We do not guarantee that you will obtain a particular result, professional qualification, or employment opportunity from your purchase and completion of any Services." },
      ],
    },
    {
      heading: "3. Ordering Services",
      blocks: [
        { subheading: "Purchasing Services via the Website" },
        { p: "3.1. To purchase any of the Services online you must register for an account via the Website. If you already have an account, you may log in using your username and password." },
        { subheading: "Purchasing Services via Telephone" },
        { p: "3.2. To purchase a Service by phone, please call +8801955-544772. You do not need an account to purchase by phone but must register to access any Online Course." },
        { p: "3.3. When you place an order via the Website or telephone, you are offering to purchase the Services under these Terms. Global Citizen Limited / GlobalEd reserves the right to cancel or decline your order until it has been confirmed." },
        { p: "3.4. We will confirm receipt of your order by email." },
        { p: "3.5. A legally binding agreement exists once we:" },
        { list: ["(a) accept your order by sending a confirmation email, and", "(b) receive payment of the Fees in accordance with Clause 5 below."] },
        { p: "3.6. Multiple courses in a single order will be treated as separate offers." },
        { p: "3.7. Global Citizen Limited / GlobalEd is not responsible for booking exams with any professional body; it is your responsibility to book any required exam." },
      ],
    },
    {
      heading: "4. Cancellation and Refund",
      blocks: [
        { p: "4.1. Once you have accessed or started using an Online Course, you cannot cancel your order." },
        { p: "4.2. Refunds (if applicable) will be processed within 7–10 working days after a valid claim." },
        { p: "4.3. Any variation or cancellation of Services is at the sole discretion of Global Citizen Limited / GlobalEd." },
      ],
    },
    {
      heading: "5. Fees",
      blocks: [
        { p: "5.1. Fees are as listed on the Website or communicated by phone at the time of order." },
        { p: "5.2. Unless specified, Fees include VAT and delivery costs of Course Materials." },
        { p: "5.3. Fees do not include amounts payable to professional bodies for registration/exams." },
        { p: "5.4. Payment must be completed before attending a Taught Course or accessing an Online Course." },
        { p: "5.5. Any bank or card charges are your responsibility." },
        { p: "5.6. You are responsible for any costs incurred for attending Courses or accessing Online Courses." },
      ],
    },
    {
      heading: "6. Liability",
      blocks: [
        { p: "6.1. Services are not investment advice." },
        { p: "6.2. Global Citizen Limited / GlobalEd and its trainers are not liable for inaccurate information, data loss, or indirect/special/consequential losses." },
        { p: "6.3. Except as expressly stated, no other warranties apply, including fitness for purpose or satisfactory quality." },
        { p: "6.4. Liability is limited to Fees received for the relevant Service." },
        { p: "6.5. Liability for death, personal injury due to negligence, or fraudulent misrepresentation is not limited." },
        { p: "6.6. Claims must be brought within six months after Services have ended." },
      ],
    },
    {
      heading: "7. Intellectual Property",
      blocks: [
        { p: "7.1. All Intellectual Property Rights in Course Materials, Online Courses, and trainer content remain with Global Citizen Limited / GlobalEd." },
        { p: "7.2. You may not: copy, distribute, modify, or use Course Materials for other courses without written permission." },
        { p: "7.3. You are granted a limited, non-transferable license to use Course Materials solely for completing the purchased course." },
      ],
    },
    {
      heading: "8. Confidentiality",
      blocks: [
        { p: "8.1. Both parties shall keep Confidential Information strictly confidential." },
        { p: "8.2. Disclosure is permitted only to legal or professional advisors." },
        { p: "8.3. Confidentiality obligations survive termination." },
      ],
    },
    {
      heading: "9. Termination",
      blocks: [
        { p: "9.1. Global Citizen Limited / GlobalEd may terminate Services immediately if you:" },
        {
          list: [
            "Fail to pay Fees;",
            "Act aggressively, bully, or harass staff or other students;",
            "Commit fraud, plagiarism, or criminal offences;",
            "Intentionally damage property;",
            "Are intoxicated on premises.",
          ],
        },
        { p: "9.2. Clauses on Liability, Intellectual Property, and Confidentiality survive termination." },
      ],
    },
    {
      heading: "10. Assignment",
      blocks: [
        { p: "Services are personal to you and cannot be transferred. We may assign Terms to another company without notice." },
      ],
    },
    {
      heading: "11. Entire Agreement",
      blocks: [
        { p: "These Terms, together with the Website Disclaimer and Course-specific Terms, form the entire agreement." },
      ],
    },
    {
      heading: "12. Force Majeure",
      blocks: [
        { p: "Global Citizen Limited / GlobalEd is not liable for events beyond reasonable control (natural disasters, strikes, pandemics, government orders)." },
      ],
    },
    {
      heading: "13. Data Protection",
      blocks: [
        { p: "13.1. We collect and use your information to provide Services." },
        { p: "13.2. Personal data may include contact details and demographics." },
        { p: "13.3. We will protect your data but cannot guarantee complete security." },
        { p: "13.4. You may update your information by contacting us at info@globaled.io" },
      ],
    },
    {
      heading: "14. Law and Jurisdiction",
      blocks: [
        { p: "These Terms are governed by Bangladeshi laws, and parties submit to the exclusive jurisdiction of Bangladeshi courts." },
      ],
    },
  ],
};

export const returnAndRefundPolicy: LegalDocument = {
  title: "Return and Refund Policy",
  intro:
    "We at Global Citizen Limited / GlobalEd want you to be completely satisfied with any service or course you purchase from us. If you have any questions, concerns, or problems, please let us know by emailing us at support@globaled.io.",
  lastUpdated: "2025-10-23",
  sections: [
    {
      heading: "Refunds for GlobalEd Courses & Services",
      blocks: [
        {
          list: [
            "When you purchase one of our online courses or services and are unable to access or follow the course due to technical issues on our end, we will issue you a refund.",
            "If you have already accessed and completed sections of the course, refunds will no longer be available.",
            "However, if you are not happy with the service, please reach out to us—we would love to know how we can improve. Simply replying to your purchase confirmation email is sufficient.",
          ],
        },
      ],
    },
    {
      heading: "Refund Conditions",
      blocks: [
        {
          list: [
            "Refunds apply only to the initial purchase or subscription term.",
            "After approving the refund request, the refund will be processed within 7–10 working days.",
            "Refund requests must be submitted within 7 days of purchase.",
          ],
        },
      ],
    },
    {
      heading: "Non-Refundable Services",
      blocks: [
        { list: ["Completed course modules or downloadable materials.", "Customized services, consultation, or projects delivered."] },
        { p: "We value your satisfaction and aim to provide the best possible learning and service experience at GlobalEd." },
      ],
    },
  ],
};
