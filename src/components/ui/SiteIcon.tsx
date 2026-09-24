import type { LucideProps } from "lucide-react";
import { SITE_ICONS, isSiteIcon } from "@/lib/icons";

/** Draws an icon stored by name in content ("GraduationCap"); unknown names fall back safely. */
export default function SiteIcon({ name, ...props }: { name: string | null | undefined } & LucideProps) {
  const Icon = SITE_ICONS[name && isSiteIcon(name) ? name : "GraduationCap"];
  return <Icon {...props} />;
}
