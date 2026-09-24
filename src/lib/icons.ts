import {
  Award,
  BadgeCheck,
  BookOpen,
  BookOpenCheck,
  Briefcase,
  Building2,
  CalendarCheck,
  ClipboardCheck,
  Clock,
  Compass,
  FileCheck,
  FileText,
  Globe2,
  GraduationCap,
  Handshake,
  Headphones,
  HeartHandshake,
  Home,
  Landmark,
  Languages,
  Laptop,
  Lightbulb,
  Luggage,
  MapPin,
  Medal,
  MessageCircle,
  Mic,
  PenLine,
  PiggyBank,
  Plane,
  PlaneTakeoff,
  Presentation,
  Rocket,
  School,
  Search,
  ShieldCheck,
  Sparkles,
  Stamp,
  Star,
  Target,
  Trophy,
  UserCheck,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";

/**
 * Icons an admin can pick for services, process steps and "why us" points.
 * Content stores the name ("GraduationCap"); the site draws it with
 * <SiteIcon name=… />. A curated list keeps the look consistent.
 */
export const SITE_ICONS = {
  GraduationCap,
  School,
  BookOpen,
  BookOpenCheck,
  Languages,
  PenLine,
  Mic,
  Headphones,
  Presentation,
  Laptop,
  Award,
  Medal,
  Trophy,
  BadgeCheck,
  Star,
  FileCheck,
  FileText,
  ClipboardCheck,
  Stamp,
  ShieldCheck,
  Plane,
  PlaneTakeoff,
  Luggage,
  Globe2,
  MapPin,
  Compass,
  Landmark,
  Building2,
  Home,
  Users,
  UserCheck,
  Handshake,
  HeartHandshake,
  MessageCircle,
  CalendarCheck,
  Clock,
  Briefcase,
  Wallet,
  PiggyBank,
  Target,
  Lightbulb,
  Rocket,
  Sparkles,
  Search,
} satisfies Record<string, LucideIcon>;

export type SiteIconName = keyof typeof SITE_ICONS;

export const SITE_ICON_NAMES = Object.keys(SITE_ICONS) as SiteIconName[];

export function isSiteIcon(name: string): name is SiteIconName {
  return Object.hasOwn(SITE_ICONS, name);
}

/** "GraduationCap" → "Graduation cap" (for labels and screen readers). */
export function iconLabel(name: string): string {
  const words = name.replace(/([a-z])([A-Z0-9])/g, "$1 $2").replace(/\d+$/, "").trim().toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
}
