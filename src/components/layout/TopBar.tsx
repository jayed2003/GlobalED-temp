import { Mail, Phone } from "lucide-react";
import { getSiteSettings } from "@/lib/content/settings";
import { telHref } from "@/lib/content/settings";
import { socialLinks } from "./socialLinks";
import Container from "./Container";

/** Slim contact bar above the navbar (Career Paths pattern). */
export default async function TopBar() {
  const site = await getSiteSettings();
  const socials = socialLinks(site);
  return (
    <div className="bg-primary-950 text-primary-100">
      <Container className="flex h-10 items-center justify-between text-xs sm:text-sm">
        <div className="flex items-center gap-5">
          <a
            href={telHref(site.phone)}
            className="flex items-center gap-1.5 transition-colors hover:text-accent-300"
          >
            <Phone size={14} aria-hidden />
            {site.phone}
          </a>
          <a
            href={`mailto:${site.email}`}
            className="hidden items-center gap-1.5 transition-colors hover:text-accent-300 sm:flex"
          >
            <Mail size={14} aria-hidden />
            {site.email}
          </a>
        </div>
        <div className="flex items-center gap-1">
          {socials.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`GlobalEd on ${label}`}
              className="rounded p-1.5 transition-colors hover:text-accent-300"
            >
              <Icon size={15} aria-hidden />
            </a>
          ))}
        </div>
      </Container>
    </div>
  );
}
