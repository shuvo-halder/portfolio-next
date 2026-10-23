import { NextResponse } from "next/server";

export async function GET() {
  const memory = process.memoryUsage();

  return NextResponse.json(
    {
      status: "healthy",
      service: "portfolio-next",
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      version: "1.0.0",
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
