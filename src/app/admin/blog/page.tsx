import Link from 'next/link';
import { Plus, FileText } from 'lucide-react';
import { requireAdminSession } from '@/lib/auth/guard';
import { prisma } from '@/lib/db/client';
import { PostsTable } from './PostsTable';

export default async function AdminBlogPage() {
  await requireAdminSession();

  let posts: Array<{
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    status: string;
    readingTime: number;
    publishedAt: Date | null;
    tags: Array<{ tag: { name: string } }>;
  }> = [];

  try {
    posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        tags: {
          include: { tag: true },
        },
      },
    });
  } catch (err) {
    console.warn('Blog posts query error:', err);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-mono tracking-tight text-[var(--foreground)]">
            Articles & Documentation (Blog)
          </h1>
          <p className="text-xs font-mono text-[var(--muted)] mt-1">
            Author and publish technical tutorials, post-mortems, and Linux systems architecture write-ups.
          </p>
        </div>

        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-mono font-medium bg-[var(--accent-emerald)] text-slate-950 hover:bg-[var(--accent-emerald)]/90 transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Article</span>
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-[var(--border-subtle)] rounded-xl bg-[var(--surface)]">
          <FileText className="w-8 h-8 mx-auto text-[var(--muted)] mb-3 opacity-60" />
          <h3 className="text-sm font-bold font-mono text-[var(--foreground)]">No articles authored yet</h3>
          <p className="text-xs font-mono text-[var(--muted)] mt-1 max-w-sm mx-auto">
            Share technical deep-dives on bash orchestration, Nginx tuning, and zero-trust VPS architectures.
          </p>
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 mt-4 rounded-lg text-xs font-mono bg-[var(--surface-raised)] border border-[var(--border-subtle)] text-[var(--foreground)] hover:bg-[var(--surface)]"
          >
            <Plus className="w-3.5 h-3.5 text-[var(--accent-emerald)]" />
            <span>Write New Article</span>
          </Link>
        </div>
      ) : (
        <PostsTable initialPosts={posts} />
      )}
    </div>
  );
}
