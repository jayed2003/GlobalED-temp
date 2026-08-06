import Link from "next/link";
import { GraduationCap, Mail, MapPin, Phone } from "lucide-react";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  YoutubeIcon,
} from "@/components/ui/BrandIcons";
import { site } from "@/data/site";
import { destinations } from "@/data/destinations";
import { services } from "@/data/services";
import { courses } from "@/data/courses";
import { branches } from "@/data/branches";
import Container from "./Container";

const socials = [
  { label: "Facebook", href: site.socials.facebook, Icon: FacebookIcon },
  { label: "Instagram", href: site.socials.instagram, Icon: InstagramIcon },
  { label: "LinkedIn", href: site.socials.linkedin, Icon: LinkedinIcon },
  { label: "YouTube", href: site.socials.youtube, Icon: YoutubeIcon },
];

/** Multi-column footer with all branches (PFEC / Career Paths pattern). */
export default function Footer() {
  return (
    <footer className="bg-primary-950 text-primary-100">
      <Container className="grid grid-cols-2 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {/* Brand */}
        <div className="col-span-2 sm:col-span-2 lg:col-span-3 xl:col-span-1">
          <Link href="/" className="flex items-center gap-2" aria-label="GlobalEd home">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-primary-800">
              <GraduationCap size={22} aria-hidden />
            </span>
            <span className="font-heading text-xl font-bold text-white">
              Global<span className="text-accent-500">Ed</span>
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-primary-200">
            Bangladesh&apos;s trusted consultancy for IELTS preparation and
            study abroad — guiding students to 13 destinations with honest,
            end-to-end support.
          </p>
          <div className="mt-5 flex items-center gap-2">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`GlobalEd on ${label}`}
                className="rounded-lg bg-primary-800 p-2 transition-colors hover:bg-primary-700 hover:text-accent-300"
              >
                <Icon size={16} aria-hidden />
              </a>
            ))}
          </div>
        </div>

        {/* Destinations */}
        <nav aria-label="Footer destinations" className="order-1 sm:order-none">
          <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-white">
            Destinations
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            {destinations.slice(0, 8).map((d) => (
              <li key={d.slug}>
                <Link
                  href={`/destinations/${d.slug}`}
                  className="transition-colors hover:text-accent-300"
                >
                  Study in {d.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/destinations" className="font-medium text-accent-400 hover:text-accent-300">
                View all 13 →
              </Link>
            </li>
          </ul>
        </nav>

        {/* Services + Courses */}
        <nav
          aria-label="Footer services and courses"
          className="col-span-2 order-3 grid grid-cols-2 gap-6 sm:order-none sm:col-span-1 sm:block"
        >
          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-white">
              Services
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              {services.slice(0, 4).map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className="transition-colors hover:text-accent-300">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="sm:mt-6">
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-white">
              Courses
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              {courses.slice(0, 4).map((c) => (
                <li key={c.slug}>
                  <Link href={`/courses/${c.slug}`} className="transition-colors hover:text-accent-300">
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Quick links */}
        <nav aria-label="Footer quick links" className="order-2 sm:order-none">
          <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-white">
            Quick Links
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              { label: "About Us", href: "/about" },
              { label: "IELTS", href: "/ielts" },
              { label: "Blogs", href: "/blogs" },
              { label: "Events", href: "/events" },
              { label: "Contact", href: "/contact" },
              { label: "Free Consultation", href: "/consultation" },
            ].map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-accent-300">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Branches */}
        <div className="col-span-2 order-4 sm:order-none sm:col-span-1">
          <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-white">
            Our Branches
          </h3>
          <ul className="mt-4 space-y-4 text-sm">
            {branches.map((branch) => (
              <li key={branch.name}>
                <p className="font-medium text-white">{branch.name}</p>
                <p className="mt-1 flex items-start gap-1.5 text-primary-200">
                  <MapPin size={13} aria-hidden className="mt-0.5 shrink-0" />
                  {branch.address}
                </p>
                <a
                  href={`tel:${branch.phones[0].replace(/\s/g, "")}`}
                  className="mt-1 flex items-center gap-1.5 transition-colors hover:text-accent-300"
                >
                  <Phone size={13} aria-hidden />
                  {branch.phones[0]}
                </a>
              </li>
            ))}
            <li className="flex items-center gap-1.5 pt-1">
              <Mail size={13} aria-hidden />
              <a href={`mailto:${site.email}`} className="transition-colors hover:text-accent-300">
                {site.email}
              </a>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-primary-800">
        <Container className="flex flex-col items-center justify-between gap-3 py-5 text-xs text-primary-300 sm:flex-row">
          <p>© {new Date().getFullYear()} {site.brandName}. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link href="#" className="transition-colors hover:text-accent-300">
              Privacy Policy
            </Link>
            <Link href="#" className="transition-colors hover:text-accent-300">
              Terms of Use
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}
