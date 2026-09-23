import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { adminRoute, readJson } from "@/lib/api/admin-route";

type Params = { id: string };

const updateSchema = z.object({
  status: z.enum(["NEW", "REPLIED", "CLOSED"], "Invalid status"),
});

export const PATCH = adminRoute<Params>({ permission: "MESSAGES" }, async ({ request, params: { id } }) => {
  const { status } = await readJson(request, updateSchema);
  await prisma.contactMessage.update({ where: { id }, data: { status } });
  return NextResponse.json({ ok: true });
});

export const DELETE = adminRoute<Params>({ permission: "MESSAGES" }, async ({ params: { id } }) => {
  await prisma.contactMessage.delete({ where: { id } });
  return NextResponse.json({ ok: true });
});
