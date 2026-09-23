import Image from "next/image";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/authz";
import AdminTable from "@/components/admin/AdminTable";
import type { Prisma } from "@/generated/prisma/client";
import { buildWhere, paging, parseListQuery } from "@/lib/admin-list/core";
import { reviewsList } from "@/lib/admin-list/sections";
import { formatDhakaDate, listProps, type SearchParams } from "@/lib/admin-list/page";
import { isOriginalUpload } from "@/lib/images";

export default async function AdminTestimonialsPage({ searchParams }: { searchParams: SearchParams }) {
  const session = await requirePermission("TESTIMONIALS");
  if (!session) redirect("/admin");

  const query = parseListQuery(reviewsList, await searchParams);
  const where = buildWhere(reviewsList, query) as Prisma.TestimonialWhereInput;
  const [testimonials, total] = await Promise.all([
    prisma.testimonial.findMany({ where, orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }], ...paging(reviewsList, query) }),
    prisma.testimonial.count({ where }),
  ]);

  const rows = testimonials.map((t) => ({
    id: t.id,
    cells: [
      <span key="img" className="relative block h-12 w-12 overflow-hidden rounded-md bg-neutral-100">
        <Image
          src={t.reviewImage}
          alt={t.reviewImageAlt || `Review from ${t.studentName}`}
          fill
          className="object-cover"
          sizes="48px"
          unoptimized={isOriginalUpload(t.reviewImage)}
        />
      </span>,
      t.studentName,
      t.university,
      t.country ?? "—",
      String(t.sortOrder),
      formatDhakaDate(t.createdAt),
    ],
    editHref: `/admin/testimonials/${t.id}/edit`,
    deleteEndpoint: `/api/admin/testimonials/${t.id}`,
    label: t.studentName,
  }));

  return (
    <AdminTable
      title="Reviews"
      newHref="/admin/testimonials/new"
      newLabel="Add Review"
      rows={rows}
      total={total}
      {...listProps(reviewsList, query)}
    />
  );
}
