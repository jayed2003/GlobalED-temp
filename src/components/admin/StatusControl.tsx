"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminRequest } from "@/lib/admin-fetch";

/**
 * Status dropdown for an inbox item (a lead or a contact message). Saves on
 * change via PATCH { status } and rolls back if the save fails.
 */
export default function StatusControl({
  endpoint,
  status,
  options,
}: {
  endpoint: string;
  status: string;
  options: { value: string; label: string }[];
}) {
  const router = useRouter();
  const [current, setCurrent] = useState(status);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateStatus = async (next: string) => {
    setSaving(true);
    setError(null);
    const previous = current;
    setCurrent(next);
    const result = await adminRequest(endpoint, { method: "PATCH", json: { status: next } });
    setSaving(false);
    if (!result.ok) {
      setCurrent(previous);
      setError(result.message);
      return;
    }
    // Refreshes this page and the sidebar's "new" counts.
    router.refresh();
  };

  return (
    <div>
      <label htmlFor="item-status" className="mb-1.5 block text-sm font-medium text-primary-900">
        Status
      </label>
      <select
        id="item-status"
        value={current}
        disabled={saving}
        onChange={(e) => updateStatus(e.target.value)}
        className="w-full max-w-xs rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-800 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100 disabled:opacity-60"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}
