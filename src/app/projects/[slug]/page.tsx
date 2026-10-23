import * as React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ExternalLink, ShieldCheck, Cpu, Terminal, Layers } from "lucide-react";
import { featuredProjects } from "@/data/projects";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { Icons } from "@/components/ui/Icons";

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return featuredProjects.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = featuredProjects.find((p) => p.slug === slug);
  if (!project) return { title: "Project Not Found" };

  return {
    title: `${project.title} | Shuvo Halder DevOps Architecture`,
    description: project.tagline,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = featuredProjects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="py-12 md:py-20 font-mono text-left">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between text-xs text-muted pb-4 border-b border-border/80">
          <Link
            href="/#projects"
            className="inline-flex items-center space-x-2 text-muted hover:text-accent-emerald transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>RETURN_TO_SYSTEMS</span>
          </Link>
          <span className="text-[11px] uppercase tracking-wider text-accent-cyan">
            SPEC_ID: {project.slug}
          </span>
        </div>

        {/* Project Header */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider bg-surface-elevated text-accent-cyan border border-border">
              {project.category}
            </span>
            <span className="px-2.5 py-1 rounded text-[11px] font-bold bg-accent-emerald/15 text-accent-emerald border border-accent-emerald/30">
              {project.language}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            {project.title}
          </h1>

          <p className="text-base sm:text-lg text-accent-emerald font-medium leading-relaxed font-sans">
            {project.tagline}
          </p>

          <div className="pt-2 flex items-center space-x-4">
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-md bg-accent-emerald text-background font-bold text-xs hover:bg-accent-emerald/90 transition-colors shadow-md"
            >
              <Icons.github className="w-4 h-4" />
              <span>VIEW_SOURCE_CODE</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </a>
          </div>
        </div>

        {/* Architecture Section */}
        <div className="p-6 sm:p-8 rounded-xl border border-border bg-surface space-y-6">
          <div className="flex items-center space-x-2 text-accent-cyan font-bold text-sm uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            <span>{"// SUBSYSTEM_ARCHITECTURE"}</span>
          </div>

          <p className="text-sm text-muted font-sans leading-relaxed">
            {project.architecture.summary}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {project.architecture.components.map((comp) => (
              <div
                key={comp.name}
                className="p-4 rounded-lg border border-border/80 bg-surface-elevated/40 space-y-2 text-xs"
              >
                <div className="font-bold text-foreground">{comp.name}</div>
                <div className="text-[11px] text-accent-emerald">{comp.tech}</div>
                <p className="text-muted leading-relaxed font-sans text-[11px]">{comp.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Problem, Solution & System Impact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="p-6 rounded-xl border border-accent-red/30 bg-surface space-y-2">
            <div className="text-accent-red font-bold text-[11px] uppercase tracking-wider">
              {"[PROBLEM_STATEMENT]"}
            </div>
            <p className="text-muted font-sans leading-relaxed">{project.problem}</p>
          </div>

          <div className="p-6 rounded-xl border border-accent-cyan/30 bg-surface space-y-2">
            <div className="text-accent-cyan font-bold text-[11px] uppercase tracking-wider">
              {"[ENGINEERED_SOLUTION]"}
            </div>
            <p className="text-muted font-sans leading-relaxed">{project.solution}</p>
          </div>

          <div className="p-6 rounded-xl border border-accent-emerald/30 bg-surface space-y-2">
            <div className="text-accent-emerald font-bold text-[11px] uppercase tracking-wider">
              {"[SYSTEM_IMPACT]"}
            </div>
            <p className="text-muted font-sans leading-relaxed">{project.impact}</p>
          </div>
        </div>

        {/* Features & Security Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
          {/* Key Features */}
          <div className="p-6 rounded-xl border border-border bg-surface space-y-4">
            <div className="flex items-center space-x-2 text-accent-emerald font-bold text-xs uppercase tracking-wider">
              <Cpu className="w-4 h-4" />
              <span>{"// CORE_FEATURES"}</span>
            </div>
            <ul className="space-y-2.5 text-muted font-sans">
              {project.features.map((feature, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-accent-emerald font-bold font-mono">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Security & Reliability */}
          <div className="p-6 rounded-xl border border-border bg-surface space-y-4">
            <div className="flex items-center space-x-2 text-accent-amber font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>{"// SECURITY_HARDENING"}</span>
            </div>
            <ul className="space-y-2.5 text-muted font-sans">
              {project.securityHighlights.map((highlight, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-accent-amber font-bold font-mono">🔒</span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Quick Install & Run Snippet */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-muted">
            <Terminal className="w-4 h-4 text-accent-emerald" />
            <span>{"// QUICK_START_EXECUTION"}</span>
          </div>
          <CodeBlock
            code={project.installSnippet}
            language="bash"
            title={`${project.slug} ~ install & run`}
            showLineNumbers
          />
        </div>

        {/* Bottom Back Button */}
        <div className="pt-8 border-t border-border flex items-center justify-between">
          <Link
            href="/#projects"
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-md border border-border bg-surface text-foreground hover:bg-surface-elevated text-xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK_TO_HOME</span>
          </Link>
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-muted hover:text-accent-emerald transition-colors"
          >
            Star this repository on GitHub →
          </a>
        </div>
      </div>
    </div>
  );
}
