"use client";

import { useWatch, type Control, type FieldErrors, type UseFormRegister } from "react-hook-form";
import type { BlogFormValues } from "@/lib/validation/blog";
import { addYears, dhakaParts, todayInDhaka } from "@/lib/validation/dates";
import { cn } from "@/lib/utils";

/**
 * Blog publishing: now, scheduled for a date and time (Bangladesh time), or a
 * draft. Past dates aren't offered; a scheduled post stays hidden from the
 * public site until its time, a draft until it's published. When editing a
 * live or scheduled post, "Keep" leaves it as it is.
 */
export default function PublishSettings({
  control,
  register,
  errors,
  current,
}: {
  control: Control<BlogFormValues>;
  register: UseFormRegister<BlogFormValues>;
  errors: FieldErrors<BlogFormValues>;
  /** Editing: the post's current publish time, already formatted. */
  current?: { label: string; scheduled: boolean; draft: boolean };
}) {
  const [mode, date] = useWatch({ control, name: ["publishMode", "publishDate"] });
  const today = todayInDhaka();
  // A time earlier than now can't be picked for today.
  const minTime = date === today ? dhakaParts(new Date()).time : undefined;
  const live = current && !current.draft;

  const options = [
    ...(live
      ? [{ value: "keep", label: current.scheduled ? "Keep schedule" : "Keep original date", hint: current.label }]
      : []),
    { value: "now", label: "Publish now", hint: live ? "Updates the publish date to now" : "Goes live as soon as you save" },
    { value: "schedule", label: "Schedule for later", hint: "Pick a date and time" },
    {
      value: "draft",
      label: current?.draft ? "Keep as draft" : live ? "Move to drafts" : "Save as draft",
      hint: "Hidden from the website; you can preview it",
    },
  ];

  return (
    <fieldset className="rounded-xl border border-neutral-200 bg-white p-5">
      <legend className="px-1 text-sm font-semibold text-primary-900">Publishing</legend>
      <div className={cn("grid gap-3", options.length === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-3")}>
        {options.map((o) => (
          <label
            key={o.value}
            className={cn(
              "flex cursor-pointer gap-2.5 rounded-lg border p-3 text-sm",
              mode === o.value ? "border-primary-500 bg-primary-50" : "border-neutral-200 hover:bg-neutral-50",
            )}
          >
            <input type="radio" value={o.value} className="mt-0.5 accent-primary-700" {...register("publishMode")} />
            <span>
              <span className="block font-medium text-primary-900">{o.label}</span>
              <span className="block text-xs text-neutral-500">{o.hint}</span>
            </span>
          </label>
        ))}
      </div>

      {mode === "schedule" && (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="b-publish-date" className="mb-1.5 block text-sm font-medium text-primary-900">
              Publish date <span className="text-red-500">*</span>
            </label>
            <input
              id="b-publish-date"
              type="date"
              min={today}
              max={addYears(today, 1)}
              aria-invalid={!!errors.publishDate}
              className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
              {...register("publishDate")}
            />
            {errors.publishDate && (
              <p role="alert" className="mt-1.5 text-xs font-medium text-red-600">
                {errors.publishDate.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="b-publish-time" className="mb-1.5 block text-sm font-medium text-primary-900">
              Publish time <span className="text-red-500">*</span>
            </label>
            <input
              id="b-publish-time"
              type="time"
              step={60}
              min={minTime}
              aria-invalid={!!errors.publishTime}
              className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
              {...register("publishTime")}
            />
            {errors.publishTime && (
              <p role="alert" className="mt-1.5 text-xs font-medium text-red-600">
                {errors.publishTime.message}
              </p>
            )}
          </div>
          <p className="text-xs text-neutral-500 sm:col-span-2">
            Bangladesh time (GMT+6). The post stays hidden from the website until then, and appears automatically.
          </p>
        </div>
      )}
    </fieldset>
  );
}
