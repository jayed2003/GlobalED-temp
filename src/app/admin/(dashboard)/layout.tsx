import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AdminShell from "@/components/admin/AdminShell";

// Admin screens are personalized/DB-backed — never statically prerendered.
export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  return (
    <AdminShell
      name={session.user.name ?? session.user.email ?? "Admin"}
      role={session.user.role}
      permissions={session.user.permissions ?? []}
    >
      {children}
    </AdminShell>
  );
}
