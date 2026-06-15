import { useAppStore } from '../../lib/store';
import { floorsById, navFloors } from '../../data/floors';
import { scrollToSection } from '../../lib/scroll';

/**
 * Elevator-panel navigation — the signature (prozilla-inspired). Pick a floor
 * to ride to that section. Reads the floor directory from data/floors.ts and
 * works on every tier (smooth-scroll on 3D, native scroll in the 2D fallback).
 */
export function ElevatorNav() {
  const activeSection = useAppStore((s) => s.activeSection);
  const setActiveSection = useAppStore((s) => s.setActiveSection);
  const openFloor = useAppStore((s) => s.openFloor);
  const activeFloor = floorsById[activeSection] ?? floorsById.hero;

  // Top floor (Lobby) at the top, ground (Contact) at the bottom — matches the
  // tower's top→bottom layout.
  const ordered = navFloors;

  const go = (id: string) => {
    setActiveSection(id); // immediate feedback (the 2D tier has no scroll-spy)
    scrollToSection(id);
  };

  return (
    <nav
      aria-label="ลิฟต์นำทาง"
      className="content-layer fixed top-1/2 right-4 z-30 -translate-y-1/2 md:right-6"
    >
      <div className="flex flex-col items-center gap-2 rounded-3xl border border-[var(--color-glow)] bg-[var(--color-ink)] p-2.5 shadow-[0_10px_30px_-12px_rgba(122,90,60,0.45)]">
        <span aria-hidden title="ลิฟต์" className="pt-1 pb-0.5 text-base">
          🛗
        </span>

        {ordered.map((f) => {
          const active = activeSection === f.id;
          return (
            <button
              key={f.id}
              onClick={() => go(f.id)}
              aria-label={`ไปยังชั้น ${f.label}`}
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

        {activeSection !== 'hero' && (
          <button
            type="button"
            onClick={() => openFloor(activeSection)}
            className="mt-1 rounded-full bg-[var(--color-butter)] px-2.5 py-1 font-[var(--font-label)] text-[10px] font-bold text-[var(--color-mist)] shadow-[0_0_0_3px_rgba(255,212,121,0.18)] transition-transform hover:scale-105"
            aria-label={`เปิดห้อง ${activeFloor.label}`}
            title={`เปิดห้อง ${activeFloor.label}`}
          >
            ดูห้อง
          </button>
        )}
      </div>
    </nav>
  );
}
