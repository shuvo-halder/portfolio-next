import * as React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowLeft, ExternalLink, ShieldCheck, Cpu, Terminal, Layers } from 'lucide-react';
import { getFeaturedProjects, getProjectBySlug } from '@/lib/db/queries';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { Icons } from '@/components/ui/Icons';

export const instant = false;

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const projects = await getFeaturedProjects();
  return projects.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: 'Project Not Found' };

  return {
    title: `${project.title} | Shuvo Halder DevOps Architecture`,
    description: project.summary,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const tags = project.tags.map((t) => t.tag.name);

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
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded bg-accent-emerald/10 text-accent-emerald text-xs border border-accent-emerald/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>PRODUCTION_VERIFIED</span>
            </span>
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-surface border border-border text-muted text-xs">
              <Cpu className="w-3.5 h-3.5 text-accent-cyan" />
              <span>{tags[0] || 'DevOps'}</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            {project.title}
          </h1>
          <p className="text-sm sm:text-base text-muted max-w-3xl leading-relaxed">
            {project.summary}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap gap-3 pt-2">
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-surface border border-border hover:border-accent-emerald text-xs font-semibold text-foreground transition-all hover:shadow-[0_0_15px_rgba(16,185,129,0.15)]"
              >
                <Icons.github className="w-4 h-4" />
                <span>GITHUB_REPOSITORY</span>
                <ExternalLink className="w-3 h-3 text-muted" />
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-accent-emerald text-slate-950 text-xs font-semibold hover:bg-accent-emerald/90 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
              >
                <span>DEMO_SYSTEM</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Tech Tags */}
        <div className="space-y-2">
          <div className="text-xs text-muted uppercase tracking-wider">{"// DEPLOYED_STACK"}</div>
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <span
                key={t}
                className="px-2.5 py-1 rounded-md text-xs bg-surface border border-border text-foreground"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Architectural Overview & Details */}
        <div className="space-y-6">
          <div className="inline-flex items-center space-x-2 text-xs text-accent-cyan uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            <span>{"// TECHNICAL_SPECIFICATION"}</span>
          </div>

          <div className="p-6 rounded-xl border border-border bg-surface/50 backdrop-blur space-y-4">
            <div className="text-xs text-foreground leading-relaxed whitespace-pre-wrap">
              {project.description}
            </div>
          </div>
        </div>

        {/* Quick Install Snippet if available */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center space-x-2 text-xs text-accent-emerald uppercase tracking-wider">
              <Terminal className="w-4 h-4" />
              <span>{"// QUICK_DEPLOY"}</span>
            </div>
          </div>
          <CodeBlock
            code={`# Clone repository\ngit clone ${project.repoUrl || 'https://github.com/shuvo-halder/' + project.slug}\ncd ${project.slug}\n\n# Inspect deploy commands\ncat README.md`}
            language="bash"
            title="deploy.sh"
          />
        </div>
      </div>
    </div>
  );
}
