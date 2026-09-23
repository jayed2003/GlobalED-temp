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

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "ADMIN" | "EDITOR";
    permissions: AdminPermission[];
  }
}
