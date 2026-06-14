/**
 * Serverless AI proxy (Task T-20).
 *
 * WHY THIS EXISTS: secret API keys must never reach the browser. The client
 * (src/lib/ai.ts) calls THIS endpoint; this endpoint holds the key and talks to
 * the AI provider. Deploy as a Vercel / Cloudflare / Netlify function.
 *
 * Web-standard handler (Request -> Response) so it runs on Edge runtimes.
 * On Vercel, this file is auto-exposed at /api/chat.
 *
 * Provider-agnostic: prefers Anthropic Claude (recommended — most capable) if
 * ANTHROPIC_API_KEY is set, otherwise falls back to OpenAI. Set the model via
 * env. No SDK dependency — uses fetch directly.
 *
 * ⚠️ TODO before production (see docs/USER_TODO.md):
 *   - add rate limiting + origin allowlist
 *   - set the system prompt with YOUR real bio/projects
 */

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const SYSTEM_PROMPT =
  'You are the friendly AI guide for a Creative Technologist portfolio. ' +
  'Answer questions about the work, skills, and how to get in touch. ' +
  'Keep replies short and warm. Reply in the same language as the user (Thai or English). ' +
  '// TODO: inject real bio + project context here.';

export const config = { runtime: 'edge' };

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  let messages: ChatMessage[];
  try {
    const body = (await request.json()) as { messages?: ChatMessage[] };
    messages = body.messages ?? [];
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }
  if (!messages.length) return json({ error: 'messages[] required' }, 400);

  const anthropicKey = getEnv('ANTHROPIC_API_KEY');
  const openaiKey = getEnv('OPENAI_API_KEY');

  try {
    if (anthropicKey) {
      const reply = await callAnthropic(anthropicKey, messages);
      return json({ reply });
    }
    if (openaiKey) {
      const reply = await callOpenAI(openaiKey, messages);
      return json({ reply });
    }
    return json(
      { error: 'No AI key configured on the server (ANTHROPIC_API_KEY or OPENAI_API_KEY).' },
      501,
    );
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : 'Upstream error' }, 502);
  }
}

async function callAnthropic(key: string, messages: ChatMessage[]): Promise<string> {
  const model = getEnv('ANTHROPIC_MODEL') || 'claude-opus-4-8';
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({ model, max_tokens: 512, system: SYSTEM_PROMPT, messages }),
  });
  if (!res.ok) throw new Error(`Anthropic ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as { content: { text: string }[] };
  return data.content.map((c) => c.text).join('');
}

async function callOpenAI(key: string, messages: ChatMessage[]): Promise<string> {
  const model = getEnv('OPENAI_MODEL') || 'gpt-4o';
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model,
      max_tokens: 512,
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
    }),
  });
  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as { choices: { message: { content: string } }[] };
  return data.choices[0]?.message.content ?? '';
}

// Edge/Node env access without depending on @types/node here.
function getEnv(name: string): string | undefined {
  return (globalThis as unknown as { process?: { env: Record<string, string | undefined> } })
    .process?.env?.[name];
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}
