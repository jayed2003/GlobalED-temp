import Link from "next/link";
import type { ActivityLog } from "@/generated/prisma/client";
import { describeActivity } from "@/lib/activity";
import { formatDhakaDateTime, timeAgo } from "@/lib/validation/dates";

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase() || "?";
}

/** "Rahim published blog post “Study in the UK” · 5 min ago", newest first. */
export default function ActivityFeed({ entries, links }: { entries: ActivityLog[]; links: Map<string, string> }) {
  if (entries.length === 0) {
    return <p className="py-6 text-center text-sm text-neutral-400">No changes yet.</p>;
  }
  return (
    <ol className="divide-y divide-neutral-100">
      {entries.map((e) => {
        const { verb, type, item } = describeActivity(e);
        const href = links.get(e.id);
        return (
          <li key={e.id} className="flex items-start gap-3 py-3">
            <span
              aria-hidden
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-50 text-xs font-semibold text-primary-700"
            >
              {initials(e.adminName)}
            </span>
            <div className="min-w-0 flex-1 text-sm">
              <p className="text-neutral-600">
                <span className="font-semibold text-primary-900">{e.adminName}</span> {verb}
                {type && ` ${type}`}
                {item &&
                  (href ? (
                    <>
                      {" "}
                      <Link href={href} className="font-medium text-primary-700 hover:underline">
                        {item}
                      </Link>
                    </>
                  ) : (
                    <span className="font-medium text-neutral-700"> {item}</span>
                  ))}
              </p>
              <p className="mt-0.5 text-xs text-neutral-400">
                <time dateTime={e.createdAt.toISOString()} title={formatDhakaDateTime(e.createdAt)}>
                  {timeAgo(e.createdAt)}
                </time>
                {e.details && ` · ${e.details}`}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
