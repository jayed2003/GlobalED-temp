import Link from "next/link";
import { redirect } from "next/navigation";
import { ExternalLink, Pencil } from "lucide-react";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/authz";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import StatusPill from "@/components/admin/ui/StatusPill";
import { PAGES, PAGE_KEYS, type PageKey } from "@/lib/pages";
import { formatDhakaDateTime } from "@/lib/validation/dates";

const GROUPS = ["Home", "About", "Contact & booking", "Listing pages", "IELTS"] as const;

/** Admin → Pages: every editable page, grouped, with its status. */
export default async function AdminPagesPage() {
  const session = await requirePermission("PAGES");
  if (!session) redirect("/admin");

  const rows = await prisma.sitePage.findMany({ select: { key: true, draft: true, updatedAt: true, updatedByName: true, publishedAt: true } });
  const byKey = new Map(rows.map((r) => [r.key, r]));

  return (
    <div className="max-w-5xl">
      <AdminPageHeader
        title="Pages"
        description="The text and images on the site's pages. The layout, buttons and menus stay as designed. Changes can be saved as a draft, previewed, then published."
      />
      <div className="space-y-8">
        {GROUPS.map((group) => {
          const keys = PAGE_KEYS.filter((k) => PAGES[k].group === group);
          return (
            <section key={group} aria-labelledby={`g-${group}`}>
              <h2 id={`g-${group}`} className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                {group}
              </h2>
              <ul className="divide-y divide-neutral-100 overflow-hidden rounded-xl border border-neutral-200 bg-white">
                {keys.map((key: PageKey) => {
                  const def = PAGES[key];
                  const row = byKey.get(key);
                  const hasDraft = row?.draft != null;
                  return (
                    <li key={key} className="flex flex-wrap items-center gap-4 px-5 py-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Link href={`/admin/pages/${key}`} className="font-heading font-semibold text-primary-900 hover:underline">
                            {def.title}
                          </Link>
                          {row ? (
                            <StatusPill state={hasDraft ? "changes" : "published"} />
                          ) : (
                            <StatusPill state="draft" label="Missing — run migrations" />
                          )}
                        </div>
                        <p className="mt-0.5 text-sm text-neutral-500">{def.summary}</p>
                        {row && (
                          <p className="mt-1 text-xs text-neutral-400">
                            {hasDraft ? "Draft saved" : "Published"} {formatDhakaDateTime(hasDraft ? row.updatedAt : row.publishedAt)}
                            {row.updatedByName && ` · ${row.updatedByName}`}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <a
                          href={def.path}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`View ${def.title} on the site`}
                          className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 hover:text-primary-700"
                        >
                          <ExternalLink size={16} aria-hidden />
                        </a>
                        <Link
                          href={`/admin/pages/${key}`}
                          aria-label={`Edit ${def.title}`}
                          className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 hover:text-primary-700"
                        >
                          <Pencil size={16} aria-hidden />
                        </Link>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
