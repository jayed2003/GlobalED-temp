"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Globe2,
  GraduationCap,
  Newspaper,
  CalendarDays,
  BookOpenCheck,
  Inbox,
  Mail,
  Users,
  Star,
  Menu,
  X,
  Building2,
  Settings,
  LayoutTemplate,
} from "lucide-react";
import type { AdminPermission } from "@/generated/prisma/client";
import SignOutButton from "@/components/admin/SignOutButton";
import { InboxBadge, InboxPoller } from "@/components/admin/InboxBadges";
import Toaster from "@/components/admin/ui/Toaster";
import type { InboxCounts } from "@/lib/admin-counts";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  /** null = every admin; "MASTER" = master admin only. */
  permission: AdminPermission | "MASTER" | null;
  /** Shows a live count of unread items next to the link. */
  badge?: keyof InboxCounts;
}

/** Sidebar, grouped the way editors think about the site. */
const navGroups: { label: string; items: NavItem[] }[] = [
  {
    label: "Overview",
    items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard, permission: null }],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/pages", label: "Pages", icon: LayoutTemplate, permission: "PAGES" },
      { href: "/admin/blogs", label: "Blogs", icon: Newspaper, permission: "BLOGS" },
      { href: "/admin/events", label: "Events", icon: CalendarDays, permission: "EVENTS" },
      { href: "/admin/destinations", label: "Destinations", icon: Globe2, permission: "DESTINATIONS" },
      { href: "/admin/courses", label: "Courses", icon: GraduationCap, permission: "COURSES" },
      { href: "/admin/ielts", label: "IELTS Content", icon: BookOpenCheck, permission: "IELTS" },
    ],
  },
  {
    label: "Company",
    items: [
      { href: "/admin/testimonials", label: "Reviews", icon: Star, permission: "TESTIMONIALS" },
      { href: "/admin/branches", label: "Branches", icon: Building2, permission: "SETTINGS" },
    ],
  },
  {
    label: "Inbox",
    items: [
      { href: "/admin/leads", label: "Leads", icon: Inbox, permission: "LEADS", badge: "leads" },
      { href: "/admin/messages", label: "Messages", icon: Mail, permission: "MESSAGES", badge: "messages" },
    ],
  },
  {
    label: "Settings",
    items: [
      { href: "/admin/settings", label: "Site Settings", icon: Settings, permission: "SETTINGS" },
      { href: "/admin/admins", label: "Manage Admins", icon: Users, permission: "MASTER" },
    ],
  },
];

function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminShell({
  name,
  role,
  permissions,
  inboxCounts,
  children,
}: {
  name: string;
  role: "ADMIN" | "EDITOR";
  permissions: AdminPermission[];
  inboxCounts: InboxCounts;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const isMaster = role === "ADMIN";

  const groups = navGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        if (item.permission === "MASTER") return isMaster;
        if (!item.permission) return true;
        return isMaster || permissions.includes(item.permission);
      }),
    }))
    .filter((group) => group.items.length > 0);

  // Mobile menu: Escape closes it.
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const nav = (
    <nav aria-label="Admin" className="space-y-5 p-3">
      {groups.map((group) => (
        <div key={group.label}>
          <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">{group.label}</p>
          <div className="space-y-0.5">
            {group.items.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary-50 text-primary-900"
                      : "text-neutral-600 hover:bg-neutral-50 hover:text-primary-900",
                  )}
                >
                  <item.icon size={18} aria-hidden className={active ? "text-primary-700" : "text-neutral-400"} />
                  {item.label}
                  {item.badge && <InboxBadge kind={item.badge} initial={inboxCounts[item.badge]} />}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );

  const brand = (
    <div className="border-b border-neutral-200 px-5 py-5">
      <Link href="/admin" className="block" aria-label="GlobalEd admin dashboard" onClick={() => setMenuOpen(false)}>
        <Image src="/images/logos/logo-01.png" alt="GlobalEd" width={1600} height={315} priority className="h-8 w-auto" />
      </Link>
      <p className="mt-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-400">Admin Panel</p>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <InboxPoller initial={inboxCounts} />
      <Toaster />

      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 overflow-y-auto border-r border-neutral-200 bg-white lg:block">
        {brand}
        {nav}
      </aside>

      {/* Mobile / tablet menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Admin menu">
          <button type="button" aria-label="Close menu" className="absolute inset-0 bg-black/30" onClick={() => setMenuOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85%] overflow-y-auto bg-white shadow-xl">
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="absolute right-3 top-4 rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-100"
            >
              <X size={20} aria-hidden />
            </button>
            {brand}
            {nav}
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-3 border-b border-neutral-200 bg-white px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              className="rounded-lg p-1.5 text-neutral-600 hover:bg-neutral-100 lg:hidden"
            >
              <Menu size={22} aria-hidden />
            </button>
            <p className="truncate text-sm text-neutral-500">
              Signed in as <span className="font-medium text-primary-900">{name}</span>{" "}
              <span className="ml-1 rounded-full bg-primary-50 px-2 py-0.5 text-xs font-semibold text-primary-700">
                {isMaster ? "Master Admin" : "Editor"}
              </span>
            </p>
          </div>
          <SignOutButton />
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
