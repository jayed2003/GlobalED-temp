import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { pageList } from "@/lib/pagination";
import { cn } from "@/lib/utils";

const itemClass =
  "inline-flex h-10 min-w-10 items-center justify-center gap-1 rounded-lg px-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500";

/**
 * Previous / page numbers / Next for a list split into pages. Plain links, so
 * every page can be opened, shared and crawled. Nothing is shown for a
 * single page.
 */
export default function Pagination({
  page,
  totalPages,
  href,
  label = "Pages",
}: {
  page: number;
  totalPages: number;
  /** The address of a page number. */
  href: (page: number) => string;
  label?: string;
}) {
  if (totalPages <= 1) return null;
  const edge = (to: number, dir: "prev" | "next") => {
    const content =
      dir === "prev" ? (
        <>
          <ChevronLeft size={16} aria-hidden /> <span className="hidden sm:inline">Previous</span>
        </>
      ) : (
        <>
          <span className="hidden sm:inline">Next</span> <ChevronRight size={16} aria-hidden />
        </>
      );
    const name = dir === "prev" ? "Previous page" : "Next page";
    return to < 1 || to > totalPages ? (
      <span aria-hidden className={cn(itemClass, "cursor-default text-neutral-300")}>
        {content}
      </span>
    ) : (
      <Link href={href(to)} rel={dir} aria-label={name} className={cn(itemClass, "text-primary-700 hover:bg-primary-50")}>
        {content}
      </Link>
    );
  };

  return (
    <nav aria-label={label} className="mt-12 flex items-center justify-center gap-1">
      {edge(page - 1, "prev")}
      {pageList(page, totalPages).map((n, i) =>
        n === "…" ? (
          <span key={`gap-${i}`} aria-hidden className="px-1 text-neutral-400">
            …
          </span>
        ) : (
          <Link
            key={n}
            href={href(n)}
            aria-label={`Page ${n}`}
            aria-current={n === page ? "page" : undefined}
            className={cn(
              itemClass,
              n === page ? "bg-primary-700 text-white" : "text-primary-800 hover:bg-primary-50",
            )}
          >
            {n}
          </Link>
        ),
      )}
      {edge(page + 1, "next")}
    </nav>
  );
}
