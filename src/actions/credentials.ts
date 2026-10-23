'use server';

import { invalidateCache } from '@/lib/db/cache';
import { z } from 'zod';
import { prisma } from '@/lib/db/client';
import { requireAdminSession } from '@/lib/auth/guard';

const certSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  issuer: z.string().min(1, 'Issuer is required'),
  issueDate: z.string().min(1, 'Issue date is required'),
  expiryDate: z.string().optional().nullable(),
  credentialId: z.string().optional().nullable(),
  credentialUrl: z.string().url().optional().or(z.literal('')),
  badgeImage: z.string().optional().nullable(),
});

const achSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  link: z.string().url().optional().or(z.literal('')),
  icon: z.string().optional().nullable(),
});

export async function createCertificationAction(formData: FormData) {
  const session = await requireAdminSession();

  const raw = {
    title: formData.get('title'),
    issuer: formData.get('issuer'),
    issueDate: formData.get('issueDate'),
    expiryDate: formData.get('expiryDate') || null,
    credentialId: formData.get('credentialId') || null,
    credentialUrl: formData.get('credentialUrl') || '',
    badgeImage: formData.get('badgeImage') || null,
  };

  const parsed = certSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message };
  }

  try {
    const highestOrder = await prisma.certification.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const cert = await prisma.certification.create({
      data: {
        title: parsed.data.title,
        issuer: parsed.data.issuer,
        issueDate: new Date(parsed.data.issueDate),
        expiryDate: parsed.data.expiryDate ? new Date(parsed.data.expiryDate) : null,
        credentialId: parsed.data.credentialId,
        credentialUrl: parsed.data.credentialUrl || null,
        badgeImage: parsed.data.badgeImage,
        order: (highestOrder?.order ?? -1) + 1,
      },
    });

    invalidateCache('certifications', '/');

    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: 'CREATE',
        entity: 'Certification',
        entityId: cert.id,
        details: { title: cert.title, issuer: cert.issuer },
      },
    }).catch(() => {});

    return { success: 'Certification added' };
  } catch (err: unknown) {
    console.error('Create certification error:', err);
    return { error: 'Failed to create certification.' };
  }
}

export async function deleteCertificationAction(id: string) {
  const session = await requireAdminSession();

  try {
    const deleted = await prisma.certification.delete({ where: { id } });

    invalidateCache('certifications', '/');

    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: 'DELETE',
        entity: 'Certification',
        entityId: id,
        details: { title: deleted.title },
      },
    }).catch(() => {});

    return { success: 'Certification deleted' };
  } catch (err: unknown) {
    console.error('Delete certification error:', err);
    return { error: 'Failed to delete certification.' };
  }
}

export async function createAchievementAction(formData: FormData) {
  const session = await requireAdminSession();

  const raw = {
    title: formData.get('title'),
    description: formData.get('description'),
    link: formData.get('link') || '',
    icon: formData.get('icon') || null,
  };

  const parsed = achSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message };
  }

  try {
    const highestOrder = await prisma.achievement.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const ach = await prisma.achievement.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        link: parsed.data.link || null,
        icon: parsed.data.icon,
        order: (highestOrder?.order ?? -1) + 1,
      },
    });

    invalidateCache('achievements', '/');

    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: 'CREATE',
        entity: 'Achievement',
        entityId: ach.id,
        details: { title: ach.title },
      },
    }).catch(() => {});

    return { success: 'Achievement added' };
  } catch (err: unknown) {
    console.error('Create achievement error:', err);
    return { error: 'Failed to create achievement.' };
  }
}

export async function deleteAchievementAction(id: string) {
  const session = await requireAdminSession();

  try {
    const deleted = await prisma.achievement.delete({ where: { id } });

    invalidateCache('achievements', '/');

    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: 'DELETE',
        entity: 'Achievement',
        entityId: id,
        details: { title: deleted.title },
      },
    }).catch(() => {});

    return { success: 'Achievement deleted' };
  } catch (err: unknown) {
    console.error('Delete achievement error:', err);
    return { error: 'Failed to delete achievement.' };
  }
}
