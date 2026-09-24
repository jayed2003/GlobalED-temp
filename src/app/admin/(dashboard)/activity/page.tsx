import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/authz";
import AdminTable from "@/components/admin/AdminTable";
import ActionPill from "@/components/admin/ui/ActionPill";
import type { Prisma } from "@/generated/prisma/client";
import { buildWhere, paging, parseListQuery } from "@/lib/admin-list/core";
import { activityList } from "@/lib/admin-list/sections";
import { listProps, type SearchParams } from "@/lib/admin-list/page";
import { entityLabel } from "@/lib/activity";
import { activityLinks } from "@/lib/activity-links";
import { formatDhakaDateTime, timeAgo } from "@/lib/validation/dates";

/** Who changed what, and when — every admin's changes and sign-ins (master admin only). */
export default async function AdminActivityPage({ searchParams }: { searchParams: SearchParams }) {
  const session = await requireAdmin();
  if (!session) redirect("/admin");

  const query = parseListQuery(activityList, await searchParams);
  const where = buildWhere(activityList, query) as Prisma.ActivityLogWhereInput;
  const [entries, total, admins] = await Promise.all([
    prisma.activityLog.findMany({ where, orderBy: { createdAt: "desc" }, ...paging(activityList, query) }),
    prisma.activityLog.count({ where }),
    prisma.activityLog.findMany({ distinct: ["adminName"], select: { adminName: true }, orderBy: { adminName: "asc" } }),
  ]);
  const links = await activityLinks(entries);

  const rows = entries.map((e) => {
    const href = links.get(e.id);
    return {
      id: e.id,
      label: e.entityLabel || entityLabel(e.entityType),
      selectable: false,
      cells: [
        <span key="when" className="whitespace-nowrap" title={formatDhakaDateTime(e.createdAt)}>
          {timeAgo(e.createdAt)}
        </span>,
        <span key="admin" className="whitespace-nowrap">
          {e.adminName}
          {!e.adminId && e.action !== "SIGNED_IN" && <span className="ml-1 text-xs text-neutral-400">(removed)</span>}
        </span>,
        <ActionPill key="action" action={e.action} />,
        entityLabel(e.entityType),
        href ? (
          <Link key="item" href={href} className="font-medium text-primary-700 hover:underline">
            {e.entityLabel || "Open"}
          </Link>
        ) : (
          <span key="item" className="text-neutral-600">{e.entityLabel || "—"}</span>
        ),
        <span key="details" className="text-neutral-500">{e.details || "—"}</span>,
      ],
    };
  });

  return (
    <AdminTable
      title="Activity"
      description="Every change made in the admin panel and every sign-in, newest first. Kept for 6 months; items that still exist link to their editor."
      readOnly
      rows={rows}
      total={total}
      {...listProps(activityList, query, { admin: admins.map((a) => ({ value: a.adminName, label: a.adminName })) })}
    />
  );
}
