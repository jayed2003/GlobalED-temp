"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ImageIcon, Loader2, UploadCloud, X } from "lucide-react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { adminRequest } from "@/lib/admin-fetch";
import { isOriginalUpload } from "@/lib/images";
import { cn } from "@/lib/utils";

const isSvg = (url: string) => /\.svg(\?|$)/i.test(url);

/** Social networks show share images at 1.91:1; 1200 × 630 is the standard size. */
function sizeAdvice(width: number, height: number): { good: boolean; message: string } {
  const ratio = width / height;
  if (width < 600 || height < 315) {
    return { good: false, message: `${width} × ${height} px is small — it may show as a tiny thumbnail. Use at least 1200 × 630.` };
  }
  if (Math.abs(ratio - 1200 / 630) > 0.2) {
    return { good: false, message: `${width} × ${height} px will be cropped to a wide 1.91:1 frame (1200 × 630). Keep important parts centred.` };
  }
  return { good: true, message: `${width} × ${height} px — a good size for sharing.` };
}

/**
 * The image Facebook, WhatsApp, LinkedIn and X show when the post is shared.
 * Optional: without one, shares use the cover image (or the default GlobalEd
 * card when the cover is an SVG, which those sites don't display).
 */
export default function OgImageField({
  value,
  onChange,
  error,
  coverImage,
  alt,
}: {
  value: string;
  onChange: (url: string) => void;
  error?: string;
  coverImage: string;
  alt: { registration: UseFormRegisterReturn; error?: string };
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [size, setSize] = useState<{ url: string; width: number; height: number } | null>(null);

  // Measure the uploaded image to warn about sizes that crop badly.
  useEffect(() => {
    if (!value) return;
    const img = new window.Image();
    img.onload = () => setSize({ url: value, width: img.naturalWidth, height: img.naturalHeight });
    img.src = value;
    return () => {
      img.onload = null;
    };
  }, [value]);

  const upload = async (file: File) => {
    setUploadError(null);
    if (file.type === "image/svg+xml" || /\.svg$/i.test(file.name)) {
      return setUploadError("Social networks don't show SVG images — use a JPG or WebP.");
    }
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("mode", "optimized");
    const result = await adminRequest<{ url: string }>("/api/admin/upload", { formData });
    setUploading(false);
    if (!result.ok) return setUploadError(result.message);
    onChange(result.data.url);
  };

  const fallback = coverImage && !isSvg(coverImage) ? coverImage : "/share-image.png";
  const advice = value && size?.url === value ? sizeAdvice(size.width, size.height) : null;

  return (
    <div>
      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-600">OG image (social share)</p>

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
          if (file) upload(file);
        }}
        className={cn(
          "relative aspect-[1200/630] w-full overflow-hidden rounded-xl border-2 border-dashed bg-neutral-50",
          dragging ? "border-primary-500 bg-primary-50" : error ? "border-red-400" : "border-neutral-300",
        )}
      >
        {value ? (
          <>
            <Image
              src={value}
              alt="OG image preview"
              fill
              sizes="(min-width: 1024px) 600px, 100vw"
              className="object-cover"
              unoptimized={isOriginalUpload(value)}
            />
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-md bg-black/60 px-2 py-1 text-xs font-medium text-white hover:bg-black/75"
            >
              <X size={14} aria-hidden /> Remove
            </button>
          </>
        ) : (
          <>
            <Image
              src={fallback}
              alt=""
              fill
              sizes="(min-width: 1024px) 600px, 100vw"
              className="object-cover opacity-25"
              unoptimized={fallback === "/share-image.png" || isOriginalUpload(fallback)}
            />
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="flex max-w-sm flex-col items-center gap-2 rounded-lg bg-white/90 px-5 py-4 text-center shadow-sm">
                {uploading ? (
                  <Loader2 size={28} aria-hidden className="animate-spin text-primary-700" />
                ) : (
                  <ImageIcon size={28} aria-hidden className="text-neutral-500" />
                )}
                <p className="text-sm font-medium text-neutral-800">
                  {uploading
                    ? "Uploading…"
                    : fallback === coverImage
                      ? "No OG image — falls back to the cover image"
                      : "No OG image — shares use the default GlobalEd card"}
                </p>
                {!uploading && <p className="text-xs text-neutral-500">Drop an image here, or choose a file below</p>}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (file) upload(file);
          }}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-60"
        >
          {uploading ? <Loader2 size={16} aria-hidden className="animate-spin" /> : <UploadCloud size={16} aria-hidden />}
          {uploading ? "Uploading…" : value ? "Replace image" : "Choose file"}
        </button>
        <p className="text-xs text-neutral-500">JPG or WebP · 1200 × 630 px recommended · max 5 MB</p>
      </div>

      {advice && (
        <p className={cn("mt-2 text-xs", advice.good ? "text-emerald-700" : "text-amber-700")}>{advice.message}</p>
      )}
      {(uploadError || error) && (
        <p role="alert" className="mt-1.5 text-xs font-medium text-red-600">
          {uploadError || error}
        </p>
      )}

      {value && (
        <div className="mt-3">
          <label htmlFor="b-og-alt" className="mb-1 block text-xs font-medium text-primary-900">
            OG image alt text <span className="text-red-500">*</span>
          </label>
          <input
            id="b-og-alt"
            type="text"
            placeholder="Describe what the image shows"
            aria-invalid={!!alt.error}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
            {...alt.registration}
          />
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
