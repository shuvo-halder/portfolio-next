'use client';

import { useState } from 'react';
import { Plus, Trash2, Briefcase, GraduationCap, Calendar, MapPin } from 'lucide-react';
import {
  createExperienceAction,
  deleteExperienceAction,
  createEducationAction,
  deleteEducationAction,
} from '@/actions/timeline';

interface Experience {
  id: string;
  company: string;
  role: string;
  location: string | null;
  startDate: Date;
  endDate: Date | null;
  current: boolean;
  description: string;
  tech: string[];
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: Date;
  endDate: Date | null;
  current: boolean;
  description: string | null;
}

export function TimelineManager({
  initialExperiences,
  initialEducations,
}: {
  initialExperiences: Experience[];
  initialEducations: Education[];
}) {
  const [activeTab, setActiveTab] = useState<'experience' | 'education'>('experience');
  const [experiences, setExperiences] = useState(initialExperiences);
  const [educations, setEducations] = useState(initialEducations);
  const [showAddModal, setShowAddModal] = useState(false);

  async function handleDeleteExp(id: string) {
    if (!confirm('Delete this career experience entry?')) return;
    const res = await deleteExperienceAction(id);
    if (res?.error) alert(res.error);
    else setExperiences(experiences.filter((e) => e.id !== id));
  }

  async function handleDeleteEdu(id: string) {
    if (!confirm('Delete this education entry?')) return;
    const res = await deleteEducationAction(id);
    if (res?.error) alert(res.error);
    else setEducations(educations.filter((e) => e.id !== id));
  }

  async function handleAddExperience(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const res = await createExperienceAction(fd);
    if (res?.error) alert(res.error);
    else {
      setShowAddModal(false);
      window.location.reload();
    }
  }

  async function handleAddEducation(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const res = await createEducationAction(fd);
    if (res?.error) alert(res.error);
    else {
      setShowAddModal(false);
      window.location.reload();
    }
  }

  return (
    <div className="space-y-6">
      {/* Tabs & Add Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 border border-[var(--border-subtle)] p-1 rounded-lg bg-[var(--surface)] w-fit">
          <button
            onClick={() => setActiveTab('experience')}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${
              activeTab === 'experience'
                ? 'bg-[var(--accent-emerald)] text-slate-950 font-bold'
                : 'text-[var(--muted)] hover:text-[var(--foreground)]'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Work / Projects ({experiences.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('education')}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${
              activeTab === 'education'
                ? 'bg-[var(--accent-emerald)] text-slate-950 font-bold'
                : 'text-[var(--muted)] hover:text-[var(--foreground)]'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Education ({educations.length})</span>
          </button>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-[var(--accent-emerald)] text-slate-950 hover:bg-[var(--accent-emerald)]/90 transition-colors w-fit"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{activeTab === 'experience' ? 'Add Experience' : 'Add Education'}</span>
        </button>
      </div>

      {/* Experience Tab Content */}
      {activeTab === 'experience' && (
        <div className="space-y-4">
          {experiences.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-[var(--border-subtle)] rounded-xl bg-[var(--surface)]">
              <p className="text-xs font-mono text-[var(--muted)]">No experience entries recorded.</p>
            </div>
          ) : (
            experiences.map((exp) => (
              <div
                key={exp.id}
                className="p-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold font-mono text-[var(--foreground)]">{exp.role}</h3>
                    <div className="text-xs font-mono text-[var(--accent-emerald)] mt-0.5">{exp.company}</div>
                    <div className="flex items-center gap-3 text-[11px] font-mono text-[var(--muted)] mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(exp.startDate).getFullYear()} -{' '}
                        {exp.current ? 'Present' : exp.endDate ? new Date(exp.endDate).getFullYear() : 'Present'}
                      </span>
                      {exp.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {exp.location}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteExp(exp.id)}
                    className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
                    title="Delete Experience"
                    aria-label="Delete Experience"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-xs font-mono text-[var(--muted)] leading-relaxed whitespace-pre-line">
                  {exp.description}
                </p>

                {exp.tech.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {exp.tech.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--surface-raised)] border border-[var(--border-subtle)] text-[var(--muted)]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Education Tab Content */}
      {activeTab === 'education' && (
        <div className="space-y-4">
          {educations.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-[var(--border-subtle)] rounded-xl bg-[var(--surface)]">
              <p className="text-xs font-mono text-[var(--muted)]">No education entries recorded.</p>
            </div>
          ) : (
            educations.map((edu) => (
              <div
                key={edu.id}
                className="p-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold font-mono text-[var(--foreground)]">
                      {edu.degree} in {edu.field}
                    </h3>
                    <div className="text-xs font-mono text-[var(--accent-emerald)] mt-0.5">{edu.institution}</div>
                    <div className="text-[11px] font-mono text-[var(--muted)] mt-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(edu.startDate).getFullYear()} -{' '}
                      {edu.current ? 'Ongoing' : edu.endDate ? new Date(edu.endDate).getFullYear() : 'Completed'}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteEdu(edu.id)}
                    className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
                    title="Delete Education"
                    aria-label="Delete Education"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {edu.description && (
                  <p className="text-xs font-mono text-[var(--muted)] leading-relaxed pt-1">{edu.description}</p>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[var(--surface)] border border-[var(--border-subtle)] rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <h3 className="text-sm font-bold font-mono text-[var(--foreground)]">
                {activeTab === 'experience' ? 'Add Experience / Role' : 'Add Education Record'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-xs font-mono text-[var(--muted)] hover:text-[var(--foreground)]"
              >
                ✕
              </button>
            </div>

            {activeTab === 'experience' ? (
              <form onSubmit={handleAddExperience} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-[var(--muted)] mb-1">Company / Organization</label>
                  <input
                    name="company"
                    type="text"
                    required
                    placeholder="e.g. BinRecon Corp."
                    className="w-full bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded px-3 py-2 text-xs font-mono text-[var(--foreground)] focus:border-[var(--accent-emerald)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[var(--muted)] mb-1">Role Title</label>
                  <input
                    name="role"
                    type="text"
                    required
                    placeholder="e.g. Systems Engineer & SRE"
                    className="w-full bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded px-3 py-2 text-xs font-mono text-[var(--foreground)] focus:border-[var(--accent-emerald)] focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-[var(--muted)] mb-1">Start Date</label>
                    <input
                      name="startDate"
                      type="date"
                      required
                      defaultValue="2023-01-01"
                      className="w-full bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded px-3 py-2 text-xs font-mono text-[var(--foreground)] focus:border-[var(--accent-emerald)] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-[var(--muted)] mb-1">End Date</label>
                    <input
                      name="endDate"
                      type="date"
                      className="w-full bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded px-3 py-2 text-xs font-mono text-[var(--foreground)] focus:border-[var(--accent-emerald)] focus:outline-none"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input id="currentRole" name="current" type="checkbox" defaultChecked className="rounded" />
                  <label htmlFor="currentRole" className="text-xs font-mono text-[var(--muted)]">
                    Currently in this role
                  </label>
                </div>
                <div>
                  <label className="block text-xs font-mono text-[var(--muted)] mb-1">Location</label>
                  <input
                    name="location"
                    type="text"
                    placeholder="Remote / binrecon.io"
                    className="w-full bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded px-3 py-2 text-xs font-mono text-[var(--foreground)] focus:border-[var(--accent-emerald)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[var(--muted)] mb-1">Tech Tags (comma separated)</label>
                  <input
                    name="tech"
                    type="text"
                    placeholder="Linux, Nginx, Docker, Bash Automation"
                    className="w-full bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded px-3 py-2 text-xs font-mono text-[var(--foreground)] focus:border-[var(--accent-emerald)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[var(--muted)] mb-1">Description / Key Accomplishments</label>
                  <textarea
                    name="description"
                    rows={4}
                    required
                    placeholder="Key systems engineered, automation delivered..."
                    className="w-full bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded p-3 text-xs font-mono text-[var(--foreground)] focus:border-[var(--accent-emerald)] focus:outline-none"
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
                    Save Entry
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleAddEducation} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-[var(--muted)] mb-1">Institution</label>
                  <input
                    name="institution"
                    type="text"
                    required
                    placeholder="e.g. University Department of CS"
                    className="w-full bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded px-3 py-2 text-xs font-mono text-[var(--foreground)] focus:border-[var(--accent-emerald)] focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-[var(--muted)] mb-1">Degree</label>
                    <input
                      name="degree"
                      type="text"
                      required
                      placeholder="B.Tech"
                      className="w-full bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded px-3 py-2 text-xs font-mono text-[var(--foreground)] focus:border-[var(--accent-emerald)] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-[var(--muted)] mb-1">Field of Study</label>
                    <input
                      name="field"
                      type="text"
                      required
                      placeholder="Computer Science"
                      className="w-full bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded px-3 py-2 text-xs font-mono text-[var(--foreground)] focus:border-[var(--accent-emerald)] focus:outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-[var(--muted)] mb-1">Start Date</label>
                    <input
                      name="startDate"
                      type="date"
                      required
                      defaultValue="2022-09-01"
                      className="w-full bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded px-3 py-2 text-xs font-mono text-[var(--foreground)] focus:border-[var(--accent-emerald)] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-[var(--muted)] mb-1">End Date</label>
                    <input
                      name="endDate"
                      type="date"
                      className="w-full bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded px-3 py-2 text-xs font-mono text-[var(--foreground)] focus:border-[var(--accent-emerald)] focus:outline-none"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input id="currentEdu" name="current" type="checkbox" defaultChecked className="rounded" />
                  <label htmlFor="currentEdu" className="text-xs font-mono text-[var(--muted)]">
                    Currently studying
                  </label>
                </div>
                <div>
                  <label className="block text-xs font-mono text-[var(--muted)] mb-1">Description (Optional)</label>
                  <textarea
                    name="description"
                    rows={3}
                    placeholder="Focus areas: Operating Systems, Networks, Distributed Systems..."
                    className="w-full bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded p-3 text-xs font-mono text-[var(--foreground)] focus:border-[var(--accent-emerald)] focus:outline-none"
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
                    Save Record
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
