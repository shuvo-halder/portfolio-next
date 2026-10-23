import { describe, it, expect } from "vitest";
import { LocalStorageAdapter } from "@/lib/storage/local";

describe("LocalStorageAdapter Security & Validation", () => {
  const adapter = new LocalStorageAdapter();

  it("generates correct public URLs using safe basenames", () => {
    const url = adapter.getUrl("avatar-123.webp");
    expect(url).toBe("/uploads/avatar-123.webp");

    // Prevents path traversal
    const safeUrl = adapter.getUrl("../../../etc/passwd");
    expect(safeUrl).toBe("/uploads/passwd");
  });

  it("rejects unsupported MIME types", async () => {
    const fakeExeBuffer = Buffer.from("MZ");
    await expect(
      adapter.upload(fakeExeBuffer, "malicious.exe", "application/x-msdownload")
    ).rejects.toThrow(/Unsupported file type/);
  });

  it("rejects dangerous file extensions", async () => {
    const scriptBuffer = Buffer.from("echo evil");
    await expect(
      adapter.upload(scriptBuffer, "exploit.sh", "image/png")
    ).rejects.toThrow(/Disallowed file extension/);
  });

  it("rejects images exceeding 5MB size limit", async () => {
    // 6MB buffer
    const largeBuffer = Buffer.alloc(6 * 1024 * 1024);
    await expect(
      adapter.upload(largeBuffer, "huge-photo.jpg", "image/jpeg")
    ).rejects.toThrow(/exceeds limit/);
  });
});
