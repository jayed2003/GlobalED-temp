"use client";

import { useEffect } from "react";
import Link from "next/link";
import { TriangleAlert, RotateCcw } from "lucide-react";

/**
 * Error boundary for every admin screen. Renders inside the admin shell
 * (sidebar stays usable) instead of taking over the whole page.
 */
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-lg rounded-xl border border-red-200 bg-white p-8 text-center shadow-sm">
      <TriangleAlert size={40} aria-hidden className="mx-auto text-red-500" />
      <h1 className="mt-4 font-heading text-xl font-bold text-primary-900">This page couldn&apos;t be loaded</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Something went wrong while loading this screen. Your saved content is safe. Try again, or go back to the
        dashboard.
      </p>
      {error.digest && <p className="mt-2 text-xs text-neutral-400">Reference: {error.digest}</p>}
      <div className="mt-6 flex justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-lg bg-primary-700 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-800"
        >
          <RotateCcw size={16} aria-hidden />
          Try again
        </button>
        <Link
          href="/admin"
          className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
