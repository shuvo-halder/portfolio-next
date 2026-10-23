import { requireAdminSession } from '@/lib/auth/guard';
import { prisma } from '@/lib/db/client';
import { SettingsManager } from './SettingsManager';

export default async function AdminSettingsPage() {
  const session = await requireAdminSession();

  const settingsMap: Record<string, string> = {
    site_title: 'Shuvo Halder | DevOps & Systems Engineer',
    seo_description: 'Engineering deterministic infrastructure, resilient automation pipelines, and hardened Linux environments.',
    enable_analytics: 'false',
    contact_forward_email: 'shuvo-halder@outlook.com',
    enable_blog: 'true',
  };

  let twoFactorEnabled = false;

  try {
    const [settingsList, user] = await Promise.all([
      prisma.setting.findMany(),
      prisma.user.findUnique({
        where: { id: session.userId },
        select: { twoFactorEnabled: true },
      }),
    ]);

    for (const s of settingsList) {
      settingsMap[s.key] = s.value;
    }
    twoFactorEnabled = user?.twoFactorEnabled ?? false;
  } catch (err) {
    console.warn('Settings query error:', err);
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold font-mono tracking-tight text-[var(--foreground)]">
          System Settings & Security Configuration
        </h1>
        <p className="text-xs font-mono text-[var(--muted)] mt-1">
          Manage site titles, SEO telemetry, analytics toggles, contact routing, and 2-Factor Authentication (TOTP).
        </p>
      </div>

      <SettingsManager initialSettings={settingsMap} initial2FAEnabled={twoFactorEnabled} />
    </div>
  );
}
