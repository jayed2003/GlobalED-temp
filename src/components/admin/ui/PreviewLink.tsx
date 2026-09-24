import { Eye } from "lucide-react";
import { adminButton } from "./buttons";

/** Opens a site page in preview mode (drafts and scheduled posts visible) in a new tab. */
export default function PreviewLink({ path, label = "Preview" }: { path: string; label?: string }) {
  return (
    <a
      href={previewHref(path)}
      target="_blank"
      rel="noopener noreferrer"
      className={adminButton("secondary")}
    >
      <Eye size={16} aria-hidden /> {label}
    </a>
  );
}

export function previewHref(path: string): string {
  return `/api/admin/preview?path=${encodeURIComponent(path)}`;
}
