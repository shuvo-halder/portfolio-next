'use client';

import { useState } from 'react';
import { Upload, Trash2, Copy, Check, FileText, Image as ImageIcon } from 'lucide-react';
import { uploadMediaAction, deleteMediaAction } from '@/actions/media';

interface MediaItem {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  createdAt: Date;
}

export function MediaManager({ initialFiles }: { initialFiles: MediaItem[] }) {
  const [files, setFiles] = useState(initialFiles);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setUploading(true);
    setError(null);

    const fd = new FormData();
    fd.append('file', selected);

    const res = await uploadMediaAction(null, fd);
    setUploading(false);

    if (res?.error) {
      setError(res.error);
    } else if (res?.media) {
      setFiles([res.media, ...files]);
      e.target.value = '';
    }
  }

  async function handleDelete(id: string, originalName: string) {
    if (!confirm(`Delete asset "${originalName}"?`)) return;

    const res = await deleteMediaAction(id);
    if (res?.error) {
      alert(res.error);
    } else {
      setFiles(files.filter((f) => f.id !== id));
    }
  }

  function handleCopy(url: string, id: string) {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="space-y-6">
      {/* Upload Dropzone */}
      <div className="p-6 rounded-xl border border-dashed border-[var(--border-subtle)] bg-[var(--surface)] text-center relative hover:border-[var(--accent-emerald)]/50 transition-colors">
        <Upload className="w-8 h-8 mx-auto text-[var(--accent-emerald)] mb-2" />
        <h3 className="text-sm font-bold font-mono text-[var(--foreground)]">Upload Static Media Asset</h3>
        <p className="text-xs font-mono text-[var(--muted)] mt-1 max-w-sm mx-auto">
          Drag & drop or click to upload PNG, JPEG, WebP, SVG, or PDF (Max 5MB images, 10MB PDFs).
        </p>

        <label className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-mono font-medium bg-[var(--surface-raised)] border border-[var(--border-subtle)] text-[var(--foreground)] hover:bg-[var(--surface)] cursor-pointer">
          <span>{uploading ? 'Processing File...' : 'Choose File'}</span>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml,application/pdf"
            disabled={uploading}
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {error && (
        <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
          {error}
        </div>
      )}

      {/* Media Grid */}
      {files.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-[var(--border-subtle)] rounded-xl bg-[var(--surface)]">
          <ImageIcon className="w-8 h-8 mx-auto text-[var(--muted)] mb-2 opacity-50" />
          <p className="text-xs font-mono text-[var(--muted)]">No media assets in library.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {files.map((file) => {
            const isImage = file.mimeType.startsWith('image/');

            return (
              <div
                key={file.id}
                className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] overflow-hidden flex flex-col group hover:border-[var(--accent-emerald)]/40 transition-all"
              >
                {/* Thumbnail / Preview Container */}
                <div className="h-32 bg-[var(--surface-raised)] flex items-center justify-center overflow-hidden border-b border-[var(--border-subtle)] relative">
                  {isImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={file.url}
                      alt={file.originalName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <FileText className="w-12 h-12 text-[var(--accent-cyan)] opacity-70" />
                  )}

                  <span className="absolute bottom-2 left-2 text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/70 text-white backdrop-blur-xs">
                    {formatBytes(file.size)}
                  </span>
                </div>

                {/* Details & Actions */}
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div className="truncate mb-2">
                    <div className="text-xs font-mono font-bold text-[var(--foreground)] truncate" title={file.originalName}>
                      {file.originalName}
                    </div>
                    <div className="text-[10px] font-mono text-[var(--muted)] truncate mt-0.5">
                      {file.url}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)]/60">
                    <button
                      onClick={() => handleCopy(file.url, file.id)}
                      className="inline-flex items-center gap-1 text-[11px] font-mono text-[var(--muted)] hover:text-[var(--accent-emerald)] transition-colors"
                      title="Copy Public URL"
                    >
                      {copiedId === file.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy URL</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleDelete(file.id, file.originalName)}
                      className="p-1 rounded text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                      title="Delete asset"
                      aria-label="Delete asset"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
