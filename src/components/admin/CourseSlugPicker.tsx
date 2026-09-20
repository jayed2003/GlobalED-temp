"use client";

import { ChevronUp, ChevronDown, Trash2 } from "lucide-react";
import { Select } from "@/components/forms/primitives";

export default function CourseSlugPicker({
  label,
  value,
  onChange,
  courses,
}: {
  label: string;
  value: string[];
  onChange: (next: string[]) => void;
  courses: { slug: string; title: string }[];
}) {
  const available = courses.filter((c) => !value.includes(c.slug));
  const titleOf = (slug: string) => courses.find((c) => c.slug === slug)?.title ?? slug;

  const remove = (index: number) => onChange(value.filter((_, i) => i !== index));
  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= value.length) return;
    const copy = [...value];
    [copy[index], copy[target]] = [copy[target], copy[index]];
    onChange(copy);
  };

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-primary-900">{label}</label>
      <div className="space-y-2">
        {value.map((slug, index) => (
          <div key={slug} className="flex items-center gap-1.5">
            <span className="flex-1 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm text-neutral-800">
              {titleOf(slug)}
            </span>
            <button
              type="button"
              onClick={() => move(index, -1)}
              disabled={index === 0}
              className="rounded p-1.5 text-neutral-400 hover:bg-neutral-100 disabled:opacity-30"
              aria-label="Move up"
            >
              <ChevronUp size={16} aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => move(index, 1)}
              disabled={index === value.length - 1}
              className="rounded p-1.5 text-neutral-400 hover:bg-neutral-100 disabled:opacity-30"
              aria-label="Move down"
            >
              <ChevronDown size={16} aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => remove(index)}
              className="rounded p-1.5 text-red-500 hover:bg-red-50"
              aria-label="Remove"
            >
              <Trash2 size={16} aria-hidden />
            </button>
          </div>
        ))}
        {value.length === 0 && <p className="text-sm text-neutral-400">No courses linked yet.</p>}
      </div>
      {available.length > 0 && (
        <div className="mt-2">
          <Select
            value=""
            onChange={(e) => {
              if (e.target.value) onChange([...value, e.target.value]);
            }}
          >
            <option value="">+ Add a course…</option>
            {available.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.title}
              </option>
            ))}
          </Select>
        </div>
      )}
    </div>
  );
}
