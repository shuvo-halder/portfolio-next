'use client';

import { useState } from 'react';
import { Plus, Trash2, Award, Trophy, ExternalLink, Calendar } from 'lucide-react';
import {
  createCertificationAction,
  deleteCertificationAction,
  createAchievementAction,
  deleteAchievementAction,
} from '@/actions/credentials';

interface Certification {
  id: string;
  title: string;
  issuer: string;
  issueDate: Date;
  expiryDate: Date | null;
  credentialId: string | null;
  credentialUrl: string | null;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  link: string | null;
}

export function CredentialsManager({
  initialCerts,
  initialAchievements,
}: {
  initialCerts: Certification[];
  initialAchievements: Achievement[];
}) {
  const [certs, setCerts] = useState(initialCerts);
  const [achievements, setAchievements] = useState(initialAchievements);
  const [activeTab, setActiveTab] = useState<'certs' | 'achievements'>('certs');
  const [showAddModal, setShowAddModal] = useState(false);

  async function handleDeleteCert(id: string) {
    if (!confirm('Delete this certification record?')) return;
    const res = await deleteCertificationAction(id);
    if (res?.error) alert(res.error);
    else setCerts(certs.filter((c) => c.id !== id));
  }

  async function handleDeleteAch(id: string) {
    if (!confirm('Delete this achievement?')) return;
    const res = await deleteAchievementAction(id);
    if (res?.error) alert(res.error);
    else setAchievements(achievements.filter((a) => a.id !== id));
  }

  async function handleAddCert(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const res = await createCertificationAction(fd);
    if (res?.error) alert(res.error);
    else {
      setShowAddModal(false);
      window.location.reload();
    }
  }

  async function handleAddAch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const res = await createAchievementAction(fd);
    if (res?.error) alert(res.error);
    else {
      setShowAddModal(false);
      window.location.reload();
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 border border-[var(--border-subtle)] p-1 rounded-lg bg-[var(--surface)] w-fit">
          <button
            onClick={() => setActiveTab('certs')}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${
              activeTab === 'certs'
                ? 'bg-[var(--accent-emerald)] text-slate-950 font-bold'
                : 'text-[var(--muted)] hover:text-[var(--foreground)]'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Certifications ({certs.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${
              activeTab === 'achievements'
                ? 'bg-[var(--accent-emerald)] text-slate-950 font-bold'
                : 'text-[var(--muted)] hover:text-[var(--foreground)]'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Achievements ({achievements.length})</span>
          </button>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-[var(--accent-emerald)] text-slate-950 hover:bg-[var(--accent-emerald)]/90 transition-colors w-fit"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{activeTab === 'certs' ? 'Add Certification' : 'Add Achievement'}</span>
        </button>
      </div>

      {activeTab === 'certs' && (
        <div className="space-y-3">
          {certs.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-[var(--border-subtle)] rounded-xl bg-[var(--surface)]">
              <p className="text-xs font-mono text-[var(--muted)]">No certifications added yet.</p>
            </div>
          ) : (
            certs.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] flex items-center justify-between"
              >
                <div>
                  <h3 className="text-sm font-bold font-mono text-[var(--foreground)]">{c.title}</h3>
                  <div className="text-xs font-mono text-[var(--accent-emerald)] mt-0.5">{c.issuer}</div>
                  <div className="flex items-center gap-3 text-[11px] font-mono text-[var(--muted)] mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Issued: {new Date(c.issueDate).toLocaleDateString()}
                    </span>
                    {c.credentialId && <span>ID: {c.credentialId}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {c.credentialUrl && (
                    <a
                      href={c.credentialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded border border-[var(--border-subtle)] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                      title="Verify Credential"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <button
                    onClick={() => handleDeleteCert(c.id)}
                    className="p-1.5 rounded text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                    title="Delete Certification"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'achievements' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {achievements.length === 0 ? (
            <div className="col-span-2 p-8 text-center border border-dashed border-[var(--border-subtle)] rounded-xl bg-[var(--surface)]">
              <p className="text-xs font-mono text-[var(--muted)]">No achievements added yet.</p>
            </div>
          ) : (
            achievements.map((a) => (
              <div
                key={a.id}
                className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] flex items-start justify-between gap-3"
              >
                <div>
                  <h3 className="text-xs font-bold font-mono text-[var(--foreground)]">{a.title}</h3>
                  <p className="text-[11px] font-mono text-[var(--muted)] mt-1">{a.description}</p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {a.link && (
                    <a
                      href={a.link}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1 rounded text-[var(--muted)] hover:text-[var(--foreground)]"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <button
                    onClick={() => handleDeleteAch(a.id)}
                    className="p-1 rounded text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[var(--surface)] border border-[var(--border-subtle)] rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <h3 className="text-sm font-bold font-mono text-[var(--foreground)]">
                {activeTab === 'certs' ? 'Add Certification' : 'Add Achievement'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-xs font-mono text-[var(--muted)] hover:text-[var(--foreground)]"
              >
                ✕
              </button>
            </div>

            {activeTab === 'certs' ? (
              <form onSubmit={handleAddCert} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-[var(--muted)] mb-1">Certification Title</label>
                  <input
                    name="title"
                    type="text"
                    required
                    placeholder="e.g. AWS Certified Solutions Architect"
                    className="w-full bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded px-3 py-2 text-xs font-mono text-[var(--foreground)] focus:border-[var(--accent-emerald)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[var(--muted)] mb-1">Issuing Authority / Organization</label>
                  <input
                    name="issuer"
                    type="text"
                    required
                    placeholder="e.g. Amazon Web Services / Linux Foundation"
                    className="w-full bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded px-3 py-2 text-xs font-mono text-[var(--foreground)] focus:border-[var(--accent-emerald)] focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-[var(--muted)] mb-1">Issue Date</label>
                    <input
                      name="issueDate"
                      type="date"
                      required
                      defaultValue="2024-01-01"
                      className="w-full bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded px-3 py-2 text-xs font-mono text-[var(--foreground)] focus:border-[var(--accent-emerald)] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-[var(--muted)] mb-1">Expiry Date (Optional)</label>
                    <input
                      name="expiryDate"
                      type="date"
                      className="w-full bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded px-3 py-2 text-xs font-mono text-[var(--foreground)] focus:border-[var(--accent-emerald)] focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-mono text-[var(--muted)] mb-1">Credential ID (Optional)</label>
                  <input
                    name="credentialId"
                    type="text"
                    placeholder="AWS-1234567"
                    className="w-full bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded px-3 py-2 text-xs font-mono text-[var(--foreground)] focus:border-[var(--accent-emerald)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[var(--muted)] mb-1">Verification URL (Optional)</label>
                  <input
                    name="credentialUrl"
                    type="url"
                    placeholder="https://credly.com/..."
                    className="w-full bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded px-3 py-2 text-xs font-mono text-[var(--foreground)] focus:border-[var(--accent-emerald)] focus:outline-none"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded text-xs font-mono text-[var(--muted)] hover:text-[var(--foreground)]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded text-xs font-mono font-semibold bg-[var(--accent-emerald)] text-slate-950"
                  >
                    Save Certification
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleAddAch} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-[var(--muted)] mb-1">Achievement Title</label>
                  <input
                    name="title"
                    type="text"
                    required
                    placeholder="e.g. GitHub Pull Shark (x2 Bronze)"
                    className="w-full bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded px-3 py-2 text-xs font-mono text-[var(--foreground)] focus:border-[var(--accent-emerald)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[var(--muted)] mb-1">Description</label>
                  <input
                    name="description"
                    type="text"
                    required
                    placeholder="Merged 16+ verified pull requests across open-source repositories"
                    className="w-full bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded px-3 py-2 text-xs font-mono text-[var(--foreground)] focus:border-[var(--accent-emerald)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[var(--muted)] mb-1">External Link (Optional)</label>
                  <input
                    name="link"
                    type="url"
                    placeholder="https://github.com/shuvo-halder?achievement=pull-shark"
                    className="w-full bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded px-3 py-2 text-xs font-mono text-[var(--foreground)] focus:border-[var(--accent-emerald)] focus:outline-none"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded text-xs font-mono text-[var(--muted)] hover:text-[var(--foreground)]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded text-xs font-mono font-semibold bg-[var(--accent-emerald)] text-slate-950"
                  >
                    Save Achievement
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
