'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { prisma } from '@/lib/db/client';
import { verifyPassword, createAdminSession, destroyAdminSession, getAdminSession } from '@/lib/auth/session';
import { checkRateLimit } from '@/lib/rate-limit';

const loginSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(1, 'Password is required'),
});

export async function loginAction(_prevState: unknown, formData: FormData) {
  const reqHeaders = await headers();
  const forwardedFor = reqHeaders.get('x-forwarded-for');
  const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';
  const userAgent = reqHeaders.get('user-agent') || 'unknown';

  // Rate limit: max 5 login attempts per 15 minutes per IP
  const rateLimitResult = checkRateLimit(`login:${clientIp}`, 5, 15 * 60 * 1000);

  if (!rateLimitResult.success) {
    const minutesLeft = Math.max(1, Math.ceil((rateLimitResult.resetAt - Date.now()) / 60000));
    return {
      error: `Too many login attempts. Access temporarily restricted. Try again in ${minutesLeft} minute${minutesLeft > 1 ? 's' : ''}.`,
    };
  }

  const rawData = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  const parsed = loginSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || 'Invalid input data' };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: parsed.data.email.toLowerCase() },
    });

    if (!user) {
      // Generic error to prevent email enumeration
      return { error: 'Invalid email or password.' };
    }

    const passwordValid = await verifyPassword(parsed.data.password, user.passwordHash);
    if (!passwordValid) {
      return { error: 'Invalid email or password.' };
    }

    // Check optional TOTP 2FA if enabled
    if (user.twoFactorEnabled) {
      // TODO: If 2FA enabled, redirect to /admin/verify-2fa with temp challenge token
    }

    // Create session
    await createAdminSession(user.id, {
      ipAddress: clientIp,
      userAgent,
    });

    // Record in AuditLog
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'LOGIN',
        entity: 'User',
        entityId: user.id,
        details: { ip: clientIp, userAgent },
        ipAddress: clientIp,
      },
    }).catch(() => {});
  } catch (err: unknown) {
    console.error('Login action error:', err);
    return { error: 'Internal authentication error. Ensure database is accessible.' };
  }

  redirect('/admin');
}

export async function logoutAction() {
  const session = await getAdminSession();
  if (session) {
    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: 'LOGOUT',
        entity: 'User',
        entityId: session.userId,
      },
    }).catch(() => {});
  }

  await destroyAdminSession();
  redirect('/admin/login');
}
