import { useState, type FormEvent } from 'react';
import { sendChat, type ChatMessage } from '../../lib/ai';

/**
 * Floating AI guide chat (Task T-21). Hidden unless VITE_ENABLE_AI_GUIDE="true"
 * AND the serverless proxy (api/chat.ts) is deployed with an AI key. Fails
 * gracefully with a readable message when the backend isn't ready.
 */
export function AIGuide() {
  const enabled = import.meta.env.VITE_ENABLE_AI_GUIDE === 'true';
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!enabled) return null;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    const next = [...messages, { role: 'user' as const, content: text }];
    setMessages(next);
    setInput('');
    setLoading(true);
    setError(null);
    try {
      const reply = await sendChat(next);
      setMessages([...next, { role: 'assistant', content: reply }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-layer fixed right-4 bottom-4 z-50">
      {open && (
        <div className="mb-3 flex h-96 w-80 flex-col rounded-2xl border border-[var(--color-glow)] bg-[var(--color-ink)] shadow-2xl">
          <div className="border-b border-[var(--color-glow)] px-4 py-3 text-sm font-semibold">
            AI Guide
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-4 text-sm">
            {messages.length === 0 && (
              <p className="text-[var(--color-muted)]">ถามอะไรเกี่ยวกับผลงานได้เลย 👋</p>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={m.role === 'user' ? 'text-right' : 'text-left'}
              >
                <span
                  className={[
                    'inline-block rounded-xl px-3 py-2',
                    m.role === 'user'
                      ? 'bg-[var(--color-accent)] text-[var(--color-void)]'
                      : 'border border-[var(--color-glow)] text-[var(--color-mist)]',
                  ].join(' ')}
                >
                  {m.content}
                </span>
              </div>
            ))}
            {loading && <p className="text-[var(--color-muted)]">กำลังคิด…</p>}
            {error && <p className="text-red-400">⚠ {error}</p>}
          </div>
          <form onSubmit={submit} className="flex gap-2 border-t border-[var(--color-glow)] p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="พิมพ์คำถาม…"
              className="flex-1 rounded-lg bg-[var(--color-void)] px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-[var(--color-accent)] px-3 py-2 text-sm font-medium text-[var(--color-void)] disabled:opacity-50"
            >
              ส่ง
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        className="ml-auto flex h-12 w-12 items-center justify-center rounded-full border border-[var(--color-glow)] bg-[var(--color-ink)] text-lg transition-colors hover:border-[var(--color-accent)]"
        aria-label="เปิด AI Guide"
      >
        {open ? '✕' : '✨'}
      </button>
    </div>
  );
}
