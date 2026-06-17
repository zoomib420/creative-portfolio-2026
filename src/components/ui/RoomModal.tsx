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
  const id = useAppStore((s) => s.roomPanel);
  const close = useAppStore((s) => s.closeFloor);
  const language = useAppStore((s) => s.language);
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

  const exitLabel = language === 'th' ? 'ออกจากห้อง' : 'Exit room';

  return (
    <div
      className="content-layer fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:justify-end sm:pr-8"
      role="dialog"
      aria-modal="true"
      aria-label={floor.label[language]}
    >
      {/* transparent catcher — keeps the 3D room visible, click to leave */}
      <button type="button" className="absolute inset-0 cursor-default" onClick={close} aria-label={exitLabel} />

      <div className="relative z-10 flex max-h-[70vh] w-full flex-col overflow-hidden rounded-t-3xl border-4 border-[#3d281c] bg-[#4a3224] shadow-[0_15px_30px_rgba(0,0,0,0.6)] sm:max-h-[80vh] sm:w-[400px] sm:rounded-3xl">
        <div className="flex shrink-0 items-center justify-between border-b-2 border-[#3d281c] px-6 py-4 bg-[#3d281c]/50">
          <div className="flex items-center gap-2">
            <span aria-hidden className="text-xl">🚪</span>
            <h2 className="font-[var(--font-display)] text-2xl font-bold text-[#ffbc61]">
              {floor.label[language]}
            </h2>
          </div>
          <button
            onClick={close}
            aria-label={exitLabel}
            className="rounded-full p-2 text-[#ffbc61]/70 transition-colors hover:bg-[#ffbc61]/20 hover:text-[#ffbc61]"
          >
            ✕
          </button>
        </div>
        <div 
          className="overflow-y-auto px-6 py-6"
          data-lenis-prevent="true"
        >
          <FloorContent id={floor.id} />
        </div>
      </div>
    </div>
  );
}
