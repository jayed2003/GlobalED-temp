import { z } from "zod";

/**
 * Zod for the whole app — import `z` from here, not from "zod".
 *
 * In the browser, Zod v4 probes `new Function("")` on first use to decide
 * whether it can compile faster validators. Under our strict
 * Content-Security-Policy (no 'unsafe-eval') the probe is blocked — Zod falls
 * back fine, but the browser still reports a CSP violation every time.
 * jitless skips the probe. Server-side validation is unaffected (no CSP
 * there, JIT stays on).
 *
 * This used to live in instrumentation-client.ts, which put all of Zod
 * (~90 KB compressed) into every page's JavaScript; here it only loads with
 * the forms that use it.
 */
if (typeof window !== "undefined") z.config({ jitless: true });

export { z };
