import { z } from "zod";

// Runs in the browser before the app becomes interactive.
//
// Zod v4 probes `new Function("")` on first use to decide whether it can
// compile faster validators. Under our strict Content-Security-Policy (no
// 'unsafe-eval') the probe is blocked — Zod falls back fine, but the browser
// still reports a CSP violation every time. jitless skips the probe.
// Server-side validation is unaffected (no CSP there, JIT stays on).
z.config({ jitless: true });
