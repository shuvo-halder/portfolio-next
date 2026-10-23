import * as React from "react";
import { ExternalLink, Clock, ArrowRight } from "lucide-react";
import { fetchDevToArticles } from "@/lib/devto";
import { formatDate } from "@/lib/utils";

export async function BlogSection() {
  const feed = await fetchDevToArticles();

  return (
    <section id="blog" className="py-16 md:py-24 border-t border-border/80 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 text-xs font-mono text-accent-emerald uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-accent-emerald" />
              <span>{"// 07. TECHNICAL_PUBLICATIONS"}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-foreground">
              Articles & Sysadmin Guides
            </h2>
            <p className="text-sm sm:text-base text-muted font-mono max-w-2xl">
              Published technical tutorials and production guides on Linux server automation and open-source tooling.
            </p>
          </div>

          <a
            href="https://dev.to/shuvo_h"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-md border border-border bg-surface text-xs font-mono text-muted hover:text-foreground hover:border-accent-emerald transition-colors"
          >
            <span>DEV.TO_PROFILE</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono">
          {feed.articles.map((article) => (
            <a
              key={article.id}
              href={article.url}
              target="_blank"
              rel="noreferrer"
              className="p-6 rounded-xl border border-border bg-surface hover:border-accent-emerald/60 hover:bg-surface-hover transition-all flex flex-col justify-between space-y-6 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px] text-muted">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-accent-cyan" />
                    <span>{article.reading_time_minutes} min read</span>
                  </span>
                  <span>{formatDate(article.published_timestamp)}</span>
                </div>

                <h3 className="text-base font-bold text-foreground group-hover:text-accent-emerald transition-colors leading-snug">
                  {article.title}
                </h3>

                <p className="text-xs text-muted font-sans leading-relaxed line-clamp-3">
                  {article.description}
                </p>
              </div>

              <div className="space-y-4 pt-3 border-t border-border/40">
                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 text-[10px]">
                  {article.tag_list.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded bg-surface-elevated text-accent-cyan border border-border/60"
                    >
                      #{t}
                    </span>
                  ))}
                </div>

                {/* Read Link */}
                <div className="flex items-center justify-between text-xs text-accent-emerald font-semibold pt-1">
                  <span>READ_FULL_ARTICLE</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </a>
          ))}

          {/* Upcoming Writing Placeholder Card */}
          <div className="p-6 rounded-xl border border-dashed border-border bg-surface/40 flex flex-col justify-between space-y-4 text-xs font-mono">
            <div className="space-y-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-accent-amber/15 text-accent-amber border border-accent-amber/30">
                UPCOMING_DRAFTS
              </span>
              <h3 className="text-sm font-bold text-foreground">
                Next in the Queue: SSL Hardening & Decentralized Mesh Networks
              </h3>
              <p className="text-muted font-sans leading-relaxed text-[11px]">
                Upcoming deep dives on zero-trust VPS architectures with Unix sockets and AODV dynamic routing in disaster zones.
              </p>
            </div>

            <div className="pt-2 text-[11px] text-muted">
              Published directly to dev.to/shuvo_h
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
