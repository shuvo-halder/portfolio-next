'use server';

import { invalidateCache } from '@/lib/db/cache';
import { z } from 'zod';
import { prisma } from '@/lib/db/client';
import { requireAdminSession } from '@/lib/auth/guard';

const experienceSchema = z.object({
  company: z.string().min(1, 'Company / Org is required'),
  role: z.string().min(1, 'Role title is required'),
  location: z.string().optional().nullable(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional().nullable(),
  current: z.boolean().default(false),
  description: z.string().min(1, 'Description is required'),
  tech: z.string().optional(),
});

const educationSchema = z.object({
  institution: z.string().min(1, 'Institution is required'),
  degree: z.string().min(1, 'Degree is required'),
  field: z.string().min(1, 'Field is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional().nullable(),
  current: z.boolean().default(false),
  description: z.string().optional().nullable(),
});

export async function createExperienceAction(formData: FormData) {
  const session = await requireAdminSession();

  const raw = {
    company: formData.get('company'),
    role: formData.get('role'),
    location: formData.get('location') || null,
    startDate: formData.get('startDate'),
    endDate: formData.get('endDate') || null,
    current: formData.get('current') === 'true' || formData.get('current') === 'on',
    description: formData.get('description'),
    tech: formData.get('tech') || '',
  };

  const parsed = experienceSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message };
  }

  const techArray = parsed.data.tech
    ? parsed.data.tech.split(',').map((t) => t.trim()).filter(Boolean)
    : [];

  try {
    const highestOrder = await prisma.experience.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const exp = await prisma.experience.create({
      data: {
        company: parsed.data.company,
        role: parsed.data.role,
        location: parsed.data.location,
        startDate: new Date(parsed.data.startDate),
        endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : null,
        current: parsed.data.current,
        description: parsed.data.description,
        tech: techArray,
        order: (highestOrder?.order ?? -1) + 1,
      },
    });

    invalidateCache('experience', '/');

    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: 'CREATE',
        entity: 'Experience',
        entityId: exp.id,
        details: { company: exp.company, role: exp.role },
      },
    }).catch(() => {});

    return { success: 'Experience added' };
  } catch (err: unknown) {
    console.error('Create experience error:', err);
    return { error: 'Failed to create experience record.' };
  }
}

export async function deleteExperienceAction(id: string) {
  const session = await requireAdminSession();

  try {
    const deleted = await prisma.experience.delete({ where: { id } });

    invalidateCache('experience', '/');

    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: 'DELETE',
        entity: 'Experience',
        entityId: id,
        details: { company: deleted.company },
      },
    }).catch(() => {});

    return { success: 'Experience record deleted' };
  } catch (err: unknown) {
    console.error('Delete experience error:', err);
    return { error: 'Failed to delete experience.' };
  }
}

export async function createEducationAction(formData: FormData) {
  const session = await requireAdminSession();

  const raw = {
    institution: formData.get('institution'),
    degree: formData.get('degree'),
    field: formData.get('field'),
    startDate: formData.get('startDate'),
    endDate: formData.get('endDate') || null,
    current: formData.get('current') === 'true' || formData.get('current') === 'on',
    description: formData.get('description') || null,
  };

  const parsed = educationSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message };
  }

  try {
    const highestOrder = await prisma.education.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const edu = await prisma.education.create({
      data: {
        institution: parsed.data.institution,
        degree: parsed.data.degree,
        field: parsed.data.field,
        startDate: new Date(parsed.data.startDate),
        endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : null,
        current: parsed.data.current,
        description: parsed.data.description,
        order: (highestOrder?.order ?? -1) + 1,
      },
    });

    invalidateCache('education', '/');

    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: 'CREATE',
        entity: 'Education',
        entityId: edu.id,
        details: { institution: edu.institution, degree: edu.degree },
      },
    }).catch(() => {});

    return { success: 'Education record added' };
  } catch (err: unknown) {
    console.error('Create education error:', err);
    return { error: 'Failed to create education record.' };
  }
}

export async function deleteEducationAction(id: string) {
  const session = await requireAdminSession();

  try {
    const deleted = await prisma.education.delete({ where: { id } });

    invalidateCache('education', '/');

    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: 'DELETE',
        entity: 'Education',
        entityId: id,
        details: { institution: deleted.institution },
      },
    }).catch(() => {});

    return { success: 'Education record deleted' };
  } catch (err: unknown) {
    console.error('Delete education error:', err);
    return { error: 'Failed to delete education record.' };
  }
}
