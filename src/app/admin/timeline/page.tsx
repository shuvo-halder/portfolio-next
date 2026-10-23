import { requireAdminSession } from '@/lib/auth/guard';
import { prisma } from '@/lib/db/client';
import { TimelineManager } from './TimelineManager';

export default async function AdminTimelinePage() {
  await requireAdminSession();

  let experiences: Array<{
    id: string;
    company: string;
    role: string;
    location: string | null;
    startDate: Date;
    endDate: Date | null;
    current: boolean;
    description: string;
    tech: string[];
  }> = [];

  let educations: Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
    startDate: Date;
    endDate: Date | null;
    current: boolean;
    description: string | null;
  }> = [];

  try {
    const [expData, eduData] = await Promise.all([
      prisma.experience.findMany({ orderBy: { startDate: 'desc' } }),
      prisma.education.findMany({ orderBy: { startDate: 'desc' } }),
    ]);
    experiences = expData;
    educations = eduData;
  } catch (err) {
    console.warn('Timeline fetch error:', err);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-mono tracking-tight text-[var(--foreground)]">
          Timeline: Experience & Education
        </h1>
        <p className="text-xs font-mono text-[var(--muted)] mt-1">
          Manage career history, open source contributions, organizational roles, and academic qualifications.
        </p>
      </div>

      <TimelineManager initialExperiences={experiences} initialEducations={educations} />
    </div>
  );
}
