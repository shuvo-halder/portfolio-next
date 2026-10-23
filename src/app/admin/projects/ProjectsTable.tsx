'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Edit2, Trash2, ExternalLink, Star, Eye } from 'lucide-react';
import { deleteProjectAction } from '@/actions/projects';

interface ProjectRow {
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
}

export function ProjectsTable({ initialProjects }: { initialProjects: ProjectRow[] }) {
  const [projects, setProjects] = useState(initialProjects);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) return;

    const res = await deleteProjectAction(id);
    if (res?.error) {
      alert(res.error);
    } else {
      setProjects(projects.filter((p) => p.id !== id));
    }
  }

  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs font-mono">
          <thead>
            <tr className="border-b border-[var(--border-subtle)] bg-[var(--surface-raised)]/60 text-[var(--muted)]">
              <th className="py-3 px-4 font-semibold">Title & Slug</th>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold">Tags</th>
              <th className="py-3 px-4 font-semibold text-center">Featured</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)]/60">
            {projects.map((p) => (
              <tr key={p.id} className="hover:bg-[var(--surface-raised)]/30 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="font-bold text-[var(--foreground)]">{p.title}</div>
                  <div className="text-[11px] text-[var(--muted)] flex items-center gap-1.5 mt-0.5">
                    <span>/{p.slug}</span>
                    {p.repoUrl && (
                      <a
                        href={p.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[var(--accent-cyan)] hover:underline inline-flex items-center gap-0.5"
                      >
                        <ExternalLink className="w-2.5 h-2.5" />
                        <span>GitHub</span>
                      </a>
                    )}
                  </div>
                </td>

                <td className="py-3.5 px-4">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono ${
                      p.status === 'PUBLISHED'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : p.status === 'DRAFT'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-slate-500/10 text-[var(--muted)]'
                    }`}
                  >
                    {p.status}
                  </span>
                </td>

                <td className="py-3.5 px-4">
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {p.tags.slice(0, 3).map(({ tag }) => (
                      <span
                        key={tag.name}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--surface-raised)] border border-[var(--border-subtle)] text-[var(--muted)]"
                      >
                        {tag.name}
                      </span>
                    ))}
                    {p.tags.length > 3 && (
                      <span className="text-[10px] text-[var(--muted)]">+{p.tags.length - 3}</span>
                    )}
                  </div>
                </td>

                <td className="py-3.5 px-4 text-center">
                  {p.featured ? (
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400 mx-auto" />
                  ) : (
                    <span className="text-[var(--muted)]/40">&mdash;</span>
                  )}
                </td>

                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      href={`/projects/${p.slug}`}
                      target="_blank"
                      className="p-1.5 rounded text-[var(--muted)] hover:text-[var(--foreground)] border border-transparent hover:border-[var(--border-subtle)] transition-colors"
                      title="View public page"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Link>

                    <Link
                      href={`/admin/projects/${p.id}/edit`}
                      className="p-1.5 rounded text-[var(--muted)] hover:text-[var(--foreground)] border border-transparent hover:border-[var(--border-subtle)] transition-colors"
                      title="Edit project"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Link>

                    <button
                      onClick={() => handleDelete(p.id, p.title)}
                      className="p-1.5 rounded text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                      title="Delete project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
