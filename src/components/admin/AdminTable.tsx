"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Pencil, Trash2, Plus, Search, X, Download, ChevronLeft, ChevronRight } from "lucide-react";
import DeleteConfirmDialog from "@/components/admin/DeleteConfirmDialog";
import { adminRequest } from "@/lib/admin-fetch";
import { DATE_PRESETS, type ClientColumn } from "@/lib/admin-list/core";
import { cn } from "@/lib/utils";

export interface AdminTableRow {
  id: string;
  cells: React.ReactNode[];
  editHref: string;
  deleteEndpoint: string;
  label: string;
  /** Unread inbox item: shown in bold. */
  unread?: boolean;
  /** false for rows that can never be deleted (e.g. the master admin). */
  selectable?: boolean;
}

const inputClass =
  "w-full rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-xs font-normal text-neutral-800 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100";

/**
 * Admin list: global search, a filter under every column header, a date
 * filter, row selection with "select all" and bulk delete, pagination and
 * (for leads) CSV download. All state lives in the URL (see
 * src/lib/admin-list/core.ts); the server page does the filtering.
 */
export default function AdminTable({
  title,
  newHref,
  newLabel,
  editLabel,
  columns,
  extraFilters = [],
  rows,
  section,
  total,
  page = 1,
  pageSize,
  dateLabel,
  exportHref,
}: {
  title: string;
  newHref?: string;
  newLabel?: string;
  editLabel?: string;
  columns: ClientColumn[];
  extraFilters?: ClientColumn[];
  rows: AdminTableRow[];
  section: string;
  total: number;
  page?: number;
  pageSize?: number;
  dateLabel: string;
  exportHref?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  // Bumped by "Clear filters" to reset the (uncontrolled) filter inputs.
  const [resetKey, setResetKey] = useState(0);

  const [pendingDelete, setPendingDelete] = useState<AdminTableRow | null>(null);
  const [bulkConfirm, setBulkConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Selection belongs to the rows currently shown; any change of rows clears it.
  const rowsKey = rows.map((r) => r.id).join(",");
  const [selection, setSelection] = useState<{ key: string; ids: Set<string>; allMatching: boolean }>({
    key: "",
    ids: new Set(),
    allMatching: false,
  });
  const selected = selection.key === rowsKey ? selection.ids : new Set<string>();
  const allMatching = selection.key === rowsKey && selection.allMatching;
  const selectableRows = rows.filter((r) => r.selectable !== false);
  const allOnPage = selectableRows.length > 0 && selectableRows.every((r) => selected.has(r.id));

  const current = (key: string) => searchParams.get(key) ?? "";
  const listQuery = useMemo(() => {
    const p = new URLSearchParams(searchParams.toString());
    p.delete("page");
    return p.toString();
  }, [searchParams]);
  const hasFilters = listQuery.length > 0;

  const navigate = (mutate: (p: URLSearchParams) => void, keepPage = false) => {
    const p = new URLSearchParams(searchParams.toString());
    mutate(p);
    if (!keepPage) p.delete("page");
    const qs = p.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };
  const setParam = (key: string, value: string) => navigate((p) => (value ? p.set(key, value) : p.delete(key)));
  const setParamDebounced = (key: string, value: string) => {
    clearTimeout(timers.current[key]);
    timers.current[key] = setTimeout(() => setParam(key, value.trim()), 400);
  };
  const clearAll = () => {
    Object.values(timers.current).forEach(clearTimeout);
    setResetKey((k) => k + 1);
    router.replace(pathname, { scroll: false });
  };

  const toggleRow = (id: string) => {
    const ids = new Set(selected);
    if (ids.has(id)) ids.delete(id);
    else ids.add(id);
    setSelection({ key: rowsKey, ids, allMatching: false });
  };
  const toggleAllOnPage = () =>
    setSelection({ key: rowsKey, ids: allOnPage ? new Set() : new Set(selectableRows.map((r) => r.id)), allMatching: false });

  const deleteCount = allMatching ? total : selected.size;

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    setError(null);
    const result = await adminRequest(pendingDelete.deleteEndpoint, { method: "DELETE" });
    setDeleting(false);
    if (!result.ok) {
      setError(result.message);
      if (result.status === 404) {
        setPendingDelete(null);
        router.refresh();
      }
      return;
    }
    setPendingDelete(null);
    router.refresh();
  };

  const confirmBulkDelete = async () => {
    setDeleting(true);
    setError(null);
    setNotice(null);
    const result = await adminRequest<{ message: string }>("/api/admin/bulk-delete", {
      json: allMatching ? { section, query: listQuery } : { section, ids: [...selected] },
    });
    setDeleting(false);
    setBulkConfirm(false);
    if (!result.ok) return setError(result.message);
    setNotice(result.data.message);
    setSelection({ key: "", ids: new Set(), allMatching: false });
    router.refresh();
  };

  const totalPages = pageSize ? Math.max(1, Math.ceil(total / pageSize)) : 1;
  const firstShown = total === 0 ? 0 : pageSize ? (page - 1) * pageSize + 1 : 1;
  const lastShown = pageSize ? Math.min(page * pageSize, total) : total;

  const filterControl = (col: ClientColumn, compact: boolean) => {
    const key = `f_${col.key}`;
    const label = `Filter by ${col.label}`;
    if (!col.filter) return null;
    if (col.filter.kind === "select") {
      return (
        <select aria-label={label} className={inputClass} value={current(key)} onChange={(e) => setParam(key, e.target.value)}>
          <option value="">{compact ? "All" : `${col.label}: all`}</option>
          {col.filter.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      );
    }
    return (
      <input
        key={`${key}-${resetKey}`}
        type={col.filter.kind === "number" ? "number" : "search"}
        aria-label={label}
        placeholder={compact ? "Filter…" : col.label}
        defaultValue={current(key)}
        onChange={(e) => setParamDebounced(key, e.target.value)}
        className={inputClass}
      />
    );
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-bold text-primary-900">{title}</h1>
        <div className="flex items-center gap-2">
          {exportHref && (
            <a
              href={listQuery ? `${exportHref}?${listQuery}` : exportHref}
              download
              className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
            >
              <Download size={16} aria-hidden /> Download CSV
            </a>
          )}
          {newHref && (
            <Link
              href={newHref}
              className="inline-flex items-center gap-2 rounded-lg bg-accent-500 px-4 py-2 text-sm font-semibold text-primary-950 hover:bg-accent-400"
            >
              <Plus size={16} aria-hidden /> {newLabel}
            </Link>
          )}
        </div>
      </div>

      {/* Toolbar: search, date, extra filters */}
      <div className="mt-5 flex flex-wrap items-end gap-3 rounded-xl border border-neutral-200 bg-white p-3">
        <div className="relative min-w-56 flex-1">
          <Search size={15} aria-hidden className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            key={`q-${resetKey}`}
            type="search"
            aria-label={`Search ${title}`}
            placeholder={`Search ${title.toLowerCase()}…`}
            defaultValue={current("q")}
            onChange={(e) => setParamDebounced("q", e.target.value)}
            className={cn(inputClass, "py-2 pl-8 text-sm")}
          />
        </div>
        <label className="text-xs font-medium text-neutral-600">
          {dateLabel}
          <select
            className={cn(inputClass, "mt-1 w-40")}
            value={current("date")}
            onChange={(e) =>
              navigate((p) => {
                if (e.target.value) p.set("date", e.target.value);
                else p.delete("date");
                if (e.target.value !== "custom") {
                  p.delete("from");
                  p.delete("to");
                }
              })
            }
          >
            <option value="">Any time</option>
            {DATE_PRESETS.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </label>
        {current("date") === "custom" && (
          <>
            <label className="text-xs font-medium text-neutral-600">
              From
              <input
                type="date"
                className={cn(inputClass, "mt-1")}
                value={current("from")}
                max={current("to") || undefined}
                onChange={(e) => setParam("from", e.target.value)}
              />
            </label>
            <label className="text-xs font-medium text-neutral-600">
              To
              <input
                type="date"
                className={cn(inputClass, "mt-1")}
                value={current("to")}
                min={current("from") || undefined}
                onChange={(e) => setParam("to", e.target.value)}
              />
            </label>
          </>
        )}
        {extraFilters.map((f) => (
          <div key={f.key} className="w-40 text-xs font-medium text-neutral-600">
            {f.label}
            <div className="mt-1">{filterControl(f, false)}</div>
          </div>
        ))}
        {hasFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-semibold text-primary-700 hover:bg-primary-50"
          >
            <X size={14} aria-hidden /> Clear filters
          </button>
        )}
      </div>

      {/* Result count + bulk actions */}
      <div className="mt-3 flex min-h-9 flex-wrap items-center justify-between gap-3 text-sm">
        <p className="text-neutral-500">
          {total === 0
            ? "No results"
            : pageSize
              ? `Showing ${firstShown}–${lastShown} of ${total}`
              : `${total} ${total === 1 ? "result" : "results"}`}
          {hasFilters && total > 0 && " (filtered)"}
        </p>
        {deleteCount > 0 && (
          <div className="flex flex-wrap items-center gap-3">
            {allOnPage && !allMatching && total > rows.length && (
              <button
                type="button"
                onClick={() => setSelection({ key: rowsKey, ids: selected, allMatching: true })}
                className="text-xs font-semibold text-primary-700 hover:underline"
              >
                Select all {total} matching
              </button>
            )}
            <span className="text-xs text-neutral-500">
              {allMatching ? `All ${total} matching selected` : `${selected.size} selected`}
            </span>
            <button
              type="button"
              onClick={() => setBulkConfirm(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
            >
              <Trash2 size={14} aria-hidden /> Delete selected
            </button>
          </div>
        )}
      </div>

      {error && <p className="mt-2 text-sm font-medium text-red-600">{error}</p>}
      {notice && <p className="mt-2 text-sm font-medium text-green-700">{notice}</p>}

      <div className="mt-2 overflow-x-auto rounded-xl border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50">
            <tr>
              <th className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  aria-label="Select all on this page"
                  className="h-4 w-4 accent-primary-700"
                  checked={allOnPage}
                  ref={(el) => {
                    if (el) el.indeterminate = selected.size > 0 && !allOnPage;
                  }}
                  onChange={toggleAllOnPage}
                  disabled={selectableRows.length === 0}
                />
              </th>
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 font-semibold text-neutral-600">
                  {col.label}
                </th>
              ))}
              <th className="px-4 py-3" />
            </tr>
            <tr className="border-t border-neutral-200">
              <th />
              {columns.map((col) => (
                <th key={col.key} className="px-4 pb-2.5 pt-0 font-normal">
                  {filterControl(col, true)}
                </th>
              ))}
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className={cn(
                  "border-b border-neutral-100 last:border-0 hover:bg-neutral-50",
                  row.unread && "font-semibold",
                  (selected.has(row.id) || allMatching) && "bg-primary-50/60",
                )}
              >
                <td className="px-4 py-3">
                  {row.selectable !== false && (
                    <input
                      type="checkbox"
                      aria-label={`Select ${row.label}`}
                      className="h-4 w-4 accent-primary-700"
                      checked={allMatching || selected.has(row.id)}
                      disabled={allMatching}
                      onChange={() => toggleRow(row.id)}
                    />
                  )}
                </td>
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
                      aria-label={`${editLabel ?? "Edit"} ${row.label}`}
                    >
                      <Pencil size={16} aria-hidden />
                    </Link>
                    {row.selectable !== false && (
                      <button
                        type="button"
                        onClick={() => setPendingDelete(row)}
                        className="rounded p-1.5 text-neutral-500 hover:bg-red-50 hover:text-red-600"
                        aria-label={`Delete ${row.label}`}
                      >
                        <Trash2 size={16} aria-hidden />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={columns.length + 2} className="px-4 py-8 text-center text-neutral-400">
                  {hasFilters ? "Nothing matches these filters." : "Nothing here yet."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pageSize && totalPages > 1 && (
        <nav aria-label="Pages" className="mt-4 flex items-center justify-center gap-1">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => navigate((p) => p.set("page", String(page - 1)), true)}
            className="rounded-md p-2 text-neutral-600 hover:bg-neutral-100 disabled:opacity-40"
            aria-label="Previous page"
          >
            <ChevronLeft size={16} aria-hidden />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((n) => n === 1 || n === totalPages || Math.abs(n - page) <= 2)
            .map((n, i, shown) => (
              <span key={n} className="flex items-center">
                {i > 0 && n - shown[i - 1] > 1 && <span className="px-1 text-neutral-400">…</span>}
                <button
                  type="button"
                  aria-current={n === page ? "page" : undefined}
                  onClick={() => navigate((p) => p.set("page", String(n)), true)}
                  className={cn(
                    "min-w-9 rounded-md px-2.5 py-1.5 text-sm font-medium",
                    n === page ? "bg-primary-700 text-white" : "text-neutral-600 hover:bg-neutral-100",
                  )}
                >
                  {n}
                </button>
              </span>
            ))}
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => navigate((p) => p.set("page", String(page + 1)), true)}
            className="rounded-md p-2 text-neutral-600 hover:bg-neutral-100 disabled:opacity-40"
            aria-label="Next page"
          >
            <ChevronRight size={16} aria-hidden />
          </button>
        </nav>
      )}

      <DeleteConfirmDialog
        open={!!pendingDelete}
        title={`Delete "${pendingDelete?.label ?? ""}"?`}
        description="This cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
        loading={deleting}
      />
      <DeleteConfirmDialog
        open={bulkConfirm}
        title={`Delete ${deleteCount} ${deleteCount === 1 ? "item" : "items"}?`}
        description={
          allMatching
            ? `This deletes every item matching the current search and filters (${total}). This cannot be undone.`
            : "This cannot be undone."
        }
        onConfirm={confirmBulkDelete}
        onCancel={() => setBulkConfirm(false)}
        loading={deleting}
      />
    </div>
  );
}
