import { useAppStore } from '../../lib/store';
import { AudioToggle } from './AudioToggle';

export function Nav() {
  const isOpen = useAppStore((s) => s.isNavPanelOpen);
  const setNavPanelOpen = useAppStore((s) => s.setNavPanelOpen);
  const language = useAppStore((s) => s.language);
  const setLanguage = useAppStore((s) => s.setLanguage);
  const tier = useAppStore((s) => s.tier);
  const setTier = useAppStore((s) => s.setTier);

  return (
    <header className="content-layer fixed top-0 left-0 z-40 flex w-full items-center justify-between px-6 py-5 md:px-10 pointer-events-none">
      {/* SUPER ROOSTER Logo (Clean & Bold) */}
      <a
        href="#top"
        className="pointer-events-auto font-[var(--font-display)] text-xl font-black tracking-[0.15em] text-[#ffbc61] uppercase drop-shadow-[0_2px_10px_rgba(255,188,97,0.4)] transition-transform hover:scale-105 active:scale-95 sm:text-2xl"
      >
        SUPER ROOSTER
      </a>

      <nav className="pointer-events-auto flex items-center gap-3 md:gap-5 text-xs tracking-widest text-[var(--color-muted)] uppercase">
        {/* Language Toggle */}
        <button
          onClick={() => setLanguage(language === 'th' ? 'en' : 'th')}
          className="flex h-8 w-14 items-center justify-between rounded-full bg-[#3d281c]/80 p-1 backdrop-blur border border-[#ffbc61]/30 transition-all hover:border-[#ffbc61]/60"
          aria-label="Toggle Language"
        >
          <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold transition-all ${language === 'th' ? 'bg-[#ffbc61] text-[#3d281c] shadow-sm' : 'text-[#fffaf2]/50'}`}>
            TH
          </div>
          <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold transition-all ${language === 'en' ? 'bg-[#ffbc61] text-[#3d281c] shadow-sm' : 'text-[#fffaf2]/50'}`}>
            EN
          </div>
        </button>

        {/* 2D / 3D Toggle */}
        <button
          onClick={() => setTier(tier === 'basic' ? 'high' : 'basic', true)}
          className="flex h-8 w-[4.5rem] items-center justify-between rounded-full bg-[#3d281c]/80 p-1 backdrop-blur border border-[#ffbc61]/30 transition-all hover:border-[#ffbc61]/60"
          title={language === 'th' ? 'สลับโหมด 2D / 3D' : 'Toggle 2D / 3D Mode'}
        >
          <div className={`flex h-6 w-8 items-center justify-center rounded-full text-[10px] font-bold transition-all ${tier !== 'basic' ? 'bg-[#ffbc61] text-[#3d281c] shadow-sm' : 'text-[#fffaf2]/50'}`}>
            3D
          </div>
          <div className={`flex h-6 w-8 items-center justify-center rounded-full text-[10px] font-bold transition-all ${tier === 'basic' ? 'bg-[#ffbc61] text-[#3d281c] shadow-sm' : 'text-[#fffaf2]/50'}`}>
            2D
          </div>
        </button>

        <div className="h-6 w-px bg-white/20 mx-1" />

        <AudioToggle />
        
        {/* Hamburger Menu Button (Clean, White, Equal Lines) */}
        <button
          onClick={() => setNavPanelOpen(!isOpen)}
          className="group flex flex-col items-end justify-center gap-[6px] p-2 focus:outline-none ml-2"
          aria-label="Toggle Navigation Panel"
        >
          <span className={`block h-[3px] w-8 rounded-full bg-white transition-all duration-300 ease-out ${isOpen ? 'translate-y-[9px] rotate-45' : 'group-hover:opacity-80'}`} />
          <span className={`block h-[3px] w-8 rounded-full bg-white transition-all duration-300 ease-out ${isOpen ? 'w-0 opacity-0' : 'group-hover:opacity-80'}`} />
          <span className={`block h-[3px] w-8 rounded-full bg-white transition-all duration-300 ease-out ${isOpen ? '-translate-y-[9px] -rotate-45' : 'group-hover:opacity-80'}`} />
        </button>
      </nav>
    </header>
  );
}
