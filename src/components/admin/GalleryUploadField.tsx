"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Plus, Loader2, X } from "lucide-react";
import { adminRequest } from "@/lib/admin-fetch";

/** Photo gallery with one alt text per photo (`alts` is kept parallel to `value`). */
export default function GalleryUploadField({
  label,
  value,
  onChange,
  alts,
  onAltsChange,
  altError,
}: {
  label: string;
  value: string[];
  onChange: (next: string[]) => void;
  alts: string[];
  onAltsChange: (next: string[]) => void;
  altError?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", file);
    const result = await adminRequest<{ url: string }>("/api/admin/upload", { formData });
    setUploading(false);
    if (!result.ok) return setError(result.message);
    onChange([...value, result.data.url]);
    onAltsChange([...value.map((_, i) => alts[i] ?? ""), ""]);
  };

  const remove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
    onAltsChange(value.map((_, i) => alts[i] ?? "").filter((_, i) => i !== index));
  };

  const setAlt = (index: number, text: string) =>
    onAltsChange(value.map((_, i) => (i === index ? text : (alts[i] ?? ""))));

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-primary-900">{label}</label>
      <div className="flex flex-wrap gap-3">
        {value.map((url, index) => (
          <div key={url} className="w-40">
            <div className="relative h-24 w-40 overflow-hidden rounded-lg border border-neutral-200">
              <Image
                src={url}
                alt={alts[index] || `Gallery photo ${index + 1}`}
                fill
                className="object-cover"
                sizes="160px"
                unoptimized={url.startsWith("http")}
              />
              <button
                type="button"
                onClick={() => remove(index)}
                className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
                aria-label={`Remove photo ${index + 1}`}
              >
                <X size={12} aria-hidden />
              </button>
            </div>
            <input
              type="text"
              value={alts[index] ?? ""}
              onChange={(e) => setAlt(index, e.target.value)}
              placeholder="Alt text (required)"
              aria-label={`Alt text for photo ${index + 1}`}
              className="mt-1.5 w-full rounded-md border border-neutral-300 px-2 py-1 text-xs focus:border-primary-500 focus:outline-none"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex h-24 w-40 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-neutral-300 text-neutral-400 hover:border-primary-400 hover:text-primary-600 disabled:opacity-60"
        >
          {uploading ? <Loader2 size={18} aria-hidden className="animate-spin" /> : <Plus size={18} aria-hidden />}
          <span className="text-xs">{uploading ? "Uploading…" : "Add Image"}</span>
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/webp,image/svg+xml"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </div>
      <p className="mt-1.5 text-xs text-neutral-500">JPG, WebP or SVG, max 5 MB each</p>
      {error && <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>}
      {altError && (
        <p role="alert" className="mt-1.5 text-xs font-medium text-red-600">
          {altError}
        </p>
      )}
    </div>
  );
}
