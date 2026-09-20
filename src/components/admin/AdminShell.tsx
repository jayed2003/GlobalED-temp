import Link from "next/link";
import {
  LayoutDashboard,
  Globe2,
  GraduationCap,
  Newspaper,
  CalendarDays,
  BookOpenCheck,
  Inbox,
  Users,
  Star,
} from "lucide-react";
import type { AdminPermission } from "@prisma/client";
import SignOutButton from "@/components/admin/SignOutButton";

const navItems: {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  permission: AdminPermission | null;
  adminOnly: boolean;
}[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, permission: null, adminOnly: false },
  { href: "/admin/destinations", label: "Destinations", icon: Globe2, permission: "DESTINATIONS", adminOnly: false },
  { href: "/admin/courses", label: "Courses", icon: GraduationCap, permission: "COURSES", adminOnly: false },
  { href: "/admin/blogs", label: "Blogs", icon: Newspaper, permission: "BLOGS", adminOnly: false },
  { href: "/admin/events", label: "Events", icon: CalendarDays, permission: "EVENTS", adminOnly: false },
  { href: "/admin/ielts", label: "IELTS Content", icon: BookOpenCheck, permission: "IELTS", adminOnly: false },
  { href: "/admin/testimonials", label: "Reviews", icon: Star, permission: "TESTIMONIALS", adminOnly: false },
  { href: "/admin/leads", label: "Leads", icon: Inbox, permission: "LEADS", adminOnly: false },
  { href: "/admin/admins", label: "Manage Admins", icon: Users, permission: null, adminOnly: true },
];

export default function AdminShell({
  name,
  role,
  permissions,
  children,
}: {
  name: string;
  role: "ADMIN" | "EDITOR";
  permissions: AdminPermission[];
  children: React.ReactNode;
}) {
  const isMaster = role === "ADMIN";
  const visibleItems = navItems.filter((item) => {
    if (item.adminOnly) return isMaster;
    if (!item.permission) return true;
    return isMaster || permissions.includes(item.permission);
  });

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <aside className="hidden w-64 shrink-0 border-r border-neutral-200 bg-white sm:block">
        <div className="border-b border-neutral-200 px-5 py-5">
          <p className="font-heading text-lg font-bold text-primary-900">GlobalEd Admin</p>
        </div>
        <nav className="space-y-1 p-3">
          {visibleItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-primary-50 hover:text-primary-900"
            >
              <item.icon size={18} aria-hidden />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-5 py-3">
          <p className="text-sm text-neutral-500">
            Signed in as <span className="font-medium text-primary-900">{name}</span>{" "}
            <span className="ml-1 rounded-full bg-primary-50 px-2 py-0.5 text-xs font-semibold text-primary-700">
              {isMaster ? "Master Admin" : "Editor"}
            </span>
          </p>
          <SignOutButton />
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
