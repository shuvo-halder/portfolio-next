import { History, ShieldCheck, User } from 'lucide-react';
import { requireAdminSession } from '@/lib/auth/guard';
import { prisma } from '@/lib/db/client';

export default async function AdminAuditLogsPage() {
  await requireAdminSession();

  let logs: Array<{
    id: string;
    action: string;
    entity: string;
    entityId: string | null;
    details: unknown;
    ipAddress: string | null;
    createdAt: Date;
    user: { name: string; email: string } | null;
  }> = [];

  try {
    logs = await prisma.auditLog.findMany({
      take: 100,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    });
  } catch (err) {
    console.warn('Audit logs query error:', err);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-mono tracking-tight text-[var(--foreground)]">
          System Audit Trail & Access Logs
        </h1>
        <p className="text-xs font-mono text-[var(--muted)] mt-1">
          Cryptographically recorded timeline of administrative operations, content mutations, and authentication sessions.
        </p>
      </div>

      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] overflow-hidden">
        <div className="p-3.5 border-b border-[var(--border-subtle)] bg-[var(--surface-raised)]/50 flex items-center justify-between text-xs font-mono">
          <span className="font-semibold text-[var(--foreground)] flex items-center gap-2">
            <History className="w-4 h-4 text-[var(--accent-emerald)]" />
            Audit Records ({logs.length})
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            Tamper Resistant
          </span>
        </div>

        {logs.length === 0 ? (
          <div className="p-12 text-center text-xs font-mono text-[var(--muted)]">
            No audit records logged yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] bg-[var(--surface-raised)]/30 text-[var(--muted)]">
                  <th className="py-2.5 px-4 font-semibold">Timestamp</th>
                  <th className="py-2.5 px-4 font-semibold">Action</th>
                  <th className="py-2.5 px-4 font-semibold">Entity</th>
                  <th className="py-2.5 px-4 font-semibold">Operator</th>
                  <th className="py-2.5 px-4 font-semibold">IP Address</th>
                  <th className="py-2.5 px-4 font-semibold">Payload Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]/60">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-[var(--surface-raised)]/30 transition-colors">
                    <td className="py-3 px-4 text-[var(--muted)] whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          log.action === 'CREATE' || log.action === 'UPLOAD'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : log.action === 'UPDATE'
                            ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                            : log.action === 'DELETE'
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {log.action}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-semibold text-[var(--foreground)]">
                      {log.entity}
                    </td>

                    <td className="py-3 px-4 text-[var(--muted)]">
                      {log.user ? (
                        <span className="flex items-center gap-1.5 truncate max-w-[150px]">
                          <User className="w-3 h-3 text-[var(--muted)]" />
                          {log.user.name}
                        </span>
                      ) : (
                        <span className="italic">System</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-[var(--muted)] whitespace-nowrap">
                      {log.ipAddress || '127.0.0.1'}
                    </td>

                    <td className="py-3 px-4 max-w-xs truncate text-[11px] text-[var(--muted)]">
                      {log.details ? JSON.stringify(log.details) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
