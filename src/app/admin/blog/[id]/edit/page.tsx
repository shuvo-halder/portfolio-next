import { notFound } from 'next/navigation';
import { requireAdminSession } from '@/lib/auth/guard';
import { prisma } from '@/lib/db/client';
import { PostForm } from '../../PostForm';

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  await requireAdminSession();
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      tags: {
        include: { tag: true },
      },
    },
  });

  if (!post) {
    notFound();
  }

  const formData = {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    coverImage: post.coverImage,
    status: post.status as 'PUBLISHED' | 'DRAFT' | 'SCHEDULED',
    tags: post.tags.map((t) => t.tag.name).join(', '),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-mono tracking-tight text-[var(--foreground)]">
          Edit Article: {post.title}
        </h1>
        <p className="text-xs font-mono text-[var(--muted)] mt-1">
          Update article content, publication status, reading time, and topic metadata.
        </p>
      </div>

      <PostForm initialData={formData} />
    </div>
  );
}
