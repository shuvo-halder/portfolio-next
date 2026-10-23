'use server';

import { ProjectStatus } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '@/lib/db/client';
import { requireAdminSession } from '@/lib/auth/guard';
import { invalidateCache } from '@/lib/db/cache';

const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  summary: z.string().min(1, 'Summary is required'),
  description: z.string().min(1, 'Description is required'),
  repoUrl: z.string().url().optional().or(z.literal('')),
  liveUrl: z.string().url().optional().or(z.literal('')),
  coverImage: z.string().optional().nullable(),
  featured: z.boolean().default(false),
  status: z.nativeEnum(ProjectStatus).default(ProjectStatus.PUBLISHED),
  tags: z.string().optional(),
});

export async function createProjectAction(_prevState: unknown, formData: FormData) {
  const session = await requireAdminSession();

  const raw = {
    title: formData.get('title'),
    slug: formData.get('slug'),
    summary: formData.get('summary'),
    description: formData.get('description'),
    repoUrl: formData.get('repoUrl') || '',
    liveUrl: formData.get('liveUrl') || '',
    coverImage: formData.get('coverImage') || null,
    featured: formData.get('featured') === 'true' || formData.get('featured') === 'on',
    status: (formData.get('status') as ProjectStatus) || ProjectStatus.PUBLISHED,
    tags: formData.get('tags') || '',
  };

  const parsed = projectSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || 'Validation failed' };
  }

  try {
    const highestOrder = await prisma.project.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const project = await prisma.project.create({
      data: {
        title: parsed.data.title,
        slug: parsed.data.slug,
        summary: parsed.data.summary,
        description: parsed.data.description,
        repoUrl: parsed.data.repoUrl || null,
        liveUrl: parsed.data.liveUrl || null,
        coverImage: parsed.data.coverImage,
        featured: parsed.data.featured,
        status: parsed.data.status,
        order: (highestOrder?.order ?? -1) + 1,
      },
    });

    // Handle tags
    if (parsed.data.tags) {
      const tagList = parsed.data.tags.split(',').map((t) => t.trim()).filter(Boolean);
      for (const tagName of tagList) {
        const tagSlug = tagName.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const tag = await prisma.tag.upsert({
          where: { slug: tagSlug },
          update: { name: tagName },
          create: { name: tagName, slug: tagSlug },
        });

        await prisma.projectTag.create({
          data: { projectId: project.id, tagId: tag.id },
        }).catch(() => {});
      }
    }

    invalidateCache('projects', '/');
    invalidateCache(`projects:${project.slug}`, `/projects/${project.slug}`);

    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: 'CREATE',
        entity: 'Project',
        entityId: project.id,
        details: { title: project.title, slug: project.slug },
      },
    }).catch(() => {});

    return { success: 'Project created successfully', slug: project.slug };
  } catch (err: unknown) {
    console.error('Create project error:', err);
    return { error: 'Failed to create project (slug must be unique).' };
  }
}

export async function updateProjectAction(id: string, _prevState: unknown, formData: FormData) {
  const session = await requireAdminSession();

  const raw = {
    title: formData.get('title'),
    slug: formData.get('slug'),
    summary: formData.get('summary'),
    description: formData.get('description'),
    repoUrl: formData.get('repoUrl') || '',
    liveUrl: formData.get('liveUrl') || '',
    coverImage: formData.get('coverImage') || null,
    featured: formData.get('featured') === 'true' || formData.get('featured') === 'on',
    status: (formData.get('status') as ProjectStatus) || ProjectStatus.PUBLISHED,
    tags: formData.get('tags') || '',
  };

  const parsed = projectSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || 'Validation failed' };
  }

  try {
    const project = await prisma.project.update({
      where: { id },
      data: {
        title: parsed.data.title,
        slug: parsed.data.slug,
        summary: parsed.data.summary,
        description: parsed.data.description,
        repoUrl: parsed.data.repoUrl || null,
        liveUrl: parsed.data.liveUrl || null,
        coverImage: parsed.data.coverImage,
        featured: parsed.data.featured,
        status: parsed.data.status,
      },
    });

    // Sync tags
    if (parsed.data.tags !== undefined) {
      await prisma.projectTag.deleteMany({ where: { projectId: id } });
      const tagList = parsed.data.tags.split(',').map((t) => t.trim()).filter(Boolean);
      for (const tagName of tagList) {
        const tagSlug = tagName.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const tag = await prisma.tag.upsert({
          where: { slug: tagSlug },
          update: { name: tagName },
          create: { name: tagName, slug: tagSlug },
        });

        await prisma.projectTag.create({
          data: { projectId: id, tagId: tag.id },
        }).catch(() => {});
      }
    }

    invalidateCache('projects', '/');
    invalidateCache(`projects:${project.slug}`, `/projects/${project.slug}`);

    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: 'UPDATE',
        entity: 'Project',
        entityId: project.id,
        details: { title: project.title, slug: project.slug },
      },
    }).catch(() => {});

    return { success: 'Project updated successfully' };
  } catch (err: unknown) {
    console.error('Update project error:', err);
    return { error: 'Failed to update project.' };
  }
}

export async function deleteProjectAction(id: string) {
  const session = await requireAdminSession();

  try {
    const deleted = await prisma.project.delete({ where: { id } });

    invalidateCache('projects', '/');
    invalidateCache(`projects:${deleted.slug}`, `/projects/${deleted.slug}`);

    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: 'DELETE',
        entity: 'Project',
        entityId: id,
        details: { title: deleted.title },
      },
    }).catch(() => {});

    return { success: 'Project deleted' };
  } catch (err: unknown) {
    console.error('Delete project error:', err);
    return { error: 'Failed to delete project.' };
  }
}

/**
 * GitHub Repository Importer:
 * Accepts a repo URL (e.g. https://github.com/shuvo-halder/virtualhost-automation)
 * or short form (shuvo-halder/virtualhost-automation) and extracts metadata + README.
 */
export async function fetchGitHubRepoMetadataAction(repoInput: string) {
  await requireAdminSession();

  let owner = 'shuvo-halder';
  let repo = repoInput.trim();

  // Strip full URL if provided
  if (repo.includes('github.com/')) {
    const parts = repo.split('github.com/')[1].split('/');
    owner = parts[0];
    repo = parts[1].replace('.git', '');
  } else if (repo.includes('/')) {
    const parts = repo.split('/');
    owner = parts[0];
    repo = parts[1];
  }

  try {
    const headers: Record<string, string> = {
      'User-Agent': 'portfolio-admin-importer',
      Accept: 'application/vnd.github.v3+json',
    };
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
    if (!res.ok) {
      return { error: `GitHub repository not found: ${owner}/${repo} (${res.status})` };
    }

    const data = await res.json();

    // Fetch README
    let readmeText = '';
    const readmeRes = await fetch(
      `https://raw.githubusercontent.com/${owner}/${repo}/${data.default_branch || 'main'}/README.md`
    );
    if (readmeRes.ok) {
      readmeText = await readmeRes.text();
    }

    const tags = [data.language, ...(data.topics || [])].filter(Boolean);

    return {
      success: true,
      data: {
        title: data.name
          .split('-')
          .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' '),
        slug: data.name.toLowerCase(),
        summary: data.description || `Production-grade ${data.language || 'software'} system.`,
        description: readmeText ? readmeText.slice(0, 4000) : data.description || '',
        repoUrl: data.html_url,
        liveUrl: data.homepage || '',
        tags: tags.join(', '),
        stars: data.stargazers_count,
        forks: data.forks_count,
      },
    };
  } catch (err: unknown) {
    console.error('GitHub fetch error:', err);
    return { error: 'Failed to connect to GitHub API.' };
  }
}
