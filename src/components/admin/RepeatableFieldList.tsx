"use client";

import { Plus, Trash2 } from "lucide-react";
import { arrayMove } from "@dnd-kit/sortable";
import { Input } from "@/components/forms/primitives";
import SortableList from "@/components/admin/ui/SortableList";
import { useRowIds } from "@/components/admin/ui/useRowIds";

/** A list of short texts: add, edit, drag to reorder, remove. */
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
  const rows = useRowIds(value.length);

  const update = (index: number, next: string) => {
    const copy = [...value];
    copy[index] = next;
    onChange(copy);
  };
  const remove = (index: number) => {
    rows.remove(index);
    onChange(value.filter((_, i) => i !== index));
  };
  const add = () => {
    rows.add();
    onChange([...value, ""]);
  };
  const move = (from: number, to: number) => {
    rows.move(from, to);
    onChange(arrayMove(value, from, to));
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
      <SortableList ids={rows.ids} onMove={move} label={label.toLowerCase()}>
        {(index, handle) => (
          <div className="flex items-center gap-1.5 bg-white">
            {handle}
            <Input
              value={value[index]}
              placeholder={placeholder}
              aria-label={`${label} ${index + 1}`}
              onChange={(e) => update(index, e.target.value)}
            />
            <button
              type="button"
              onClick={() => remove(index)}
              className="rounded p-1.5 text-red-500 hover:bg-red-50"
              aria-label={`Remove ${label.toLowerCase()} ${index + 1}`}
            >
              <Trash2 size={16} aria-hidden />
            </button>
          </div>
        )}
      </SortableList>
      {value.length === 0 && <p className="text-sm text-neutral-400">No items yet.</p>}
      {error && (
        <p role="alert" className="mt-1.5 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
