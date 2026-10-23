import Link from 'next/link';
import {
  FolderGit2,
  FileText,
  Inbox,
  Wrench,
  Image as ImageIcon,
  History,
  Plus,
  ArrowUpRight,
  Database,
  Cpu,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { requireAdminSession } from '@/lib/auth/guard';
import { prisma } from '@/lib/db/client';

export default async function AdminDashboardPage() {
  await requireAdminSession();

  // Fetch counts and recent activity with error resilience
  let projectsCount = 0;
  let postsCount = 0;
  let unreadMessagesCount = 0;
  let skillsCount = 0;
  let mediaCount = 0;
  let recentMessages: Array<{
    id: string;
    name: string;
    email: string;
    subject: string | null;
    status: string;
    createdAt: Date;
  }> = [];
  let recentLogs: Array<{
    id: string;
    action: string;
    entity: string;
    entityId: string | null;
    createdAt: Date;
  }> = [];
  let dbConnected = false;

  try {
    const [projects, posts, messages, unreadMessages, skills, media, logs] = await Promise.all([
      prisma.project.count(),
      prisma.post.count(),
      prisma.contactMessage.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.contactMessage.count({ where: { status: 'UNREAD' } }),
      prisma.skill.count(),
      prisma.media.count(),
      prisma.auditLog.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    projectsCount = projects;
    postsCount = posts;
    unreadMessagesCount = unreadMessages;
    skillsCount = skills;
    mediaCount = media;
    recentMessages = messages;
    recentLogs = logs;
    dbConnected = true;
  } catch (err) {
    console.warn('Dashboard DB query fallback:', err);
  }

  const uptimeSeconds = Math.floor(process.uptime());
  const hours = Math.floor(uptimeSeconds / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);

  return (
    <div className="space-y-8">
      {/* Page Title & Status Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-mono tracking-tight text-[var(--foreground)]">
            Infrastructure Telemetry & Content Control
          </h1>
          <p className="text-xs font-mono text-[var(--muted)] mt-1">
            Real-time management dashboard for portfolio data, blog engine, and system settings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-[var(--accent-emerald)] text-slate-950 hover:bg-[var(--accent-emerald)]/90 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Project</span>
          </Link>
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium border border-[var(--border-subtle)] bg-[var(--surface-raised)] hover:bg-[var(--surface)] text-[var(--foreground)] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Post</span>
          </Link>
        </div>
      </div>

      {/* Metrics Bento Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <Link
          href="/admin/projects"
          className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] hover:border-[var(--accent-emerald)]/50 transition-all group"
        >
          <div className="flex items-center justify-between text-[var(--muted)] mb-2">
            <span className="text-xs font-mono">Projects</span>
            <FolderGit2 className="w-4 h-4 group-hover:text-[var(--accent-emerald)] transition-colors" />
          </div>
          <div className="text-2xl font-mono font-bold text-[var(--foreground)]">{projectsCount}</div>
          <div className="text-[10px] font-mono text-[var(--muted)] mt-1">Published & Drafts</div>
        </Link>

        <Link
          href="/admin/blog"
          className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] hover:border-[var(--accent-emerald)]/50 transition-all group"
        >
          <div className="flex items-center justify-between text-[var(--muted)] mb-2">
            <span className="text-xs font-mono">Blog Posts</span>
            <FileText className="w-4 h-4 group-hover:text-[var(--accent-emerald)] transition-colors" />
          </div>
          <div className="text-2xl font-mono font-bold text-[var(--foreground)]">{postsCount}</div>
          <div className="text-[10px] font-mono text-[var(--muted)] mt-1">Articles & Notes</div>
        </Link>

        <Link
          href="/admin/messages"
          className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] hover:border-amber-500/50 transition-all group"
        >
          <div className="flex items-center justify-between text-[var(--muted)] mb-2">
            <span className="text-xs font-mono">Inbox</span>
            <Inbox className="w-4 h-4 group-hover:text-amber-400 transition-colors" />
          </div>
          <div className="text-2xl font-mono font-bold text-[var(--foreground)] flex items-center gap-2">
            <span>{unreadMessagesCount}</span>
            {unreadMessagesCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono">
                NEW
              </span>
            )}
          </div>
          <div className="text-[10px] font-mono text-[var(--muted)] mt-1">Unread Inquiries</div>
        </Link>

        <Link
          href="/admin/skills"
          className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] hover:border-[var(--accent-emerald)]/50 transition-all group"
        >
          <div className="flex items-center justify-between text-[var(--muted)] mb-2">
            <span className="text-xs font-mono">Toolbox</span>
            <Wrench className="w-4 h-4 group-hover:text-[var(--accent-emerald)] transition-colors" />
          </div>
          <div className="text-2xl font-mono font-bold text-[var(--foreground)]">{skillsCount}</div>
          <div className="text-[10px] font-mono text-[var(--muted)] mt-1">Tracked Skills</div>
        </Link>

        <Link
          href="/admin/media"
          className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] hover:border-[var(--accent-emerald)]/50 transition-all group"
        >
          <div className="flex items-center justify-between text-[var(--muted)] mb-2">
            <span className="text-xs font-mono">Media</span>
            <ImageIcon className="w-4 h-4 group-hover:text-[var(--accent-emerald)] transition-colors" />
          </div>
          <div className="text-2xl font-mono font-bold text-[var(--foreground)]">{mediaCount}</div>
          <div className="text-[10px] font-mono text-[var(--muted)] mt-1">Uploaded Assets</div>
        </Link>
      </div>

      {/* System Telemetry & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Node & Database Diagnostics */}
        <div className="p-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--muted)]">
              Host Environment
            </h2>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs font-mono py-1 border-b border-[var(--border-subtle)]/50">
              <span className="text-[var(--muted)] flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5" />
                PostgreSQL
              </span>
              <span className={dbConnected ? 'text-emerald-400 font-semibold' : 'text-red-400 font-semibold'}>
                {dbConnected ? 'CONNECTED' : 'DISCONNECTED'}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs font-mono py-1 border-b border-[var(--border-subtle)]/50">
              <span className="text-[var(--muted)] flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" />
                Node Runtime
              </span>
              <span className="text-[var(--foreground)]">{process.version}</span>
            </div>

            <div className="flex items-center justify-between text-xs font-mono py-1">
              <span className="text-[var(--muted)] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Process Uptime
              </span>
              <span className="text-[var(--foreground)]">
                {hours}h {minutes}m
              </span>
            </div>
          </div>
        </div>

        {/* Recent Contact Submissions */}
        <div className="lg:col-span-2 p-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--muted)]">
              Recent Inquiries
            </h2>
            <Link
              href="/admin/messages"
              className="text-xs font-mono text-[var(--accent-emerald)] hover:underline inline-flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          {recentMessages.length === 0 ? (
            <div className="p-6 text-center border border-dashed border-[var(--border-subtle)] rounded-lg">
              <p className="text-xs font-mono text-[var(--muted)]">No contact messages received yet.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-[var(--surface-raised)] border border-[var(--border-subtle)] text-xs font-mono"
                >
                  <div className="truncate">
                    <div className="font-semibold text-[var(--foreground)] truncate">{msg.name}</div>
                    <div className="text-[var(--muted)] text-[11px] truncate">
                      {msg.subject || msg.email}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-3">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                        msg.status === 'UNREAD'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-slate-500/10 text-[var(--muted)]'
                      }`}
                    >
                      {msg.status}
                    </span>
                    <span className="text-[10px] text-[var(--muted)]">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Audit Log Stream */}
      <div className="p-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[var(--muted)]" />
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--muted)]">
              System Audit Stream
            </h2>
          </div>
          <Link
            href="/admin/audit-logs"
            className="text-xs font-mono text-[var(--accent-emerald)] hover:underline inline-flex items-center gap-1"
          >
            <span>Full Audit Trail</span>
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        {recentLogs.length === 0 ? (
          <div className="p-4 text-center border border-dashed border-[var(--border-subtle)] rounded-lg">
            <p className="text-xs font-mono text-[var(--muted)]">No audit activity recorded.</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--border-subtle)]/50">
            {recentLogs.map((log) => (
              <div key={log.id} className="py-2.5 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="font-semibold text-[var(--foreground)]">{log.action}</span>
                  <span className="text-[var(--muted)]">{log.entity}</span>
                  {log.entityId && (
                    <span className="text-[10px] text-[var(--muted)]/60 font-mono">#{log.entityId.slice(0, 8)}</span>
                  )}
                </div>
                <span className="text-[10px] text-[var(--muted)]">
                  {new Date(log.createdAt).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
