'use client';

import { useState } from 'react';
import { Plus, Trash2, Eye, EyeOff, Wrench } from 'lucide-react';
import {
  createCategoryAction,
  deleteCategoryAction,
  createSkillAction,
  deleteSkillAction,
  toggleSkillVisibilityAction,
} from '@/actions/skills';

interface Skill {
  id: string;
  name: string;
  level: string;
  order: number;
  visible: boolean;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  order: number;
  skills: Skill[];
}

export function SkillsManager({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [newCatName, setNewCatName] = useState('');
  const [addingToCat, setAddingToCat] = useState<string | null>(null);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState('PROFICIENT');

  async function handleAddCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const fd = new FormData();
    fd.append('name', newCatName);
    const res = await createCategoryAction(fd);
    if (res?.error) {
      alert(res.error);
    } else {
      setNewCatName('');
      window.location.reload();
    }
  }

  async function handleDeleteCategory(id: string, name: string) {
    if (!confirm(`Are you sure you want to delete category "${name}" and all its skills?`)) return;
    const res = await deleteCategoryAction(id);
    if (res?.error) {
      alert(res.error);
    } else {
      setCategories(categories.filter((c) => c.id !== id));
    }
  }

  async function handleAddSkill(categoryId: string) {
    if (!newSkillName.trim()) return;

    const fd = new FormData();
    fd.append('categoryId', categoryId);
    fd.append('name', newSkillName);
    fd.append('level', newSkillLevel);

    const res = await createSkillAction(fd);
    if (res?.error) {
      alert(res.error);
    } else {
      setNewSkillName('');
      setAddingToCat(null);
      window.location.reload();
    }
  }

  async function handleDeleteSkill(id: string) {
    if (!confirm('Delete this skill?')) return;
    const res = await deleteSkillAction(id);
    if (res?.error) {
      alert(res.error);
    } else {
      setCategories(
        categories.map((cat) => ({
          ...cat,
          skills: cat.skills.filter((s) => s.id !== id),
        }))
      );
    }
  }

  async function handleToggleVisibility(id: string, current: boolean) {
    const res = await toggleSkillVisibilityAction(id, !current);
    if (res?.error) {
      alert(res.error);
    } else {
      setCategories(
        categories.map((cat) => ({
          ...cat,
          skills: cat.skills.map((s) => (s.id === id ? { ...s, visible: !current } : s)),
        }))
      );
    }
  }

  return (
    <div className="space-y-6">
      {/* Add Category Bar */}
      <form
        onSubmit={handleAddCategory}
        className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] flex flex-col sm:flex-row items-center gap-3"
      >
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="New Category Name (e.g., 'Cloud Infrastructure (AWS/GCP)')"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            className="w-full bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-xs font-mono text-[var(--foreground)] focus:border-[var(--accent-emerald)] focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-mono font-medium bg-[var(--accent-emerald)] text-slate-950 hover:bg-[var(--accent-emerald)]/90 transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Category</span>
        </button>
      </form>

      {/* Category List */}
      <div className="space-y-4">
        {categories.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-[var(--border-subtle)] rounded-xl bg-[var(--surface)]">
            <p className="text-xs font-mono text-[var(--muted)]">No skill categories defined yet.</p>
          </div>
        ) : (
          categories.map((cat) => (
            <div
              key={cat.id}
              className="p-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-[var(--accent-emerald)]" />
                  <h3 className="text-sm font-bold font-mono text-[var(--foreground)]">{cat.name}</h3>
                  <span className="text-[10px] font-mono text-[var(--muted)] px-2 py-0.5 rounded bg-[var(--surface-raised)] border border-[var(--border-subtle)]">
                    {cat.skills.length} skills
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setAddingToCat(addingToCat === cat.id ? null : cat.id)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono text-[var(--foreground)] border border-[var(--border-subtle)] hover:bg-[var(--surface-raised)] transition-colors"
                  >
                    <Plus className="w-3 h-3 text-[var(--accent-emerald)]" />
                    <span>Add Skill</span>
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(cat.id, cat.name)}
                    className="p-1 rounded text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                    title="Delete Category"
                    aria-label="Delete Category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Add Skill Inline Form */}
              {addingToCat === cat.id && (
                <div className="p-3 rounded-lg bg-[var(--surface-raised)] border border-[var(--border-subtle)] flex flex-col sm:flex-row items-center gap-2.5 animate-fadeIn">
                  <input
                    type="text"
                    placeholder="Skill name (e.g., Docker, Bash, Terraform)"
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    className="flex-1 w-full bg-[var(--surface)] border border-[var(--border-subtle)] rounded px-2.5 py-1.5 text-xs font-mono text-[var(--foreground)] focus:border-[var(--accent-emerald)] focus:outline-none"
                  />
                  <select
                    value={newSkillLevel}
                    onChange={(e) => setNewSkillLevel(e.target.value)}
                    className="w-full sm:w-auto bg-[var(--surface)] border border-[var(--border-subtle)] rounded px-2.5 py-1.5 text-xs font-mono text-[var(--foreground)] focus:border-[var(--accent-emerald)] focus:outline-none"
                  >
                    <option value="EXPERT">EXPERT (Production Grade)</option>
                    <option value="ADVANCED">ADVANCED</option>
                    <option value="PROFICIENT">PROFICIENT</option>
                    <option value="INTERMEDIATE">INTERMEDIATE</option>
                    <option value="BEGINNER">BEGINNER (Planned / Exploring)</option>
                  </select>
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      type="button"
                      onClick={() => handleAddSkill(cat.id)}
                      className="px-3 py-1.5 rounded text-xs font-mono bg-[var(--accent-emerald)] text-slate-950 font-semibold hover:bg-[var(--accent-emerald)]/90"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddingToCat(null)}
                      className="px-2 py-1.5 rounded text-xs font-mono text-[var(--muted)] hover:text-[var(--foreground)]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Skills Pills */}
              <div className="flex flex-wrap gap-2">
                {cat.skills.length === 0 ? (
                  <p className="text-xs font-mono text-[var(--muted)]/60 italic">No skills in this category.</p>
                ) : (
                  cat.skills.map((skill) => (
                    <div
                      key={skill.id}
                      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-mono border transition-all ${
                        skill.visible
                          ? 'bg-[var(--surface-raised)] border-[var(--border-subtle)] text-[var(--foreground)]'
                          : 'bg-slate-900/40 border-slate-800 text-[var(--muted)]/50 line-through'
                      }`}
                    >
                      <span>{skill.name}</span>
                      <span className="text-[9px] px-1 rounded bg-[var(--surface)] border border-[var(--border-subtle)] text-[var(--accent-cyan)]">
                        {skill.level}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggleVisibility(skill.id, skill.visible)}
                        className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                        title={skill.visible ? 'Hide skill from public site' : 'Show skill on public site'}
                        aria-label="Toggle visibility"
                      >
                        {skill.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3 text-amber-400" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSkill(skill.id)}
                        className="text-[var(--muted)] hover:text-red-400 transition-colors"
                        title="Delete skill"
                        aria-label="Delete skill"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
