import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function AdminDashboardPage() {
  const [destinations, courses, blogs, events, leads, reviews] = await Promise.all([
    prisma.destination.count(),
    prisma.course.count(),
    prisma.blogPost.count(),
    prisma.eventItem.count(),
    prisma.lead.count({ where: { status: "NEW" } }),
    prisma.testimonial.count(),
  ]);

  const cards = [
    { label: "Destinations", count: destinations, href: "/admin/destinations" },
    { label: "Courses", count: courses, href: "/admin/courses" },
    { label: "Blog Posts", count: blogs, href: "/admin/blogs" },
    { label: "Events", count: events, href: "/admin/events" },
    { label: "Reviews", count: reviews, href: "/admin/testimonials" },
    { label: "New Leads", count: leads, href: "/admin/leads" },
  ];

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
