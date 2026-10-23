import type { Metadata } from 'next';
import { getAdminSession } from '@/lib/auth/session';
import { AdminShell } from './AdminShell';

export const instant = false;

export const metadata: Metadata = {
  title: 'Control Room | Admin Dashboard',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  // If there is no active session (e.g. visiting /admin/login), render children directly without the shell
  if (!session) {
    return <>{children}</>;
  }

  return <AdminShell user={session.user}>{children}</AdminShell>;
}
