import { describe, it, expect } from "vitest";
import { cn, formatUptime, formatDate } from "@/lib/utils";

describe("Utility Helpers", () => {
  it("cn() merges class names and resolves tailwind collisions", () => {
    expect(cn("px-2 py-1", "bg-red-500")).toBe("px-2 py-1 bg-red-500");
    expect(cn("px-2", "px-4")).toBe("px-4");
    expect(cn("text-red-500", undefined, null, false && "hidden")).toBe("text-red-500");
  });

  it("formatUptime() formats seconds into human readable duration", () => {
    expect(formatUptime(45)).toBe("45s");
    expect(formatUptime(125)).toBe("2m 5s");
    expect(formatUptime(3665)).toBe("1h 1m 5s");
    expect(formatUptime(90065)).toBe("1d 1h 1m 5s");
  });

  it("formatDate() formats ISO dates properly", () => {
    const formatted = formatDate("2026-05-05T09:56:12Z");
    expect(formatted).toContain("2026");
    expect(formatted).toContain("May");
  });
});
