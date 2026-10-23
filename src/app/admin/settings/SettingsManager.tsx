'use client';

import { useState } from 'react';
import { Save, ShieldCheck, ShieldAlert, KeyRound, QrCode, CheckCircle2 } from 'lucide-react';
import {
  updateSettingsAction,
  generate2FASetupAction,
  verifyAndEnable2FAAction,
  disable2FAAction,
} from '@/actions/settings';

interface SettingsManagerProps {
  initialSettings: Record<string, string>;
  initial2FAEnabled: boolean;
}

export function SettingsManager({ initialSettings, initial2FAEnabled }: SettingsManagerProps) {
  const [settings, setSettings] = useState(initialSettings);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(initial2FAEnabled);

  // 2FA Setup State
  const [setupData, setSetupData] = useState<{ secret: string; qrCodeDataUrl: string } | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSaveSettings(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    const fd = new FormData(e.currentTarget);
    const res = await updateSettingsAction(fd);
    setSaving(false);

    if (res?.error) {
      setFeedback({ type: 'error', message: res.error });
    } else {
      setFeedback({ type: 'success', message: 'System settings successfully updated' });
    }
  }

  async function handleStart2FASetup() {
    setFeedback(null);
    try {
      const data = await generate2FASetupAction();
      setSetupData(data);
    } catch {
      setFeedback({ type: 'error', message: 'Failed to initialize 2FA engine.' });
    }
  }

  async function handleVerify2FA(e: React.FormEvent) {
    e.preventDefault();
    if (!setupData || !verificationCode) return;

    const res = await verifyAndEnable2FAAction(verificationCode, setupData.secret);
    if (res?.error) {
      setFeedback({ type: 'error', message: res.error });
    } else {
      setTwoFactorEnabled(true);
      setSetupData(null);
      setVerificationCode('');
      setFeedback({ type: 'success', message: res.success || '2FA Enabled' });
    }
  }

  async function handleDisable2FA() {
    if (!confirm('Are you sure you want to disable 2-Factor Authentication?')) return;

    const res = await disable2FAAction();
    if (res?.error) {
      setFeedback({ type: 'error', message: res.error });
    } else {
      setTwoFactorEnabled(false);
      setFeedback({ type: 'success', message: res.success || '2FA Disabled' });
    }
  }

  return (
    <div className="space-y-8">
      {feedback && (
        <div
          className={`p-3.5 rounded-lg text-xs font-mono flex items-center gap-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
              : 'bg-red-500/10 border border-red-500/30 text-red-400'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <ShieldAlert className="w-4 h-4 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* General Settings Form */}
      <form onSubmit={handleSaveSettings} className="space-y-6">
        <div className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] space-y-4">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--muted)]">
            Site Configuration & Meta Defaults
          </h2>

          <div>
            <label className="block text-xs font-mono text-[var(--muted)] mb-1.5">Public Site Title</label>
            <input
              name="site_title"
              type="text"
              required
              value={settings.site_title || ''}
              onChange={(e) => setSettings({ ...settings, site_title: e.target.value })}
              className="w-full bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-xs font-mono text-[var(--foreground)] focus:border-[var(--accent-emerald)] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[var(--muted)] mb-1.5">Default SEO Meta Description</label>
            <textarea
              name="seo_description"
              rows={2}
              required
              value={settings.seo_description || ''}
              onChange={(e) => setSettings({ ...settings, seo_description: e.target.value })}
              className="w-full bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded-lg p-3 text-xs font-mono text-[var(--foreground)] focus:border-[var(--accent-emerald)] focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[var(--muted)] mb-1.5">Contact Notification Email</label>
            <input
              name="contact_forward_email"
              type="email"
              required
              value={settings.contact_forward_email || ''}
              onChange={(e) => setSettings({ ...settings, contact_forward_email: e.target.value })}
              className="w-full bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-xs font-mono text-[var(--foreground)] focus:border-[var(--accent-emerald)] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="flex items-center gap-2">
              <input
                id="enable_blog"
                name="enable_blog"
                type="checkbox"
                value="true"
                checked={settings.enable_blog === 'true'}
                onChange={(e) => setSettings({ ...settings, enable_blog: e.target.checked ? 'true' : 'false' })}
                className="rounded bg-[var(--surface-raised)] border-[var(--border-subtle)] text-[var(--accent-emerald)]"
              />
              <label htmlFor="enable_blog" className="text-xs font-mono text-[var(--foreground)]">
                Enable Public Blog Routes (/blog)
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="enable_analytics"
                name="enable_analytics"
                type="checkbox"
                value="true"
                checked={settings.enable_analytics === 'true'}
                onChange={(e) =>
                  setSettings({ ...settings, enable_analytics: e.target.checked ? 'true' : 'false' })
                }
                className="rounded bg-[var(--surface-raised)] border-[var(--border-subtle)] text-[var(--accent-emerald)]"
              />
              <label htmlFor="enable_analytics" className="text-xs font-mono text-[var(--foreground)]">
                Enable Privacy Analytics (Plausible/Umami)
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-mono font-semibold bg-[var(--accent-emerald)] text-slate-950 hover:bg-[var(--accent-emerald)]/90 transition-all disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </div>
        </div>
      </form>

      {/* Two-Factor Authentication Card */}
      <div className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-[var(--accent-emerald)]" />
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--foreground)]">
              Two-Factor Authentication (TOTP 2FA)
            </h2>
          </div>

          <span
            className={`inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded border ${
              twoFactorEnabled
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            }`}
          >
            {twoFactorEnabled ? <ShieldCheck className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
            {twoFactorEnabled ? 'ENFORCED' : 'DISABLED'}
          </span>
        </div>

        <p className="text-xs font-mono text-[var(--muted)] leading-relaxed">
          Standard RFC 6238 time-based one-time password protocol compatible with Google Authenticator, Bitwarden, 1Password, or YubiKey.
        </p>

        {!twoFactorEnabled && !setupData && (
          <button
            type="button"
            onClick={handleStart2FASetup}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-medium border border-[var(--border-subtle)] bg-[var(--surface-raised)] hover:bg-[var(--surface)] text-[var(--foreground)] transition-colors"
          >
            <QrCode className="w-3.5 h-3.5 text-[var(--accent-emerald)]" />
            <span>Setup 2-Factor Authenticator</span>
          </button>
        )}

        {setupData && !twoFactorEnabled && (
          <div className="p-4 rounded-lg bg-[var(--surface-raised)] border border-[var(--border-subtle)] space-y-4 animate-fadeIn">
            <div className="text-xs font-mono text-[var(--foreground)] font-semibold">
              Step 1: Scan this QR code in your Authenticator app
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="p-2 rounded bg-white w-fit">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={setupData.qrCodeDataUrl} alt="2FA QR Code" className="w-36 h-36" />
              </div>

              <div className="space-y-2">
                <div className="text-[11px] font-mono text-[var(--muted)]">Manual Secret Key:</div>
                <code className="text-xs font-mono bg-black/60 px-2.5 py-1 rounded border border-[var(--border-subtle)] text-[var(--accent-emerald)] block break-all">
                  {setupData.secret}
                </code>
              </div>
            </div>

            <form onSubmit={handleVerify2FA} className="space-y-3 pt-2">
              <label className="block text-xs font-mono text-[var(--muted)]">
                Step 2: Enter the 6-digit code shown in your app
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.trim())}
                  placeholder="000000"
                  className="bg-[var(--surface)] border border-[var(--border-subtle)] rounded px-3 py-1.5 text-sm font-mono tracking-widest text-[var(--foreground)] w-32 focus:border-[var(--accent-emerald)] focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded text-xs font-mono font-semibold bg-[var(--accent-emerald)] text-slate-950 hover:bg-[var(--accent-emerald)]/90"
                >
                  Verify & Activate
                </button>
                <button
                  type="button"
                  onClick={() => setSetupData(null)}
                  className="px-3 py-1.5 rounded text-xs font-mono text-[var(--muted)] hover:text-[var(--foreground)]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {twoFactorEnabled && (
          <div className="pt-2">
            <button
              type="button"
              onClick={handleDisable2FA}
              className="px-3 py-1.5 rounded-lg text-xs font-mono text-red-400 hover:text-red-300 border border-red-500/20 hover:bg-red-500/10 transition-colors"
            >
              Disable 2-Factor Authentication
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
