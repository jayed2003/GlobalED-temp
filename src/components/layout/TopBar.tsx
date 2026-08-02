import { Mail, Phone } from "lucide-react";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  YoutubeIcon,
} from "@/components/ui/BrandIcons";
import { site } from "@/data/site";
import Container from "./Container";

const socials = [
  { label: "Facebook", href: site.socials.facebook, Icon: FacebookIcon },
  { label: "Instagram", href: site.socials.instagram, Icon: InstagramIcon },
  { label: "LinkedIn", href: site.socials.linkedin, Icon: LinkedinIcon },
  { label: "YouTube", href: site.socials.youtube, Icon: YoutubeIcon },
];

/** Slim contact bar above the navbar (Career Paths pattern). */
export default function TopBar() {
  return (
    <div className="bg-primary-950 text-primary-100">
      <Container className="flex h-10 items-center justify-between text-xs sm:text-sm">
        <div className="flex items-center gap-5">
          <a
            href={`tel:${site.phone.replace(/\s/g, "")}`}
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
