import { requireAdminSession } from '@/lib/auth/guard';
import { ProjectForm } from '../ProjectForm';

export default async function NewProjectPage() {
  await requireAdminSession();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-mono tracking-tight text-[var(--foreground)]">
          Create New Project
        </h1>
        <p className="text-xs font-mono text-[var(--muted)] mt-1">
          Add an infrastructure tool, open-source project, or import directly from a GitHub repository.
        </p>
      </div>

      <ProjectForm />
    </div>
  );
}
