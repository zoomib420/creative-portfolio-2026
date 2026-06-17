import { useEffect } from 'react';
import { useAppStore } from '../../lib/store';
import { floorsById } from '../../data/floors';

/**
 * Heads-up control shown once you've ENTERED a room (focusedFloor set). It lets
 * you leave the room, and—while no content panel is open—nudges you to click the
 * props inside. Esc closes the panel first, then leaves the room.
 */
export function RoomExit() {
  const entered = useAppStore((s) => s.focusedFloor);
  const panel = useAppStore((s) => s.roomPanel);
  const closeFloor = useAppStore((s) => s.closeFloor);
  const closeRoomPanel = useAppStore((s) => s.closeRoomPanel);
  const floor = entered ? floorsById[entered] : null;

  useEffect(() => {
    if (!entered) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      // Esc backs out one level: panel → room.
      if (useAppStore.getState().roomPanel) closeRoomPanel();
      else closeFloor();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [entered, closeFloor, closeRoomPanel]);

  const language = useAppStore((s) => s.language);

  if (!entered || !floor) return null;

  return (
    <div className="content-layer fixed top-20 left-3 z-40 flex flex-col items-start gap-2 md:left-6">
      <button
        type="button"
        onClick={closeFloor}
        className="inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-4 py-2 font-[var(--font-label)] text-sm font-bold text-[var(--color-mist)] shadow-[0_10px_30px_-12px_rgba(122,90,60,0.5)] transition-transform hover:scale-105"
        aria-label={language === 'th' ? 'ออกจากห้อง' : 'Leave room'}
      >
        <span aria-hidden>←</span> {language === 'th' ? 'ออกจากห้อง' : 'Leave room'}
      </button>
      {!panel && (
        <span className="rounded-full bg-[var(--color-accent)] px-3 py-1 text-xs font-bold text-white shadow">
          {language === 'th' 
            ? `อยู่ในห้อง ${floor.label.th} · คลิกวัตถุในห้องเพื่อดูข้อมูล` 
            : `Inside ${floor.label.en} · Click objects for info`}
        </span>
      )}
    </div>
  );
}
