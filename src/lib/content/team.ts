import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import type { TeamMember } from "@/types";

/** The Our Team page (Admin → Team): Board of Directors and staff, in order. */
export const getTeam = unstable_cache(
  async (): Promise<{ board: TeamMember[]; team: TeamMember[] }> => {
    const rows = await prisma.teamMember.findMany({
      where: { shown: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
    const toMember = (r: (typeof rows)[number]): TeamMember => ({
      name: r.name,
      designation: r.role,
      photo: r.photo,
      photoAlt: r.photoAlt,
      bio: r.bio || undefined,
    });
    return {
      board: rows.filter((r) => r.group === "BOARD").map(toMember),
      team: rows.filter((r) => r.group === "TEAM").map(toMember),
    };
  },
  ["team"],
  { tags: ["team"] },
);
