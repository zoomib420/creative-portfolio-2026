import { useEffect } from 'react';
import { useAppStore } from '../../lib/store';
import { floorsById } from '../../data/floors';
import { FloorContent } from './FloorContent';

/**
 * The content panel for the room you've entered. Experience3D swaps the 3D scene
 * to that floor's furnished interior (store.focusedFloor); this panel docks to
 * the bottom (mobile) / right (desktop) so the 3D room stays visible. A
 * transparent click-catcher closes the room (so does Esc / the ✕).
 */
export function RoomModal() {
  const id = useAppStore((s) => s.focusedFloor);
  const close = useAppStore((s) => s.closeFloor);
  const floor = id ? floorsById[id] : null;

  useEffect(() => {
    if (!floor) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [floor, close]);

  if (!floor) return null;

  return (
    <div
      className="content-layer fixed inset-0 z-50 flex items-end md:items-stretch md:justify-end"
      role="dialog"
      aria-modal="true"
      aria-label={floor.label}
    >
      {/* transparent catcher — keeps the 3D room visible, click to leave */}
      <button type="button" className="absolute inset-0 cursor-default" onClick={close} aria-label="ออกจากห้อง" />

      <div className="relative z-10 flex max-h-[60vh] w-full flex-col overflow-hidden rounded-t-3xl border border-[var(--color-glow)] bg-[var(--color-ink)] shadow-[0_-10px_40px_-12px_rgba(122,90,60,0.55)] md:h-full md:max-h-none md:w-[420px] md:rounded-none md:rounded-l-3xl md:border-l">
        <div className="flex shrink-0 items-center justify-between border-b border-[var(--color-glow)] px-6 py-4">
          <div className="flex items-center gap-2">
            <span aria-hidden className="text-sm">🚪</span>
            <h2 className="font-[var(--font-display)] text-2xl font-bold text-[var(--color-mist)]">
              {floor.label}
            </h2>
          </div>
          <button
            onClick={close}
            aria-label="ออกจากห้อง"
            className="rounded-full p-2 text-[var(--color-muted)] transition-colors hover:bg-[var(--color-glow)] hover:text-[var(--color-mist)]"
          >
            ✕
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-6">
          <FloorContent id={floor.id} />
        </div>
      </div>
    </div>
  );
}
