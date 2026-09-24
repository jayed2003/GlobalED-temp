"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { SITE_ICON_NAMES, SITE_ICONS, iconLabel } from "@/lib/icons";
import SiteIcon from "@/components/ui/SiteIcon";
import { cn } from "@/lib/utils";

/**
 * Pick an icon from the site's curated set. Shows the current icon; opens a
 * grid of choices (arrow keys move, Enter picks, Escape closes).
 */
export default function IconPicker({
  id,
  value,
  onChange,
  invalid,
}: {
  id?: string;
  value: string;
  onChange: (name: string) => void;
  invalid?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const gridId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    // Focus the selected icon (or the first) when the grid opens.
    const frame = requestAnimationFrame(() => {
      const target =
        gridRef.current?.querySelector<HTMLButtonElement>('[aria-checked="true"]') ??
        gridRef.current?.querySelector<HTMLButtonElement>("button");
      target?.focus();
    });
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      cancelAnimationFrame(frame);
    };
  }, [open]);

  const onGridKeyDown = (event: React.KeyboardEvent) => {
    const buttons = Array.from(gridRef.current?.querySelectorAll<HTMLButtonElement>("button") ?? []);
    const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
    const columns = 6;
    const moves: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: columns, ArrowUp: -columns };
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      rootRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
    } else if (event.key in moves && index >= 0) {
      event.preventDefault();
      buttons[Math.min(buttons.length - 1, Math.max(0, index + moves[event.key]))]?.focus();
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        id={id}
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={gridId}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex w-full items-center gap-3 rounded-lg border bg-white px-3 py-2 text-left text-sm text-neutral-800 hover:bg-neutral-50",
          invalid ? "border-red-500" : "border-neutral-300",
        )}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
          <SiteIcon name={value} size={18} aria-hidden />
        </span>
        <span className="flex-1">{value ? iconLabel(value) : "Choose an icon"}</span>
        <ChevronDown size={16} aria-hidden className="text-neutral-400" />
      </button>

      {open && (
        <div
          id={gridId}
          ref={gridRef}
          role="radiogroup"
          aria-label="Icons"
          onKeyDown={onGridKeyDown}
          className="absolute left-0 top-full z-30 mt-1 grid w-[19rem] grid-cols-6 gap-1 rounded-xl border border-neutral-200 bg-white p-2 shadow-xl"
        >
          {SITE_ICON_NAMES.map((name) => {
            const Icon = SITE_ICONS[name];
            const selected = name === value;
            return (
              <button
                key={name}
                type="button"
                role="radio"
                aria-checked={selected}
                aria-label={iconLabel(name)}
                title={iconLabel(name)}
                tabIndex={selected || (!value && name === SITE_ICON_NAMES[0]) ? 0 : -1}
                onClick={() => {
                  onChange(name);
                  setOpen(false);
                }}
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-lg focus-visible:outline-2 focus-visible:outline-primary-500",
                  selected ? "bg-primary-700 text-white" : "text-neutral-600 hover:bg-primary-50 hover:text-primary-800",
                )}
              >
                <Icon size={20} aria-hidden />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
