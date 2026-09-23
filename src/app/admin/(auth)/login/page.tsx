import type { Metadata } from "next";
import LoginForm from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Admin Login",
};

// Only ever send the admin back inside the admin area after signing in.
function safeCallback(value: string | string[] | undefined): string {
  const url = Array.isArray(value) ? value[0] : value;
  if (!url) return "/admin";
  try {
    // Accepts a relative path or a same-site absolute URL (Auth.js uses the latter).
    const parsed = new URL(url, "http://local");
    const path = parsed.pathname + parsed.search;
    return path.startsWith("/admin") && !path.startsWith("/admin/login") ? path : "/admin";
  } catch {
    return "/admin";
  }
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const expired = params.expired === "1";

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        <h1 className="font-heading text-xl font-bold text-primary-900">GlobalEd Admin</h1>
        <p className="mt-1 text-sm text-neutral-500">Sign in to manage site content.</p>
        {expired && (
          <p role="status" className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            Your session has expired. Please sign in again.
          </p>
        )}
        <div className="mt-6">
          <LoginForm callbackUrl={safeCallback(params.callbackUrl)} />
        </div>
      </div>
    </div>
  );
}
