import type { DefaultSession } from "next-auth";
import type { AdminPermission } from "@/generated/prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "ADMIN" | "EDITOR";
      permissions: AdminPermission[];
    } & DefaultSession["user"];
  }

  interface User {
    role: "ADMIN" | "EDITOR";
    permissions: AdminPermission[];
  }
}

// next-auth/jwt only re-exports this interface, so augmenting it there has no
// effect — it has to be merged where it is declared.
declare module "@auth/core/jwt" {
  interface JWT {
    id?: string;
    role?: "ADMIN" | "EDITOR";
    permissions?: AdminPermission[];
    /** Epoch ms of sign-in; the session ends 8h after this regardless of activity. */
    loginAt?: number;
  }
}
