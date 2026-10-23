'use server';

import { generateSecret, generateURI, verifySync } from 'otplib';
import QRCode from 'qrcode';
import { prisma } from '@/lib/db/client';
import { requireAdminSession } from '@/lib/auth/guard';
import { invalidateCache } from '@/lib/db/cache';

export async function updateSettingsAction(formData: FormData) {
  const session = await requireAdminSession();

  const entries: Array<{ key: string; value: string }> = [
    { key: 'site_title', value: (formData.get('site_title') as string) || '' },
    { key: 'seo_description', value: (formData.get('seo_description') as string) || '' },
    { key: 'enable_analytics', value: formData.get('enable_analytics') === 'true' ? 'true' : 'false' },
    { key: 'contact_forward_email', value: (formData.get('contact_forward_email') as string) || '' },
    { key: 'enable_blog', value: formData.get('enable_blog') === 'true' ? 'true' : 'false' },
  ];

  try {
    for (const item of entries) {
      await prisma.setting.upsert({
        where: { key: item.key },
        update: { value: item.value },
        create: { key: item.key, value: item.value },
      });
    }

    invalidateCache('settings', '/');

    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: 'UPDATE',
        entity: 'Setting',
        details: { updatedKeys: entries.map((e) => e.key) },
      },
    }).catch(() => {});

    return { success: 'Settings saved successfully' };
  } catch (err: unknown) {
    console.error('Settings update error:', err);
    return { error: 'Failed to update system settings.' };
  }
}

export async function generate2FASetupAction() {
  const session = await requireAdminSession();

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) throw new Error('User not found');

  const secret = generateSecret();
  const serviceName = 'DevOps Control Room (Shuvo Halder)';
  const otpauth = generateURI({ issuer: serviceName, label: user.email, secret });
  const qrCodeDataUrl = await QRCode.toDataURL(otpauth);

  return { secret, qrCodeDataUrl };
}

export async function verifyAndEnable2FAAction(
  token: string,
  secret: string
): Promise<{ success?: string; error?: string }> {
  const session = await requireAdminSession();

  const result = verifySync({ token, secret });
  if (!result.valid) {
    return { error: 'Invalid 6-digit verification code. Please check your authenticator clock and try again.' };
  }

  await prisma.user.update({
    where: { id: session.userId },
    data: {
      twoFactorSecret: secret,
      twoFactorEnabled: true,
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: session.userId,
      action: 'ENABLE_2FA',
      entity: 'User',
      entityId: session.userId,
    },
  }).catch(() => {});

  return { success: 'Two-Factor Authentication is now actively protecting your account.' };
}

export async function disable2FAAction(): Promise<{ success?: string; error?: string }> {
  const session = await requireAdminSession();

  await prisma.user.update({
    where: { id: session.userId },
    data: {
      twoFactorSecret: null,
      twoFactorEnabled: false,
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: session.userId,
      action: 'DISABLE_2FA',
      entity: 'User',
      entityId: session.userId,
    },
  }).catch(() => {});

  return { success: 'Two-Factor Authentication has been disabled.' };
}
