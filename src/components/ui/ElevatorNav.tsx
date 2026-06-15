import { useAppStore, type PresentationMode } from '../../lib/store';
import { scrollToSection } from '../../lib/scroll';

/**
 * Elevator-panel navigation (the signature, prozilla-inspired). Pick a "floor"
 * to ride to that section. A small world selector at the bottom switches the
 * 3D presentation model. Shown only on 3D tiers.
 */

const FLOORS = [
  { id: 'contact', n: '3', label: 'Contact' },
  { id: 'about', n: '2', label: 'About' },
  { id: 'work', n: '1', label: 'Work' },
  { id: 'hero', n: 'L', label: 'Lobby' },
];

const WORLDS: { id: PresentationMode; glyph: string; label: string }[] = [
  { id: 'island', glyph: '🏝️', label: 'Island' },
  { id: 'walkthrough', glyph: '🏛️', label: 'Walk-through' },
  { id: 'scrollstory', glyph: '✨', label: 'Story' },
];

export function ElevatorNav() {
  const activeSection = useAppStore((s) => s.activeSection);
  const mode = useAppStore((s) => s.presentationMode);
  const setMode = useAppStore((s) => s.setPresentationMode);

  const goWorld = (m: PresentationMode) => {
    setMode(m);
    scrollToSection('hero');
  };

  return (
    <nav
      aria-label="ลิฟต์นำทาง"
      className="content-layer fixed top-1/2 right-4 z-30 -translate-y-1/2 md:right-6"
    >
      <div className="flex flex-col items-center gap-2 rounded-3xl border border-[var(--color-glow)] bg-[var(--color-ink)] p-2.5 shadow-[0_10px_30px_-12px_rgba(122,90,60,0.45)]">
        <span aria-hidden className="pt-1 pb-0.5 text-base">
          🛗
        </span>

        {FLOORS.map((f) => {
          const active = activeSection === f.id;
          return (
            <button
              key={f.id}
              onClick={() => scrollToSection(f.id)}
              aria-label={`ไปยัง ${f.label}`}
              aria-current={active ? 'true' : undefined}
              title={f.label}
              className={[
                'flex h-9 w-9 items-center justify-center rounded-full font-[var(--font-display)] text-sm font-bold transition-all',
                active
                  ? 'scale-110 bg-[var(--color-accent)] text-white shadow-[0_0_0_4px_rgba(255,154,98,0.2)]'
                  : 'bg-[var(--color-void)] text-[var(--color-muted)] hover:bg-[var(--color-butter)] hover:text-[var(--color-mist)]',
              ].join(' ')}
            >
              {f.n}
            </button>
          );
        })}

        <span className="my-1 h-px w-6 bg-[var(--color-glow)]" />

        <div className="flex flex-col gap-1.5 pb-1">
          {WORLDS.map((w) => (
            <button
              key={w.id}
              onClick={() => goWorld(w.id)}
              aria-label={`โลก ${w.label}`}
              aria-pressed={mode === w.id}
              title={w.label}
              className={[
                'flex h-7 w-7 items-center justify-center rounded-full text-xs transition-all',
                mode === w.id
                  ? 'scale-110 bg-[var(--color-accent-2)]'
                  : 'opacity-50 hover:opacity-100',
              ].join(' ')}
            >
              {w.glyph}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
