import { profile } from '../../data/profile';
import { FloorContent } from '../ui/FloorContent';
import { useAppStore } from '../../lib/store';

/**
 * Basic (2D/Static) tier — the graceful fallback for low-power devices,
 * reduced-motion users, and browsers without WebGL2/WebGPU.
 * Same content source as the 3D world (src/data/{projects,profile}.ts).
 */
export function Grid2D() {
  const language = useAppStore((s) => s.language);
  
  return (
    <div className="min-h-screen w-full bg-[#1a110b] text-[#fffaf2]">
      <main id="top" className="content-layer mx-auto max-w-5xl px-6 pt-32 pb-24 md:px-10">
        {/* Hero */}
        <section id="hero" className="mb-28">
          <p className="mb-4 font-[var(--font-label)] text-xs tracking-[0.3em] text-[#ffbc61] font-bold uppercase">
            {profile.role[language]} · 2026
          </p>
          <h1 className="font-[var(--font-display)] text-4xl leading-tight font-extrabold text-[#fffaf2] text-balance md:text-6xl">
            {language === 'th' ? 'ผมคือ สุดยอดไก่ชน นักสร้าง' : 'I am Super Rooster Builder'}
          </h1>
          <p className="mt-6 max-w-2xl text-[#fffaf2]/80 font-normal leading-[1.8] whitespace-pre-line">
            {profile.tagline[language]}
          </p>
          <p className="mt-6 max-w-2xl text-[#fffaf2]/50 text-sm">
            {language === 'th' 
              ? 'คุณกำลังดูเวอร์ชัน 2D ที่เบาและเข้าถึงง่าย — เปิดบนอุปกรณ์ที่รองรับ WebGPU เพื่อสัมผัสประสบการณ์ 3D เต็มรูปแบบ'
              : 'You are viewing the lightweight, accessible 2D version — Open on a WebGPU-supported device for the full 3D experience.'}
          </p>
        </section>

        {/* About */}
        <section id="about" className="mb-28">
          <h2 className="mb-6 font-[var(--font-display)] text-2xl font-semibold text-[#ffbc61]">
            {language === 'th' ? 'เกี่ยวกับผม' : 'About Me'}
          </h2>
          <FloorContent id="about" />
        </section>

        {/* Work */}
        <section id="work" className="mb-28">
          <h2 className="mb-8 font-[var(--font-display)] text-2xl font-semibold text-[#ffbc61]">
            {language === 'th' ? 'ผลงานของผม' : 'My Works'}
          </h2>
          <FloorContent id="work" />
        </section>

        {/* Tech + Arcade */}
        <section id="tech" className="mb-28">
          <h2 className="mb-8 font-[var(--font-display)] text-2xl font-semibold text-[#ffbc61]">
            {language === 'th' ? 'เทค & ห้องเกม' : 'Tech & Arcade'}
          </h2>
          <FloorContent id="tech" />
        </section>

        <section id="contact" className="mb-28">
          <h2 className="mb-6 font-[var(--font-display)] text-2xl font-semibold text-[#ffbc61]">
            {language === 'th' ? 'ติดต่อ' : 'Contact'}
          </h2>
          <FloorContent id="contact" />
        </section>

        <footer id="thanks" className="border-t border-[#ffbc61]/20 pt-8">
          <h2 className="mb-6 font-[var(--font-display)] text-2xl font-semibold text-[#ffbc61]">
            {language === 'th' ? 'ขอบคุณ' : 'Thanks'}
          </h2>
          <FloorContent id="thanks" />
        </footer>
      </main>
    </div>
  );
}
