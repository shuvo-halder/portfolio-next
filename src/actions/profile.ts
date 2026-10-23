'use server';

import { invalidateCache } from '@/lib/db/cache';
import { z } from 'zod';
import { prisma } from '@/lib/db/client';
import { requireAdminSession } from '@/lib/auth/guard';

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  headline: z.string().min(1, 'Headline is required'),
  bio: z.string().min(1, 'Bio is required'),
  avatarUrl: z.string().optional().nullable(),
  resumeUrl: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  email: z.string().email('Valid email is required'),
  availabilityStatus: z.string().min(1, 'Status is required'),
  availabilityMessage: z.string().optional().nullable(),
  githubUrl: z.string().url().optional().or(z.literal('')),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  devtoUrl: z.string().url().optional().or(z.literal('')),
  hackerrankUrl: z.string().url().optional().or(z.literal('')),
  huggingfaceUrl: z.string().url().optional().or(z.literal('')),
  websiteUrl: z.string().url().optional().or(z.literal('')),
});

export async function updateProfileAction(_prevState: unknown, formData: FormData) {
  const session = await requireAdminSession();

  const raw = {
    name: formData.get('name'),
    headline: formData.get('headline'),
    bio: formData.get('bio'),
    avatarUrl: formData.get('avatarUrl') || null,
    resumeUrl: formData.get('resumeUrl') || null,
    location: formData.get('location') || null,
    email: formData.get('email'),
    availabilityStatus: formData.get('availabilityStatus'),
    availabilityMessage: formData.get('availabilityMessage') || null,
    githubUrl: formData.get('githubUrl') || '',
    linkedinUrl: formData.get('linkedinUrl') || '',
    devtoUrl: formData.get('devtoUrl') || '',
    hackerrankUrl: formData.get('hackerrankUrl') || '',
    huggingfaceUrl: formData.get('huggingfaceUrl') || '',
    websiteUrl: formData.get('websiteUrl') || '',
  };

  const parsed = profileSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || 'Validation failed' };
  }

  const socialLinks = {
    github: parsed.data.githubUrl || undefined,
    linkedin: parsed.data.linkedinUrl || undefined,
    devto: parsed.data.devtoUrl || undefined,
    hackerrank: parsed.data.hackerrankUrl || undefined,
    huggingface: parsed.data.huggingfaceUrl || undefined,
    website: parsed.data.websiteUrl || undefined,
    email: `mailto:${parsed.data.email}`,
  };

  try {
    const updated = await prisma.profile.upsert({
      where: { id: 'singleton' },
      update: {
        name: parsed.data.name,
        headline: parsed.data.headline,
        bio: parsed.data.bio,
        avatarUrl: parsed.data.avatarUrl,
        resumeUrl: parsed.data.resumeUrl,
        location: parsed.data.location,
        email: parsed.data.email,
        availabilityStatus: parsed.data.availabilityStatus,
        availabilityMessage: parsed.data.availabilityMessage,
        socialLinks,
      },
      create: {
        id: 'singleton',
        name: parsed.data.name,
        headline: parsed.data.headline,
        bio: parsed.data.bio,
        avatarUrl: parsed.data.avatarUrl,
        resumeUrl: parsed.data.resumeUrl,
        location: parsed.data.location,
        email: parsed.data.email,
        availabilityStatus: parsed.data.availabilityStatus,
        availabilityMessage: parsed.data.availabilityMessage,
        socialLinks,
      },
    });

    // Invalidate cached public profile
    invalidateCache('profile', '/');

    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: 'UPDATE',
        entity: 'Profile',
        entityId: 'singleton',
        details: { name: updated.name, email: updated.email },
      },
    }).catch(() => {});

    return { success: 'Profile successfully updated.' };
  } catch (err: unknown) {
    console.error('Update profile error:', err);
    return { error: 'Failed to update profile in database.' };
  }
}
