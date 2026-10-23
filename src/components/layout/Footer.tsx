"use client";

import * as React from "react";
import { ArrowUp, Mail, ExternalLink, Terminal, ShieldCheck } from "lucide-react";
import { Icons } from "@/components/ui/Icons";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const socials = [
    { name: "GitHub", href: "https://github.com/shuvo-halder", icon: Icons.github },
    { name: "LinkedIn", href: "https://www.linkedin.com/in/shuvo-halder/", icon: Icons.linkedin },
    { name: "Dev.to", href: "https://dev.to/shuvo_h", icon: Icons.devto },
    { name: "HackerRank", href: "https://www.hackerrank.com/profile/shuvohalder_1331", icon: Icons.hackerrank },
    { name: "Email", href: "mailto:shuvo-halder@outlook.com", icon: Mail },
  ];

  return (
    <footer className="w-full border-t border-border bg-surface/60 backdrop-blur-sm transition-colors text-xs font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Identity & Mission */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2 text-foreground font-bold">
              <Terminal className="w-4 h-4 text-accent-emerald" />
              <span>{"Shuvo Halder // DevOps & Systems Engineer"}</span>
            </div>
            <p className="text-muted leading-relaxed max-w-md">
              Specialized in deterministic infrastructure, production Linux server automation,
              hardened reverse proxy topologies, and resilient system architecture.
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-muted">
              <ShieldCheck className="w-3.5 h-3.5 text-accent-emerald" />
              <span>Zero-trust design · Defense in depth · Idempotent Bash</span>
            </div>
          </div>

          {/* Quick Connect Links */}
          <div className="space-y-3">
            <span className="text-foreground font-semibold tracking-wider text-[11px] uppercase">
              {"// TELEMETRY_LINKS"}
            </span>
            <ul className="space-y-1.5 text-muted">
              {socials.slice(0, 4).map((s) => {
                const IconComponent = s.icon;
                return (
                  <li key={s.name}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-accent-emerald hover:underline flex items-center space-x-2 transition-colors"
                    >
                      <IconComponent className="w-3.5 h-3.5 opacity-80" />
                      <span>{s.name}</span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-40 ml-0.5" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* System & Architecture Meta */}
          <div className="space-y-3">
            <span className="text-foreground font-semibold tracking-wider text-[11px] uppercase">
              {"// REPO_SPEC"}
            </span>
            <ul className="space-y-1.5 text-muted text-[11px]">
              <li>Next.js (App Router, Turbopack)</li>
              <li>TypeScript Strict · Tailwind CSS</li>
              <li>Multi-Stage Alpine Docker Container</li>
              <li>Automated CI/CD via GitHub Actions</li>
              <li className="text-accent-emerald font-semibold">
                <a href="/api/health" target="_blank" className="hover:underline flex items-center space-x-1">
                  <span>GET /api/health</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-muted text-[11px]">
          <div>
            © 2026 Shuvo Halder. Built for high reliability and zero downtime.
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded border border-border bg-surface hover:bg-surface-hover hover:text-accent-emerald transition-colors"
          >
            <span>BACK_TO_TOP</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
