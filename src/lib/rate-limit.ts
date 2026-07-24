// =============================================================================
// RATE LIMITING for the AI endpoints
// =============================================================================
// The Gemini free tier has a hard quota, so the public AI routes (/api/chat and
// /api/recommend) must not be callable without limit — one abusive client could
// otherwise burn the whole daily allowance for everyone.
//
// This is a fixed-window counter kept in process memory. Trade-off, on purpose:
//   • No extra service or dependency (fits the free-tier goal of this project).
//   • On a serverless host each instance has its own memory, so the effective
//     limit is per-instance rather than global. That is still enough to stop
//     the realistic abuse case (one client hammering the endpoint in a loop).
//   • For a strict global limit, swap the store for Redis (e.g. Upstash) —
//     `rateLimit()` keeps the same signature.
// =============================================================================

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

// Drop expired buckets so the map cannot grow without bound. Runs only when the
// map gets large, so the common path stays O(1).
const MAX_TRACKED_KEYS = 10_000;
function sweep(now: number) {
  if (buckets.size < MAX_TRACKED_KEYS) return;
  for (const [key, b] of buckets) {
    if (b.resetAt <= now) buckets.delete(key);
  }
}

export type RateLimitResult = {
  ok: boolean;
  /** Requests left in the current window. */
  remaining: number;
  /** Seconds until the window resets (for the Retry-After header). */
  retryAfter: number;
};

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfter: 0 };
  }

  bucket.count++;
  const retryAfter = Math.ceil((bucket.resetAt - now) / 1000);
  if (bucket.count > limit) {
    return { ok: false, remaining: 0, retryAfter };
  }
  return { ok: true, remaining: limit - bucket.count, retryAfter };
}

// Best-effort client IP. Behind Vercel/most proxies `x-forwarded-for` holds the
// original client first; fall back to a shared key so a missing header still
// gets limited rather than bypassing the check entirely.
export function clientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}

// Convenience wrapper: builds the key from the route name + caller IP.
export function limitByIp(
  req: Request,
  route: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  return rateLimit(`${route}:${clientIp(req)}`, limit, windowMs);
}
