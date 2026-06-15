import { profile } from '../../data/profile';
import { FloorContent } from '../ui/FloorContent';

/**
 * Basic (2D/Static) tier — the graceful fallback for low-power devices,
 * reduced-motion users, and browsers without WebGL2/WebGPU.
 * Same content source as the 3D world (src/data/{projects,profile}.ts).
 */
export function Grid2D() {
  return (
    <main id="top" className="content-layer mx-auto max-w-5xl px-6 pt-32 pb-24 md:px-10">
      {/* Hero */}
      <section id="hero" className="mb-28">
        <p className="mb-4 font-[var(--font-label)] text-xs tracking-[0.3em] text-[var(--color-accent)] uppercase">
          {profile.role} · 2026
        </p>
        <h1 className="font-[var(--font-display)] text-4xl leading-tight font-medium text-balance md:text-6xl">
          {profile.tagline}
        </h1>
        <p className="mt-6 max-w-2xl text-[var(--color-muted)]">
          คุณกำลังดูเวอร์ชัน 2D ที่เบาและเข้าถึงง่าย —
          เปิดบนอุปกรณ์ที่รองรับ WebGPU เพื่อสัมผัสประสบการณ์ 3D เต็มรูปแบบ
        </p>
      </section>

      {/* About */}
      <section id="about" className="mb-28">
        <h2 className="mb-6 font-[var(--font-display)] text-2xl font-semibold">เกี่ยวกับผม</h2>
        <FloorContent id="about" />
      </section>

      {/* Work */}
      <section id="work" className="mb-28">
        <h2 className="mb-8 font-[var(--font-display)] text-2xl font-semibold">ผลงานของผม</h2>
        <FloorContent id="work" />
      </section>

      {/* Tech + Arcade */}
      <section id="tech" className="mb-28">
        <h2 className="mb-8 font-[var(--font-display)] text-2xl font-semibold text-[#c7a6e6]">
          เทค & ห้องเกม
        </h2>
        <FloorContent id="tech" />
      </section>

      <section id="contact" className="mb-28">
        <h2 className="mb-6 font-[var(--font-display)] text-2xl font-semibold">ติดต่อ</h2>
        <FloorContent id="contact" />
      </section>

      <footer id="thanks" className="border-t border-[var(--color-glow)] pt-8">
        <h2 className="mb-6 font-[var(--font-display)] text-2xl font-semibold">ขอบคุณ</h2>
        <FloorContent id="thanks" />
      </footer>
    </main>
  );
}
