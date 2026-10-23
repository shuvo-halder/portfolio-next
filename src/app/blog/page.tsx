import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Clock, Calendar, FileText, ChevronRight } from 'lucide-react';
import { getPublishedPosts } from '@/lib/db/queries';

export const instant = false;

export const metadata: Metadata = {
  title: 'Blog & Systems Engineering Notes | Shuvo Halder',
  description: 'Technical articles, shell automation deep-dives, Linux server hardening guides, and systems telemetry architecture.',
};

export default async function PublicBlogPage() {
  const posts = await getPublishedPosts();

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="fixed inset-0 crt-grid opacity-25 pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--muted)] hover:text-[var(--accent-emerald)] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>cd .. (Return to Portfolio)</span>
          </Link>
        </div>

        {/* Section Header */}
        <div className="border-b border-[var(--border-subtle)] pb-6">
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent-emerald)] mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>cat /var/log/engineering-notes.md</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-[var(--foreground)]">
            Systems & Infrastructure Notes
          </h1>
          <p className="text-xs sm:text-sm font-mono text-[var(--muted)] mt-2 leading-relaxed">
            In-depth guides on Linux daemon supervision, Nginx reverse proxy performance tuning, Let&apos;s Encrypt lifecycle automation, and reproducible sysadmin tooling.
          </p>
        </div>

        {/* Posts Stream */}
        {posts.length === 0 ? (
          <div className="p-12 text-center rounded-xl border border-dashed border-[var(--border-subtle)] bg-[var(--surface)]">
            <FileText className="w-10 h-10 mx-auto text-[var(--muted)] mb-3 opacity-50" />
            <h3 className="text-sm font-bold font-mono text-[var(--foreground)]">No articles published yet</h3>
            <p className="text-xs font-mono text-[var(--muted)] mt-1">
              Articles and engineering post-mortems will appear here once published from the admin panel.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <article
                key={post.id}
                className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] hover:border-[var(--accent-emerald)]/50 transition-all group"
              >
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2">
                  <div className="flex items-center gap-3 text-[11px] font-mono text-[var(--muted)]">
                    {post.publishedAt && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.publishedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readingTime} min read
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.map(({ tag }) => (
                      <span
                        key={tag.name}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--surface-raised)] border border-[var(--border-subtle)] text-[var(--accent-cyan)]"
                      >
                        #{tag.name}
                      </span>
                    ))}
                  </div>
                </div>

                <h2 className="text-lg sm:text-xl font-bold font-mono text-[var(--foreground)] group-hover:text-[var(--accent-emerald)] transition-colors">
                  <Link href={`/blog/${post.slug}`} className="hover:underline">
                    {post.title}
                  </Link>
                </h2>

                <p className="text-xs font-mono text-[var(--muted)] mt-2 leading-relaxed">
                  {post.excerpt}
                </p>

                <div className="mt-4 pt-4 border-t border-[var(--border-subtle)]/50 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[var(--muted)]/60">
                    slug: /{post.slug}
                  </span>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-mono text-[var(--accent-emerald)] hover:underline"
                  >
                    <span>Read Article</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
