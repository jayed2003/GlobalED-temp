import { cn } from "@/lib/utils";

export type ContentState = "published" | "draft" | "scheduled" | "changes" | "hidden";

const STYLES: Record<ContentState, { label: string; className: string }> = {
  published: { label: "Published", className: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  draft: { label: "Draft", className: "bg-neutral-100 text-neutral-600 ring-neutral-200" },
  scheduled: { label: "Scheduled", className: "bg-amber-50 text-amber-800 ring-amber-200" },
  changes: { label: "Unpublished changes", className: "bg-sky-50 text-sky-800 ring-sky-200" },
  hidden: { label: "Hidden", className: "bg-neutral-100 text-neutral-500 ring-neutral-200" },
};

/** Draft / Published / Scheduled / … badge, used in lists and editor headers. */
export default function StatusPill({ state, label, className }: { state: ContentState; label?: string; className?: string }) {
  const style = STYLES[state];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
        style.className,
        className,
      )}
    >
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current" />
      {label ?? style.label}
    </span>
  );
}
