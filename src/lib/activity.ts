import type { Session } from "next-auth";
import type { ActivityAction } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";

/**
 * Activity log: who changed what, and when ("Rahim updated Course 'IELTS
 * Regular' · 5 min ago"). Every admin route that changes something calls
 * logActivity() after the change succeeds; sign-ins are logged from auth.ts.
 *
 * Logging never breaks the action itself — if the write fails, the error is
 * logged on the server and the admin's change still goes through.
 */

export const ENTITY_LABELS = {
  destination: "Destination",
  course: "Course",
  blog: "Blog post",
  event: "Event",
  ielts: "IELTS content",
  testimonial: "Review",
  lead: "Lead",
  message: "Message",
  admin: "Admin account",
  page: "Page",
  settings: "Site settings",
  branch: "Branch",
  service: "Service",
  faq: "FAQ",
  team: "Team member",
  session: "Sign-in",
} as const;

export type EntityType = keyof typeof ENTITY_LABELS;

export const ACTION_LABELS: Record<ActivityAction, string> = {
  CREATED: "created",
  UPDATED: "updated",
  PUBLISHED: "published",
  UNPUBLISHED: "unpublished",
  DELETED: "deleted",
  BULK_DELETED: "deleted",
  STATUS_CHANGED: "changed the status of",
  SIGNED_IN: "signed in",
};

/** Entries are kept for a year. */
const RETENTION_MS = 365 * 24 * 60 * 60 * 1000;

interface Entry {
  action: ActivityAction;
  entityType: EntityType;
  entityId?: string | null;
  /** What the item is called, e.g. the post title (kept even after it's deleted). */
  label?: string;
  /** Extra context, e.g. "Status: Contacted" or "3 items". */
  details?: string;
}

export async function recordActivity(admin: { id: string | null; name: string }, entry: Entry): Promise<void> {
  try {
    await prisma.activityLog.create({
      data: {
        adminId: admin.id || null,
        adminName: admin.name,
        action: entry.action,
        entityType: entry.entityType,
        entityId: entry.entityId ?? null,
        entityLabel: (entry.label ?? "").slice(0, 200),
        details: (entry.details ?? "").slice(0, 200),
      },
    });
    // Occasional clean-up of entries past the retention period.
    if (Math.random() < 0.02) {
      await prisma.activityLog.deleteMany({ where: { createdAt: { lt: new Date(Date.now() - RETENTION_MS) } } });
    }
  } catch (err) {
    console.error("[activity] could not record activity", err);
  }
}

type PublishState = "DRAFT" | "PUBLISHED";

/** Log entry for a new item that can start as a draft. */
export function createdAction(state: PublishState): Pick<Entry, "action" | "details"> {
  return state === "PUBLISHED" ? { action: "PUBLISHED" } : { action: "CREATED", details: "Saved as draft" };
}

/** Log action for saving an existing item: published / unpublished when that changed. */
export function savedAction(before: PublishState, after: PublishState): ActivityAction {
  if (before === after) return "UPDATED";
  return after === "PUBLISHED" ? "PUBLISHED" : "UNPUBLISHED";
}

/** Record something the signed-in admin just did. */
export function logActivity(session: Session, entry: Entry): Promise<void> {
  return recordActivity(
    { id: session.user.id || null, name: session.user.name || session.user.email || "Admin" },
    entry,
  );
}
