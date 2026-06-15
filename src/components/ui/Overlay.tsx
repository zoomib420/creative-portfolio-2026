import { profile } from '../../data/profile';
import { FloorContent } from './FloorContent';
import { Squiggle } from './Squiggle';

/**
 * Scrollable HTML content layered above the 3D canvas. Text stays in the DOM
 * (crisp, selectable, accessible) while the canvas reacts behind it.
 */
export function Overlay() {
  return (
    <main id="top" className="content-layer">
      {/* Hero — leaves space so the 3D object is visible behind the text. */}
      <section id="hero" className="flex min-h-screen flex-col justify-center px-6 md:px-16">
        <div className="max-w-3xl" data-reveal>
          <p className="mb-4 font-[var(--font-label)] text-xs tracking-[0.3em] text-[var(--color-accent)] uppercase">
            {profile.role} · 2026
          </p>
          <h1 className="font-[var(--font-display)] text-5xl leading-[1.05] font-medium text-balance md:text-7xl">
            ผมคือซูม{' '}
            <span className="relative inline-block text-[var(--color-accent)] italic">
              นักสร้าง
              <Squiggle className="absolute -bottom-2 left-0 h-3 w-full" />
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-[var(--color-muted)]">{profile.tagline}</p>
          <p className="mt-8 text-xs tracking-widest text-[var(--color-muted)] uppercase">
            ↓ เลื่อนลงเพื่อสำรวจ
          </p>
        </div>
      </section>

      {/* About */}
      <section id="about" className="px-6 py-24 md:px-16">
        <div data-reveal className="max-w-3xl">
          <h2 className="mb-6 font-[var(--font-display)] text-3xl font-semibold">เกี่ยวกับผม</h2>
          <FloorContent id="about" />
        </div>
      </section>

      {/* Work */}
      <section id="work" className="px-6 py-24 md:px-16">
        <div data-reveal>
          <h2 className="mb-10 font-[var(--font-display)] text-3xl font-semibold">ผลงานของผม</h2>
          <FloorContent id="work" />
        </div>
      </section>

      {/* Tech + Arcade */}
      <section id="tech" className="px-6 py-24 md:px-16">
        <div data-reveal>
          <h2 className="mb-10 font-[var(--font-display)] text-3xl font-semibold text-[#c7a6e6]">
            เทค & ห้องเกม
          </h2>
          <FloorContent id="tech" />
        </div>
      </section>

      <section id="contact" className="px-6 py-24 md:px-16">
        <div data-reveal>
          <h2 className="mb-6 font-[var(--font-display)] text-3xl font-semibold">ติดต่อ</h2>
          <FloorContent id="contact" />
        </div>
      </section>

      <footer id="thanks" className="px-6 py-16 md:px-16">
        <div data-reveal className="max-w-2xl">
          <h2 className="mb-6 font-[var(--font-display)] text-3xl font-semibold">ขอบคุณ</h2>
          <FloorContent id="thanks" />
        </div>
      </footer>
    </main>
  );
}
