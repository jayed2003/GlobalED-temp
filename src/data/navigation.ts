import { services } from "./services";

export interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

/**
 * Primary navigation — Destinations/Courses dropdown children come from the
 * database (see src/lib/content), so the caller (site layout) fetches those
 * and passes them in here. Services/IELTS/About stay static (out of CMS scope).
 */
export function buildNavItems(
  destinations: { slug: string; name: string }[],
  courses: { slug: string; title: string }[],
): NavItem[] {
  return [
    {
      label: "Destinations",
      href: "/destinations",
      children: destinations.map((d) => ({
        label: d.name,
        href: `/destinations/${d.slug}`,
      })),
    },
    {
      label: "IELTS",
      href: "/ielts",
      children: [
        { label: "What is IELTS?", href: "/ielts/what-is-ielts" },
        { label: "Why IELTS?", href: "/ielts/why-ielts" },
        { label: "IELTS with GlobalEd", href: "/ielts/with-globaled" },
        { label: "IELTS Preparation", href: "/ielts/preparation" },
        { label: "Book an IELTS Test", href: "/consultation" },
      ],
    },
    {
      label: "Services",
      href: "/services",
      children: services.map((s) => ({
        label: s.title,
        href: `/services/${s.slug}`,
      })),
    },
    {
      label: "Courses",
      href: "/courses",
      children: courses.map((c) => ({
        label: c.title,
        href: `/courses/${c.slug}`,
      })),
    },
    {
      label: "About Us",
      href: "/about",
      children: [
        { label: "Our Success", href: "/about/our-success" },
        { label: "Our Organization", href: "/about/our-organization" },
        { label: "Our Team", href: "/about/our-team" },
      ],
    },
    { label: "Contact", href: "/contact" },
  ];
}
