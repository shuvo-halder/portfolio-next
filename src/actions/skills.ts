'use server';

import { invalidateCache } from '@/lib/db/cache';
import { z } from 'zod';
import { SkillLevel } from '@prisma/client';
import { prisma } from '@/lib/db/client';
import { requireAdminSession } from '@/lib/auth/guard';

const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  slug: z.string().optional(),
});

const skillSchema = z.object({
  categoryId: z.string().min(1, 'Category is required'),
  name: z.string().min(1, 'Skill name is required'),
  level: z.nativeEnum(SkillLevel),
});

export async function createCategoryAction(formData: FormData) {
  const session = await requireAdminSession();

  const name = formData.get('name') as string;
  const slug = (formData.get('slug') as string) || name.toLowerCase().replace(/[^a-z0-9]/g, '-');

  const parsed = categorySchema.safeParse({ name, slug });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message };
  }

  try {
    const highestOrder = await prisma.skillCategory.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const category = await prisma.skillCategory.create({
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug || name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        order: (highestOrder?.order ?? -1) + 1,
      },
    });

    invalidateCache('skills', '/');

    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: 'CREATE',
        entity: 'SkillCategory',
        entityId: category.id,
        details: { name: category.name },
      },
    }).catch(() => {});

    return { success: 'Category created' };
  } catch (err: unknown) {
    console.error('Create category error:', err);
    return { error: 'Failed to create category (slug might already exist).' };
  }
}

export async function deleteCategoryAction(id: string) {
  const session = await requireAdminSession();

  try {
    const deleted = await prisma.skillCategory.delete({ where: { id } });

    invalidateCache('skills', '/');

    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: 'DELETE',
        entity: 'SkillCategory',
        entityId: id,
        details: { name: deleted.name },
      },
    }).catch(() => {});

    return { success: 'Category deleted' };
  } catch (err: unknown) {
    console.error('Delete category error:', err);
    return { error: 'Failed to delete category.' };
  }
}

export async function createSkillAction(formData: FormData) {
  const session = await requireAdminSession();

  const categoryId = formData.get('categoryId') as string;
  const name = formData.get('name') as string;
  const rawLevel = (formData.get('level') as string) || 'PROFICIENT';

  const parsed = skillSchema.safeParse({ categoryId, name, level: rawLevel });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message };
  }

  try {
    const highestOrder = await prisma.skill.findFirst({
      where: { categoryId: parsed.data.categoryId },
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const skill = await prisma.skill.create({
      data: {
        categoryId: parsed.data.categoryId,
        name: parsed.data.name,
        level: parsed.data.level,
        order: (highestOrder?.order ?? -1) + 1,
      },
    });

    invalidateCache('skills', '/');

    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: 'CREATE',
        entity: 'Skill',
        entityId: skill.id,
        details: { name: skill.name, categoryId: skill.categoryId },
      },
    }).catch(() => {});

    return { success: 'Skill added' };
  } catch (err: unknown) {
    console.error('Create skill error:', err);
    return { error: 'Failed to add skill.' };
  }
}

export async function deleteSkillAction(id: string) {
  const session = await requireAdminSession();

  try {
    const deleted = await prisma.skill.delete({ where: { id } });

    invalidateCache('skills', '/');

    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: 'DELETE',
        entity: 'Skill',
        entityId: id,
        details: { name: deleted.name },
      },
    }).catch(() => {});

    return { success: 'Skill deleted' };
  } catch (err: unknown) {
    console.error('Delete skill error:', err);
    return { error: 'Failed to delete skill.' };
  }
}

export async function toggleSkillVisibilityAction(id: string, visible: boolean) {
  await requireAdminSession();

  try {
    await prisma.skill.update({
      where: { id },
      data: { visible },
    });

    invalidateCache('skills', '/');
    return { success: true };
  } catch (err: unknown) {
    console.error('Toggle skill error:', err);
    return { error: 'Failed to update skill.' };
  }
}
