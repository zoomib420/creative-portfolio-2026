import { useAppStore, type PresentationMode } from '../../lib/store';

const MODES: { id: PresentationMode; label: string }[] = [
  { id: 'island', label: 'Island' },
  { id: 'walkthrough', label: 'Walk-through' },
  { id: 'scrollstory', label: 'Story' },
];

/**
 * Switch between the three 3D presentation models. Shown only on 3D tiers.
 * Scroll resets to the top so each model starts from its intro.
 */
export function ModeSwitcher() {
  const mode = useAppStore((s) => s.presentationMode);
  const setMode = useAppStore((s) => s.setPresentationMode);

  const pick = (m: PresentationMode) => {
    setMode(m);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  return (
    <div className="content-layer fixed bottom-4 left-1/2 z-30 -translate-x-1/2">
      <div className="flex gap-1 rounded-full border border-[var(--color-glow)] bg-[var(--color-ink)]/80 p-1 backdrop-blur">
        {MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => pick(m.id)}
            aria-pressed={mode === m.id}
            className={[
              'rounded-full px-3 py-1.5 text-xs tracking-wide transition-colors',
              mode === m.id
                ? 'bg-[var(--color-accent)] text-[var(--color-void)]'
                : 'text-[var(--color-muted)] hover:text-[var(--color-accent)]',
            ].join(' ')}
          >
            {m.label}
          </button>
        ))}
      </div>
    </div>
  );
}
