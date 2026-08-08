import { destinations } from "./destinations";
import { services } from "./services";
import { courses } from "./courses";

export interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

/** Primary navigation — dropdown children are generated from content data. */
export const navItems: NavItem[] = [
  { label: "Home", href: "/" },
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
      { label: "Browse IELTS Courses", href: "/ielts" },
      { label: "IELTS Mock Registration", href: "/ielts-registration" },
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
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];
