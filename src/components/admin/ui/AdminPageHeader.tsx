import Link from "next/link";
import { ChevronRight, ExternalLink } from "lucide-react";
import StatusPill, { type ContentState } from "./StatusPill";
import { adminButton } from "./buttons";

/**
 * Top of every admin screen: breadcrumb, title, status and the page's
 * actions ("View on site", "Add new", …).
 */
export default function AdminPageHeader({
  title,
  description,
  breadcrumbs,
  status,
  viewHref,
  actions,
}: {
  title: string;
  description?: string;
  /** Parent screens, e.g. [{ label: "Blogs", href: "/admin/blogs" }]. */
  breadcrumbs?: { label: string; href: string }[];
  status?: ContentState;
  /** Public page for this item — adds a "View on site" button (opens a new tab). */
  viewHref?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="mb-2">
          <ol className="flex flex-wrap items-center gap-1 text-sm text-neutral-500">
            {breadcrumbs.map((crumb) => (
              <li key={crumb.href} className="flex items-center gap-1">
                <Link href={crumb.href} className="hover:text-primary-700 hover:underline">
                  {crumb.label}
                </Link>
                <ChevronRight size={14} aria-hidden className="text-neutral-400" />
              </li>
            ))}
          </ol>
        </nav>
      )}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-heading text-2xl font-bold text-primary-900">{title}</h1>
            {status && <StatusPill state={status} />}
          </div>
          {description && <p className="mt-1 max-w-2xl text-sm text-neutral-500">{description}</p>}
        </div>
        {(viewHref || actions) && (
          <div className="flex flex-wrap items-center gap-2">
            {viewHref && (
              <a href={viewHref} target="_blank" rel="noopener noreferrer" className={adminButton("secondary")}>
                <ExternalLink size={16} aria-hidden />
                View on site
              </a>
            )}
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
