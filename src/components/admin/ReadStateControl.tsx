"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { MailOpen, Mail } from "lucide-react";
import { adminRequest } from "@/lib/admin-fetch";

/**
 * Read/unread for an inbox item (lead or contact message), separate from its
 * status. Opening the detail page marks it read — done here in the browser,
 * so link prefetching in the list can never mark something read that nobody
 * actually looked at. "Mark as unread" puts the New badge back.
 */
export default function ReadStateControl({ endpoint, read }: { endpoint: string; read: boolean }) {
  const router = useRouter();
  const [isRead, setIsRead] = useState(read);
  const [error, setError] = useState<string | null>(null);
  const autoMarked = useRef(false);

  const save = async (next: boolean) => {
    setError(null);
    const result = await adminRequest(endpoint, { method: "PATCH", json: { read: next } });
    if (!result.ok) return setError(result.message);
    setIsRead(next);
    router.refresh(); // updates the sidebar/dashboard unread counts
  };

  useEffect(() => {
    if (read || autoMarked.current) return;
    autoMarked.current = true;
    void save(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <button
        type="button"
        onClick={() => save(!isRead)}
        className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
      >
        {isRead ? <Mail size={16} aria-hidden /> : <MailOpen size={16} aria-hidden />}
        {isRead ? "Mark as unread" : "Mark as read"}
      </button>
      {error && <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}
