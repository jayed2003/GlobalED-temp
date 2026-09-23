import Link from "next/link";
import { SearchX } from "lucide-react";

/** Shown inside the admin shell for unknown admin URLs or items that no longer exist. */
export default function AdminNotFound() {
  return (
    <div className="mx-auto max-w-lg rounded-xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
      <SearchX size={40} aria-hidden className="mx-auto text-primary-300" />
      <h1 className="mt-4 font-heading text-xl font-bold text-primary-900">Not found</h1>
      <p className="mt-2 text-sm text-neutral-600">
        This page or item doesn&apos;t exist. It may have been deleted, or the link is wrong.
      </p>
      <Link
        href="/admin"
        className="mt-6 inline-block rounded-lg bg-primary-700 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-800"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
