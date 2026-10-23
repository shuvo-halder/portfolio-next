interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

/**
 * In-memory sliding window rate limiter.
 * @param key Unique identifier (e.g. IP address)
 * @param limit Max allowed requests
 * @param windowMs Time window in milliseconds (default 10 minutes)
 */
export function checkRateLimit(
  key: string,
  limit: number = 3,
  windowMs: number = 10 * 60 * 1000
): { success: boolean; remaining: number; resetAt: number } {
  const now = Date.now();

  // Clean old expired entries
  if (rateLimitStore.size > 1000) {
    for (const [k, record] of rateLimitStore.entries()) {
      if (record.resetAt <= now) {
        rateLimitStore.delete(k);
      }
    }
  }

  const record = rateLimitStore.get(key);

  if (!record || record.resetAt <= now) {
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });
    return {
      success: true,
      remaining: limit - 1,
      resetAt: now + windowMs,
    };
  }

  if (record.count >= limit) {
    return {
      success: false,
      remaining: 0,
      resetAt: record.resetAt,
    };
  }

  record.count += 1;
  return {
    success: true,
    remaining: limit - record.count,
    resetAt: record.resetAt,
  };
}
