import { requireAdminSession } from '@/lib/auth/guard';
import { prisma } from '@/lib/db/client';
import { CredentialsManager } from './CredentialsManager';

export default async function AdminCredentialsPage() {
  await requireAdminSession();

  let certs: Array<{
    id: string;
    title: string;
    issuer: string;
    issueDate: Date;
    expiryDate: Date | null;
    credentialId: string | null;
    credentialUrl: string | null;
  }> = [];

  let achievements: Array<{
    id: string;
    title: string;
    description: string;
    link: string | null;
  }> = [];

  try {
    const [certData, achData] = await Promise.all([
      prisma.certification.findMany({ orderBy: { order: 'asc' } }),
      prisma.achievement.findMany({ orderBy: { order: 'asc' } }),
    ]);
    certs = certData;
    achievements = achData;
  } catch (err) {
    console.warn('Credentials fetch error:', err);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-mono tracking-tight text-[var(--foreground)]">
          Certifications & Achievement Badges
        </h1>
        <p className="text-xs font-mono text-[var(--muted)] mt-1">
          Manage professional vendor credentials and verified GitHub / competitive coding achievements.
        </p>
      </div>

      <CredentialsManager initialCerts={certs} initialAchievements={achievements} />
    </div>
  );
}
