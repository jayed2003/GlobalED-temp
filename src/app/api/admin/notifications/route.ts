import { NextResponse } from "next/server";
import { adminRoute } from "@/lib/api/admin-route";
import { getInboxCounts } from "@/lib/admin-counts";

// Polled by the admin sidebar badges; never cache.
export const dynamic = "force-dynamic";

export const GET = adminRoute({ anyAdmin: true }, async ({ session }) => {
  const counts = await getInboxCounts(session);
  return NextResponse.json(counts, { headers: { "Cache-Control": "no-store" } });
});
