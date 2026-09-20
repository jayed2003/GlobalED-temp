import type { Metadata } from "next";
import LoginForm from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Admin Login",
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        <h1 className="font-heading text-xl font-bold text-primary-900">GlobalEd Admin</h1>
        <p className="mt-1 text-sm text-neutral-500">Sign in to manage site content.</p>
        <div className="mt-6">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
