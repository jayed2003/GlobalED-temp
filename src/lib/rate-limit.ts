import { Ratelimit, type Duration } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

/**
 * Rate limiting for form submissions, admin login and admin writes.
 *
 * Counters live in Upstash Redis because Vercel runs many short-lived server
 * instances — an in-memory counter on one instance means nothing to the next.
 * Upstash is added from Vercel → Storage → Marketplace, which sets either
 * KV_REST_API_URL/KV_REST_API_TOKEN or UPSTASH_REDIS_REST_URL/…_TOKEN.
 *
 * Without Redis (local dev, or before it's connected) an in-memory limiter is
 * used instead: exact on a single dev server, best-effort per instance in
 * production — and it logs a warning so the missing store gets noticed.
 * If Redis is configured but unreachable, requests are allowed through:
 * losing a real lead to a Redis outage is worse than a brief lack of limits.
 */

type Limit = { limit: number; window: Duration };

// Sized for a consultancy website: a real visitor submits a form once or
// twice; anything beyond this is a script or someone hammering the endpoint.
export const LIMITS = {
  /** Consultation / IELTS booking form, per IP */
  leadBurst: { limit: 5, window: "10 m" },
  leadDaily: { limit: 20, window: "1 d" },
  /** Contact form, per IP */
  contactBurst: { limit: 5, window: "10 m" },
  contactDaily: { limit: 20, window: "1 d" },
  /** Admin login attempts: per email+IP (guessing one account) and per IP (spraying many) */
  loginAccount: { limit: 5, window: "15 m" },
  loginIp: { limit: 20, window: "15 m" },
  /** Admin image uploads, per admin */
  upload: { limit: 30, window: "10 m" },
  /** Other admin create/update/delete calls, per admin */
  adminWrite: { limit: 60, window: "1 m" },
} satisfies Record<string, Limit>;

export type LimitName = keyof typeof LIMITS;

export interface RateLimitResult {
  success: boolean;
  /** Seconds until the caller may try again (0 when allowed). */
  retryAfter: number;
}

const redisUrl = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
const redis = redisUrl && redisToken ? new Redis({ url: redisUrl, token: redisToken }) : null;

const upstashLimiters = new Map<LimitName, Ratelimit>();
function upstashLimiter(name: LimitName): Ratelimit {
  let limiter = upstashLimiters.get(name);
  if (!limiter) {
    const { limit, window } = LIMITS[name];
    limiter = new Ratelimit({
      redis: redis!,
      limiter: Ratelimit.slidingWindow(limit, window),
      prefix: `globaled:rl:${name}`,
      timeout: 2000, // don't hold a request hostage to a slow Redis
    });
    upstashLimiters.set(name, limiter);
  }
  return limiter;
}

// --- in-memory fallback (sliding log) -------------------------------------
const memory = new Map<string, number[]>();
let warnedNoRedis = false;

function durationMs(window: Duration): number {
  const [amount, unit] = window.split(" ") as [string, string];
  const n = Number(amount);
  const factor = { ms: 1, s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 }[unit] ?? 1000;
  return n * factor;
}

function memoryLimit(name: LimitName, key: string): RateLimitResult {
  if (!warnedNoRedis && process.env.NODE_ENV === "production") {
    warnedNoRedis = true;
    console.warn("[rate-limit] Upstash Redis is not configured — using per-instance in-memory limits.");
  }
  const { limit, window } = LIMITS[name];
  const windowMs = durationMs(window);
  const now = Date.now();
  const bucketKey = `${name}:${key}`;
  const hits = (memory.get(bucketKey) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) {
    memory.set(bucketKey, hits);
    return { success: false, retryAfter: Math.max(1, Math.ceil((hits[0] + windowMs - now) / 1000)) };
  }
  hits.push(now);
  memory.set(bucketKey, hits);
  if (memory.size > 10_000) memory.clear(); // crude bound; fine for a fallback
  return { success: true, retryAfter: 0 };
}

/** Count one attempt against `name` for `key` (an IP, admin id, …). */
export async function checkRateLimit(name: LimitName, key: string): Promise<RateLimitResult> {
  if (!redis) return memoryLimit(name, key);
  try {
    const { success, reset } = await upstashLimiter(name).limit(key);
    return { success, retryAfter: success ? 0 : Math.max(1, Math.ceil((reset - Date.now()) / 1000)) };
  } catch (err) {
    console.error(`[rate-limit] Redis check failed for ${name}; allowing request`, err);
    return { success: true, retryAfter: 0 };
  }
}

/** Check several limits; the first one that is exceeded wins. */
export async function checkRateLimits(checks: [LimitName, string][]): Promise<RateLimitResult> {
  for (const [name, key] of checks) {
    const result = await checkRateLimit(name, key);
    if (!result.success) return result;
  }
  return { success: true, retryAfter: 0 };
}

/**
 * Client IP. On Vercel, x-real-ip / x-forwarded-for are set by the platform
 * edge (a client-sent value is overwritten), so they can be trusted there.
 */
export function getClientIp(headers: Headers): string {
  const real = headers.get("x-real-ip")?.trim();
  if (real) return real;
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || "unknown";
}

function waitText(seconds: number): string {
  if (seconds < 60) return `${seconds} seconds`;
  const minutes = Math.ceil(seconds / 60);
  if (minutes < 60) return minutes === 1 ? "1 minute" : `${minutes} minutes`;
  const hours = Math.ceil(minutes / 60);
  return hours === 1 ? "1 hour" : `${hours} hours`;
}

/** Standard 429 JSON response with a Retry-After header. */
export function tooManyRequests(retryAfter: number, message?: string): NextResponse {
  return NextResponse.json(
    {
      error:
        message ??
        `Too many attempts. Please try again in ${waitText(retryAfter)}, or call / WhatsApp us directly.`,
    },
    { status: 429, headers: { "Retry-After": String(retryAfter) } },
  );
}
