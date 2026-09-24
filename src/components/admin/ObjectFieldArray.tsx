"use client";

import { Plus, Trash2 } from "lucide-react";
import { arrayMove } from "@dnd-kit/sortable";
import SortableList from "@/components/admin/ui/SortableList";
import { useRowIds } from "@/components/admin/ui/useRowIds";

/** A list of small records (e.g. universities, FAQs): add, edit, drag to reorder, remove. */
export default function ObjectFieldArray<T extends Record<string, unknown>>({
  label,
  value,
  onChange,
  emptyItem,
  renderRow,
  error,
  minItems = 0,
  maxItems = Infinity,
}: {
  label: string;
  value: T[];
  onChange: (next: T[]) => void;
  emptyItem: T;
  renderRow: (item: T, update: (patch: Partial<T>) => void, index: number) => React.ReactNode;
  error?: string;
  /** Fewest / most items: hides Remove / Add at the limits. */
  minItems?: number;
  maxItems?: number;
}) {
  const rows = useRowIds(value.length);

  const updateAt = (index: number, patch: Partial<T>) => {
    const copy = [...value];
    copy[index] = { ...copy[index], ...patch };
    onChange(copy);
  };
  const remove = (index: number) => {
    rows.remove(index);
    onChange(value.filter((_, i) => i !== index));
  };
  const add = () => {
    rows.add();
    onChange([...value, emptyItem]);
  };
  const move = (from: number, to: number) => {
    rows.move(from, to);
    onChange(arrayMove(value, from, to));
  };

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label className="block text-sm font-medium text-primary-900">{label}</label>
        {value.length < maxItems && (
          <button
            type="button"
            onClick={add}
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary-700 hover:underline"
          >
            <Plus size={14} aria-hidden /> Add
          </button>
        )}
      </div>
      <SortableList ids={rows.ids} onMove={move} label={label.toLowerCase()}>
        {(index, handle) => (
          <div className="flex items-start gap-2 rounded-lg border border-neutral-200 bg-white p-3">
            <div className="pt-1">{handle}</div>
            <div className="flex-1">{renderRow(value[index], (patch) => updateAt(index, patch), index)}</div>
            {value.length > minItems && (
              <button
                type="button"
                onClick={() => remove(index)}
                className="rounded p-1.5 text-red-500 hover:bg-red-50"
                aria-label={`Remove item ${index + 1}`}
              >
                <Trash2 size={16} aria-hidden />
              </button>
            )}
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
