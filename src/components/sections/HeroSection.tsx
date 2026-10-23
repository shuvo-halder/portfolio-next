"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowDown, FileText, Mail, ExternalLink } from "lucide-react";
import { profileData } from "@/data/content";
import { InteractiveTerminal } from "@/components/terminal/InteractiveTerminal";
import { Icons } from "@/components/ui/Icons";

export function HeroSection({
  profile,
}: {
  profile?: {
    name?: string;
    headline?: string;
    availabilityStatus?: string;
    availabilityMessage?: string | null;
    resumeUrl?: string | null;
  };
} = {}) {
  const [cvNotification, setCvNotification] = React.useState(false);
  const name = profile?.name || profileData.name;
  const headline = profile?.headline || profileData.title;
  const statusMsg = profile?.availabilityMessage || 'HOST: LINUX-PRODUCTION // STATUS: ACTIVE';
  const resumeUrl = profile?.resumeUrl || '/resume.pdf';

  const handleDownloadCV = (e: React.MouseEvent) => {
    // Check if CV file exists or trigger notice
    fetch("/resume.pdf", { method: "HEAD" })
      .then((res) => {
        if (!res.ok) {
          e.preventDefault();
          setCvNotification(true);
          setTimeout(() => setCvNotification(false), 4000);
        }
      })
      .catch(() => {
        e.preventDefault();
        setCvNotification(true);
        setTimeout(() => setCvNotification(false), 4000);
      });
  };

  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-accent-emerald/5 blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline, Bio & CTAs */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* System Status Pill */}
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border border-border bg-surface text-xs font-mono text-accent-emerald shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-emerald opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-emerald"></span>
              </span>
              <span>{statusMsg}</span>
            </div>

            {/* Main Name & Title */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight font-mono text-foreground">
                {name}
              </h1>
              <p className="text-xl sm:text-2xl font-mono text-accent-cyan font-semibold">
                {headline}
              </p>
            </div>

            {/* Value Proposition */}
            <p className="text-base sm:text-lg text-muted font-sans leading-relaxed max-w-xl">
              {profileData.tagline} Focused on automation-first server orchestration, hardened web proxies,
              and resilient systems infrastructure.
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-3 py-2 font-mono">
              <div className="p-3 rounded-lg border border-border bg-surface/80">
                <div className="text-2xl font-bold text-accent-emerald">88</div>
                <div className="text-[11px] text-muted">Public Repos</div>
              </div>
              <div className="p-3 rounded-lg border border-border bg-surface/80">
                <div className="text-2xl font-bold text-accent-cyan">6</div>
                <div className="text-[11px] text-muted">Core Tools</div>
              </div>
              <div className="p-3 rounded-lg border border-border bg-surface/80">
                <div className="text-2xl font-bold text-accent-amber">100%</div>
                <div className="text-[11px] text-muted">ShellCheck Clean</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2 font-mono text-xs">
              <Link
                href="#projects"
                className="inline-flex items-center space-x-2 px-5 py-3 rounded-md bg-accent-emerald text-background font-bold hover:bg-accent-emerald/90 transition-colors shadow-lg shadow-accent-emerald/20"
              >
                <span>EXPLORE_PROJECTS</span>
                <ArrowDown className="w-4 h-4" />
              </Link>

              <a
                href={resumeUrl}
                download="Shuvo_Halder_Resume.pdf"
                onClick={handleDownloadCV}
                className="inline-flex items-center space-x-2 px-4 py-3 rounded-md border border-border bg-surface text-foreground hover:bg-surface-hover hover:border-accent-cyan transition-colors"
              >
                <FileText className="w-4 h-4 text-accent-cyan" />
                <span>DOWNLOAD_CV</span>
              </a>

              <Link
                href="#contact"
                className="inline-flex items-center space-x-2 px-4 py-3 rounded-md border border-border bg-surface text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>CONTACT</span>
              </Link>
            </div>

            {/* CV Download Notification if file is not yet placed */}
            {cvNotification && (
              <div className="p-3 rounded border border-accent-amber/40 bg-accent-amber/10 text-accent-amber text-xs font-mono">
                Resume file placeholder: please place your custom `resume.pdf` in `/public/resume.pdf` to enable direct download.
              </div>
            )}

            {/* Social Links Row */}
            <div className="flex items-center space-x-3 pt-3 text-muted text-xs font-mono">
              <span className="text-[11px] uppercase tracking-wider">{"// SOCIAL:"}</span>
              <a
                href={profileData.socials.github}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded border border-border bg-surface hover:text-accent-emerald hover:border-accent-emerald transition-colors"
                title="GitHub"
              >
                <Icons.github className="w-4 h-4" />
              </a>
              <a
                href={profileData.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded border border-border bg-surface hover:text-accent-cyan hover:border-accent-cyan transition-colors"
                title="LinkedIn"
              >
                <Icons.linkedin className="w-4 h-4" />
              </a>
              <a
                href={profileData.socials.devto}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded border border-border bg-surface hover:text-foreground hover:border-border transition-colors"
                title="Dev.to"
              >
                <Icons.devto className="w-4 h-4" />
              </a>
              <a
                href={profileData.organization.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded border border-border bg-surface hover:text-accent-emerald transition-colors text-[11px]"
              >
                <span>binrecon.io</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Terminal */}
          <div className="lg:col-span-6 w-full">
            <InteractiveTerminal />
          </div>
        </div>
      </div>
    </section>
  );
}
