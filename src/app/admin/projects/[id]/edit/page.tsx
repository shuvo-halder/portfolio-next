import { notFound } from 'next/navigation';
import { requireAdminSession } from '@/lib/auth/guard';
import { prisma } from '@/lib/db/client';
import { ProjectForm } from '../../ProjectForm';

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  await requireAdminSession();
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      tags: {
        include: { tag: true },
      },
    },
  });

  if (!project) {
    notFound();
  }

  const formData = {
    id: project.id,
    title: project.title,
    slug: project.slug,
    summary: project.summary,
    description: project.description,
    repoUrl: project.repoUrl,
    liveUrl: project.liveUrl,
    coverImage: project.coverImage,
    featured: project.featured,
    status: project.status as 'PUBLISHED' | 'DRAFT' | 'ARCHIVED',
    tags: project.tags.map((t) => t.tag.name).join(', '),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-mono tracking-tight text-[var(--foreground)]">
          Edit Project: {project.title}
        </h1>
        <p className="text-xs font-mono text-[var(--muted)] mt-1">
          Update architectural documentation, installation commands, status, and repository metadata.
        </p>
      </div>

      <ProjectForm initialData={formData} />
    </div>
  );
}
