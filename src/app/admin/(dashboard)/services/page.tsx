import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/authz";
import AdminTable from "@/components/admin/AdminTable";
import ReorderButton from "@/components/admin/ui/ReorderButton";
import StatusPill from "@/components/admin/ui/StatusPill";
import type { Prisma } from "@/generated/prisma/client";
import { buildWhere, parseListQuery } from "@/lib/admin-list/core";
import { servicesList } from "@/lib/admin-list/sections";
import { formatDhakaDate, listProps, type SearchParams } from "@/lib/admin-list/page";

export default async function AdminServicesPage({ searchParams }: { searchParams: SearchParams }) {
  const session = await requirePermission("SERVICES");
  if (!session) redirect("/admin");

  const query = parseListQuery(servicesList, await searchParams);
  const where = buildWhere(servicesList, query) as Prisma.ServiceWhereInput;
  const order: Prisma.ServiceOrderByWithRelationInput[] = [{ sortOrder: "asc" }, { createdAt: "asc" }];
  const [services, total, all] = await Promise.all([
    prisma.service.findMany({ where, orderBy: order }),
    prisma.service.count({ where }),
    prisma.service.findMany({ orderBy: order, select: { id: true, title: true, status: true } }),
  ]);

  const rows = services.map((s) => ({
    id: s.id,
    cells: [
      <span key="title" className="font-medium text-primary-900">{s.title}</span>,
      <span key="slug" className="text-neutral-500">/services/{s.slug}</span>,
      <StatusPill key="status" state={s.status === "PUBLISHED" ? "published" : "draft"} />,
      formatDhakaDate(s.updatedAt),
    ],
    editHref: `/admin/services/${s.id}/edit`,
    deleteEndpoint: `/api/admin/services/${s.id}`,
    label: s.title,
  }));

  return (
    <AdminTable
      title="Services"
      newHref="/admin/services/new"
      newLabel="Add Service"
      actions={
        <ReorderButton
          endpoint="/api/admin/services/reorder"
          title="Reorder services"
          what="services"
          items={all.map((s) => ({ id: s.id, label: s.title, hint: s.status === "DRAFT" ? "Draft" : undefined }))}
        />
      }
      rows={rows}
      total={total}
      {...listProps(servicesList, query)}
    />
  );
}
