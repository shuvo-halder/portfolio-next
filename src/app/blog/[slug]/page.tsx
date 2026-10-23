import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock, Calendar, Share2 } from 'lucide-react';
import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';
import { getPostBySlug, getPublishedPosts } from '@/lib/db/queries';

export const instant = false;

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: 'Article Not Found' };
  }

  return {
    title: `${post.title} | Shuvo Halder`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt?.toISOString(),
      authors: ['Shuvo Halder'],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Parse Markdown to HTML and sanitize safely against XSS
  const rawHtml = await marked.parse(post.content);
  const cleanHtml = sanitizeHtml(rawHtml, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      'h1',
      'h2',
      'h3',
      'h4',
      'pre',
      'code',
      'span',
      'table',
      'thead',
      'tbody',
      'tr',
      'th',
      'td',
    ]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      code: ['class'],
      pre: ['class'],
      span: ['class'],
    },
  });

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="fixed inset-0 crt-grid opacity-25 pointer-events-none" />

      <article className="max-w-3xl mx-auto space-y-8 relative z-10">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--muted)] hover:text-[var(--accent-emerald)] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>cd .. (All Articles)</span>
          </Link>

          <span className="text-[10px] font-mono text-[var(--accent-emerald)] px-2 py-0.5 rounded border border-emerald-500/20 bg-emerald-500/10">
            ARTICLE // VERIFIED
          </span>
        </div>

        {/* Article Header */}
        <header className="border-b border-[var(--border-subtle)] pb-6 space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[var(--muted)]">
            {post.publishedAt && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            )}
            <span>&bull;</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {post.readingTime} min read
            </span>
            <span>&bull;</span>
            <span>By Shuvo Halder</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-mono tracking-tight text-[var(--foreground)] leading-tight">
            {post.title}
          </h1>

          <p className="text-sm font-mono text-[var(--muted)] leading-relaxed italic border-l-2 border-[var(--accent-emerald)] pl-3">
            {post.excerpt}
          </p>

          <div className="flex flex-wrap gap-1.5 pt-2">
            {post.tags.map(({ tag }) => (
              <span
                key={tag.name}
                className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-[var(--surface-raised)] border border-[var(--border-subtle)] text-[var(--accent-cyan)]"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        </header>

        {/* Content Body */}
        <div
          className="prose prose-invert max-w-none text-xs sm:text-sm font-mono leading-relaxed space-y-4 text-[var(--foreground)]/90 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:font-mono [&_h1]:text-[var(--foreground)] [&_h2]:text-xl [&_h2]:font-bold [&_h2]:font-mono [&_h2]:text-[var(--foreground)] [&_h2]:border-b [&_h2]:border-[var(--border-subtle)] [&_h2]:pb-2 [&_h2]:mt-8 [&_h3]:text-base [&_h3]:font-bold [&_h3]:font-mono [&_h3]:text-[var(--accent-emerald)] [&_h3]:mt-6 [&_pre]:p-4 [&_pre]:rounded-xl [&_pre]:bg-[var(--surface-raised)] [&_pre]:border [&_pre]:border-[var(--border-subtle)] [&_pre]:overflow-x-auto [&_code]:text-[var(--accent-cyan)] [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mt-1 [&_blockquote]:border-l-2 [&_blockquote]:border-[var(--accent-emerald)] [&_blockquote]:pl-4 [&_blockquote]:text-[var(--muted)] [&_a]:text-[var(--accent-cyan)] [&_a]:underline"
          dangerouslySetInnerHTML={{ __html: cleanHtml }}
        />

        {/* Article Footer */}
        <footer className="pt-8 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--muted)] hover:text-[var(--foreground)]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Articles</span>
          </Link>

          <Link
            href="/#contact"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-mono font-medium bg-[var(--surface-raised)] border border-[var(--border-subtle)] text-[var(--foreground)] hover:bg-[var(--surface)]"
          >
            <Share2 className="w-3.5 h-3.5 text-[var(--accent-emerald)]" />
            <span>Discuss This Topic</span>
          </Link>
        </footer>
      </article>
    </div>
  );
}
