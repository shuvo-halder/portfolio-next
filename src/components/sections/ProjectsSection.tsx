"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { featuredProjects } from "@/data/projects";
import { Icons } from "@/components/ui/Icons";

export function ProjectsSection() {
  const [filter, setFilter] = React.useState<string>("all");

  const categories = [
    { id: "all", label: "ALL_SYSTEMS (6)" },
    { id: "automation", label: "AUTOMATION" },
    { id: "security", label: "SECURITY" },
    { id: "systems", label: "SYSTEMS" },
    { id: "monitoring", label: "MONITORING" },
    { id: "networking", label: "NETWORKING" },
  ];

  const filtered = React.useMemo(() => {
    if (filter === "all") return featuredProjects;
    return featuredProjects.filter((p) => p.category === filter);
  }, [filter]);

  return (
    <section id="projects" className="py-16 md:py-24 border-t border-border/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-left">
        {/* Section Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-accent-emerald uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-accent-emerald" />
            <span>{"// 03. FEATURED_REPOSITORIES"}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-foreground">
            Production-Grade DevOps Tools
          </h2>
          <p className="text-sm sm:text-base text-muted font-mono max-w-2xl">
            Real systems utilities architected for Linux server administration, SSL lifecycle governance,
            log auditing, and decentralized networks.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 font-mono text-xs">
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setFilter(c.id)}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors border ${
                filter === c.id
                  ? "bg-accent-emerald text-background font-bold border-accent-emerald"
                  : "bg-surface text-muted hover:text-foreground border-border hover:bg-surface-hover"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filtered.map((project) => (
            <div
              key={project.slug}
              className="p-6 sm:p-8 rounded-xl border border-border bg-surface flex flex-col justify-between space-y-6 hover:border-accent-emerald/60 transition-all shadow-sm"
            >
              {/* Header: Title, Category, Language */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-surface-elevated text-accent-cyan border border-border">
                    {project.category}
                  </span>
                  <div className="flex items-center space-x-2 text-xs font-mono text-muted">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-accent-emerald" />
                    <span>{project.language}</span>
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold font-mono text-foreground">
                  {project.title}
                </h3>
                <p className="text-xs sm:text-sm text-accent-emerald font-mono font-medium">
                  {project.tagline}
                </p>
              </div>

              {/* Problem -> Solution -> Impact Breakdown */}
              <div className="space-y-3 text-xs font-sans border-y border-border/60 py-4">
                <div className="space-y-1">
                  <div className="font-mono text-[11px] font-bold text-accent-red uppercase flex items-center space-x-1.5">
                    <span>{"[PROBLEM]"}</span>
                  </div>
                  <p className="text-muted leading-relaxed pl-2 border-l border-accent-red/40">
                    {project.problem}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="font-mono text-[11px] font-bold text-accent-cyan uppercase flex items-center space-x-1.5">
                    <span>{"[ENGINEERED_SOLUTION]"}</span>
                  </div>
                  <p className="text-muted leading-relaxed pl-2 border-l border-accent-cyan/40">
                    {project.solution}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="font-mono text-[11px] font-bold text-accent-emerald uppercase flex items-center space-x-1.5">
                    <span>{"[SYSTEM_IMPACT]"}</span>
                  </div>
                  <p className="text-muted leading-relaxed pl-2 border-l border-accent-emerald/40">
                    {project.impact}
                  </p>
                </div>
              </div>

              {/* Tech Tags */}
              <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                {project.techTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded bg-surface-elevated text-muted border border-border/80"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between font-mono text-xs gap-3">
                <Link
                  href={`/projects/${project.slug}`}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-md bg-surface-elevated text-foreground hover:bg-accent-emerald hover:text-background font-semibold border border-border hover:border-accent-emerald transition-all"
                >
                  <span>ARCHITECTURE_SPEC</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-md text-muted hover:text-foreground transition-colors"
                >
                  <Icons.github className="w-4 h-4" />
                  <span>SOURCE</span>
                  <ExternalLink className="w-3 h-3 opacity-60 ml-0.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
