import * as React from "react";
import { ShieldCheck, GraduationCap, Building2, Terminal, Cpu, ArrowUpRight } from "lucide-react";
import { profileData } from "@/data/content";

export function AboutSection() {
  return (
    <section id="about" className="py-16 md:py-24 border-t border-border/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="space-y-2 text-left">
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-accent-emerald uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-accent-emerald" />
            <span>{"// 01. OPERATING_PROFILE"}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-foreground">
            About & System Philosophy
          </h2>
          <p className="text-sm sm:text-base text-muted font-mono max-w-2xl">
            Engineering deterministic infrastructure where manual repetition is eliminated,
            security is non-negotiable, and failures are handled with automated recovery.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-left">
          {/* Main Bio Card (8 cols) */}
          <div className="md:col-span-8 p-6 sm:p-8 rounded-xl border border-border bg-surface flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-accent-emerald font-mono text-xs font-bold uppercase tracking-wider">
                <Terminal className="w-4 h-4" />
                <span>WHO_I_AM // SYSTEM_ENGINEER</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-mono text-foreground">
                Hi, I&apos;m Shuvo Halder — Systems Engineer & Open-Source Author.
              </h3>
              <div className="space-y-3 text-sm text-muted font-sans leading-relaxed">
                {profileData.summary.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Verification Checklist */}
            <div className="pt-4 border-t border-border/60 grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
              <div className="flex items-center space-x-2 text-foreground">
                <ShieldCheck className="w-4 h-4 text-accent-emerald shrink-0" />
                <span>Zero-Trust Hardening</span>
              </div>
              <div className="flex items-center space-x-2 text-foreground">
                <Cpu className="w-4 h-4 text-accent-cyan shrink-0" />
                <span>Deterministic Linux</span>
              </div>
              <div className="flex items-center space-x-2 text-foreground">
                <Terminal className="w-4 h-4 text-accent-amber shrink-0" />
                <span>ShellCheck Compliant</span>
              </div>
            </div>
          </div>

          {/* Education & Org Highlights (4 cols) */}
          <div className="md:col-span-4 space-y-6">
            {/* Education Card */}
            <div className="p-6 rounded-xl border border-border bg-surface space-y-4">
              <div className="flex items-center space-x-3 text-accent-cyan font-mono text-xs font-bold uppercase tracking-wider">
                <GraduationCap className="w-4 h-4" />
                <span>EDUCATION_NODE</span>
              </div>
              <div>
                <h4 className="text-lg font-bold font-mono text-foreground">
                  {profileData.education.degree} in {profileData.education.field}
                </h4>
                <p className="text-xs font-mono text-muted mt-1">
                  Status: {profileData.education.status}
                </p>
              </div>
              <p className="text-xs text-muted leading-relaxed font-sans">
                Focused on Operating Systems, Computer Networking, Distributed Protocols,
                and Low-Level Systems Administration.
              </p>
            </div>

            {/* Organization Card */}
            <div className="p-6 rounded-xl border border-border bg-surface space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 text-accent-emerald font-mono text-xs font-bold uppercase tracking-wider">
                  <Building2 className="w-4 h-4" />
                  <span>ORGANIZATION</span>
                </div>
                <a
                  href={profileData.organization.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted hover:text-accent-emerald transition-colors"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
              <div>
                <h4 className="text-lg font-bold font-mono text-foreground">
                  {profileData.organization.name}
                </h4>
                <p className="text-xs font-mono text-accent-cyan mt-0.5">
                  {profileData.organization.role}
                </p>
              </div>
              <p className="text-xs text-muted leading-relaxed font-sans">
                Active in open-source server architectures, email SaaS infrastructure, and
                decentralized communication systems.
              </p>
            </div>
          </div>
        </div>

        {/* 3 Core Operating Principles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {profileData.philosophy.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl border border-border bg-surface/70 space-y-2 hover:border-accent-emerald/50 transition-colors"
            >
              <span className="text-xs font-mono text-accent-emerald font-bold">
                0{idx + 1}. PRINCIPLE
              </span>
              <h4 className="text-base font-bold font-mono text-foreground">
                {item.title}
              </h4>
              <p className="text-xs text-muted leading-relaxed font-sans">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
