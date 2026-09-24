"use client";

import { cn } from "@/lib/utils";

/** On/off switch (role="switch"), e.g. "Shown on site". */
export default function Toggle({
  checked,
  onChange,
  label,
  onLabel,
  offLabel,
  disabled,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Accessible name, e.g. "Show the Hero section on the site". */
  label: string;
  /** Visible text next to the switch for each state (optional). */
  onLabel?: string;
  offLabel?: string;
  disabled?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 disabled:opacity-50",
          checked ? "bg-emerald-500" : "bg-neutral-300",
        )}
      >
        <span
          aria-hidden
          className={cn(
            "inline-block h-4 w-4 rounded-full bg-white shadow transition-transform",
            checked ? "translate-x-[18px]" : "translate-x-0.5",
          )}
        />
      </button>
      {(onLabel || offLabel) && (
        <span aria-hidden className={cn("text-xs font-medium", checked ? "text-emerald-700" : "text-neutral-500")}>
          {checked ? onLabel : offLabel}
        </span>
      )}
    </span>
  );
}
