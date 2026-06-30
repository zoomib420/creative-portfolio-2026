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
  const language = useAppStore((s) => s.language);
  const links = project.links ?? [];

  return (
    <article
      className={[
        'group flex w-full flex-col overflow-hidden rounded-xl border border-[#ffbc61]/20 text-left transition-all',
        'hover:-translate-y-0.5 hover:border-[#ffbc61]',
        glass ? 'bg-[#3d281c]/70 backdrop-blur' : 'bg-[#3d281c]',
      ].join(' ')}
    >
      <button
        type="button"
        onClick={() => openProject(project.id)}
        className="m-0 flex flex-1 flex-col justify-start appearance-none border-0 bg-transparent p-0 text-left"
      >
        {project.thumbnail && (
          <div className="h-32 w-full shrink-0 overflow-hidden md:h-40">
            <img
              src={project.thumbnail}
              alt={project.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              style={project.thumbnailPosition ? { objectPosition: project.thumbnailPosition } : undefined}
            />
          </div>
        )}

        <div className="flex flex-1 flex-col p-5 pb-0">
          <div className="flex items-center justify-between">
            <span className="text-[10px] tracking-widest text-[#ffbc61] uppercase">
              {project.level}
            </span>
            <span className="text-[10px] text-[#fffaf2]/50">{project.year}</span>
          </div>
          <h3 className="mt-2 font-[var(--font-display)] text-lg font-semibold text-[#fffaf2]">{project.title}</h3>
          <p className="mt-2 text-sm text-[#fffaf2]/70">{project.tagline[language]}</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {project.tools.slice(0, 3).map((t) => (
              <li
                key={t}
                className="rounded-full border border-[#ffbc61]/20 px-2 py-0.5 text-[10px] text-[#ffbc61]/70"
              >
                {t}
              </li>
            ))}
          </ul>
        </div>
      </button>

      <div className="mt-auto flex flex-wrap items-center gap-2 p-5 pt-4">
        <button
          type="button"
          onClick={() => openProject(project.id)}
          className="rounded-full border border-[#ffbc61]/35 px-3 py-1.5 text-xs font-bold text-[#ffbc61] transition-colors hover:bg-[#ffbc61] hover:text-[#2a2233]"
        >
          {language === 'th' ? 'ดูรายละเอียด' : 'Details'}
        </button>

        {links.map((link) => (
          <a
            key={link.url}
            href={link.url}
            target="_blank"
            rel="noreferrer noopener"
            className="rounded-full border border-[#fffaf2]/20 px-3 py-1.5 text-xs font-bold text-[#fffaf2]/75 transition-colors hover:border-[#ffbc61] hover:text-[#ffbc61]"
          >
            {link.label} ↗
          </a>
        ))}

        {links.length === 0 && (
          <span className="text-xs text-[#ffbc61] opacity-0 transition-opacity group-hover:opacity-100">
            {language === 'th' ? 'ดูรายละเอียด →' : 'View details →'}
          </span>
        )}
      </div>
    </article>
  );
}
