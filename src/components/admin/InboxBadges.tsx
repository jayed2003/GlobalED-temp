"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { adminRequest } from "@/lib/admin-fetch";
import type { InboxCounts } from "@/lib/admin-counts";

/**
 * Live "new leads / new messages" counts for the admin sidebar.
 * <InboxPoller> (rendered once) keeps a small shared store up to date:
 * seeded from the server-rendered counts, refreshed every minute and
 * whenever the tab regains focus. Each <InboxBadge> reads from that store.
 */

const POLL_MS = 60_000;

let counts: InboxCounts = {};
const listeners = new Set<() => void>();

function setCounts(next: InboxCounts) {
  counts = next;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function InboxPoller({ initial }: { initial: InboxCounts }) {
  const pathname = usePathname();
  const total = useSyncExternalStore(
    subscribe,
    () => (counts.leads ?? 0) + (counts.messages ?? 0),
    () => (initial.leads ?? 0) + (initial.messages ?? 0),
  );

  // Fresh server counts arrive after router.refresh() (e.g. a status change).
  useEffect(() => {
    setCounts(initial);
  }, [initial.leads, initial.messages]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let stopped = false;
    const refresh = async () => {
      if (document.visibilityState !== "visible") return;
      const result = await adminRequest<InboxCounts>("/api/admin/notifications");
      if (!stopped && result.ok) setCounts(result.data);
    };
    const timer = window.setInterval(refresh, POLL_MS);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      stopped = true;
      window.clearInterval(timer);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);

  // "(3) Leads | GlobalEd" in the browser tab while anything is waiting.
  useEffect(() => {
    const base = document.title.replace(/^\(\d+\+?\)\s*/, "");
    document.title = total > 0 ? `(${total > 99 ? "99+" : total}) ${base}` : base;
  }, [total, pathname]);

  return null;
}

export function InboxBadge({ kind, initial }: { kind: keyof InboxCounts; initial?: number }) {
  const value = useSyncExternalStore(
    subscribe,
    () => counts[kind] ?? 0,
    () => initial ?? 0,
  );
  if (!value) return null;
  return (
    <span
      className="ml-auto min-w-5 rounded-full bg-red-600 px-1.5 py-0.5 text-center text-xs font-bold leading-none text-white"
      aria-label={`${value} new`}
    >
      {value > 99 ? "99+" : value}
    </span>
  );
}
