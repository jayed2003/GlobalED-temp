import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/** Animated progress bar + step dots. Only completed steps are clickable (to go back). */
export default function FormProgress({
  steps,
  current,
  onGoTo,
}: {
  steps: string[];
  current: number;
  onGoTo: (index: number) => void;
}) {
  const percent = ((current + 1) / steps.length) * 100;
  return (
    <div>
      <div className="flex items-center justify-between text-xs font-medium text-neutral-600">
        <span>
          Step {current + 1} of {steps.length}
        </span>
        <span className="text-primary-800">{steps[current]}</span>
      </div>
      <div
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={steps.length}
        aria-valuenow={current + 1}
        className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-200"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary-600 to-accent-500 transition-[width] duration-500 ease-out motion-reduce:transition-none"
          style={{ width: `${percent}%` }}
        />
      </div>
      <ol className="mt-3 flex items-center justify-between">
        {steps.map((label, i) => (
          <li key={label}>
            <button
              type="button"
              disabled={i >= current}
              onClick={() => onGoTo(i)}
              aria-label={i < current ? `Go back to ${label}` : label}
              aria-current={i === current ? "step" : undefined}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 motion-reduce:transition-none",
                i < current && "cursor-pointer bg-green-500 text-white hover:scale-110",
                i === current && "scale-110 bg-primary-700 text-white ring-4 ring-primary-100",
                i > current && "cursor-default bg-neutral-200 text-neutral-500",
              )}
            >
              {i < current ? <Check size={14} aria-hidden /> : i + 1}
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
