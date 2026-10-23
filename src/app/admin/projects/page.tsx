import Link from 'next/link';
import { Plus, FolderGit2 } from 'lucide-react';
import { requireAdminSession } from '@/lib/auth/guard';
import { prisma } from '@/lib/db/client';
import { ProjectsTable } from './ProjectsTable';

export default async function AdminProjectsPage() {
  await requireAdminSession();

  let projects: Array<{
    id: string;
    title: string;
    slug: string;
    summary: string;
    status: string;
    featured: boolean;
    order: number;
    repoUrl: string | null;
    tags: Array<{ tag: { name: string } }>;
    createdAt: Date;
  }> = [];

  try {
    projects = await prisma.project.findMany({
      orderBy: { order: 'asc' },
      include: {
        tags: {
          include: { tag: true },
        },
      },
    });
  } catch (err) {
    console.warn('Projects query error:', err);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-mono tracking-tight text-[var(--foreground)]">
            Projects Portfolio
          </h1>
          <p className="text-xs font-mono text-[var(--muted)] mt-1">
            Manage featured sysadmin utilities, open-source repositories, and technical case studies.
          </p>
        </div>

        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-mono font-medium bg-[var(--accent-emerald)] text-slate-950 hover:bg-[var(--accent-emerald)]/90 transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Project</span>
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-[var(--border-subtle)] rounded-xl bg-[var(--surface)]">
          <FolderGit2 className="w-8 h-8 mx-auto text-[var(--muted)] mb-3 opacity-60" />
          <h3 className="text-sm font-bold font-mono text-[var(--foreground)]">No projects created yet</h3>
          <p className="text-xs font-mono text-[var(--muted)] mt-1 max-w-sm mx-auto">
            Create your first project manually or import directly from your GitHub repositories.
          </p>
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 mt-4 rounded-lg text-xs font-mono bg-[var(--surface-raised)] border border-[var(--border-subtle)] text-[var(--foreground)] hover:bg-[var(--surface)]"
          >
            <Plus className="w-3.5 h-3.5 text-[var(--accent-emerald)]" />
            <span>Create or Import Project</span>
          </Link>
        </div>
      ) : (
        <ProjectsTable initialProjects={projects} />
      )}
    </div>
  );
}
