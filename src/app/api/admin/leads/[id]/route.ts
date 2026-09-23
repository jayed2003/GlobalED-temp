import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { adminRoute, readJson } from "@/lib/api/admin-route";

type Params = { id: string };

const updateSchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "CLOSED"], "Invalid status"),
});

export const PATCH = adminRoute<Params>({ permission: "LEADS" }, async ({ request, params: { id } }) => {
  const { status } = await readJson(request, updateSchema);
  await prisma.lead.update({ where: { id }, data: { status } });
  return NextResponse.json({ ok: true });
});

export const DELETE = adminRoute<Params>({ permission: "LEADS" }, async ({ params: { id } }) => {
  await prisma.lead.delete({ where: { id } });
  return NextResponse.json({ ok: true });
});
