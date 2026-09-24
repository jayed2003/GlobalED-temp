import type { ActivityAction } from "@/generated/prisma/client";
import { cn } from "@/lib/utils";

const STYLES: Record<ActivityAction, { label: string; className: string }> = {
  CREATED: { label: "Created", className: "bg-sky-50 text-sky-800 ring-sky-200" },
  UPDATED: { label: "Updated", className: "bg-neutral-100 text-neutral-700 ring-neutral-200" },
  PUBLISHED: { label: "Published", className: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  UNPUBLISHED: { label: "Unpublished", className: "bg-amber-50 text-amber-800 ring-amber-200" },
  DELETED: { label: "Deleted", className: "bg-red-50 text-red-700 ring-red-200" },
  BULK_DELETED: { label: "Deleted", className: "bg-red-50 text-red-700 ring-red-200" },
  STATUS_CHANGED: { label: "Status changed", className: "bg-violet-50 text-violet-700 ring-violet-200" },
  SIGNED_IN: { label: "Signed in", className: "bg-white text-neutral-500 ring-neutral-200" },
};

/** Activity log action badge (Published, Deleted, …). */
export default function ActionPill({ action, className }: { action: ActivityAction; className?: string }) {
  const style = STYLES[action];
  return (
    <span
      className={cn(
        "inline-flex whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
        style.className,
        className,
      )}
    >
      {style.label}
    </span>
  );
}
