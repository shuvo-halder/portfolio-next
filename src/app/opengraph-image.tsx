import { ImageResponse } from "next/og";

export const alt = "Shuvo Halder | DevOps Engineer & System Administrator";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#090d16",
          padding: "60px 80px",
          fontFamily: "monospace",
          border: "12px solid #0f172a",
        }}
      >
        {/* Top telemetry bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "8px 18px",
              borderRadius: "9999px",
              backgroundColor: "#0f172a",
              border: "1px solid #1e293b",
            }}
          >
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "9999px",
                backgroundColor: "#10b981",
              }}
            />
            <span style={{ color: "#10b981", fontSize: 18, fontWeight: 700 }}>
              HOST: LINUX-PRODUCTION // PORT: 443
            </span>
          </div>

          <div style={{ color: "#06b6d4", fontSize: 18, fontWeight: 700 }}>
            shuvo@infra-control:~$
          </div>
        </div>

        {/* Center Headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              color: "#ffffff",
              fontSize: 68,
              fontWeight: 900,
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
            }}
          >
            Shuvo Halder
          </div>
          <div
            style={{
              color: "#06b6d4",
              fontSize: 32,
              fontWeight: 700,
            }}
          >
            DevOps Engineer & System Administrator
          </div>
          <div
            style={{
              color: "#94a3b8",
              fontSize: 22,
              lineHeight: 1.4,
              maxWidth: "900px",
            }}
          >
            Engineering deterministic infrastructure, resilient automation pipelines, and hardened Linux environments.
          </div>
        </div>

        {/* Bottom stats row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            paddingTop: "24px",
            borderTop: "2px solid #1e293b",
          }}
        >
          <div style={{ display: "flex", gap: "32px" }}>
            <span style={{ color: "#10b981", fontSize: 20, fontWeight: 700 }}>
              88 Public Repositories
            </span>
            <span style={{ color: "#94a3b8", fontSize: 20 }}>·</span>
            <span style={{ color: "#38bdf8", fontSize: 20, fontWeight: 700 }}>
              Nginx & Apache Hardening
            </span>
            <span style={{ color: "#94a3b8", fontSize: 20 }}>·</span>
            <span style={{ color: "#f59e0b", fontSize: 20, fontWeight: 700 }}>
              Docker & systemd
            </span>
          </div>

          <div style={{ color: "#64748b", fontSize: 18 }}>
            shuvohalder.dev
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
