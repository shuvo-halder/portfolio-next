'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Edit2, Trash2, Eye, Clock, Calendar } from 'lucide-react';
import { deletePostAction } from '@/actions/blog';

interface PostRow {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  status: string;
  readingTime: number;
  publishedAt: Date | null;
  tags: Array<{ tag: { name: string } }>;
}

export function PostsTable({ initialPosts }: { initialPosts: PostRow[] }) {
  const [posts, setPosts] = useState(initialPosts);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Are you sure you want to delete article "${title}"?`)) return;

    const res = await deletePostAction(id);
    if (res?.error) {
      alert(res.error);
    } else {
      setPosts(posts.filter((p) => p.id !== id));
    }
  }

  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs font-mono">
          <thead>
            <tr className="border-b border-[var(--border-subtle)] bg-[var(--surface-raised)]/60 text-[var(--muted)]">
              <th className="py-3 px-4 font-semibold">Title & Excerpt</th>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold">Tags</th>
              <th className="py-3 px-4 font-semibold">Read Time</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)]/60">
            {posts.map((p) => (
              <tr key={p.id} className="hover:bg-[var(--surface-raised)]/30 transition-colors">
                <td className="py-3.5 px-4 max-w-sm">
                  <div className="font-bold text-[var(--foreground)] truncate">{p.title}</div>
                  <div className="text-[11px] text-[var(--muted)] truncate mt-0.5">{p.excerpt}</div>
                  <div className="text-[10px] text-[var(--muted)]/60 mt-1 flex items-center gap-2">
                    <span>/{p.slug}</span>
                    {p.publishedAt && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-2.5 h-2.5" />
                        {new Date(p.publishedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </td>

                <td className="py-3.5 px-4">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono ${
                      p.status === 'PUBLISHED'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : p.status === 'SCHEDULED'
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
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
                  </div>
                </td>

                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-1 text-[var(--muted)]">
                    <Clock className="w-3 h-3" />
                    <span>{p.readingTime} min</span>
                  </span>
                </td>

                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      href={`/blog/${p.slug}`}
                      target="_blank"
                      className="p-1.5 rounded text-[var(--muted)] hover:text-[var(--foreground)] border border-transparent hover:border-[var(--border-subtle)] transition-colors"
                      title="View public article"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Link>

                    <Link
                      href={`/admin/blog/${p.id}/edit`}
                      className="p-1.5 rounded text-[var(--muted)] hover:text-[var(--foreground)] border border-transparent hover:border-[var(--border-subtle)] transition-colors"
                      title="Edit article"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Link>

                    <button
                      onClick={() => handleDelete(p.id, p.title)}
                      className="p-1.5 rounded text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                      title="Delete article"
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
