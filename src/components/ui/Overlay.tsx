import { profile } from '../../data/profile';
import { floors } from '../../data/floors';
import { useAppStore } from '../../lib/store';
import { Squiggle } from './Squiggle';

const rooms = floors.filter((f) => f.ready && f.id !== 'hero');

function AccessibleRoomButton({ id, label }: { id: string; label: string }) {
  const openRoomPanel = useAppStore((s) => s.openRoomPanel);
  const lang = useAppStore((s) => s.language);
  return (
    <button
      type="button"
      onClick={() => openRoomPanel(id)}
      aria-label={lang === 'th' ? `เข้าไปดูในห้อง ${label}` : `Enter room ${label}`}
      className="sr-only focus:not-sr-only focus:pointer-events-auto focus:fixed focus:top-24 focus:left-6 focus:z-50 focus:rounded-full focus:bg-[var(--color-ink)] focus:px-5 focus:py-2.5 focus:font-[var(--font-label)] focus:text-sm focus:font-bold focus:text-[var(--color-mist)] focus:shadow-[0_10px_30px_-12px_rgba(122,90,60,0.5)]"
    >
      {lang === 'th' ? 'เข้าไปดูในห้อง' : 'Enter Room'}
    </button>
  );
}

export function Overlay() {
  const language = useAppStore((s) => s.language);

  return (
    <main id="top" className="content-layer pointer-events-none">
      {/* The Top Left Controls are now in Nav.tsx */}

      <section
        id="hero"
        className="flex min-h-screen flex-col justify-start px-6 pt-[14vh] md:justify-center md:px-16 md:pt-0"
      >
        <div
          className="pointer-events-auto max-w-[min(14rem,48vw)] drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)] sm:max-w-[22rem] md:max-w-3xl"
          data-reveal
        >
          <p className="mb-4 hidden font-[var(--font-label)] text-xs tracking-[0.3em] text-[#ffd479] font-bold uppercase md:block">
            {profile.role[language]} · 2026
          </p>
          <h1 className="hidden font-[var(--font-display)] text-3xl leading-[1.05] font-extrabold text-[#fffaf2] text-balance sm:text-4xl md:block md:text-7xl">
            {language === 'th' ? 'ผมคือ ' : 'I am a '}
            <span className="relative block text-[#ffbc61] italic sm:inline-block">
              {/* Background Glow */}
              <span className="absolute inset-0 block bg-[#ffbc61] blur-[20px] opacity-20 scale-125" aria-hidden="true" />
              <span className="relative z-10">{language === 'th' ? 'นักสร้าง' : 'Builder'}</span>
              <Squiggle className="absolute -bottom-2 left-0 h-3 w-full z-10 opacity-80" />
            </span>
          </h1>
          <p className="mt-6 hidden max-w-xl text-sm font-normal leading-[1.8] text-[#fffaf2]/90 whitespace-pre-line md:mt-8 md:block md:text-base">
            {profile.tagline[language]}
          </p>
          <p className="mt-7 text-[10px] font-bold tracking-widest text-[#ffd479] uppercase md:mt-8 md:text-xs">
            {language === 'th' ? '↓ เลื่อนลงเพื่อสำรวจตึก แล้วคลิกห้องเพื่อดูข้อมูล' : '↓ Scroll down to explore, click rooms for info'}
          </p>
        </div>
      </section>

      {/* Invisible scroll anchors; the visible room names are baked into the 3D tower. */}
      {rooms.map((f) => {
        const Tag = f.id === 'thanks' ? 'footer' : 'section';
        return (
          <Tag key={f.id} id={f.id} aria-label={f.label[language]} className="min-h-screen">
            <AccessibleRoomButton id={f.id} label={f.label[language]} />
          </Tag>
        );
      })}
    </main>
  );
}
