import { type ReactNode } from 'react';
import { profile } from '../../data/profile';
import { projectCategories } from '../../data/projects';
import { floorsById } from '../../data/floors';
import { FloorContent } from '../ui/FloorContent';
import { useAppStore } from '../../lib/store';

/**
 * Basic (2D/Static) tier — the graceful fallback for low-power devices,
 * reduced-motion users, and browsers without WebGL2/WebGPU.
 *
 * Same content source as the 3D world (src/data/*). It mirrors the elevator
 * metaphor with floor numbers, and surfaces EVERYTHING the 3D tower has —
 * including the game projects and the playable arcade — so nothing is lost
 * when a visitor lands on the 2D version.
 */

/** Subtle on-load fade-up entrance. Pure CSS (see `.reveal-up` in index.css):
 *  no JS/IntersectionObserver, so content can never get stuck hidden, and the
 *  hidden start state is gated behind `prefers-reduced-motion: no-preference`. */
function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <div className={`reveal-up ${className}`} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/** Section header carrying the floor "number" + accent, tying the 2D page back
 *  to the building/elevator metaphor. */
function SectionHeader({ floorId, title }: { floorId: string; title: string }) {
  const floor = floorsById[floorId];
  const accent = floor?.accent ?? '#ffbc61';
  const n = (floor?.n ?? '').padStart(2, '0');
  return (
    <div className="mb-8 flex items-end gap-4">
      <span
        className="font-[var(--font-display)] text-5xl leading-none font-extrabold md:text-6xl"
        style={{ color: accent, opacity: 0.28 }}
        aria-hidden="true"
      >
        {n}
      </span>
      <div className="pb-1">
        <h2 className="font-[var(--font-display)] text-2xl font-semibold md:text-3xl" style={{ color: accent }}>
          {title}
        </h2>
        <span className="mt-2 block h-1 w-12 rounded-full" style={{ backgroundColor: accent }} />
      </div>
    </div>
  );
}

/** Smaller header for a sub-group inside a section (e.g. Games under Works). */
function SubHeader({ children }: { children: ReactNode }) {
  return (
    <h3 className="mt-12 mb-5 font-[var(--font-display)] text-lg font-semibold text-[#fffaf2]/90">
      {children}
    </h3>
  );
}

export function Grid2D() {
  const language = useAppStore((s) => s.language);
  const lineLink = profile.socials.find((s) => s.url.includes('lin.ee'));

  const sectionClass = 'mb-24 md:mb-32 scroll-mt-28';

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#1a110b] text-[#fffaf2]">
      {/* soft warm glows for depth (cheap, static) */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage:
            'radial-gradient(70% 50% at 50% -5%, rgba(255,188,97,0.18), transparent 60%),' +
            'radial-gradient(60% 50% at 100% 100%, rgba(86,194,176,0.12), transparent 55%)',
        }}
      />

      <main id="top" className="content-layer mx-auto max-w-5xl px-5 pt-28 pb-24 sm:px-6 md:px-10 md:pt-32">
        {/* ===== Hero ===== */}
        <section id="hero" className="mb-24 md:mb-32">
          <Reveal>
            <p className="mb-4 font-[var(--font-label)] text-xs font-bold tracking-[0.3em] text-[#ffbc61] uppercase">
              {profile.role[language]} · 2026
            </p>
            <h1 className="font-[var(--font-display)] text-4xl leading-tight font-extrabold text-balance text-[#fffaf2] md:text-6xl">
              {language === 'th' ? 'สุดยอดไก่ชน' : 'Super Rooster,'}
              <br />
              <span className="text-[#ffbc61] italic block mt-2">
                {language === 'th' ? 'ยอดนักสร้าง' : 'The Ultimate Builder'}
              </span>
            </h1>
            <p className="mt-6 max-w-2xl leading-[1.8] font-normal whitespace-pre-line text-[#fffaf2]/80">
              {profile.tagline[language]}
            </p>
          </Reveal>

          {/* what I build — quick chips */}
          <Reveal delay={120}>
            <ul className="mt-7 flex flex-wrap gap-2">
              {projectCategories.map((cat) => (
                <li
                  key={cat.id}
                  className="rounded-full border border-[#ffbc61]/30 bg-[#3d281c]/60 px-3.5 py-1.5 text-sm text-[#fffaf2]/85"
                >
                  {cat.label[language]}
                </li>
              ))}
            </ul>
          </Reveal>

          {/* CTAs */}
          <Reveal delay={200}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {lineLink && (
                <a
                  href={lineLink.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group flex items-center gap-2.5 rounded-full bg-[#00B900] px-6 py-3 font-[var(--font-display)] text-base font-bold text-white shadow-lg transition-all hover:-translate-y-1 hover:bg-[#009900] hover:shadow-[#00B900]/40"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                    <path d="M24 10.304c0-5.369-5.383-9.738-12-9.738-6.616 0-12 4.369-12 9.738 0 4.814 4.269 8.846 10.036 9.608.391.084.922.258 1.057.592.122.303.079.778.039 1.085l-.171 1.027c-.053.303-.242 1.186 1.039.647 1.281-.54 6.911-4.069 9.428-6.967 1.739-1.907 2.572-3.843 2.572-5.992z" />
                  </svg>
                  {language === 'th' ? 'คุยกับ Intake Pilot' : 'Chat with Intake Pilot'}
                </a>
              )}
              <a
                href="#work"
                className="rounded-full border border-[#ffbc61]/40 px-6 py-3 font-[var(--font-display)] text-base font-bold text-[#ffbc61] transition-colors hover:bg-[#ffbc61] hover:text-[#1a110b]"
              >
                {language === 'th' ? 'ดูผลงาน ↓' : 'See my work ↓'}
              </a>
            </div>
          </Reveal>

          <Reveal delay={260}>
            <p className="mt-10 max-w-xl rounded-lg border border-[#ffbc61]/15 bg-[#3d281c]/40 px-4 py-3 text-sm text-[#fffaf2]/50">
              {language === 'th'
                ? '💡 คุณกำลังดูเวอร์ชัน 2D ที่เบาและเข้าถึงง่าย — เปิดบนอุปกรณ์ที่รองรับ WebGPU เพื่อสัมผัสประสบการณ์ตึก 3D เต็มรูปแบบ'
                : '💡 You are viewing the lightweight, accessible 2D version — open on a WebGPU-supported device for the full 3D building experience.'}
            </p>
          </Reveal>
        </section>

        {/* ===== About ===== */}
        <section id="about" className={sectionClass}>
          <Reveal>
            <SectionHeader floorId="about" title={language === 'th' ? 'เกี่ยวกับผม' : 'About Me'} />
            <FloorContent id="about" />
          </Reveal>
        </section>

        {/* ===== Works (+ Games sub-group) ===== */}
        <section id="work" className={sectionClass}>
          <Reveal>
            <SectionHeader floorId="work" title={language === 'th' ? 'ผลงานของผม' : 'My Works'} />
            <FloorContent id="work" />
          </Reveal>
          <Reveal>
            <SubHeader>{language === 'th' ? '🎮 เกมที่ผมสร้าง' : '🎮 Games I’ve built'}</SubHeader>
            <FloorContent id="work-games" />
          </Reveal>
        </section>

        {/* ===== Business Systems ===== */}
        <section id="business" className={sectionClass}>
          <Reveal>
            <SectionHeader floorId="business" title={language === 'th' ? 'ระบบสำหรับธุรกิจ' : 'Business Systems'} />
            <FloorContent id="business" />
          </Reveal>
        </section>

        {/* ===== Tech & Arcade ===== */}
        <section id="tech" className={sectionClass}>
          <Reveal>
            <SectionHeader floorId="tech" title={language === 'th' ? 'เทค & ห้องเกม' : 'Tech & Arcade'} />
            <FloorContent id="tech" />
          </Reveal>
          <Reveal>
            <SubHeader>
              {language === 'th' ? '🕹️ ห้องเกม — กดเล่นได้เลย!' : '🕹️ Arcade — play right here!'}
            </SubHeader>
            <FloorContent id="tech-games" />
          </Reveal>
        </section>

        {/* ===== Contact ===== */}
        <section id="contact" className={sectionClass}>
          <Reveal>
            <SectionHeader floorId="contact" title={language === 'th' ? 'ติดต่อ' : 'Contact'} />
            <FloorContent id="contact" />
          </Reveal>
        </section>

        {/* ===== Thanks ===== */}
        <footer id="thanks" className="border-t border-[#ffbc61]/20 pt-10">
          <Reveal>
            <SectionHeader floorId="thanks" title={language === 'th' ? 'ขอบคุณ' : 'Thanks'} />
            <FloorContent id="thanks" />
          </Reveal>
        </footer>
      </main>
    </div>
  );
}
