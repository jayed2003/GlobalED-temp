import { NextResponse } from "next/server";
import { z } from "zod";
import { requirePermission } from "@/lib/authz";
import { prisma } from "@/lib/db";

const updateSchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "CLOSED"]),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requirePermission("LEADS");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  await prisma.lead.update({ where: { id }, data: { status: parsed.data.status } });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requirePermission("LEADS");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.lead.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
