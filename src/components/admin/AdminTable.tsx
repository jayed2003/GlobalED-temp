"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Plus } from "lucide-react";
import DeleteConfirmDialog from "@/components/admin/DeleteConfirmDialog";
import { adminRequest } from "@/lib/admin-fetch";

export interface AdminTableRow {
  id: string;
  cells: React.ReactNode[];
  editHref: string;
  deleteEndpoint: string;
  label: string;
}

export default function AdminTable({
  title,
  newHref,
  newLabel,
  columnHeaders,
  rows,
  editLabel,
}: {
  title: string;
  newHref?: string;
  newLabel?: string;
  columnHeaders: string[];
  rows: AdminTableRow[];
  editLabel?: string;
}) {
  const router = useRouter();
  const [pendingDelete, setPendingDelete] = useState<AdminTableRow | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    setError(null);
    const result = await adminRequest(pendingDelete.deleteEndpoint, { method: "DELETE" });
    setDeleting(false);
    if (!result.ok) {
      setError(result.message);
      // Already gone (deleted elsewhere): close the dialog and refresh the list.
      if (result.status === 404) {
        setPendingDelete(null);
        router.refresh();
      }
      return;
    }
    setPendingDelete(null);
    router.refresh();
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-primary-900">{title}</h1>
        {newHref && (
          <Link
            href={newHref}
            className="inline-flex items-center gap-2 rounded-lg bg-accent-500 px-4 py-2 text-sm font-semibold text-primary-950 hover:bg-accent-400"
          >
            <Plus size={16} aria-hidden /> {newLabel}
          </Link>
        )}
      </div>

      {error && <p className="mt-3 text-sm font-medium text-red-600">{error}</p>}

      <div className="mt-6 overflow-x-auto rounded-xl border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50">
            <tr>
              {columnHeaders.map((header) => (
                <th key={header} className="px-4 py-3 font-semibold text-neutral-600">
                  {header}
                </th>
              ))}
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                {row.cells.map((cell, index) => (
                  <td key={index} className="px-4 py-3 text-neutral-700">
                    {cell}
                  </td>
                ))}
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={row.editHref}
                      className="rounded p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-primary-700"
                      aria-label={editLabel ?? "Edit"}
                    >
                      <Pencil size={16} aria-hidden />
                    </Link>
                    <button
                      type="button"
                      onClick={() => setPendingDelete(row)}
                      className="rounded p-1.5 text-neutral-500 hover:bg-red-50 hover:text-red-600"
                      aria-label="Delete"
                    >
                      <Trash2 size={16} aria-hidden />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={columnHeaders.length + 1} className="px-4 py-8 text-center text-neutral-400">
                  Nothing here yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <DeleteConfirmDialog
        open={!!pendingDelete}
        title={`Delete "${pendingDelete?.label ?? ""}"?`}
        description="This cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
        loading={deleting}
      />
    </div>
  );
}
