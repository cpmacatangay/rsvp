/**
 * In-memory fixed-window rate limiter (ARCHITECTURE §10, §15: best-effort
 * per-instance guard; swap for Upstash only if a real need ever appears).
 * Keys are opaque (ip+bucket); injected clock keeps the unit test honest.
 */

type Window = {
  count: number;
  expiresAt: number;
};

export type RateLimiter = {
  /** true = allowed (and consumes), false = over the window budget */
  check: (key: string) => boolean;
};

export function createRateLimiter(
  limit: number,
  windowMs: number,
  now: () => number = Date.now,
): RateLimiter {
  const windows = new Map<string, Window>();

  return {
    check(key: string): boolean {
      const t = now();
      const found = windows.get(key);
      if (!found || found.expiresAt <= t) {
        if (windows.size > 10_000) windows.clear(); // bounded memory guard
        windows.set(key, { count: 1, expiresAt: t + windowMs });
        return true;
      }
      found.count += 1;
      return found.count <= limit;
    },
  };
}
