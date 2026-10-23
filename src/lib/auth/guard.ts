import { redirect } from 'next/navigation';
import { getAdminSession } from './session';

export async function requireAdminSession(redirectToLogin = true) {
  const session = await getAdminSession();

  if (!session) {
    if (redirectToLogin) {
      redirect('/admin/login');
    }
    throw new Error('Unauthorized: Admin session required');
  }

  return session;
}
