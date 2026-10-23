import { describe, it, expect } from "vitest";
import { checkRateLimit } from "@/lib/rate-limit";

describe("Rate Limiter", () => {
  it("allows requests under the limit", () => {
    const testIp = `test-ip-${Date.now()}`;
    const first = checkRateLimit(testIp, 3, 5000);
    expect(first.success).toBe(true);
    expect(first.remaining).toBe(2);

    const second = checkRateLimit(testIp, 3, 5000);
    expect(second.success).toBe(true);
    expect(second.remaining).toBe(1);

    const third = checkRateLimit(testIp, 3, 5000);
    expect(third.success).toBe(true);
    expect(third.remaining).toBe(0);

    const fourth = checkRateLimit(testIp, 3, 5000);
    expect(fourth.success).toBe(false);
    expect(fourth.remaining).toBe(0);
  });
});
