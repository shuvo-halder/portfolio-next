import { requireAdminSession } from '@/lib/auth/guard';
import { prisma } from '@/lib/db/client';
import { ProfileForm } from './ProfileForm';

export default async function AdminProfilePage() {
  await requireAdminSession();

  let profile = await prisma.profile.findUnique({
    where: { id: 'singleton' },
  });

  if (!profile) {
    // Provide sensible defaults if not yet seeded
    profile = {
      id: 'singleton',
      name: 'Shuvo Halder',
      headline: 'DevOps Engineer & System Administrator',
      bio: 'Specialized in automated Linux server management, production web servers (Nginx/Apache), SSL/TLS certificate lifecycle governance, and security-first bash orchestration.',
      avatarUrl: '/avatar.png',
      resumeUrl: '/resume.pdf',
      location: '/dev/null',
      email: 'shuvo-halder@outlook.com',
      availabilityStatus: 'available',
      availabilityMessage: 'Available for DevOps contracts, SRE consulting & infrastructure automation',
      socialLinks: {
        github: 'https://github.com/shuvo-halder',
        linkedin: 'https://www.linkedin.com/in/shuvo-halder/',
        devto: 'https://dev.to/shuvo_h',
        hackerrank: 'https://www.hackerrank.com/profile/shuvohalder_1331',
        huggingface: 'https://huggingface.co/shuvo-halder',
        website: 'https://binrecon.io',
      },
      seoTitle: 'Shuvo Halder | DevOps Engineer',
      seoDescription: 'DevOps Portfolio & Systems Showcase',
      ogImageUrl: null,
      updatedAt: new Date(),
    };
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-mono tracking-tight text-[var(--foreground)]">
          Profile & System Identity
        </h1>
        <p className="text-xs font-mono text-[var(--muted)] mt-1">
          Configure the public biography, contact channels, telemetry status, and social profiles.
        </p>
      </div>

      <ProfileForm initialData={profile} />
    </div>
  );
}
