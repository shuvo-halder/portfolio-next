import * as React from "react";

export function GithubSectionSkeleton() {
  return (
    <section className="py-16 md:py-24 border-t border-border/80 text-left font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="space-y-2">
          <div className="h-4 w-40 bg-surface-elevated rounded animate-pulse" />
          <div className="h-8 w-72 bg-surface-elevated rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 rounded-xl border border-border bg-surface animate-pulse" />
          ))}
        </div>
        <div className="h-32 rounded-xl border border-border bg-surface animate-pulse" />
      </div>
    </section>
  );
}

export function BlogSectionSkeleton() {
  return (
    <section className="py-16 md:py-24 border-t border-border/80 text-left font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="space-y-2">
          <div className="h-4 w-40 bg-surface-elevated rounded animate-pulse" />
          <div className="h-8 w-72 bg-surface-elevated rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 rounded-xl border border-border bg-surface animate-pulse" />
          ))}
        </div>
      </div>
    </section>
  );
}
