import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { rateLimit, clientIp } from "./rate-limit";

// The limiter keeps state in a module-level map, so each test uses its own key.
let n = 0;
const freshKey = () => `test-key-${n++}`;

describe("rateLimit", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-24T10:00:00Z"));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("allows requests up to the limit", () => {
    const key = freshKey();
    expect(rateLimit(key, 3, 60_000).ok).toBe(true);
    expect(rateLimit(key, 3, 60_000).ok).toBe(true);
    expect(rateLimit(key, 3, 60_000).ok).toBe(true);
  });

  it("blocks the request that exceeds the limit", () => {
    const key = freshKey();
    for (let i = 0; i < 3; i++) rateLimit(key, 3, 60_000);
    expect(rateLimit(key, 3, 60_000).ok).toBe(false);
  });

  it("counts down the remaining quota", () => {
    const key = freshKey();
    expect(rateLimit(key, 3, 60_000).remaining).toBe(2);
    expect(rateLimit(key, 3, 60_000).remaining).toBe(1);
    expect(rateLimit(key, 3, 60_000).remaining).toBe(0);
  });

  it("reports retryAfter in seconds while blocked", () => {
    const key = freshKey();
    rateLimit(key, 1, 60_000);
    const blocked = rateLimit(key, 1, 60_000);
    expect(blocked.ok).toBe(false);
    expect(blocked.retryAfter).toBeGreaterThan(0);
    expect(blocked.retryAfter).toBeLessThanOrEqual(60);
  });

  it("resets once the window has passed", () => {
    const key = freshKey();
    rateLimit(key, 1, 60_000);
    expect(rateLimit(key, 1, 60_000).ok).toBe(false);

    vi.advanceTimersByTime(60_001);
    expect(rateLimit(key, 1, 60_000).ok).toBe(true);
  });

  it("tracks each key independently", () => {
    const a = freshKey();
    const b = freshKey();
    rateLimit(a, 1, 60_000);
    expect(rateLimit(a, 1, 60_000).ok).toBe(false);
    expect(rateLimit(b, 1, 60_000).ok).toBe(true);
  });
});

describe("clientIp", () => {
  const withHeaders = (h: Record<string, string>) =>
    new Request("https://example.com", { headers: h });

  it("takes the first entry of x-forwarded-for", () => {
    expect(clientIp(withHeaders({ "x-forwarded-for": "1.2.3.4, 5.6.7.8" }))).toBe(
      "1.2.3.4"
    );
  });

  it("falls back to x-real-ip", () => {
    expect(clientIp(withHeaders({ "x-real-ip": "9.9.9.9" }))).toBe("9.9.9.9");
  });

  it("returns 'unknown' when no proxy header is present", () => {
    expect(clientIp(withHeaders({}))).toBe("unknown");
  });
});
