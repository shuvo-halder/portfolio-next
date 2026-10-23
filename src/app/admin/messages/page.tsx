import { requireAdminSession } from '@/lib/auth/guard';
import { prisma } from '@/lib/db/client';
import { MessagesInbox } from './MessagesInbox';

export default async function AdminMessagesPage() {
  await requireAdminSession();

  let messages: Array<{
    id: string;
    name: string;
    email: string;
    subject: string | null;
    message: string;
    status: 'UNREAD' | 'READ' | 'ARCHIVED' | 'SPAM';
    ipAddress: string | null;
    createdAt: Date;
  }> = [];

  try {
    messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
  } catch (err) {
    console.warn('Messages query error:', err);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-mono tracking-tight text-[var(--foreground)]">
          Contact Inquiries & Submissions
        </h1>
        <p className="text-xs font-mono text-[var(--muted)] mt-1">
          Review, archive, and respond to incoming correspondence sent via the public contact gateway.
        </p>
      </div>

      <MessagesInbox initialMessages={messages} />
    </div>
  );
}
