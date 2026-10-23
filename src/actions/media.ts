'use server';

import { prisma } from '@/lib/db/client';
import { requireAdminSession } from '@/lib/auth/guard';
import { storage } from '@/lib/storage';

export async function uploadMediaAction(_prevState: unknown, formData: FormData) {
  const session = await requireAdminSession();

  const file = formData.get('file') as File | null;
  if (!file || file.size === 0) {
    return { error: 'No file provided for upload.' };
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const storedFile = await storage.upload(buffer, file.name, file.type);

    const media = await prisma.media.create({
      data: {
        filename: storedFile.filename,
        originalName: storedFile.originalName,
        mimeType: storedFile.mimeType,
        size: storedFile.size,
        url: storedFile.url,
        path: storedFile.path,
        storage: 'LOCAL',
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: 'UPLOAD',
        entity: 'Media',
        entityId: media.id,
        details: { filename: media.filename, size: media.size },
      },
    }).catch(() => {});

    return { success: 'File uploaded successfully', media };
  } catch (err: unknown) {
    console.error('Upload error:', err);
    return { error: (err as Error).message || 'Failed to upload media file.' };
  }
}

export async function deleteMediaAction(id: string) {
  const session = await requireAdminSession();

  try {
    const media = await prisma.media.findUnique({ where: { id } });
    if (!media) {
      return { error: 'Media file not found.' };
    }

    await storage.delete(media.filename);
    await prisma.media.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: 'DELETE',
        entity: 'Media',
        entityId: id,
        details: { filename: media.filename },
      },
    }).catch(() => {});

    return { success: 'Media deleted' };
  } catch (err: unknown) {
    console.error('Delete media error:', err);
    return { error: 'Failed to delete media.' };
  }
}
