import { requireAdminSession } from '@/lib/auth/guard';
import { prisma } from '@/lib/db/client';
import { SkillsManager } from './SkillsManager';

export default async function AdminSkillsPage() {
  await requireAdminSession();

  let categories: Array<{
    id: string;
    name: string;
    slug: string;
    order: number;
    skills: Array<{
      id: string;
      name: string;
      level: string;
      order: number;
      visible: boolean;
    }>;
  }> = [];

  try {
    categories = await prisma.skillCategory.findMany({
      orderBy: { order: 'asc' },
      include: {
        skills: {
          orderBy: { order: 'asc' },
        },
      },
    });
  } catch (err) {
    console.warn('Skills query error:', err);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-mono tracking-tight text-[var(--foreground)]">
          Skills & Systems Toolbox
        </h1>
        <p className="text-xs font-mono text-[var(--muted)] mt-1">
          Organize technical competencies into domain categories and define proficiency telemetry.
        </p>
      </div>

      <SkillsManager initialCategories={categories} />
    </div>
  );
}
