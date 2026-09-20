"use client";

import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { Input } from "@/components/forms/primitives";

export default function RepeatableFieldList({
  label,
  value,
  onChange,
  placeholder,
  error,
}: {
  label: string;
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  error?: string;
}) {
  const update = (index: number, next: string) => {
    const copy = [...value];
    copy[index] = next;
    onChange(copy);
  };
  const remove = (index: number) => onChange(value.filter((_, i) => i !== index));
  const add = () => onChange([...value, ""]);
  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= value.length) return;
    const copy = [...value];
    [copy[index], copy[target]] = [copy[target], copy[index]];
    onChange(copy);
  };

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label className="block text-sm font-medium text-primary-900">{label}</label>
        <button
          type="button"
          onClick={add}
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary-700 hover:underline"
        >
          <Plus size={14} aria-hidden /> Add
        </button>
      </div>
      <div className="space-y-2">
        {value.map((item, index) => (
          <div key={index} className="flex items-center gap-1.5">
            <Input value={item} placeholder={placeholder} onChange={(e) => update(index, e.target.value)} />
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
        {value.length === 0 && <p className="text-sm text-neutral-400">No items yet.</p>}
      </div>
      {error && (
        <p role="alert" className="mt-1.5 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
