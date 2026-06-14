/**
 * Client-side AI helper. Talks ONLY to our serverless proxy (api/chat.ts),
 * never directly to OpenAI/Anthropic — no secret keys in the browser.
 */

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '/api';

export async function sendChat(messages: ChatMessage[]): Promise<string> {
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ messages }),
  });
  const data = (await res.json().catch(() => ({}))) as { reply?: string; error?: string };
  if (!res.ok || !data.reply) {
    throw new Error(data.error ?? `AI request failed (${res.status})`);
  }
  return data.reply;
}
