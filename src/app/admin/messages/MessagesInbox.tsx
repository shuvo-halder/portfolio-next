'use client';

import { useState } from 'react';
import { Mail, Trash2, Archive, CheckCircle2, Reply, Calendar, Inbox } from 'lucide-react';
import { markMessageStatusAction, deleteMessageAction } from '@/actions/messages';

interface ContactMessageItem {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  status: 'UNREAD' | 'READ' | 'ARCHIVED' | 'SPAM';
  ipAddress: string | null;
  createdAt: Date;
}

export function MessagesInbox({ initialMessages }: { initialMessages: ContactMessageItem[] }) {
  const [messages, setMessages] = useState(initialMessages);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessageItem | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'UNREAD' | 'ARCHIVED'>('ALL');

  const filtered = messages.filter((m) => {
    if (filter === 'UNREAD') return m.status === 'UNREAD';
    if (filter === 'ARCHIVED') return m.status === 'ARCHIVED';
    return true;
  });

  async function handleMarkStatus(id: string, status: 'UNREAD' | 'READ' | 'ARCHIVED' | 'SPAM') {
    const res = await markMessageStatusAction(id, status);
    if (res?.error) {
      alert(res.error);
    } else {
      setMessages(messages.map((m) => (m.id === id ? { ...m, status } : m)));
      if (selectedMessage?.id === id) {
        setSelectedMessage({ ...selectedMessage, status });
      }
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Permanently delete this message?')) return;
    const res = await deleteMessageAction(id);
    if (res?.error) {
      alert(res.error);
    } else {
      setMessages(messages.filter((m) => m.id !== id));
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border border-[var(--border-subtle)] p-1 rounded-lg bg-[var(--surface)] w-fit">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${
            filter === 'ALL'
              ? 'bg-[var(--accent-emerald)] text-slate-950 font-bold'
              : 'text-[var(--muted)] hover:text-[var(--foreground)]'
          }`}
        >
          All ({messages.length})
        </button>
        <button
          onClick={() => setFilter('UNREAD')}
          className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${
            filter === 'UNREAD'
              ? 'bg-[var(--accent-emerald)] text-slate-950 font-bold'
              : 'text-[var(--muted)] hover:text-[var(--foreground)]'
          }`}
        >
          Unread ({messages.filter((m) => m.status === 'UNREAD').length})
        </button>
        <button
          onClick={() => setFilter('ARCHIVED')}
          className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${
            filter === 'ARCHIVED'
              ? 'bg-[var(--accent-emerald)] text-slate-950 font-bold'
              : 'text-[var(--muted)] hover:text-[var(--foreground)]'
          }`}
        >
          Archived ({messages.filter((m) => m.status === 'ARCHIVED').length})
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] overflow-hidden">
          <div className="p-3 border-b border-[var(--border-subtle)] bg-[var(--surface-raised)]/50 text-xs font-mono text-[var(--muted)] font-semibold">
            Messages ({filtered.length})
          </div>

          <div className="divide-y divide-[var(--border-subtle)]/60 max-h-[600px] overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="p-8 text-center text-xs font-mono text-[var(--muted)]">
                <Inbox className="w-8 h-8 mx-auto mb-2 opacity-50" />
                No messages matching this filter.
              </div>
            ) : (
              filtered.map((msg) => {
                const isSelected = selectedMessage?.id === msg.id;

                return (
                  <div
                    key={msg.id}
                    onClick={() => {
                      setSelectedMessage(msg);
                      if (msg.status === 'UNREAD') {
                        handleMarkStatus(msg.id, 'READ');
                      }
                    }}
                    className={`p-3.5 cursor-pointer text-xs font-mono transition-colors ${
                      isSelected
                        ? 'bg-[var(--accent-emerald)]/10 border-l-2 border-[var(--accent-emerald)]'
                        : 'hover:bg-[var(--surface-raised)]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-[var(--foreground)] truncate">{msg.name}</span>
                      <span className="text-[10px] text-[var(--muted)]">
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="text-[11px] text-[var(--muted)] truncate mb-1.5">
                      {msg.subject || msg.email}
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                          msg.status === 'UNREAD'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold'
                            : msg.status === 'ARCHIVED'
                            ? 'bg-slate-500/10 text-[var(--muted)]'
                            : 'bg-emerald-500/10 text-emerald-400'
                        }`}
                      >
                        {msg.status}
                      </span>
                      <span className="text-[10px] text-[var(--muted)]/60 truncate">{msg.email}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Message Detail Viewer */}
        <div className="lg:col-span-7 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-6 flex flex-col justify-between min-h-[450px]">
          {selectedMessage ? (
            <div className="space-y-6">
              {/* Header Info */}
              <div className="flex items-start justify-between pb-4 border-b border-[var(--border-subtle)]">
                <div>
                  <h3 className="text-base font-bold font-mono text-[var(--foreground)]">
                    {selectedMessage.subject || 'Direct Contact Submission'}
                  </h3>
                  <div className="text-xs font-mono text-[var(--muted)] mt-1 flex flex-wrap items-center gap-2">
                    <span className="text-[var(--accent-emerald)] font-semibold">{selectedMessage.name}</span>
                    <span>&lt;{selectedMessage.email}&gt;</span>
                  </div>
                  <div className="text-[10px] font-mono text-[var(--muted)]/60 mt-1 flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(selectedMessage.createdAt).toLocaleString()}
                    </span>
                    {selectedMessage.ipAddress && <span>IP: {selectedMessage.ipAddress}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(
                      selectedMessage.subject || 'Portfolio Inquiry'
                    )}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-mono bg-[var(--accent-emerald)] text-slate-950 font-semibold hover:bg-[var(--accent-emerald)]/90"
                    title="Reply by email"
                  >
                    <Reply className="w-3.5 h-3.5" />
                    <span>Reply</span>
                  </a>

                  {selectedMessage.status !== 'ARCHIVED' ? (
                    <button
                      onClick={() => handleMarkStatus(selectedMessage.id, 'ARCHIVED')}
                      className="p-1.5 rounded-lg border border-[var(--border-subtle)] text-[var(--muted)] hover:text-[var(--foreground)]"
                      title="Archive message"
                      aria-label="Archive message"
                    >
                      <Archive className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleMarkStatus(selectedMessage.id, 'READ')}
                      className="p-1.5 rounded-lg border border-[var(--border-subtle)] text-[var(--muted)] hover:text-[var(--foreground)]"
                      title="Unarchive message"
                      aria-label="Unarchive message"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    title="Delete message"
                    aria-label="Delete message"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Message Content */}
              <div className="p-4 rounded-lg bg-[var(--surface-raised)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--foreground)] leading-relaxed whitespace-pre-wrap">
                {selectedMessage.message}
              </div>
            </div>
          ) : (
            <div className="m-auto text-center p-12">
              <Mail className="w-10 h-10 mx-auto text-[var(--muted)] mb-3 opacity-40" />
              <p className="text-xs font-mono text-[var(--muted)]">Select an inquiry from the list to read.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
