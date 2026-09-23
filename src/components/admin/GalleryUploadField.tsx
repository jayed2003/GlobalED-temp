"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Plus, Loader2, X } from "lucide-react";
import { adminRequest } from "@/lib/admin-fetch";

export default function GalleryUploadField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string[];
  onChange: (next: string[]) => void;
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
  };

  const remove = (index: number) => onChange(value.filter((_, i) => i !== index));

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-primary-900">{label}</label>
      <div className="flex flex-wrap gap-3">
        {value.map((url, index) => (
          <div key={url} className="relative h-20 w-28 overflow-hidden rounded-lg border border-neutral-200">
            <Image src={url} alt="" fill className="object-cover" sizes="112px" unoptimized={url.startsWith("http")} />
            <button
              type="button"
              onClick={() => remove(index)}
              className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
              aria-label="Remove image"
            >
              <X size={12} aria-hidden />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex h-20 w-28 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-neutral-300 text-neutral-400 hover:border-primary-400 hover:text-primary-600 disabled:opacity-60"
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
    </div>
  );
}
