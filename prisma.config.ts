import "dotenv/config";
import { defineConfig } from "prisma/config";

// Prisma 7: connection URLs and the seed command live here, not in
// schema.prisma / package.json. The CLI (migrate, db pull, studio) uses the
// direct (non-pooled) connection; the app itself connects through the pooled
// DATABASE_URL via the pg driver adapter in src/lib/db.ts.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Not env(): that throws when unset, which would break `prisma generate`
    // (postinstall) on any build machine without DB credentials.
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "",
  },
});
