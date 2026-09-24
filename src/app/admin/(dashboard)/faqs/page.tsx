import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/authz";
import AdminTable from "@/components/admin/AdminTable";
import ReorderButton from "@/components/admin/ui/ReorderButton";
import StatusPill from "@/components/admin/ui/StatusPill";
import type { Prisma } from "@/generated/prisma/client";
import { buildWhere, parseListQuery } from "@/lib/admin-list/core";
import { faqsList } from "@/lib/admin-list/sections";
import { listProps, type SearchParams } from "@/lib/admin-list/page";
import { FAQ_CATEGORIES } from "@/lib/validation/faq";

const categoryLabel: Record<string, string> = Object.fromEntries(FAQ_CATEGORIES.map((c) => [c.value, c.label]));

export default async function AdminFaqsPage({ searchParams }: { searchParams: SearchParams }) {
  const session = await requirePermission("FAQS");
  if (!session) redirect("/admin");

  const query = parseListQuery(faqsList, await searchParams);
  const where = buildWhere(faqsList, query) as Prisma.FaqWhereInput;
  const order: Prisma.FaqOrderByWithRelationInput[] = [{ sortOrder: "asc" }, { createdAt: "asc" }];
  const [faqs, total, all] = await Promise.all([
    prisma.faq.findMany({ where, orderBy: order }),
    prisma.faq.count({ where }),
    prisma.faq.findMany({ orderBy: order, select: { id: true, question: true, category: true, shown: true } }),
  ]);

  const rows = faqs.map((f) => ({
    id: f.id,
    cells: [
      <span key="q" className="line-clamp-2 block max-w-md font-medium text-primary-900">{f.question}</span>,
      categoryLabel[f.category],
      f.showOnServices ? "Also on Services" : "—",
      <StatusPill key="shown" state={f.shown ? "published" : "hidden"} label={f.shown ? "Shown" : "Hidden"} />,
    ],
    editHref: `/admin/faqs/${f.id}/edit`,
    deleteEndpoint: `/api/admin/faqs/${f.id}`,
    label: f.question,
  }));

  return (
    <AdminTable
      title="FAQs"
      newHref="/admin/faqs/new"
      newLabel="Add Question"
      actions={
        <ReorderButton
          endpoint="/api/admin/faqs/reorder"
          title="Reorder questions"
          what="questions"
          items={all.map((f) => ({ id: f.id, label: f.question, hint: `${categoryLabel[f.category]}${f.shown ? "" : " · Hidden"}` }))}
        />
      }
      rows={rows}
      total={total}
      {...listProps(faqsList, query)}
    />
  );
}
