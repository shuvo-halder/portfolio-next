'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { Lock, Mail, Terminal, ArrowLeft, ShieldCheck, AlertCircle } from 'lucide-react';
import { loginAction } from '@/actions/auth';

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background scanline & CRT effect */}
      <div className="fixed inset-0 crt-grid opacity-30 pointer-events-none" />
      <div className="fixed inset-0 bg-radial-[at_top] from-[var(--accent-emerald)]/5 via-transparent to-transparent pointer-events-none" />

      {/* Back to Home Link */}
      <div className="absolute top-6 left-6 z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-[var(--muted)] hover:text-[var(--foreground)] transition-colors px-3 py-1.5 rounded-md border border-[var(--border-subtle)] bg-[var(--surface)]/80 backdrop-blur"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit to Public Site</span>
        </Link>
      </div>

      <div className="w-full max-w-md z-10">
        {/* Terminal Header */}
        <div className="bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded-t-xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="font-mono text-xs text-[var(--muted)] ml-2 flex items-center gap-1.5">
              <Terminal className="w-3 h-3 text-[var(--accent-emerald)]" />
              auth-gateway.service
            </span>
          </div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-3 h-3" />
            TLS 1.3
          </span>
        </div>

        {/* Card Body */}
        <div className="bg-[var(--surface)] border-x border-b border-[var(--border-subtle)] rounded-b-xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          <div className="mb-6 text-center">
            <h1 className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-[var(--foreground)]">
              Control Room Login
            </h1>
            <p className="text-xs font-mono text-[var(--muted)] mt-1.5">
              Restricted Area // Single-Admin Authentication Protocol
            </p>
          </div>

          {state?.error && (
            <div className="mb-6 p-3.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
              <span>{state.error}</span>
            </div>
          )}

          <form action={formAction} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-mono text-[var(--muted)] mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="admin@domain.com"
                  className="w-full bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-[var(--foreground)] placeholder:text-[var(--muted)]/50 focus:outline-none focus:border-[var(--accent-emerald)] transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-mono text-[var(--muted)] mb-1.5">
                Security Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  className="w-full bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-[var(--foreground)] placeholder:text-[var(--muted)]/50 focus:outline-none focus:border-[var(--accent-emerald)] transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full mt-2 bg-[var(--accent-emerald)] hover:bg-[var(--accent-emerald)]/90 text-slate-950 font-mono font-semibold py-2.5 px-4 rounded-lg text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(16,185,129,0.2)]"
            >
              {isPending ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Authenticate Session</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[var(--border-subtle)] text-center">
            <p className="text-[10px] font-mono text-[var(--muted)]">
              Self-hosted VPS Instance &bull; Argon2/Bcrypt Guarded &bull; Audit Logged
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
