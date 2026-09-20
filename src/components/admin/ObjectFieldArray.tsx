"use client";

import { Plus, Trash2 } from "lucide-react";

export default function ObjectFieldArray<T extends Record<string, unknown>>({
  label,
  value,
  onChange,
  emptyItem,
  renderRow,
  error,
}: {
  label: string;
  value: T[];
  onChange: (next: T[]) => void;
  emptyItem: T;
  renderRow: (item: T, update: (patch: Partial<T>) => void) => React.ReactNode;
  error?: string;
}) {
  const updateAt = (index: number, patch: Partial<T>) => {
    const copy = [...value];
    copy[index] = { ...copy[index], ...patch };
    onChange(copy);
  };
  const remove = (index: number) => onChange(value.filter((_, i) => i !== index));
  const add = () => onChange([...value, emptyItem]);

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
      <div className="space-y-3">
        {value.map((item, index) => (
          <div key={index} className="flex items-start gap-2 rounded-lg border border-neutral-200 p-3">
            <div className="flex-1">{renderRow(item, (patch) => updateAt(index, patch))}</div>
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
