import { profile } from '../../data/profile';
import { projects, projectCategories } from '../../data/projects';
import { games } from '../../data/games';
import { ProjectCard } from './ProjectCard';
import { GameCard } from './GameCard';

/** Unique tools across all projects → tech chips. */
const techChips = [...new Set(projects.flatMap((p) => p.tools))];

/**
 * Full content for a floor's "room". Shared by the 3D RoomModal (opened on
 * click) and the 2D fallback (rendered inline) so the two never drift apart.
 */
export function FloorContent({ id }: { id: string }) {
  switch (id) {
    case 'about':
      return (
        <div className="space-y-4">
          <p className="leading-relaxed whitespace-pre-line text-[var(--color-muted)]">
            {profile.bio}
          </p>
          <p className="text-sm text-[var(--color-muted)]">📍 {profile.location}</p>
        </div>
      );

    case 'work':
      return (
        <div className="space-y-10">
          {projectCategories.map((cat) => {
            const items = projects.filter((p) => p.category === cat.id);
            if (!items.length) return null;
            return (
              <div key={cat.id}>
                <h3 className="mb-4 font-[var(--font-label)] text-xs tracking-[0.3em] text-[var(--color-accent)] uppercase">
                  {cat.label}
                </h3>
                <div className="grid gap-5 sm:grid-cols-2">
                  {items.map((p) => (
                    <ProjectCard key={p.id} project={p} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      );

    case 'tech':
      return (
        <div className="space-y-8">
          <div>
            <h3 className="mb-4 font-[var(--font-label)] text-xs tracking-[0.3em] text-[var(--color-accent)] uppercase">
              เครื่องมือ &amp; เทคโนโลยีที่ใช้
            </h3>
            <ul className="flex flex-wrap gap-2">
              {techChips.map((t) => (
                <li
                  key={t}
                  className="rounded-full border border-[var(--color-glow)] bg-[var(--color-void)] px-3 py-1 text-sm text-[var(--color-mist)]"
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-[var(--font-label)] text-xs tracking-[0.3em] text-[#c7a6e6] uppercase">
              พักเล่นเกมสักหน่อยไหม?
            </h3>
            <div className="grid gap-5 sm:grid-cols-2">
              {games.map((g) => (
                <GameCard key={g.id} game={g} />
              ))}
            </div>
          </div>
        </div>
      );

    case 'contact':
      return (
        <div className="space-y-4">
          <a className="inline-block text-lg text-[var(--color-accent)]" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
          <ul className="flex flex-wrap gap-4 text-xs tracking-widest uppercase">
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
        </div>
      );

    case 'thanks':
      return (
        <div className="space-y-5">
          <p className="leading-relaxed text-[var(--color-muted)]">
            ขอบคุณที่สละเวลาแวะเข้ามาชมพอร์ตของผมนะครับ — ถ้าชอบงานของผม
            หรืออยากร่วมงานกัน ทักมาได้เลย! 🙏
          </p>
          {/* TODO(user): ใส่ช่องทางสนับสนุนจริง (PromptPay / Ko-fi / ฯลฯ) เมื่อพร้อม */}
          <button
            type="button"
            disabled
            title="เร็ว ๆ นี้"
            className="cursor-not-allowed rounded-full border border-[var(--color-glow)] px-5 py-2 text-sm text-[var(--color-muted)] opacity-70"
          >
            ♥ สนับสนุนผม (เร็ว ๆ นี้)
          </button>
        </div>
      );

    default:
      return null;
  }
}
