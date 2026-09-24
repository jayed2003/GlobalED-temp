import { definePage, icon, image, list, repeater, section, text, textarea } from "./fields";

/**
 * Every editable page: its sections and fields. The layout stays as designed;
 * admins edit text, images and lists, and can hide the home page sections.
 * Buttons, links and navigation stay in code (by design).
 *
 * Adding a field later: give it a `.default(...)`-safe place in the content
 * (or a migration that adds it to every row), since published content is
 * validated against these definitions.
 */

const headerSection = (hint?: string) =>
  section({
    title: "Page header",
    description: hint ?? "The big title and intro at the top of the page.",
    fields: {
      title: text({ label: "Title", max: 100 }),
      description: textarea({ label: "Intro", max: 300, required: false }),
    },
  });

/** Eyebrow + title + intro above a block of content. */
const headingFields = (o: { introRequired?: boolean } = {}) => ({
  eyebrow: text({ label: "Small label above the title", max: 50, required: false }),
  title: text({ label: "Title", max: 120 }),
  description: textarea({ label: "Intro", max: 300, required: o.introRequired ?? false, rows: 2 }),
});

// ---------------------------------------------------------------------------
// Home

export const homePage = definePage({
  key: "home",
  title: "Home",
  path: "/",
  group: "Home",
  summary: "Hero, every home page section's heading, the steps and the reasons to choose GlobalEd. Sections can be hidden.",
  sections: {
    hero: section({
      title: "Hero",
      description: "The first thing visitors see. The two buttons (Book Free Consultation, Browse Courses) stay as designed.",
      toggle: true,
      fields: {
        eyebrow: text({ label: "Small label", max: 50, required: false }),
        headline: text({ label: "Headline", max: 90, hint: "The GlobalEd logo is added after this text." }),
        text: textarea({ label: "Intro", max: 300 }),
        image: image({ label: "Hero image", large: true }),
      },
    }),
    stats: section({
      title: "Key numbers band",
      description: "The numbers come from Site settings → Key numbers.",
      toggle: true,
      fields: {},
    }),
    services: section({ title: "Services", description: "Heading above the services. The services themselves are edited under Services.", toggle: true, fields: headingFields() }),
    howItWorks: section({
      title: "How it works",
      description: "The step-by-step timeline that follows the scroll.",
      toggle: true,
      fields: {
        ...headingFields(),
        steps: repeater({
          label: "Steps",
          itemLabel: "Step",
          minItems: 3,
          maxItems: 8,
          fields: {
            title: text({ label: "Step title", max: 60 }),
            description: textarea({ label: "Step text", max: 200, rows: 2 }),
            icon: icon({ label: "Icon" }),
          },
        }),
      },
    }),
    destinations: section({ title: "Destinations", description: "Heading above the destination cards.", toggle: true, fields: headingFields() }),
    whyUs: section({
      title: "Why GlobalEd",
      toggle: true,
      fields: {
        ...headingFields(),
        reasons: repeater({
          label: "Reasons",
          itemLabel: "Reason",
          minItems: 2,
          maxItems: 8,
          fields: {
            title: text({ label: "Title", max: 60 }),
            description: textarea({ label: "Text", max: 200, rows: 2 }),
            icon: icon({ label: "Icon" }),
          },
        }),
      },
    }),
    reviews: section({
      title: "Student reviews",
      description: "Heading above the reviews carousel (also used on Our Success). Reviews are edited under Reviews.",
      toggle: true,
      fields: headingFields(),
    }),
    blogs: section({ title: "Blogs", description: "Heading above the latest posts.", toggle: true, fields: headingFields() }),
    events: section({ title: "Events", description: "Heading above the upcoming events.", toggle: true, fields: headingFields() }),
    partners: section({
      title: "Partner universities strip",
      description: "The scrolling list of partner universities (taken from the destinations).",
      toggle: true,
      fields: { title: text({ label: "Title", max: 80 }) },
    }),
    faqCta: section({
      title: "Questions banner",
      description: "The banner at the bottom. Its text comes from Site settings → Call-to-action banner.",
      toggle: true,
      fields: {},
    }),
  },
});

// ---------------------------------------------------------------------------
// About

export const aboutPage = definePage({
  key: "about",
  title: "About Us",
  path: "/about",
  group: "About",
  summary: "Page header and the three cards linking to the About pages.",
  sections: {
    hero: headerSection("If the title contains “GlobalEd”, “Ed” is shown in the brand green."),
    cards: section({
      title: "Cards",
      description: "The three cards. Where each card links stays as designed.",
      fields: {
        successTitle: text({ label: "Our Success — title", max: 60 }),
        successText: textarea({ label: "Our Success — text", max: 200, rows: 2 }),
        organizationTitle: text({ label: "Our Organization — title", max: 60 }),
        organizationText: textarea({ label: "Our Organization — text", max: 200, rows: 2 }),
        teamTitle: text({ label: "Our Team — title", max: 60 }),
        teamText: textarea({ label: "Our Team — text", max: 200, rows: 2 }),
      },
    }),
  },
});

export const organizationPage = definePage({
  key: "about-organization",
  title: "About › Our Organization",
  path: "/about/our-organization",
  group: "About",
  summary: "Our story, milestones (also shown on Our Success), mission, vision and sister organizations.",
  sections: {
    hero: headerSection(),
    story: section({
      title: "Our story",
      fields: {
        eyebrow: text({ label: "Small label above the title", max: 50, required: false }),
        title: text({ label: "Title", max: 80 }),
        paragraphs: list({ label: "Paragraphs", itemLabel: "Paragraph", max: 1200, multiline: true, maxItems: 8 }),
      },
    }),
    journey: section({
      title: "Milestones",
      description: "Year-by-year milestones. Shown here and on Our Success.",
      fields: {
        title: text({ label: "Title", max: 60 }),
        milestones: repeater({
          label: "Milestones",
          itemLabel: "Milestone",
          minItems: 1,
          maxItems: 20,
          fields: {
            year: text({ label: "Year", max: 12, placeholder: "2025" }),
            milestone: text({ label: "What happened", max: 160 }),
          },
        }),
      },
    }),
    missionVision: section({
      title: "Mission and vision",
      fields: {
        mission: textarea({ label: "Mission", max: 600, rows: 3 }),
        vision: textarea({ label: "Vision", max: 600, rows: 3 }),
      },
    }),
    sisters: section({
      title: "Sister organizations",
      fields: {
        eyebrow: text({ label: "Small label above the title", max: 50, required: false }),
        title: text({ label: "Title", max: 100 }),
        organizations: repeater({
          label: "Organizations",
          itemLabel: "Organization",
          minItems: 0,
          maxItems: 12,
          fields: {
            name: text({ label: "Name", max: 100 }),
            description: textarea({ label: "Description", max: 300, rows: 2 }),
            logo: image({ label: "Logo", required: false }),
          },
        }),
      },
    }),
  },
});

export const successPage = definePage({
  key: "about-success",
  title: "About › Our Success",
  path: "/about/our-success",
  group: "About",
  summary: "Page header, the milestones heading and the four photos.",
  sections: {
    hero: headerSection(),
    milestones: section({
      title: "Milestones",
      description: "The milestones themselves are edited on About › Our Organization.",
      fields: {
        eyebrow: text({ label: "Small label above the title", max: 50, required: false }),
        title: text({ label: "Title", max: 100 }),
      },
    }),
    photos: section({
      title: "Photo collage",
      description: "Four photos shown as a tilted collage beside the milestones.",
      fields: {
        photos: repeater({
          label: "Photos",
          itemLabel: "Photo",
          minItems: 4,
          maxItems: 4,
          fields: { photo: image({ label: "Photo" }) },
        }),
      },
    }),
  },
});

export const teamPage = definePage({
  key: "about-team",
  title: "About › Our Team",
  path: "/about/our-team",
  group: "About",
  summary: "Page header with photo, and the headings above the board and the team.",
  sections: {
    hero: section({
      title: "Page header",
      fields: {
        title: text({ label: "Title", max: 100 }),
        description: textarea({ label: "Intro", max: 300, required: false }),
        image: image({ label: "Header photo", large: true }),
      },
    }),
    board: section({ title: "Board of Directors heading", fields: headingFields() }),
    team: section({ title: "Team heading", fields: headingFields() }),
  },
});

// ---------------------------------------------------------------------------
// Contact & booking

export const contactPage = definePage({
  key: "contact",
  title: "Contact",
  path: "/contact",
  group: "Contact & booking",
  summary: "Page header and the text beside the contact form. Branches are edited under Branches.",
  sections: {
    hero: headerSection(),
    form: section({
      title: "Message form",
      fields: {
        title: text({ label: "Title", max: 80 }),
        text: textarea({ label: "Text", max: 300 }),
      },
    }),
  },
});

export const consultationPage = definePage({
  key: "consultation",
  title: "Free Consultation",
  path: "/consultation",
  group: "Contact & booking",
  summary: "Page header and the “why students trust us” points beside the booking form.",
  sections: {
    hero: headerSection(),
    trust: section({
      title: "Trust box",
      description: "The blue box beside the form. The two numbers come from Site settings → Key numbers.",
      fields: {
        title: text({ label: "Title", max: 80 }),
        points: list({ label: "Points", itemLabel: "Point", max: 120, minItems: 1, maxItems: 8 }),
      },
    }),
  },
});

// ---------------------------------------------------------------------------
// Listing pages (header + SEO)

const listingPage = (key: string, title: string, path: string, summary: string) =>
  definePage({ key, title, path, group: "Listing pages", summary, sections: { hero: headerSection() } });

export const faqsPage = listingPage("faqs", "FAQs", "/faqs", "Page header. The questions are edited under FAQs.");
export const blogsPage = listingPage("blogs", "Blogs", "/blogs", "Page header above the blog list.");
export const eventsPage = listingPage("events", "Events", "/events", "Page header above the events.");
export const destinationsPage = listingPage("destinations", "Destinations", "/destinations", "Page header above the destinations.");
export const coursesPage = listingPage("courses", "Courses", "/courses", "Page header above the courses.");

export const servicesPage = definePage({
  key: "services",
  title: "Services",
  path: "/services",
  group: "Listing pages",
  summary: "Page header and the FAQ heading. Services are edited under Services.",
  sections: {
    hero: headerSection(),
    faqs: section({
      title: "FAQ heading",
      description: "Above the questions marked “Also show on the Services page”.",
      fields: {
        eyebrow: text({ label: "Small label above the title", max: 50, required: false }),
        title: text({ label: "Title", max: 100 }),
      },
    }),
  },
});

// ---------------------------------------------------------------------------
// IELTS (titles and body text are in Admin → IELTS Content)

export const ieltsPage = definePage({
  key: "ielts",
  title: "IELTS",
  path: "/ielts",
  group: "IELTS",
  summary: "Header, the texts on the five IELTS cards and the success-stories label.",
  sections: {
    hero: section({
      title: "Page header",
      description: "If the title contains “GlobalEd”, “Ed” is shown in the brand green. The button stays as designed.",
      fields: {
        title: text({ label: "Title", max: 100 }),
        description: textarea({ label: "Intro", max: 600, rows: 4 }),
      },
    }),
    cards: section({
      title: "Cards",
      description: "The first four card titles come from IELTS Content. Where each card links stays as designed.",
      fields: {
        whatText: textarea({ label: "“What is IELTS?” — text", max: 200, rows: 2 }),
        whyText: textarea({ label: "“Why IELTS?” — text", max: 200, rows: 2 }),
        withText: textarea({ label: "“IELTS with GlobalEd” — text", max: 200, rows: 2 }),
        preparationText: textarea({ label: "“Preparation” — text", max: 200, rows: 2 }),
        bookTitle: text({ label: "Booking card — title", max: 60 }),
        bookText: textarea({ label: "Booking card — text", max: 200, rows: 2 }),
      },
    }),
    stories: section({
      title: "Success stories",
      description: "The title and text come from IELTS Content → Student Success Stories.",
      fields: { eyebrow: text({ label: "Small label above the title", max: 60, required: false }) },
    }),
  },
});

export const ieltsWhatPage = definePage({
  key: "ielts-what",
  title: "IELTS › What is IELTS?",
  path: "/ielts/what-is-ielts",
  group: "IELTS",
  summary: "The header intro. Title and body are in IELTS Content; the banner artwork stays as designed.",
  sections: {
    hero: section({ title: "Page header", fields: { description: textarea({ label: "Intro", max: 300 }) } }),
  },
});

const ieltsSeoOnly = (key: string, title: string, path: string) =>
  definePage({
    key,
    title,
    path,
    group: "IELTS",
    summary: "Search and sharing only — the page text is in IELTS Content.",
    sections: {},
  });

export const ieltsWhyPage = ieltsSeoOnly("ielts-why", "IELTS › Why IELTS?", "/ielts/why-ielts");
export const ieltsWithPage = ieltsSeoOnly("ielts-with-globaled", "IELTS › IELTS with GlobalEd", "/ielts/with-globaled");
export const ieltsPreparationPage = ieltsSeoOnly("ielts-preparation", "IELTS › Preparation", "/ielts/preparation");
