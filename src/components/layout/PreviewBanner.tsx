"use client";

import { usePathname } from "next/navigation";
import { Eye } from "lucide-react";

/** Shown on the public site while an admin is previewing unpublished changes. */
export default function PreviewBanner() {
  const pathname = usePathname();
  return (
    <div
      role="status"
      className="fixed inset-x-0 bottom-4 z-[60] mx-auto flex w-fit max-w-[calc(100%-2rem)] items-center gap-3 rounded-full bg-amber-400 px-4 py-2 text-sm font-medium text-amber-950 shadow-lg"
    >
      <Eye size={16} aria-hidden />
      <span>Preview — you&apos;re seeing unpublished changes</span>
      {/* A full page load (not a client navigation): the server clears the preview cookie. */}
      <a
        href={`/api/admin/preview/exit?path=${encodeURIComponent(pathname)}`}
        className="rounded-full bg-amber-950 px-3 py-1 text-xs font-semibold text-amber-50 hover:bg-amber-900"
      >
        Exit preview
      </a>
    </div>
  );
}
