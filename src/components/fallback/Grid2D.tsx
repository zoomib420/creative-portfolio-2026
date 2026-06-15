import { projects } from '../../data/projects';
import { games } from '../../data/games';
import { profile } from '../../data/profile';
import { ProjectCard } from '../ui/ProjectCard';
import { GameCard } from '../ui/GameCard';

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

      {/* Work */}
      <section id="work" className="mb-28">
        <h2 className="mb-8 font-[var(--font-display)] text-2xl font-semibold">ผลงานของผม</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </section>

      {/* Arcade */}
      <section id="arcade" className="mb-28">
        <h2 className="mb-8 font-[var(--font-display)] text-2xl font-semibold text-[#c7a6e6]">พักเล่นเกมสักหน่อยไหม?</h2>
        <div className="grid gap-6 sm:grid-cols-2 max-w-3xl">
          {games.map((g) => (
            <GameCard key={g.id} game={g} />
          ))}
        </div>
      </section>

      {/* About */}
      <section id="about" className="mb-28">
        <h2 className="mb-6 font-[var(--font-display)] text-2xl font-semibold">เกี่ยวกับผม</h2>
        <p className="max-w-2xl leading-relaxed text-[var(--color-muted)]">{profile.bio}</p>
        <p className="mt-4 text-sm text-[var(--color-muted)]">📍 {profile.location}</p>
      </section>

      <footer id="contact" className="border-t border-[var(--color-glow)] pt-8">
        <p className="text-sm text-[var(--color-muted)]">
          ติดต่อ:{' '}
          <a className="text-[var(--color-accent)]" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
        </p>
        <ul className="mt-4 flex flex-wrap gap-4 text-xs tracking-widest uppercase">
          {profile.socials.map((s) => (
            <li key={s.url}>
              <a
                className="text-[var(--color-muted)] transition-colors hover:text-[var(--color-accent)]"
                href={s.url}
                target="_blank"
                rel="noreferrer noopener"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </footer>
    </main>
  );
}
