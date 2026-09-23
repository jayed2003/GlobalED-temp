import type { Session } from "next-auth";
import { prisma } from "@/lib/db";

/** Unread item counts shown as sidebar badges. Only for sections the admin can open. */
export interface InboxCounts {
  leads?: number;
  messages?: number;
}

export async function getInboxCounts(session: Session): Promise<InboxCounts> {
  const isMaster = session.user.role === "ADMIN";
  const can = (p: "LEADS" | "MESSAGES") => isMaster || session.user.permissions.includes(p);
  const [leads, messages] = await Promise.all([
    can("LEADS") ? prisma.lead.count({ where: { readAt: null } }) : undefined,
    can("MESSAGES") ? prisma.contactMessage.count({ where: { readAt: null } }) : undefined,
  ]);
  return { leads, messages };
}
