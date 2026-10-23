"use client";

import * as React from "react";
import { GitCommit, Package, CheckCircle2, ShieldAlert, Rocket, Activity, Info } from "lucide-react";

interface PipelineStep {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  devopsPrinciple: string;
  tooling: string;
  status: "active" | "success";
}

export function PipelineDiagram() {
  const [selectedStep, setSelectedStep] = React.useState<PipelineStep | null>(null);

  const steps: PipelineStep[] = [
    {
      id: "commit",
      name: "01. Commit",
      icon: GitCommit,
      description: "Git push event with semantic commit formatting and pre-commit hooks.",
      devopsPrinciple: "Version control as the sole source of truth; immutable git SHAs.",
      tooling: "Git / GitHub / Husky",
      status: "success",
    },
    {
      id: "build",
      name: "02. Build",
      icon: Package,
      description: "Multi-stage Alpine Docker build with frozen dependency locks.",
      devopsPrinciple: "Hermetic, reproducible artifact generation with layer caching.",
      tooling: "Docker / BuildKit / Turbopack",
      status: "success",
    },
    {
      id: "test",
      name: "03. Test",
      icon: CheckCircle2,
      description: "Parallel unit tests and strict ShellCheck verification for all bash code.",
      devopsPrinciple: "Fail-fast validation preventing defects from reaching runtime.",
      tooling: "Vitest / ShellCheck / ESLint",
      status: "success",
    },
    {
      id: "scan",
      name: "04. Security",
      icon: ShieldAlert,
      description: "Container vulnerability scanning and secret leak detection.",
      devopsPrinciple: "Shift-left security; zero high/critical CVEs in base images.",
      tooling: "Trivy / OWASP / Dependabot",
      status: "success",
    },
    {
      id: "deploy",
      name: "05. Deploy",
      icon: Rocket,
      description: "Automated publish to GHCR & zero-downtime rolling restart over SSH.",
      devopsPrinciple: "Immutable artifact deployment with health-checked canary verification.",
      tooling: "GHCR / systemd / Docker Compose",
      status: "active",
    },
    {
      id: "monitor",
      name: "06. Telemetry",
      icon: Activity,
      description: "Real-time health verification via /api/health and Nginx log inspection.",
      devopsPrinciple: "Continuous observability, synthetic pings, and proactive alerting.",
      tooling: "cURL / systemd timers / Nginx",
      status: "active",
    },
  ];

  return (
    <div className="w-full rounded-xl border border-border bg-surface p-6 sm:p-8 font-mono text-left transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-border/80 gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs text-accent-emerald font-semibold uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse" />
            <span>CONTINUOUS INTEGRATION & DELIVERY FLOW</span>
          </div>
          <h3 className="text-xl font-bold text-foreground">
            Deterministic Pipeline Architecture
          </h3>
        </div>
        <div className="text-xs text-muted flex items-center space-x-2 bg-surface-elevated px-3 py-1.5 rounded border border-border/60">
          <Info className="w-3.5 h-3.5 text-accent-cyan" />
          <span>Click any stage for architecture spec</span>
        </div>
      </div>

      {/* SVG Pipeline Visualization */}
      <div className="py-8 overflow-x-auto">
        <div className="min-w-[760px] flex items-center justify-between relative px-4">
          {/* Animated Connecting Pulse Line */}
          <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-1 bg-border -z-0">
            <div className="h-full bg-gradient-to-r from-accent-emerald via-accent-cyan to-accent-amber opacity-80 animate-pulse" />
          </div>

          {/* Pipeline Nodes */}
          {steps.map((step) => {
            const Icon = step.icon;
            const isSelected = selectedStep?.id === step.id;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setSelectedStep(step)}
                className={`relative z-10 flex flex-col items-center group focus:outline-none transition-transform hover:-translate-y-1 ${
                  isSelected ? "scale-105" : ""
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-xl border flex items-center justify-center transition-all shadow-md ${
                    isSelected
                      ? "border-accent-emerald bg-accent-emerald/20 text-accent-emerald ring-2 ring-accent-emerald/40"
                      : "border-border bg-surface-elevated text-foreground group-hover:border-accent-cyan group-hover:text-accent-cyan"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <span className="mt-3 text-xs font-bold text-foreground tracking-tight">
                  {step.name}
                </span>
                <span className="text-[10px] text-muted">{step.tooling.split(" / ")[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Step Inspector Card */}
      <div className="mt-4 p-4 sm:p-5 rounded-lg border border-border/80 bg-surface-elevated/60 text-xs transition-all">
        {selectedStep ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span className="text-[10px] text-muted uppercase tracking-wider block mb-1">
                {"// STAGE_NAME"}
              </span>
              <p className="font-bold text-foreground text-sm">{selectedStep.name}</p>
              <p className="text-muted mt-1">{selectedStep.description}</p>
            </div>
            <div>
              <span className="text-[10px] text-muted uppercase tracking-wider block mb-1">
                {"// DEVOPS_PRINCIPLE"}
              </span>
              <p className="text-accent-emerald font-semibold">{selectedStep.devopsPrinciple}</p>
            </div>
            <div>
              <span className="text-[10px] text-muted uppercase tracking-wider block mb-1">
                {"// TOOLING_ECOSYSTEM"}
              </span>
              <p className="text-accent-cyan font-semibold">{selectedStep.tooling}</p>
              <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] bg-accent-emerald/15 text-accent-emerald border border-accent-emerald/30 font-semibold">
                STATUS: VERIFIED
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center py-2 text-muted">
            Select a stage node above to inspect pipeline enforcement policies, tooling, and verification gates.
          </div>
        )}
      </div>
    </div>
  );
}
