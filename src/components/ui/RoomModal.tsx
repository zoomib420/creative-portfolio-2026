import { useEffect } from 'react';
import { useAppStore } from '../../lib/store';
import { floorsById } from '../../data/floors';
import { FloorContent } from './FloorContent';

/**
 * The "room" you enter when clicking a floor — the camera zooms in (handled in
 * ElevatorScene via store.focusedFloor) and this panel slides up with the floor's
 * full content. A translucent backdrop keeps the zoomed room visible behind it.
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
      className="content-layer fixed inset-0 z-50 flex items-end justify-center md:items-center md:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={floor.label}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={close}
        aria-label="ปิดห้องจากฉากหลัง"
      />

      <div className="relative z-10 flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl border border-[var(--color-glow)] bg-[var(--color-ink)] shadow-[0_-10px_40px_-12px_rgba(122,90,60,0.5)] md:max-h-[82vh] md:rounded-3xl">
        <div className="flex shrink-0 items-center justify-between border-b border-[var(--color-glow)] px-6 py-4">
          <h2 className="font-[var(--font-display)] text-2xl font-bold text-[var(--color-mist)]">
            {floor.label}
          </h2>
          <button
            onClick={close}
            aria-label="ปิดห้อง"
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
