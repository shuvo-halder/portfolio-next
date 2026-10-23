import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "@/lib/auth/session";

describe("Authentication Utilities", () => {
  it("successfully hashes and verifies passwords using bcrypt", async () => {
    const plainText = "MySuperSecurePassword123!";
    const hash = await hashPassword(plainText);

    expect(hash).toBeDefined();
    expect(hash.startsWith("$2")).toBe(true); // bcrypt signature
    expect(hash).not.toEqual(plainText);

    const isValid = await verifyPassword(plainText, hash);
    expect(isValid).toBe(true);

    const isInvalid = await verifyPassword("WrongPassword456!", hash);
    expect(isInvalid).toBe(false);
  });
});
