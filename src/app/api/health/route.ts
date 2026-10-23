import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";

export async function GET() {
  const memory = process.memoryUsage();
  let dbStatus = "disconnected";
  let dbLatencyMs: number | null = null;

  try {
    const start = Date.now();
    // Test connectivity with a quick 2-second timeout
    await Promise.race([
      prisma.$queryRaw`SELECT 1`,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Database ping timed out")), 2000)
      ),
    ]);
    dbLatencyMs = Date.now() - start;
    dbStatus = "connected";
  } catch (error) {
    dbStatus = error instanceof Error ? error.message : "unreachable";
  }

  const isHealthy = dbStatus === "connected";

  return NextResponse.json(
    {
      status: isHealthy ? "healthy" : "degraded",
      service: "portfolio-next",
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      database: {
        status: dbStatus,
        latencyMs: dbLatencyMs,
      },
      memory: {
        rssMB: Number((memory.rss / (1024 * 1024)).toFixed(2)),
        heapTotalMB: Number((memory.heapTotal / (1024 * 1024)).toFixed(2)),
        heapUsedMB: Number((memory.heapUsed / (1024 * 1024)).toFixed(2)),
      },
      environment: process.env.NODE_ENV || "development",
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    }
  );
}
