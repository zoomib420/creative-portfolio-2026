import type { ReactElement } from 'react';
import { projects } from '../data/projects';
import { profile } from '../data/profile';

/**
 * Static GenUI registry (Task T-22).
 *
 * The SAFEST GenUI flavor: the frontend owns the layout and ships a fixed
 * allowlist of components. The AI may only pick a component key + pass simple
 * props — it can never inject arbitrary markup. The serverless AI guide (T-21)
 * returns descriptors like { component: 'project_list', props: {...} } and this
 * renders them. Unknown keys render nothing (fail safe).
 *
 * NOT yet wired into the UI — waiting on the backend to emit descriptors.
 */

export interface GenUIDescriptor {
  component: string;
  props?: Record<string, unknown>;
}

function Callout({ text }: { text?: string }): ReactElement {
  return (
    <div className="rounded-lg border border-[var(--color-glow)] bg-[var(--color-ink)] p-3 text-sm text-[var(--color-mist)]">
      {String(text ?? '')}
    </div>
  );
}

import { useAppStore } from './store';

function ProjectList({ ids }: { ids?: string[] }): ReactElement {
  const language = useAppStore((s) => s.language);
  const list = (ids?.length ? projects.filter((p) => ids.includes(p.id)) : projects).slice(0, 5);
  return (
    <ul className="space-y-1 text-sm">
      {list.map((p) => (
        <li key={p.id} className="text-[var(--color-muted)]">
          <span className="text-[var(--color-accent)]">{p.title}</span> — {p.tagline[language]}
        </li>
      ))}
    </ul>
  );
}

function ContactCard(): ReactElement {
  const language = useAppStore((s) => s.language);
  return (
    <a
      href={`mailto:${profile.email}`}
      className="inline-block rounded-lg border border-[var(--color-accent)] px-4 py-2 text-sm text-[var(--color-accent)]"
    >
      {language === 'th' ? 'ติดต่อ' : 'Contact'} {profile.name[language]} ↗
    </a>
  );
}

// The allowlist. Anything not here is ignored.
const REGISTRY: Record<string, (props: Record<string, unknown>) => ReactElement> = {
  callout: (p) => <Callout text={p.text as string} />,
  project_list: (p) => <ProjectList ids={p.ids as string[]} />,
  contact_card: () => <ContactCard />,
};

/** Render an AI-provided descriptor through the allowlist. Returns null if unknown. */
export function renderGenUI(descriptor: GenUIDescriptor): ReactElement | null {
  const factory = REGISTRY[descriptor.component];
  if (!factory) return null;
  return factory(descriptor.props ?? {});
}

export const GENUI_COMPONENT_KEYS = Object.keys(REGISTRY);
