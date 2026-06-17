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

  return (
    <button
      onClick={() => openProject(project.id)}
      className={[
        'group block w-full rounded-xl border border-[#ffbc61]/20 p-5 text-left transition-all',
        'hover:-translate-y-0.5 hover:border-[#ffbc61]',
        glass ? 'bg-[#3d281c]/70 backdrop-blur' : 'bg-[#3d281c]',
      ].join(' ')}
    >
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
      <span className="mt-4 inline-block text-xs text-[#ffbc61] opacity-0 transition-opacity group-hover:opacity-100">
        {language === 'th' ? 'ดูรายละเอียด →' : 'View details →'}
      </span>
    </button>
  );
}
