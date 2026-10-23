import { requireAdminSession } from '@/lib/auth/guard';
import { prisma } from '@/lib/db/client';
import { MediaManager } from './MediaManager';

export default async function AdminMediaPage() {
  await requireAdminSession();

  let mediaFiles: Array<{
    id: string;
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    url: string;
    createdAt: Date;
  }> = [];

  try {
    mediaFiles = await prisma.media.findMany({
      orderBy: { createdAt: 'desc' },
    });
  } catch (err) {
    console.warn('Media query error:', err);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-mono tracking-tight text-[var(--foreground)]">
          Media Library & Asset Storage
        </h1>
        <p className="text-xs font-mono text-[var(--muted)] mt-1">
          Upload diagrams, cover art, architecture screenshots, and PDF resumes with automatic MIME validation.
        </p>
      </div>

      <MediaManager initialFiles={mediaFiles} />
    </div>
  );
}
