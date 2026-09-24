import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/authz";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import PageEditor from "@/components/admin/PageEditor";
import { isPageKey, pageDef } from "@/lib/pages";
import { SITE_URL } from "@/lib/site-url";
import { formatDhakaDateTime } from "@/lib/validation/dates";

export default async function EditSitePage({ params }: { params: Promise<{ key: string }> }) {
  const session = await requirePermission("PAGES");
  if (!session) redirect("/admin");

  const { key } = await params;
  if (!isPageKey(key)) notFound();
  const def = pageDef(key);
  const row = await prisma.sitePage.findUnique({ where: { key } });
  if (!row) notFound();

  const published = def.schema.safeParse(row.published);
  if (!published.success) throw new Error(`Page "${key}" doesn't match its definition — check the latest migration.`);
  // A draft saved before the page's fields changed is ignored rather than breaking the editor.
  const draft = row.draft ? def.schema.safeParse(row.draft) : null;
  const draftValues = draft?.success ? (draft.data as Record<string, unknown>) : null;

  return (
    <div>
      <AdminPageHeader
        title={def.title}
        breadcrumbs={[{ label: "Pages", href: "/admin/pages" }]}
        status={draftValues ? "changes" : "published"}
        description={
          draftValues
            ? `There are unpublished changes (saved ${formatDhakaDateTime(row.updatedAt)}${row.updatedByName ? ` by ${row.updatedByName}` : ""}). Visitors still see the version published ${formatDhakaDateTime(row.publishedAt)}.`
            : `Published ${formatDhakaDateTime(row.publishedAt)}${row.updatedByName ? ` by ${row.updatedByName}` : ""}.`
        }
        viewHref={def.path}
      />
      <div className="max-w-4xl">
        <PageEditor
          pageKey={key}
          published={published.data as Record<string, unknown>}
          draft={draftValues}
          siteUrl={SITE_URL}
        />
      </div>
    </div>
  );
}
