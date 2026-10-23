import { requireAdminSession } from '@/lib/auth/guard';
import { PostForm } from '../PostForm';

export default async function NewBlogPage() {
  await requireAdminSession();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-mono tracking-tight text-[var(--foreground)]">
          Write New Article
        </h1>
        <p className="text-xs font-mono text-[var(--muted)] mt-1">
          Compose Markdown articles with live syntax-highlighted preview and custom tags.
        </p>
      </div>

      <PostForm />
    </div>
  );
}
