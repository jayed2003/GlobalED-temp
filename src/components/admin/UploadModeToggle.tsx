"use client";

import type { UploadMode } from "@/lib/images";
import { cn } from "@/lib/utils";

const HINTS: Record<UploadMode, string> = {
  optimized: "Resized to fit 1920px and compressed — fastest pages (recommended).",
  original: "Full size and quality, served as uploaded — for images where detail matters.",
};

/** "Optimized | Original" choice for the next image upload. */
export default function UploadModeToggle({
  value,
  onChange,
}: {
  value: UploadMode;
  onChange: (mode: UploadMode) => void;
}) {
  return (
    <div>
      <div role="group" aria-label="Image quality" className="inline-flex rounded-lg border border-neutral-300 p-0.5">
        {(["optimized", "original"] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            aria-pressed={value === mode}
            onClick={() => onChange(mode)}
            className={cn(
              "rounded-md px-3 py-1 text-xs font-semibold transition-colors",
              value === mode ? "bg-primary-700 text-white" : "text-neutral-600 hover:bg-neutral-100",
            )}
          >
            {mode === "optimized" ? "Optimized" : "Original"}
          </button>
        ))}
      </div>
      <p className="mt-1 text-xs text-neutral-500">{HINTS[value]}</p>
    </div>
  );
}
