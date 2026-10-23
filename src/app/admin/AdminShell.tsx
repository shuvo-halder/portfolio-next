'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  User,
  FolderGit2,
  FileText,
  Wrench,
  Clock,
  Award,
  Image,
  Inbox,
  History,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Terminal,
  Activity,
} from 'lucide-react';
import { logoutAction } from '@/actions/auth';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

interface AdminShellProps {
  user: {
    name: string;
    email: string;
  };
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/profile', label: 'Profile & Bio', icon: User },
  { href: '/admin/projects', label: 'Projects', icon: FolderGit2 },
  { href: '/admin/blog', label: 'Blog & Posts', icon: FileText },
  { href: '/admin/skills', label: 'Skills & Tools', icon: Wrench },
  { href: '/admin/timeline', label: 'Timeline & Edu', icon: Clock },
  { href: '/admin/credentials', label: 'Certifications', icon: Award },
  { href: '/admin/media', label: 'Media Library', icon: Image },
  { href: '/admin/messages', label: 'Contact Messages', icon: Inbox },
  { href: '/admin/audit-logs', label: 'Audit Logs', icon: History },
  { href: '/admin/settings', label: 'System Settings', icon: Settings },
];

export function AdminShell({ user, children }: AdminShellProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col md:flex-row text-[var(--foreground)]">
      {/* Mobile Header Bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-[var(--border-subtle)] bg-[var(--surface)] sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[var(--accent-emerald)]" />
          <span className="font-mono text-sm font-bold tracking-tight">CONTROL ROOM</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-md border border-[var(--border-subtle)] text-[var(--muted)] hover:text-[var(--foreground)]"
            aria-label="Toggle navigation menu"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-[var(--surface)] border-r border-[var(--border-subtle)] flex flex-col z-50 transition-transform duration-200 md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[var(--surface-raised)] border border-[var(--border-subtle)] flex items-center justify-center">
              <Terminal className="w-4 h-4 text-[var(--accent-emerald)]" />
            </div>
            <div>
              <div className="font-mono text-xs font-bold tracking-wider">DEV-CONTROL</div>
              <div className="text-[10px] font-mono text-[var(--muted)] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                ONLINE // ADMIN
              </div>
            </div>
          </Link>
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-mono transition-all ${
                  isActive
                    ? 'bg-[var(--accent-emerald)]/10 text-[var(--accent-emerald)] border border-[var(--accent-emerald)]/30 font-semibold'
                    : 'text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-raised)]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[var(--accent-emerald)]' : 'text-[var(--muted)]'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info & Footer Actions */}
        <div className="p-3 border-t border-[var(--border-subtle)] bg-[var(--surface-raised)]/50 space-y-2">
          <div className="px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border-subtle)] flex items-center justify-between">
            <div className="truncate">
              <div className="text-xs font-mono font-medium truncate">{user.name}</div>
              <div className="text-[10px] font-mono text-[var(--muted)] truncate">{user.email}</div>
            </div>
            <Activity className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          </div>

          <div className="flex items-center gap-1">
            <Link
              href="/"
              target="_blank"
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-[11px] font-mono text-[var(--muted)] hover:text-[var(--foreground)] border border-[var(--border-subtle)] hover:bg-[var(--surface)] transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Public Site</span>
            </Link>

            <form action={logoutAction} className="shrink-0">
              <button
                type="submit"
                title="Sign out"
                className="p-1.5 rounded-md text-red-400 hover:text-red-300 border border-red-500/20 hover:bg-red-500/10 transition-colors"
                aria-label="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 overflow-x-hidden min-h-screen flex flex-col">
        {/* Top Header Bar */}
        <header className="hidden md:flex items-center justify-between px-8 py-3.5 border-b border-[var(--border-subtle)] bg-[var(--surface)]/50 backdrop-blur sticky top-0 z-30">
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--muted)]">
            <span>root@control-room</span>
            <span>:</span>
            <span className="text-[var(--accent-emerald)] font-semibold">{pathname}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono bg-[var(--surface-raised)] border border-[var(--border-subtle)] text-[var(--muted)]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>POSTGRES: OK</span>
            </div>
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono text-[var(--muted)] hover:text-[var(--foreground)] border border-[var(--border-subtle)] hover:bg-[var(--surface-raised)] transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              <span>View Live</span>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>

      {/* Backdrop for mobile sidebar */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-xs"
        />
      )}
    </div>
  );
}
