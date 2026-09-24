import { FacebookIcon, InstagramIcon, LinkedinIcon, YoutubeIcon } from "@/components/ui/BrandIcons";
import type { SiteSettings } from "@/types";

/** The social profiles set in Site settings (an empty link hides its icon). */
export function socialLinks(site: SiteSettings) {
  return [
    { label: "Facebook", href: site.socials.facebook, Icon: FacebookIcon },
    { label: "Instagram", href: site.socials.instagram, Icon: InstagramIcon },
    { label: "LinkedIn", href: site.socials.linkedin, Icon: LinkedinIcon },
    { label: "YouTube", href: site.socials.youtube, Icon: YoutubeIcon },
  ].filter((s) => s.href);
}
