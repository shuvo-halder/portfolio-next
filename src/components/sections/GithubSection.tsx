import * as React from "react";
import { Star, GitFork, ExternalLink, Activity, FolderGit2 } from "lucide-react";
import { fetchGitHubTelemetry } from "@/lib/github";

export async function GithubSection() {
  const telemetry = await fetchGitHubTelemetry();

  return (
    <section id="activity" className="py-16 md:py-24 border-t border-border/80 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 text-xs font-mono text-accent-emerald uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-accent-emerald" />
              <span>{"// 05. GITHUB_TELEMETRY"}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-foreground">
              Live GitHub Activity & Codebase Metrics
            </h2>
            <p className="text-sm sm:text-base text-muted font-mono max-w-2xl">
              Real-time telemetry aggregated from the GitHub REST API with 1-hour Incremental Static Regeneration.
            </p>
          </div>

          <div className="flex items-center space-x-2 font-mono text-xs">
            <span className="px-3 py-1.5 rounded-full border border-border bg-surface text-muted flex items-center space-x-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  telemetry.isFallback ? "bg-accent-amber" : "bg-accent-emerald"
                }`}
              />
              <span>
                {telemetry.isFallback ? "CACHE: STATIC_SNAPSHOT" : "FEED: GITHUB_API_V3 (ISR)"}
              </span>
            </span>
          </div>
        </div>

        {/* Top 4 Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
          <div className="p-5 rounded-xl border border-border bg-surface space-y-1">
            <div className="text-xs text-muted">PUBLIC_REPOSITORIES</div>
            <div className="text-3xl font-extrabold text-foreground">
              {telemetry.stats.totalRepos}
            </div>
            <div className="text-[11px] text-accent-emerald">88 Active Open-Source Units</div>
          </div>

          <div className="p-5 rounded-xl border border-border bg-surface space-y-1">
            <div className="text-xs text-muted">TOTAL_STARGAZERS</div>
            <div className="text-3xl font-extrabold text-accent-amber">
              {telemetry.stats.totalStars}
            </div>
            <div className="text-[11px] text-muted">Community Endorsements</div>
          </div>

          <div className="p-5 rounded-xl border border-border bg-surface space-y-1">
            <div className="text-xs text-muted">TOTAL_FORKS</div>
            <div className="text-3xl font-extrabold text-accent-cyan">
              {telemetry.stats.totalForks}
            </div>
            <div className="text-[11px] text-muted">Upstream Clones & Derivations</div>
          </div>

          <div className="p-5 rounded-xl border border-border bg-surface space-y-1">
            <div className="text-xs text-muted">GITHUB_FOLLOWERS</div>
            <div className="text-3xl font-extrabold text-foreground">
              {telemetry.stats.followers}
            </div>
            <div className="text-[11px] text-accent-emerald">Active Network</div>
          </div>
        </div>

        {/* Language Distribution Breakdown Bar */}
        <div className="p-6 rounded-xl border border-border bg-surface space-y-4 font-mono">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-foreground uppercase tracking-wider flex items-center space-x-2">
              <Activity className="w-4 h-4 text-accent-emerald" />
              <span>{"// CODEBASE_LANGUAGE_DISTRIBUTION"}</span>
            </span>
            <span className="text-muted text-[11px]">Aggregated across all 88 repos</span>
          </div>

          {/* Visual Percentage Segment Bar */}
          <div className="w-full h-3 rounded-full overflow-hidden flex bg-surface-elevated">
            {telemetry.languages.map((lang) => (
              <div
                key={lang.name}
                style={{
                  width: `${lang.percentage}%`,
                  backgroundColor: lang.color || "#10b981",
                }}
                title={`${lang.name}: ${lang.percentage}% (${lang.count} repos)`}
                className="h-full transition-all"
              />
            ))}
          </div>

          {/* Language Legend Tags */}
          <div className="flex flex-wrap gap-4 pt-2 text-xs">
            {telemetry.languages.map((lang) => (
              <div key={lang.name} className="flex items-center space-x-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: lang.color || "#10b981" }}
                />
                <span className="text-foreground font-semibold">{lang.name}</span>
                <span className="text-muted text-[11px]">{lang.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Highlighted Repositories Grid */}
        <div className="space-y-4 font-mono">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted uppercase tracking-wider font-bold flex items-center space-x-2">
              <FolderGit2 className="w-4 h-4 text-accent-cyan" />
              <span>{"// HIGHLIGHTED_REPOSITORIES"}</span>
            </span>
            <a
              href="https://github.com/shuvo-halder?tab=repositories"
              target="_blank"
              rel="noreferrer"
              className="text-accent-emerald hover:underline flex items-center space-x-1"
            >
              <span>VIEW_ALL_88_ON_GITHUB</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {telemetry.topRepos.map((repo) => (
              <a
                key={repo.name}
                href={repo.url}
                target="_blank"
                rel="noreferrer"
                className="p-5 rounded-xl border border-border bg-surface hover:border-accent-emerald/60 hover:bg-surface-hover transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-foreground group-hover:text-accent-emerald transition-colors truncate">
                      {repo.name}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-xs text-muted line-clamp-2 font-sans leading-relaxed">
                    {repo.description}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-muted pt-2 border-t border-border/40">
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center space-x-1 text-accent-amber">
                      <Star className="w-3.5 h-3.5" />
                      <span>{repo.stars}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <GitFork className="w-3.5 h-3.5" />
                      <span>{repo.forks}</span>
                    </span>
                  </div>
                  <span className="text-[11px] text-accent-cyan font-bold">{repo.language}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
