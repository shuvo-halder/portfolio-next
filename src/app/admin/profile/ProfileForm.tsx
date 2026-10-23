'use client';

import { useActionState } from 'react';
import { Save, AlertCircle, CheckCircle2, User, Globe, Mail, MapPin, FileText } from 'lucide-react';
import { updateProfileAction } from '@/actions/profile';

interface ProfileFormProps {
  initialData: {
    name: string;
    headline: string;
    bio: string;
    avatarUrl: string | null;
    resumeUrl: string | null;
    location: string | null;
    email: string;
    availabilityStatus: string;
    availabilityMessage: string | null;
    socialLinks: unknown;
  };
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState(updateProfileAction, null);

  const socials = (initialData.socialLinks as Record<string, string>) || {};

  return (
    <form action={formAction} className="space-y-6">
      {state?.error && (
        <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      {state?.success && (
        <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{state.success}</span>
        </div>
      )}

      {/* Basic Identity Card */}
      <div className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] space-y-4">
        <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--muted)] flex items-center gap-2">
          <User className="w-4 h-4 text-[var(--accent-emerald)]" />
          General Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-[var(--muted)] mb-1.5">Full Name</label>
            <input
              name="name"
              type="text"
              required
              defaultValue={initialData.name}
              className="w-full bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-xs font-mono text-[var(--foreground)] focus:border-[var(--accent-emerald)] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[var(--muted)] mb-1.5">Direct Contact Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
              <input
                name="email"
                type="email"
                required
                defaultValue={initialData.email}
                className="w-full bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-[var(--foreground)] focus:border-[var(--accent-emerald)] focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-[var(--muted)] mb-1.5">Headline / Tagline</label>
          <input
            name="headline"
            type="text"
            required
            defaultValue={initialData.headline}
            className="w-full bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-xs font-mono text-[var(--foreground)] focus:border-[var(--accent-emerald)] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-[var(--muted)] mb-1.5">Professional Bio</label>
          <textarea
            name="bio"
            rows={5}
            required
            defaultValue={initialData.bio}
            className="w-full bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded-lg p-3 text-xs font-mono text-[var(--foreground)] focus:border-[var(--accent-emerald)] focus:outline-none leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-mono text-[var(--muted)] mb-1.5">Location / Zone</label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
              <input
                name="location"
                type="text"
                defaultValue={initialData.location || ''}
                placeholder="/dev/null"
                className="w-full bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-[var(--foreground)] focus:border-[var(--accent-emerald)] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-[var(--muted)] mb-1.5">Avatar File URL</label>
            <input
              name="avatarUrl"
              type="text"
              defaultValue={initialData.avatarUrl || ''}
              placeholder="/avatar.png"
              className="w-full bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-xs font-mono text-[var(--foreground)] focus:border-[var(--accent-emerald)] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[var(--muted)] mb-1.5">Resume / CV File Path</label>
            <div className="relative">
              <FileText className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
              <input
                name="resumeUrl"
                type="text"
                defaultValue={initialData.resumeUrl || ''}
                placeholder="/resume.pdf"
                className="w-full bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-[var(--foreground)] focus:border-[var(--accent-emerald)] focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Availability Status Card */}
      <div className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] space-y-4">
        <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--muted)] flex items-center gap-2">
          <Globe className="w-4 h-4 text-[var(--accent-emerald)]" />
          Availability & Status Telemetry
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-[var(--muted)] mb-1.5">Status Code</label>
            <select
              name="availabilityStatus"
              defaultValue={initialData.availabilityStatus}
              className="w-full bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-xs font-mono text-[var(--foreground)] focus:border-[var(--accent-emerald)] focus:outline-none"
            >
              <option value="available">Available (Operational / Ready for Work)</option>
              <option value="open_to_offers">Open to Opportunities</option>
              <option value="busy">Engaged / Contracted</option>
              <option value="offline">Offline / Maintenance</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono text-[var(--muted)] mb-1.5">Custom Status Message</label>
            <input
              name="availabilityMessage"
              type="text"
              defaultValue={initialData.availabilityMessage || ''}
              placeholder="Available for DevOps contracts & SRE consulting"
              className="w-full bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-xs font-mono text-[var(--foreground)] focus:border-[var(--accent-emerald)] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Social Profiles Card */}
      <div className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] space-y-4">
        <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--muted)]">
          Social & External Endpoints
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-[var(--muted)] mb-1.5">GitHub URL</label>
            <input
              name="githubUrl"
              type="url"
              defaultValue={socials.github || ''}
              placeholder="https://github.com/..."
              className="w-full bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-xs font-mono text-[var(--foreground)] focus:border-[var(--accent-emerald)] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[var(--muted)] mb-1.5">LinkedIn URL</label>
            <input
              name="linkedinUrl"
              type="url"
              defaultValue={socials.linkedin || ''}
              placeholder="https://linkedin.com/in/..."
              className="w-full bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-xs font-mono text-[var(--foreground)] focus:border-[var(--accent-emerald)] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[var(--muted)] mb-1.5">Dev.to URL</label>
            <input
              name="devtoUrl"
              type="url"
              defaultValue={socials.devto || ''}
              placeholder="https://dev.to/..."
              className="w-full bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-xs font-mono text-[var(--foreground)] focus:border-[var(--accent-emerald)] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[var(--muted)] mb-1.5">HackerRank URL</label>
            <input
              name="hackerrankUrl"
              type="url"
              defaultValue={socials.hackerrank || ''}
              placeholder="https://hackerrank.com/..."
              className="w-full bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-xs font-mono text-[var(--foreground)] focus:border-[var(--accent-emerald)] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[var(--muted)] mb-1.5">Hugging Face URL</label>
            <input
              name="huggingfaceUrl"
              type="url"
              defaultValue={socials.huggingface || ''}
              placeholder="https://huggingface.co/..."
              className="w-full bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-xs font-mono text-[var(--foreground)] focus:border-[var(--accent-emerald)] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[var(--muted)] mb-1.5">Organization / Website URL</label>
            <input
              name="websiteUrl"
              type="url"
              defaultValue={socials.website || ''}
              placeholder="https://binrecon.io"
              className="w-full bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-xs font-mono text-[var(--foreground)] focus:border-[var(--accent-emerald)] focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-mono font-semibold bg-[var(--accent-emerald)] text-slate-950 hover:bg-[var(--accent-emerald)]/90 transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isPending ? 'Committing Changes...' : 'Save Profile Changes'}</span>
        </button>
      </div>
    </form>
  );
}
