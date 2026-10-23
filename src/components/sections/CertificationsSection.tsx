import * as React from "react";
import Image from "next/image";
import { Award, ExternalLink, Sparkles, Code2 } from "lucide-react";
import { achievementsData } from "@/data/timeline";

export function CertificationsSection() {
  return (
    <section className="py-16 md:py-24 border-t border-border/80 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-accent-emerald uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-accent-emerald" />
            <span>{"// ACHIEVEMENTS_&_CREDENTIALS"}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-foreground">
            Badges, Achievements & Proof of Work
          </h2>
          <p className="text-sm sm:text-base text-muted font-mono max-w-2xl">
            Verified GitHub community achievements, algorithmic challenges, and open-source milestones.
          </p>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-mono">
          {achievementsData.map((item) => (
            <div
              key={item.id}
              className={`p-6 rounded-xl border bg-surface flex flex-col justify-between space-y-4 transition-all ${
                item.isPlaceholder
                  ? "border-dashed border-border/80 bg-surface/40"
                  : "border-border hover:border-accent-emerald/60 hover:bg-surface-hover shadow-sm"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  {item.badgeUrl ? (
                    <div className="relative w-12 h-12">
                      <Image
                        src={item.badgeUrl}
                        alt={item.title}
                        width={48}
                        height={48}
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  ) : item.source === "hackerrank" ? (
                    <div className="w-12 h-12 rounded-xl bg-accent-emerald/15 border border-accent-emerald/30 flex items-center justify-center text-accent-emerald">
                      <Code2 className="w-6 h-6" />
                    </div>
                  ) : item.source === "huggingface" ? (
                    <div className="w-12 h-12 rounded-xl bg-accent-amber/15 border border-accent-amber/30 flex items-center justify-center text-accent-amber">
                      <Sparkles className="w-6 h-6" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-surface-elevated border border-border flex items-center justify-center text-muted">
                      <Award className="w-6 h-6" />
                    </div>
                  )}

                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-surface-elevated text-muted border border-border/60">
                    {item.source}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-foreground">{item.title}</h3>
                  {item.tier && (
                    <span className="text-xs font-semibold text-accent-cyan">
                      Tier: {item.tier}
                    </span>
                  )}
                </div>

                <p className="text-xs text-muted font-sans leading-relaxed">
                  {item.description}
                </p>
              </div>

              {item.link && item.link !== "#" && (
                <div className="pt-2 border-t border-border/40">
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1.5 text-xs text-accent-emerald hover:underline font-semibold"
                  >
                    <span>VERIFY_RECORD</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
