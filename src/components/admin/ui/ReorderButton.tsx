"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { arrayMove } from "@dnd-kit/sortable";
import { ArrowUpDown, Loader2, X } from "lucide-react";
import { adminRequest } from "@/lib/admin-fetch";
import SortableList from "./SortableList";
import { adminButton } from "./buttons";
import { toast } from "./toast";

interface Item {
  id: string;
  label: string;
  /** Small grey text next to the label, e.g. "Hidden". */
  hint?: string;
}

/**
 * "Reorder" button for a list page: opens a dialog where the items can be
 * dragged (or moved with the keyboard) into the order they should appear on
 * the site, then saved in one go.
 */
export default function ReorderButton({
  endpoint,
  items,
  title,
  what,
}: {
  /** POST { ids } in the new order. */
  endpoint: string;
  items: Item[];
  title: string;
  /** Plural noun for screen readers, e.g. "branches". */
  what: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [order, setOrder] = useState(items);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  const close = () => {
    if (!saving) setOpen(false);
  };

  // Focus the dialog's first control when it opens.
  useEffect(() => {
    if (open) dialogRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      // Escape during a keyboard drag cancels the drag (dnd-kit), not the dialog.
      const dragging = document.querySelector("[aria-pressed='true'][aria-roledescription='sortable']");
      if (event.key === "Escape" && !dragging && !saving) setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, saving]);

  const save = async () => {
    setSaving(true);
    setError(null);
    const result = await adminRequest(endpoint, { json: { ids: order.map((i) => i.id) } });
    setSaving(false);
    if (!result.ok) return setError(result.message);
    setOpen(false);
    toast.success("New order saved");
    router.refresh();
  };

  const changed = order.some((item, i) => item.id !== items[i]?.id);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOrder(items);
          setError(null);
          setOpen(true);
        }}
        disabled={items.length < 2}
        className={adminButton("secondary")}
      >
        <ArrowUpDown size={16} aria-hidden /> Reorder
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="flex max-h-[85vh] w-full max-w-lg flex-col rounded-xl bg-white shadow-xl"
          >
            <div className="flex items-start justify-between gap-3 border-b border-neutral-100 px-6 py-4">
              <div>
                <h2 id={titleId} className="font-heading text-lg font-bold text-primary-900">
                  {title}
                </h2>
                <p className="mt-0.5 text-xs text-neutral-500">
                  Drag the handles, or focus one and use Space and the arrow keys. The site shows them in this order.
                </p>
              </div>
              <button type="button" onClick={close} aria-label="Close" className="rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-100">
                <X size={18} aria-hidden />
              </button>
            </div>

            <div className="overflow-y-auto px-6 py-4">
              <SortableList ids={order.map((i) => i.id)} onMove={(from, to) => setOrder((o) => arrayMove(o, from, to))} label={what}>
                {(index, handle) => (
                  <div className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-white px-3 py-2.5">
                    {handle}
                    <span className="w-6 text-xs tabular-nums text-neutral-400">{index + 1}</span>
                    <span className="flex-1 text-sm font-medium text-neutral-800">{order[index].label}</span>
                    {order[index].hint && <span className="text-xs text-neutral-400">{order[index].hint}</span>}
                  </div>
                )}
              </SortableList>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-neutral-100 px-6 py-4">
              <p className="text-sm text-red-600" role={error ? "alert" : undefined}>
                {error}
              </p>
              <div className="flex gap-2">
                <button type="button" onClick={close} className={adminButton("ghost")}>
                  Cancel
                </button>
                <button type="button" onClick={save} disabled={saving || !changed} className={adminButton("primary")}>
                  {saving && <Loader2 size={16} aria-hidden className="animate-spin" />}
                  {saving ? "Saving…" : "Save order"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
