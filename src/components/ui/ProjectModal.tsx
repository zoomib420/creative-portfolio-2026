import { useEffect } from 'react';
import { useAppStore } from '../../lib/store';
import { projectsById } from '../../data/projects';
import { ambientAudio } from '../../lib/audio';

/**
 * Project detail modal — shared by both the 2D grid and the 3D overlay.
 * Driven by store.activeProjectId. Opening it should also pause the 3D render
 * loop (perf budget) — wired in T-13.
 */
export function ProjectModal() {
  const activeId = useAppStore((s) => s.activeProjectId);
  const close = useAppStore((s) => s.closeProject);
  const audioEnabled = useAppStore((s) => s.audioEnabled);
  const language = useAppStore((s) => s.language);
  const project = activeId ? projectsById[activeId] : null;

  // Shift the ambient Solfeggio frequency to match this project's "room".
  useEffect(() => {
    if (!project || !audioEnabled) return;
    if (project.ambientHz) ambientAudio.setFrequency(project.ambientHz);
    return () => ambientAudio.setFrequency(528);
  }, [project, audioEnabled]);

  // Close on Escape + lock body scroll while open.
  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [project, close]);

  if (!project) return null;

  const closeLabel = language === 'th' ? 'ปิด' : 'Close';

  return (
    <div
      className="content-layer fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
    >
      {/* backdrop */}
      <button
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-label={closeLabel}
        onClick={close}
      />

      <div 
        className="relative z-10 max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[var(--color-glow)] bg-[var(--color-ink)] p-6 md:p-8"
        data-lenis-prevent="true"
      >
        <button
          className="absolute top-4 right-4 text-[var(--color-muted)] transition-colors hover:text-[var(--color-accent)]"
          onClick={close}
          aria-label={closeLabel}
        >
          ✕
        </button>

        <div className="mb-2 flex items-center gap-3 text-[10px] tracking-widest uppercase">
          <span className="text-[var(--color-accent-2)]">{project.level}</span>
          <span className="text-[var(--color-muted)]">{project.year}</span>
          <span className="text-[var(--color-muted)]">· {project.role}</span>
        </div>

        <h2 className="font-[var(--font-display)] text-2xl font-semibold md:text-3xl">
          {project.title}
        </h2>
        <p className="mt-2 text-[var(--color-accent)]">{project.tagline[language]}</p>

        <p className="mt-5 leading-relaxed text-[var(--color-muted)]">{project.description[language]}</p>

        <h3 className="mt-6 mb-2 text-xs tracking-widest text-[var(--color-mist)] uppercase">
          Key features
        </h3>
        <ul className="list-inside list-disc space-y-1 text-sm text-[var(--color-muted)]">
          {project.features.map((f, i) => (
            <li key={i}>{f[language]}</li>
          ))}
        </ul>

        <h3 className="mt-6 mb-2 text-xs tracking-widest text-[var(--color-mist)] uppercase">
          Tools
        </h3>
        <ul className="flex flex-wrap gap-2">
          {project.tools.map((t) => (
            <li
              key={t}
              className="rounded-full border border-[var(--color-glow)] px-2.5 py-0.5 text-xs text-[var(--color-muted)]"
            >
              {t}
            </li>
          ))}
        </ul>

        {project.links && project.links.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-3">
            {project.links.map((l) => (
              <a
                key={l.url}
                href={l.url}
                target="_blank"
                rel="noreferrer noopener"
                className="rounded-lg border border-[var(--color-accent)] px-4 py-2 text-sm text-[var(--color-accent)] transition-colors hover:bg-[var(--color-accent)] hover:text-[var(--color-void)]"
              >
                {l.label} ↗
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
