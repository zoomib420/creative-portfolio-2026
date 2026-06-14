import { projects } from '../../data/projects';
import { profile } from '../../data/profile';
import { ProjectCard } from './ProjectCard';

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
          <p className="mb-4 text-xs tracking-[0.3em] text-[var(--color-accent)] uppercase">
            {profile.role} · 2026
          </p>
          <h1 className="font-[var(--font-display)] text-5xl leading-[1.05] font-semibold text-balance md:text-7xl">
            Living <span className="text-[var(--color-accent)]">Experience</span>
          </h1>
          <p className="mt-6 max-w-xl text-[var(--color-muted)]">{profile.tagline}</p>
          <p className="mt-8 text-xs tracking-widest text-[var(--color-muted)] uppercase">
            ↓ เลื่อนลงเพื่อสำรวจ
          </p>
        </div>
      </section>

      {/* Work */}
      <section id="work" className="px-6 py-24 md:px-16">
        <h2 data-reveal className="mb-10 font-[var(--font-display)] text-3xl font-semibold">
          ผลงานที่คัดสรร
        </h2>
        <div data-reveal className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} glass />
          ))}
        </div>
      </section>

      {/* About */}
      <section id="about" className="px-6 py-24 md:px-16">
        <div data-reveal>
          <h2 className="mb-6 font-[var(--font-display)] text-3xl font-semibold">เกี่ยวกับผม</h2>
          <p className="max-w-2xl leading-relaxed text-[var(--color-muted)]">{profile.bio}</p>
          <p className="mt-4 text-sm text-[var(--color-muted)]">📍 {profile.location}</p>
        </div>
      </section>

      <footer id="contact" className="px-6 py-16 md:px-16">
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
