'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, AlertCircle, CheckCircle2, Code2, Eye } from 'lucide-react';
import { createPostAction, updatePostAction } from '@/actions/blog';

interface PostFormData {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  status: 'PUBLISHED' | 'DRAFT' | 'SCHEDULED';
  tags: string;
}

export function PostForm({ initialData }: { initialData?: PostFormData }) {
  const router = useRouter();
  const isEditing = Boolean(initialData?.id);

  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || '');
  const [status, setStatus] = useState<'PUBLISHED' | 'DRAFT' | 'SCHEDULED'>(
    initialData?.status || 'DRAFT'
  );
  const [tags, setTags] = useState(initialData?.tags || '');

  const [previewMode, setPreviewMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function handleTitleChange(val: string) {
    setTitle(val);
    if (!isEditing && (!slug || slug === title.toLowerCase().replace(/[^a-z0-9]/g, '-'))) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]/g, '-'));
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    const fd = new FormData();
    fd.append('title', title);
    fd.append('slug', slug);
    fd.append('excerpt', excerpt);
    fd.append('content', content);
    if (coverImage) fd.append('coverImage', coverImage);
    fd.append('status', status);
    fd.append('tags', tags);

    let res;
    if (isEditing && initialData?.id) {
      res = await updatePostAction(initialData.id, null, fd);
    } else {
      res = await createPostAction(null, fd);
    }

    setSaving(false);

    if (res?.error) {
      setError(res.error);
    } else {
      setSuccess(isEditing ? 'Article updated' : 'Article created');
      router.push('/admin/blog');
      router.refresh();
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/blog"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Articles</span>
        </Link>
      </div>

      {error && (
        <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-[var(--muted)] mb-1.5">Article Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Automate Apache & Nginx Virtual Hosts in Seconds"
                className="w-full bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-xs font-mono text-[var(--foreground)] focus:border-[var(--accent-emerald)] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[var(--muted)] mb-1.5">URL Slug (Unique)</label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="automate-apache-nginx-virtual-hosts"
                className="w-full bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-xs font-mono text-[var(--foreground)] focus:border-[var(--accent-emerald)] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-[var(--muted)] mb-1.5">Short Excerpt (SEO & Cards)</label>
            <textarea
              required
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="A step-by-step breakdown of managing virtual host configs with shell automation..."
              className="w-full bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded-lg p-3 text-xs font-mono text-[var(--foreground)] focus:border-[var(--accent-emerald)] focus:outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono text-[var(--muted)] mb-1.5">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'PUBLISHED' | 'DRAFT' | 'SCHEDULED')}
                className="w-full bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-xs font-mono text-[var(--foreground)] focus:border-[var(--accent-emerald)] focus:outline-none"
              >
                <option value="DRAFT">DRAFT (Unpublished)</option>
                <option value="PUBLISHED">PUBLISHED (Public)</option>
                <option value="SCHEDULED">SCHEDULED</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-[var(--muted)] mb-1.5">Cover Image URL (Optional)</label>
              <input
                type="text"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="/uploads/..."
                className="w-full bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-xs font-mono text-[var(--foreground)] focus:border-[var(--accent-emerald)] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[var(--muted)] mb-1.5">Tags (Comma separated)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Linux, DevOps, Automation"
                className="w-full bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-xs font-mono text-[var(--foreground)] focus:border-[var(--accent-emerald)] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Content Markdown Editor */}
        <div className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--muted)]">
              Article Content (Markdown / MDX)
            </label>
            <div className="flex items-center gap-1 border border-[var(--border-subtle)] p-0.5 rounded-md bg-[var(--surface-raised)]">
              <button
                type="button"
                onClick={() => setPreviewMode(false)}
                className={`px-2.5 py-1 text-xs font-mono rounded flex items-center gap-1 transition-colors ${
                  !previewMode ? 'bg-[var(--surface)] text-[var(--foreground)] font-bold' : 'text-[var(--muted)]'
                }`}
              >
                <Code2 className="w-3 h-3" />
                <span>Write</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode(true)}
                className={`px-2.5 py-1 text-xs font-mono rounded flex items-center gap-1 transition-colors ${
                  previewMode ? 'bg-[var(--surface)] text-[var(--foreground)] font-bold' : 'text-[var(--muted)]'
                }`}
              >
                <Eye className="w-3 h-3" />
                <span>Preview</span>
              </button>
            </div>
          </div>

          {!previewMode ? (
            <textarea
              required
              rows={16}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="## Introduction&#10;&#10;Write technical explanations, code snippets, and architecture diagrams here..."
              className="w-full bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded-lg p-3 text-xs font-mono text-[var(--foreground)] focus:border-[var(--accent-emerald)] focus:outline-none font-mono leading-relaxed resize-y"
            />
          ) : (
            <div className="p-4 rounded-lg bg-[var(--surface-raised)] border border-[var(--border-subtle)] min-h-[350px] text-xs font-mono text-[var(--foreground)] whitespace-pre-wrap leading-relaxed">
              {content || <span className="text-[var(--muted)] italic">No content written yet.</span>}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <Link
            href="/admin/blog"
            className="px-4 py-2 rounded-lg text-xs font-mono text-[var(--muted)] hover:text-[var(--foreground)] border border-[var(--border-subtle)]"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-mono font-semibold bg-[var(--accent-emerald)] text-slate-950 hover:bg-[var(--accent-emerald)]/90 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : isEditing ? 'Update Article' : 'Save Article'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
