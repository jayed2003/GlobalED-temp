import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// eslint-config-next 16 ships native flat configs (no FlatCompat needed).
const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // Zod comes from @/lib/zod, which turns off its CSP-blocked eval probe in the browser.
    ignores: ["src/lib/zod.ts"],
    rules: {
      "no-restricted-imports": ["error", { paths: [{ name: "zod", message: 'Import { z } from "@/lib/zod" instead.' }] }],
    },
  },
  globalIgnores([
    "node_modules/**",
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "src/generated/**",
  ]),
]);

export default eslintConfig;
