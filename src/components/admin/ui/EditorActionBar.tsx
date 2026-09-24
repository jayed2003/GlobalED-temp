"use client";

import { useEffect, useRef } from "react";
import { Loader2, Save } from "lucide-react";
import { adminButton } from "./buttons";

/**
 * The save bar at the bottom of every editor. It stays in view while you
 * scroll, says whether there are unsaved changes (or why the last save
 * failed), and holds the form's buttons. Ctrl+S / ⌘S saves.
 *
 * Must be rendered inside the <form>: the main button is its submit button.
 * Extra actions (e.g. "Save draft", "Preview") go in `children`.
 */
export default function EditorActionBar({
  dirty,
  busy,
  submitLabel,
  busyLabel = "Saving…",
  error,
  submitIcon,
  onShortcut,
  children,
}: {
  dirty: boolean;
  busy: boolean;
  submitLabel: string;
  busyLabel?: string;
  /** Why the last save failed; shown until the next attempt. */
  error?: string | null;
  submitIcon?: React.ReactNode;
  /** What Ctrl+S does, if not the main button (e.g. "Save draft" on page editors). */
  onShortcut?: () => void;
  children?: React.ReactNode;
}) {
  const barRef = useRef<HTMLDivElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        if (busy) return;
        if (onShortcut) onShortcut();
        else barRef.current?.closest("form")?.requestSubmit(submitRef.current ?? undefined);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [busy, onShortcut]);

  return (
    <div
      ref={barRef}
      className="sticky bottom-4 z-20 mt-8 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-white/95 px-4 py-3 shadow-lg shadow-neutral-900/5 backdrop-blur"
    >
      <p className="min-w-0 text-sm" aria-live="polite">
        {error ? (
          <span className="font-medium text-red-600">{error}</span>
        ) : dirty ? (
          <span className="inline-flex items-center gap-2 font-medium text-amber-700">
            <span aria-hidden className="h-2 w-2 rounded-full bg-amber-500" />
            Unsaved changes
          </span>
        ) : (
          <span className="text-neutral-400">No unsaved changes</span>
        )}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        {children}
        <button ref={submitRef} type="submit" disabled={busy} title="Save (Ctrl+S)" className={adminButton("primary")}>
          {busy ? <Loader2 size={16} aria-hidden className="animate-spin" /> : (submitIcon ?? <Save size={16} aria-hidden />)}
          {busy ? busyLabel : submitLabel}
        </button>
      </div>
    </div>
  );
}
