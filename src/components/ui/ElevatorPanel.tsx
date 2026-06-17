import { useAppStore } from '../../lib/store';
import { navFloors } from '../../data/floors';
import { scrollToSection } from '../../lib/scroll';

export function ElevatorPanel() {
  const isOpen = useAppStore((s) => s.isNavPanelOpen);
  const setOpen = useAppStore((s) => s.setNavPanelOpen);
  const activeSection = useAppStore((s) => s.activeSection);
  const language = useAppStore((s) => s.language);

  if (!isOpen) return null;

  return (
    <>
      {/* Invisible backdrop just to close when clicking outside */}
      <div 
        className="fixed inset-0 z-40" 
        onClick={() => setOpen(false)}
      />

      {/* Panel positioned at Top Right */}
      <div className="fixed top-24 right-6 z-50 w-64 rounded-3xl border-4 border-[#3d281c] bg-[#4a3224] p-5 shadow-[0_15px_30px_rgba(0,0,0,0.7)] md:right-10">
        
        <h2 className="mb-4 mt-1 text-center font-[var(--font-display)] text-lg tracking-widest text-[#ffbc61] uppercase">
          Elevator
        </h2>

        {/* Normal order (Lobby at top, underground floors below) */}
        <div className="flex flex-col gap-2">
          {navFloors.map((floor) => {
            const isActive = activeSection === floor.id;
            return (
              <button
                key={floor.id}
                onClick={() => {
                  setOpen(false);
                  scrollToSection(floor.id);
                }}
                className={`group flex items-center gap-3 rounded-xl p-2.5 text-left transition-all focus:outline-none focus:ring-2 focus:ring-[#ffbc61] ${
                  isActive ? 'bg-[#3d281c] shadow-inner' : 'hover:bg-[#5e4231]'
                }`}
              >
                <div 
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-base font-bold transition-all ${
                    isActive 
                      ? 'border-[#ffbc61] bg-[#ffbc61] text-[#4a3224] shadow-[0_0_12px_rgba(255,188,97,0.5)]' 
                      : 'border-[#ffbc61]/30 bg-[#3d281c] text-[#ffbc61]/70 group-hover:border-[#ffbc61]/60'
                  }`}
                >
                  {floor.n}
                </div>
                <div className="flex flex-col">
                  <span className={`font-[var(--font-display)] text-xs tracking-wider uppercase transition-colors ${
                    isActive ? 'text-[#ffbc61]' : 'text-[#ffbc61]/70 group-hover:text-[#ffbc61]'
                  }`}>
                    {floor.label[language]}
                  </span>
                  <span className="text-[9px] tracking-wide text-[var(--color-mist)]/50 uppercase">
                    Level {floor.level}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
