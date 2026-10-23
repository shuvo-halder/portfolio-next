import * as React from "react";
import { Briefcase, Calendar, MapPin, Building, GitCommit, GraduationCap } from "lucide-react";
import { timelineItems } from "@/data/timeline";

export function ExperienceSection() {
  const getItemIcon = (type: string) => {
    switch (type) {
      case "organization":
        return <Building className="w-4 h-4 text-accent-emerald" />;
      case "open-source":
        return <GitCommit className="w-4 h-4 text-accent-cyan" />;
      case "education":
        return <GraduationCap className="w-4 h-4 text-accent-amber" />;
      default:
        return <Briefcase className="w-4 h-4 text-muted" />;
    }
  };

  return (
    <section id="timeline" className="py-16 md:py-24 border-t border-border/80 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-accent-emerald uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-accent-emerald" />
            <span>{"// 06. EXPERIENCE_&_MILESTONES"}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-foreground">
            Experience & Engineering Journey
          </h2>
          <p className="text-sm sm:text-base text-muted font-mono max-w-2xl">
            A chronological timeline of organizational roles, open-source development, and systems engineering milestones.
          </p>
        </div>

        {/* Vertical Timeline */}
        <div className="relative pl-6 sm:pl-8 border-l border-border/80 space-y-12 ml-2 sm:ml-4 font-mono">
          {timelineItems.map((item) => (
            <div key={item.id} className="relative group">
              {/* Timeline Pin Node */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-7 h-7 rounded-full border border-border bg-surface flex items-center justify-center group-hover:border-accent-emerald transition-colors shadow-sm">
                {getItemIcon(item.type)}
              </div>

              {/* Card Container */}
              <div
                className={`p-6 rounded-xl border bg-surface space-y-4 transition-all ${
                  item.isPlaceholder
                    ? "border-dashed border-border/80 bg-surface/40"
                    : "border-border hover:border-accent-emerald/60 shadow-sm"
                }`}
              >
                {/* Header: Period & Role */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{item.role}</h3>
                    <div className="text-xs text-accent-emerald font-semibold flex items-center space-x-2 mt-0.5">
                      <span>{item.organization}</span>
                      {item.location && (
                        <>
                          <span className="text-muted">·</span>
                          <span className="text-muted flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span>{item.location}</span>
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-mono bg-surface-elevated text-accent-cyan border border-border/60 self-start sm:self-center">
                    <Calendar className="w-3 h-3" />
                    <span>{item.period}</span>
                  </div>
                </div>

                {/* Description bullet list */}
                <ul className="space-y-2 text-xs font-sans text-muted leading-relaxed">
                  {item.description.map((desc, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-accent-emerald font-mono font-bold">›</span>
                      <span>{desc}</span>
                    </li>
                  ))}
                </ul>

                {/* Tech Skills Badges */}
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border/40 text-[11px]">
                  {item.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 rounded bg-surface-elevated text-muted border border-border/60"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
