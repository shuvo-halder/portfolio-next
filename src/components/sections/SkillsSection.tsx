"use client";

import * as React from "react";
import { Cpu } from "lucide-react";
import { skillCategories } from "@/data/skills";

interface SkillItem {
  id: string;
  name: string;
  level: string;
  featured?: boolean;
  description?: string;
}

interface CategoryItem {
  id: string;
  name: string;
  description?: string;
  skills: SkillItem[];
}

export function SkillsSection({
  categories,
}: {
  categories?: CategoryItem[];
} = {}) {
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const sourceCategories = categories || (skillCategories as unknown as CategoryItem[]);

  const filterTabs = [
    { id: "all", label: "ALL_SKILLS" },
    { id: "linux-sysadmin", label: "LINUX & OS" },
    { id: "webservers-proxy", label: "WEB & PROXY" },
    { id: "containers", label: "CONTAINERS" },
    { id: "cicd-devops", label: "CI/CD & DEVOPS" },
    { id: "programming-scripting", label: "LANGUAGES" },
    { id: "security-observability", label: "SECURITY & LOGS" },
    { id: "cloud-iac-eval", label: "ROADMAP (EVAL)" },
  ];

  const displayedCategories = React.useMemo(() => {
    if (selectedCategory === "all") return sourceCategories;
    return sourceCategories.filter((c) => c.id === selectedCategory);
  }, [selectedCategory, sourceCategories]);

  const getLevelBadge = (level: string) => {
    const norm = (level || "").toLowerCase();
    switch (norm) {
      case "production":
      case "expert":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-accent-emerald/15 text-accent-emerald border border-accent-emerald/30">
            PROD
          </span>
        );
      case "advanced":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/30">
            ADVANCED
          </span>
        );
      case "intermediate":
      case "proficient":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-muted/20 text-muted border border-border">
            PROFICIENT
          </span>
        );
      case "planned":
      case "beginner":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-accent-amber/15 text-accent-amber border border-accent-amber/30">
            EVAL / ROADMAP
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-muted/20 text-muted border border-border">
            {level}
          </span>
        );
    }
  };

  return (
    <section id="skills" className="py-16 md:py-24 border-t border-border/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-left">
        {/* Section Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-accent-emerald uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-accent-emerald" />
            <span>{"// 02. TECHNICAL_TOOLBOX"}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-foreground">
            Skills & System Proficiencies
          </h2>
          <p className="text-sm sm:text-base text-muted font-mono max-w-2xl">
            Hardened Linux primitives, high-throughput reverse proxies, and automated delivery pipelines.
            All skills tagged with authentic operational maturity levels.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 font-mono text-xs">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors border ${
                selectedCategory === tab.id
                  ? "bg-accent-emerald text-background font-bold border-accent-emerald"
                  : "bg-surface text-muted hover:text-foreground border-border hover:bg-surface-hover"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Categories Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedCategories.map((cat) => (
            <div
              key={cat.id}
              className="p-6 rounded-xl border border-border bg-surface flex flex-col justify-between space-y-5 hover:border-border-subtle transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold font-mono text-foreground">
                    {cat.name}
                  </h3>
                  <Cpu className="w-4 h-4 text-accent-cyan" />
                </div>
                <p className="text-xs text-muted font-sans leading-relaxed">
                  {cat.description}
                </p>
              </div>

              {/* Skills List */}
              <div className="space-y-2 pt-2 border-t border-border/60">
                {cat.skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="flex items-center justify-between p-2 rounded-md bg-surface-elevated/40 hover:bg-surface-elevated transition-colors text-xs font-mono"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-foreground font-medium">{skill.name}</span>
                    </div>
                    <div>{getLevelBadge(skill.level)}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Legend Footnote */}
        <div className="p-4 rounded-lg border border-border bg-surface/50 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-muted">
          <div className="flex items-center space-x-4">
            <span className="font-bold text-foreground">STATUS_LEGEND:</span>
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-accent-emerald" />
              <span>PROD = Daily Production Usage</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-accent-cyan" />
              <span>ADVANCED = In-Depth Implementation</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-accent-amber" />
              <span>ROADMAP = In Active Evaluation</span>
            </span>
          </div>
          <span className="text-[11px] text-accent-emerald">ZERO_FABRICATED_METRICS</span>
        </div>
      </div>
    </section>
  );
}
