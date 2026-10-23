'use server';

import { PostStatus } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '@/lib/db/client';
import { requireAdminSession } from '@/lib/auth/guard';
import { invalidateCache } from '@/lib/db/cache';

const postSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  excerpt: z.string().min(1, 'Excerpt is required'),
  content: z.string().min(1, 'Content is required'),
  coverImage: z.string().optional().nullable(),
  status: z.nativeEnum(PostStatus).default(PostStatus.DRAFT),
  tags: z.string().optional(),
});

function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export async function createPostAction(_prevState: unknown, formData: FormData) {
  const session = await requireAdminSession();

  const raw = {
    title: formData.get('title'),
    slug: formData.get('slug'),
    excerpt: formData.get('excerpt'),
    content: formData.get('content'),
    coverImage: formData.get('coverImage') || null,
    status: (formData.get('status') as PostStatus) || PostStatus.DRAFT,
    tags: formData.get('tags') || '',
  };

  const parsed = postSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || 'Validation failed' };
  }

  const readingTime = calculateReadingTime(parsed.data.content);
  const publishedAt = parsed.data.status === PostStatus.PUBLISHED ? new Date() : null;

  try {
    const post = await prisma.post.create({
      data: {
        title: parsed.data.title,
        slug: parsed.data.slug,
        excerpt: parsed.data.excerpt,
        content: parsed.data.content,
        coverImage: parsed.data.coverImage,
        status: parsed.data.status,
        readingTime,
        publishedAt,
      },
    });

    if (parsed.data.tags) {
      const tagList = parsed.data.tags.split(',').map((t) => t.trim()).filter(Boolean);
      for (const tagName of tagList) {
        const tagSlug = tagName.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const tag = await prisma.tag.upsert({
          where: { slug: tagSlug },
          update: { name: tagName },
          create: { name: tagName, slug: tagSlug },
        });

        await prisma.postTag.create({
          data: { postId: post.id, tagId: tag.id },
        }).catch(() => {});
      }
    }

    invalidateCache('posts', '/');
    invalidateCache(`posts:${post.slug}`, `/blog/${post.slug}`);

    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: 'CREATE',
        entity: 'Post',
        entityId: post.id,
        details: { title: post.title, slug: post.slug },
      },
    }).catch(() => {});

    return { success: 'Post created successfully', slug: post.slug };
  } catch (err: unknown) {
    console.error('Create post error:', err);
    return { error: 'Failed to create post (slug must be unique).' };
  }
}

export async function updatePostAction(id: string, _prevState: unknown, formData: FormData) {
  const session = await requireAdminSession();

  const raw = {
    title: formData.get('title'),
    slug: formData.get('slug'),
    excerpt: formData.get('excerpt'),
    content: formData.get('content'),
    coverImage: formData.get('coverImage') || null,
    status: (formData.get('status') as PostStatus) || PostStatus.DRAFT,
    tags: formData.get('tags') || '',
  };

  const parsed = postSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || 'Validation failed' };
  }

  const readingTime = calculateReadingTime(parsed.data.content);

  try {
    const existing = await prisma.post.findUnique({ where: { id } });
    const publishedAt =
      parsed.data.status === PostStatus.PUBLISHED
        ? existing?.publishedAt || new Date()
        : null;

    const post = await prisma.post.update({
      where: { id },
      data: {
        title: parsed.data.title,
        slug: parsed.data.slug,
        excerpt: parsed.data.excerpt,
        content: parsed.data.content,
        coverImage: parsed.data.coverImage,
        status: parsed.data.status,
        readingTime,
        publishedAt,
      },
    });

    if (parsed.data.tags !== undefined) {
      await prisma.postTag.deleteMany({ where: { postId: id } });
      const tagList = parsed.data.tags.split(',').map((t) => t.trim()).filter(Boolean);
      for (const tagName of tagList) {
        const tagSlug = tagName.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const tag = await prisma.tag.upsert({
          where: { slug: tagSlug },
          update: { name: tagName },
          create: { name: tagName, slug: tagSlug },
        });

        await prisma.postTag.create({
          data: { postId: id, tagId: tag.id },
        }).catch(() => {});
      }
    }

    invalidateCache('posts', '/');
    invalidateCache(`posts:${post.slug}`, `/blog/${post.slug}`);

    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: 'UPDATE',
        entity: 'Post',
        entityId: post.id,
        details: { title: post.title, slug: post.slug },
      },
    }).catch(() => {});

    return { success: 'Post updated successfully' };
  } catch (err: unknown) {
    console.error('Update post error:', err);
    return { error: 'Failed to update post.' };
  }
}

export async function deletePostAction(id: string) {
  const session = await requireAdminSession();

  try {
    const deleted = await prisma.post.delete({ where: { id } });

    invalidateCache('posts', '/');
    invalidateCache(`posts:${deleted.slug}`, `/blog/${deleted.slug}`);

    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: 'DELETE',
        entity: 'Post',
        entityId: id,
        details: { title: deleted.title },
      },
    }).catch(() => {});

    return { success: 'Post deleted' };
  } catch (err: unknown) {
    console.error('Delete post error:', err);
    return { error: 'Failed to delete post.' };
  }
}
