import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AdminShell from "@/components/admin/AdminShell";
import { getInboxCounts } from "@/lib/admin-counts";

// Admin screens are personalized/DB-backed — never statically prerendered.
export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  const inboxCounts = await getInboxCounts(session);

  return (
    <AdminShell
      name={session.user.name ?? session.user.email ?? "Admin"}
      role={session.user.role}
      permissions={session.user.permissions ?? []}
      inboxCounts={inboxCounts}
    >
      {children}
    </AdminShell>
  );
}
