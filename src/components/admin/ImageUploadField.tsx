"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { UploadCloud, Loader2 } from "lucide-react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { adminRequest } from "@/lib/admin-fetch";
import { isOriginalUpload, type UploadMode } from "@/lib/images";
import UploadModeToggle from "@/components/admin/UploadModeToggle";

/** Alt-text input shown under the image (bound with react-hook-form's register). */
interface AltField {
  id: string;
  registration: UseFormRegisterReturn;
  error?: string;
  required?: boolean;
  placeholder?: string;
}

export default function ImageUploadField({
  label,
  value,
  onChange,
  error,
  alt,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  error?: string;
  alt?: AltField;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [mode, setMode] = useState<UploadMode>("optimized");

  const handleFile = async (file: File) => {
    setUploading(true);
    setUploadError(null);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("mode", mode);
    const result = await adminRequest<{ url: string }>("/api/admin/upload", { formData });
    setUploading(false);
    if (!result.ok) return setUploadError(result.message);
    onChange(result.data.url);
  };

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-primary-900">{label}</label>
      <div className="flex items-center gap-4">
        <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50">
          {value ? (
            <Image src={value} alt={`Preview: ${label}`} fill className="object-cover" sizes="128px" unoptimized={isOriginalUpload(value)} />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-neutral-400">No image</div>
          )}
        </div>
        <div className="space-y-2">
          <UploadModeToggle value={mode} onChange={setMode} />
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
      {alt && (
        <div className="mt-3">
          <label htmlFor={alt.id} className="mb-1 block text-xs font-medium text-primary-900">
            Alt text {alt.required ? <span className="text-red-500">*</span> : <span className="text-neutral-400">(optional)</span>}
          </label>
          <input
            id={alt.id}
            type="text"
            placeholder={alt.placeholder ?? "Describe what the image shows"}
            aria-invalid={!!alt.error}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
            {...alt.registration}
          />
          <p className="mt-1 text-xs text-neutral-500">Read aloud to visitors who can&apos;t see the image, and used by search engines.</p>
          {alt.error && (
            <p role="alert" className="mt-1 text-xs font-medium text-red-600">
              {alt.error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
