import { useAppStore } from '../../lib/store';
import type { Project } from '../../data/projects';

interface ProjectCardProps {
  project: Project;
  /** Slightly translucent style for layering over the 3D canvas. */
  glass?: boolean;
}

/** Clickable project card shared by the 2D grid and the 3D overlay. */
export function ProjectCard({ project, glass = false }: ProjectCardProps) {
  const openProject = useAppStore((s) => s.openProject);

  return (
    <button
      onClick={() => openProject(project.id)}
      className={[
        'group block w-full rounded-xl border border-[var(--color-glow)] p-5 text-left transition-all',
        'hover:-translate-y-0.5 hover:border-[var(--color-accent)]',
        glass ? 'bg-[var(--color-ink)]/70 backdrop-blur' : 'bg-[var(--color-ink)]',
      ].join(' ')}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] tracking-widest text-[var(--color-accent-2)] uppercase">
          {project.level}
        </span>
        <span className="text-[10px] text-[var(--color-muted)]">{project.year}</span>
      </div>
      <h3 className="mt-2 font-[var(--font-display)] text-lg font-semibold">{project.title}</h3>
      <p className="mt-2 text-sm text-[var(--color-muted)]">{project.tagline}</p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {project.tools.slice(0, 3).map((t) => (
          <li
            key={t}
            className="rounded-full border border-[var(--color-glow)] px-2 py-0.5 text-[10px] text-[var(--color-muted)]"
          >
            {t}
          </li>
        ))}
      </ul>
      <span className="mt-4 inline-block text-xs text-[var(--color-accent)] opacity-0 transition-opacity group-hover:opacity-100">
        ดูรายละเอียด →
      </span>
    </button>
  );
}
