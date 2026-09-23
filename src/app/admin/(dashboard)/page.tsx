import Link from "next/link";
import { redirect } from "next/navigation";
import type { AdminPermission } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/authz";

export default async function AdminDashboardPage() {
  const session = await requireSession();
  if (!session) redirect("/admin/login");
  const isMaster = session.user.role === "ADMIN";
  const can = (permission: AdminPermission) => isMaster || session.user.permissions.includes(permission);

  // Only count (and show) sections this admin is allowed to open.
  const sections: { permission: AdminPermission; label: string; href: string; count: () => Promise<number> }[] = [
    { permission: "DESTINATIONS", label: "Destinations", href: "/admin/destinations", count: () => prisma.destination.count() },
    { permission: "COURSES", label: "Courses", href: "/admin/courses", count: () => prisma.course.count() },
    { permission: "BLOGS", label: "Blog Posts", href: "/admin/blogs", count: () => prisma.blogPost.count() },
    { permission: "EVENTS", label: "Events", href: "/admin/events", count: () => prisma.eventItem.count() },
    { permission: "TESTIMONIALS", label: "Reviews", href: "/admin/testimonials", count: () => prisma.testimonial.count() },
    { permission: "LEADS", label: "Unread Leads", href: "/admin/leads", count: () => prisma.lead.count({ where: { readAt: null } }) },
    {
      permission: "MESSAGES",
      label: "Unread Messages",
      href: "/admin/messages",
      count: () => prisma.contactMessage.count({ where: { readAt: null } }),
    },
  ];
  const visible = sections.filter((s) => can(s.permission));
  const counts = await Promise.all(visible.map((s) => s.count()));
  const cards = visible.map((s, i) => ({ label: s.label, href: s.href, count: counts[i] }));

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-primary-900">Dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <p className="text-sm text-neutral-500">{card.label}</p>
            <p className="mt-1 font-heading text-3xl font-bold text-primary-900">{card.count}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
