import Link from "next/link";
import { redirect } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  CalendarPlus,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Inbox,
  LayoutTemplate,
  Mail,
  PenSquare,
  TrendingUp,
} from "lucide-react";
import type { AdminPermission } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/authz";
import { activityLinks } from "@/lib/activity-links";
import { contentCounts, leadStats, needsAttention, recentActivity } from "@/lib/dashboard";
import ActivityFeed from "@/components/admin/dashboard/ActivityFeed";
import LeadsChart from "@/components/admin/dashboard/LeadsChart";
import { adminButton } from "@/components/admin/ui/buttons";
import { cn } from "@/lib/utils";

function Card({ title, subtitle, action, className, children }: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("rounded-xl border border-neutral-200 bg-white p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-heading text-base font-semibold text-primary-900">{title}</h2>
          {subtitle && <p className="mt-0.5 text-xs text-neutral-500">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Stat({ label, value, href, icon: Icon, hint, highlight }: {
  label: string;
  value: number;
  href: string;
  icon: typeof Inbox;
  hint?: string;
  highlight?: boolean;
}) {
  return (
    <Link href={href} className="group rounded-xl border border-neutral-200 bg-white p-4 transition hover:border-primary-200 hover:shadow-sm sm:p-5">
      <p className="flex items-center gap-2 text-sm text-neutral-500">
        <Icon size={16} aria-hidden className={highlight ? "text-accent-600" : "text-neutral-400"} />
        {label}
      </p>
      <p className="mt-2 flex items-center gap-2 font-heading text-2xl font-bold tabular-nums text-primary-900 sm:text-3xl">
        {value}
        {highlight && <span aria-hidden className="h-2 w-2 rounded-full bg-accent-500" />}
      </p>
      {hint && <p className="mt-1 text-xs text-neutral-400">{hint}</p>}
    </Link>
  );
}

export default async function AdminDashboardPage() {
  const session = await requireSession();
  if (!session) redirect("/admin/login");
  const role = session.user.role;
  const permissions = session.user.permissions ?? [];
  const can = (permission: AdminPermission) => role === "ADMIN" || permissions.includes(permission);

  const [leads, unreadMessages, attention, activity, content] = await Promise.all([
    can("LEADS") ? leadStats() : null,
    can("MESSAGES") ? prisma.contactMessage.count({ where: { readAt: null } }) : null,
    needsAttention(can),
    recentActivity(role, permissions),
    contentCounts(can),
  ]);
  const links = await activityLinks(activity);

  const now = new Date();
  const hour = Number(new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Dhaka", hour: "numeric", hourCycle: "h23" }).format(now));
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = (session.user.name ?? "").trim().split(/\s+/)[0] || "there";
  const today = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Dhaka", weekday: "long", day: "numeric", month: "long" }).format(now);

  const quickActions = [
    can("BLOGS") && { href: "/admin/blogs/new", label: "New blog post", icon: PenSquare },
    can("EVENTS") && { href: "/admin/events/new", label: "New event", icon: CalendarPlus },
    can("PAGES") && { href: "/admin/pages/home", label: "Edit home page", icon: LayoutTemplate },
  ].filter((a) => !!a);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-neutral-500">{today}</p>
          <h1 className="mt-1 font-heading text-2xl font-bold text-primary-900">
            {greeting}, {firstName}
          </h1>
        </div>
        {quickActions.length > 0 && (
          <nav aria-label="Quick actions" className="flex flex-wrap gap-2">
            {quickActions.map((a) => (
              <Link key={a.href} href={a.href} className={adminButton("secondary")}>
                <a.icon size={16} aria-hidden /> {a.label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      {(leads || unreadMessages !== null) && (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          {leads && (
            <>
              <Stat label="Unread leads" value={leads.unread} href="/admin/leads?f_read=unread" icon={Inbox} highlight={leads.unread > 0} hint="Bookings not opened yet" />
              <Stat label="Leads, last 7 days" value={leads.last7} href="/admin/leads?date=7d" icon={TrendingUp} />
              <Stat label="Leads, last 30 days" value={leads.last30} href="/admin/leads" icon={TrendingUp} />
            </>
          )}
          {unreadMessages !== null && (
            <Stat label="Unread messages" value={unreadMessages} href="/admin/messages?f_read=unread" icon={Mail} highlight={unreadMessages > 0} hint="From the contact form" />
          )}
        </div>
      )}

      {/* Phones: one column, most important first (the column wrappers are display: contents there). */}
      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-3 lg:items-start">
        <div className="contents lg:block lg:col-span-2 lg:space-y-6">
          {leads && (
            <Card
              className="order-2 lg:order-none"
              title="Leads per week"
              subtitle={`Last 12 weeks · ${leads.weeks.reduce((sum, w) => sum + w.count, 0)} in total`}
            >
              <LeadsChart weeks={leads.weeks} />
            </Card>
          )}
          <Card
            className="order-3 lg:order-none"
            title="Recent activity"
            subtitle={role === "ADMIN" ? "Changes by every admin" : "Changes in your sections"}
            action={
              role === "ADMIN" && (
                <Link href="/admin/activity" className="inline-flex items-center gap-1 text-xs font-semibold text-primary-700 hover:underline">
                  View all <ArrowRight size={14} aria-hidden />
                </Link>
              )
            }
          >
            <ActivityFeed entries={activity} links={links} />
          </Card>
        </div>

        <div className="contents lg:block lg:space-y-6">
          <Card className="order-1 lg:order-none" title="Needs attention">
            {attention.length === 0 ? (
              <p className="flex items-center gap-2 py-2 text-sm text-neutral-500">
                <CheckCircle2 size={18} aria-hidden className="text-emerald-600" /> All caught up.
              </p>
            ) : (
              <ul className="-mx-2 space-y-1">
                {attention.map((item) => (
                  <li key={item.key}>
                    <Link href={item.href} className="flex items-start gap-3 rounded-lg p-2 hover:bg-neutral-50">
                      {item.tone === "warning" ? (
                        <AlertTriangle size={18} aria-label="Warning" className="mt-0.5 shrink-0 text-amber-600" />
                      ) : (
                        <CircleDot size={18} aria-hidden className="mt-0.5 shrink-0 text-primary-500" />
                      )}
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium text-primary-900">{item.title}</span>
                        {item.detail && <span className="mt-0.5 block text-xs text-neutral-500">{item.detail}</span>}
                      </span>
                      <ChevronRight size={16} aria-hidden className="mt-0.5 shrink-0 text-neutral-300" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {content.length > 0 && (
            <Card className="order-4 lg:order-none" title="Content" subtitle="Live on the site">
              <ul className="divide-y divide-neutral-100">
                {content.map((c) => (
                  <li key={c.href}>
                    <Link href={c.href} className="flex items-center justify-between gap-3 py-2 text-sm hover:text-primary-700">
                      <span className="text-neutral-700">{c.label}</span>
                      <span className="flex items-baseline gap-2">
                        {c.aside && <span className="text-xs text-neutral-400">{c.aside}</span>}
                        <span className="font-semibold tabular-nums text-primary-900">{c.total}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
