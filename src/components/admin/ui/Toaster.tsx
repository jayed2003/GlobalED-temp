"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { CheckCircle2, AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { dismissToast, getServerToasts, getToasts, subscribeToasts } from "./toast";

/** Renders admin toasts (top right). Mounted once, in the admin shell. */
export default function Toaster() {
  const toasts = useSyncExternalStore(subscribeToasts, getToasts, getServerToasts);

  return (
    <div aria-live="polite" className="pointer-events-none fixed right-4 top-4 z-[70] flex w-[min(24rem,calc(100%-2rem))] flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          role={t.kind === "error" ? "alert" : "status"}
          className={cn(
            "pointer-events-auto flex items-start gap-3 rounded-xl border bg-white px-4 py-3 text-sm shadow-lg",
            t.kind === "error" ? "border-red-200" : "border-emerald-200",
          )}
        >
          {t.kind === "error" ? (
            <AlertCircle size={18} aria-hidden className="mt-0.5 shrink-0 text-red-600" />
          ) : (
            <CheckCircle2 size={18} aria-hidden className="mt-0.5 shrink-0 text-emerald-600" />
          )}
          <div className="min-w-0 flex-1">
            <p className="text-neutral-800">{t.message}</p>
            {t.href && (
              <Link
                href={t.href}
                target={t.href.startsWith("/admin") ? undefined : "_blank"}
                className="mt-1 inline-block font-semibold text-primary-700 hover:underline"
              >
                {t.linkLabel ?? "View"}
              </Link>
            )}
          </div>
          <button
            type="button"
            onClick={() => dismissToast(t.id)}
            aria-label="Dismiss notification"
            className="rounded p-0.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
          >
            <X size={16} aria-hidden />
          </button>
        </div>
      ))}
    </div>
  );
}
