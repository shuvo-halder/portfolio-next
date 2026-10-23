'use server';

import { MessageStatus } from '@prisma/client';
import { prisma } from '@/lib/db/client';
import { requireAdminSession } from '@/lib/auth/guard';

export async function markMessageStatusAction(id: string, status: MessageStatus) {
  await requireAdminSession();

  try {
    const updated = await prisma.contactMessage.update({
      where: { id },
      data: { status },
    });
    return { success: true, message: updated };
  } catch (err: unknown) {
    console.error('Update message error:', err);
    return { error: 'Failed to update message status.' };
  }
}

export async function deleteMessageAction(id: string) {
  const session = await requireAdminSession();

  try {
    await prisma.contactMessage.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: 'DELETE',
        entity: 'ContactMessage',
        entityId: id,
      },
    }).catch(() => {});

    return { success: true };
  } catch (err: unknown) {
    console.error('Delete message error:', err);
    return { error: 'Failed to delete message.' };
  }
}
