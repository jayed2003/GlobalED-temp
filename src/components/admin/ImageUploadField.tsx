"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { UploadCloud, Loader2 } from "lucide-react";

export default function ImageUploadField({
  label,
  value,
  onChange,
  error,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  error?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setUploading(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Upload failed");
      }
      const { url } = await res.json();
      onChange(url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-primary-900">{label}</label>
      <div className="flex items-center gap-4">
        <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50">
          {value ? (
            <Image src={value} alt="" fill className="object-cover" sizes="128px" unoptimized={value.startsWith("http")} />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-neutral-400">No image</div>
          )}
        </div>
        <div>
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
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-60"
          >
            {uploading ? (
              <Loader2 size={16} aria-hidden className="animate-spin" />
            ) : (
              <UploadCloud size={16} aria-hidden />
            )}
            {uploading ? "Uploading…" : "Upload Image"}
          </button>
          <p className="mt-1.5 text-xs text-neutral-500">JPG, WebP or SVG, max 5 MB</p>
          {uploadError && <p className="mt-1.5 text-xs font-medium text-red-600">{uploadError}</p>}
        </div>
      </div>
      {error && (
        <p role="alert" className="mt-1.5 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
