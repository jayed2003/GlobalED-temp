"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImageIcon, UploadCloud, Loader2 } from "lucide-react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { adminRequest } from "@/lib/admin-fetch";
import { isOriginalUpload, type UploadMode } from "@/lib/images";
import { cn } from "@/lib/utils";
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
  large,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  error?: string;
  alt?: AltField;
  /**
   * A big 16:9 preview that's also a drop zone (the blog cover, shown at
   * 16:9 on the site). Otherwise a small thumbnail.
   */
  large?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [mode, setMode] = useState<UploadMode>("optimized");
  const [dragging, setDragging] = useState(false);

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

  const fileInput = (
    <input
      ref={inputRef}
      type="file"
      accept="image/jpeg,image/webp,image/svg+xml"
      className="hidden"
      onChange={(e) => {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (file) handleFile(file);
      }}
    />
  );

  const uploadButton = (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      disabled={uploading}
      className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-60"
    >
      {uploading ? <Loader2 size={16} aria-hidden className="animate-spin" /> : <UploadCloud size={16} aria-hidden />}
      {uploading ? "Uploading…" : large && value ? "Replace image" : "Upload Image"}
    </button>
  );

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-primary-900">{label}</label>
      {large ? (
        <>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              const file = e.dataTransfer.files?.[0];
              if (file) handleFile(file);
            }}
            className={cn(
              "relative aspect-video w-full max-w-2xl overflow-hidden rounded-xl border-2 border-dashed bg-neutral-50",
              dragging ? "border-primary-500 bg-primary-50" : error ? "border-red-400" : "border-neutral-300",
            )}
          >
            {value && (
              <Image
                src={value}
                alt={`Preview: ${label}`}
                fill
                sizes="(min-width: 768px) 672px, 100vw"
                className="object-cover"
                unoptimized={isOriginalUpload(value)}
              />
            )}
            {(!value || uploading) && (
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="flex flex-col items-center gap-2 rounded-lg bg-white/90 px-5 py-4 text-center">
                  {uploading ? (
                    <Loader2 size={28} aria-hidden className="animate-spin text-primary-700" />
                  ) : (
                    <ImageIcon size={28} aria-hidden className="text-neutral-500" />
                  )}
                  <p className="text-sm font-medium text-neutral-800">{uploading ? "Uploading…" : "No image yet"}</p>
                  {!uploading && <p className="text-xs text-neutral-500">Drop an image here, or upload below</p>}
                </div>
              </div>
            )}
          </div>
          <div className="mt-3 flex flex-wrap items-start gap-x-4 gap-y-2">
            {fileInput}
            {uploadButton}
            <UploadModeToggle value={mode} onChange={setMode} />
          </div>
          <p className="mt-1.5 text-xs text-neutral-500">JPG, WebP or SVG, max 5 MB · shown at 16:9 (e.g. 1600 × 900 px)</p>
          {uploadError && <p className="mt-1.5 text-xs font-medium text-red-600">{uploadError}</p>}
        </>
      ) : (
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
            {fileInput}
            {uploadButton}
            <p className="mt-1.5 text-xs text-neutral-500">JPG, WebP or SVG, max 5 MB</p>
            {uploadError && <p className="mt-1.5 text-xs font-medium text-red-600">{uploadError}</p>}
          </div>
        </div>
      )}
      {error && (
        <p role="alert" className="mt-1.5 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
      {alt && (
        <div className={cn("mt-3", large && "max-w-2xl")}>
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
