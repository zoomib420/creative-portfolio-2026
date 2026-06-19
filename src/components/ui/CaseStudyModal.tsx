import { useEffect } from 'react';
import { useAppStore } from '../../lib/store';
import { caseStudies } from '../../data/caseStudies';

/**
 * Full case-study detail modal, opened from a service package's
 * "อ่าน Case Study เต็ม" button. Mirrors ProjectModal's structure/styling.
 */
export function CaseStudyModal() {
  const activeId = useAppStore((s) => s.activeCaseStudyId);
  const close = useAppStore((s) => s.closeCaseStudy);
  const language = useAppStore((s) => s.language);
  const study = activeId ? caseStudies[activeId] : null;

  useEffect(() => {
    if (!study) return;
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
  }, [study, close]);

  if (!study) return null;

  const closeLabel = language === 'th' ? 'ปิด' : 'Close';
  const sectionLabels = {
    context: language === 'th' ? 'บริบท' : 'Context',
    problem: language === 'th' ? 'ปัญหาก่อนเริ่ม' : 'The Problem',
    solution: language === 'th' ? 'ทางแก้ที่ทำ' : 'The Solution',
    results: language === 'th' ? 'ผลลัพธ์' : 'Results',
    tools: language === 'th' ? 'เครื่องมือ/เทคนิคที่ใช้' : 'Tools & Techniques',
    applicableTo: language === 'th' ? 'ใช้กับธุรกิจแบบไหนได้อีก' : 'Who else this fits',
  };

  return (
    <div
      className="content-layer fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={study.projectTitle}
    >
      <button
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-label={closeLabel}
        onClick={close}
      />

      <div
        className="relative z-10 max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[var(--color-glow)] bg-[var(--color-ink)] flex flex-col"
        data-lenis-prevent="true"
      >
        <button
          className="absolute top-4 right-4 z-20 text-[var(--color-muted)] transition-colors hover:text-[var(--color-accent)] rounded-full bg-[var(--color-void)]/80 p-2 backdrop-blur"
          onClick={close}
          aria-label={closeLabel}
        >
          ✕
        </button>

        <div className="p-6 md:p-8 flex-1">
          <p className="mb-2 text-[10px] tracking-widest uppercase text-[var(--color-accent-2)]">
            {language === 'th' ? 'Case Study' : 'Case Study'}
          </p>
          <h2 className="font-[var(--font-display)] text-2xl font-semibold md:text-3xl text-[var(--color-mist)]">
            {study.projectTitle}
          </h2>
          <p className="mt-3 leading-relaxed text-[var(--color-mist)]">{study.context[language]}</p>

          <h3 className="mt-6 mb-2 text-xs tracking-widest text-[var(--color-mist)] uppercase">
            {sectionLabels.problem}
          </h3>
          <p className="leading-relaxed text-[var(--color-muted)]">{study.problem[language]}</p>

          <h3 className="mt-6 mb-2 text-xs tracking-widest text-[var(--color-mist)] uppercase">
            {sectionLabels.solution}
          </h3>
          <p className="leading-relaxed text-[var(--color-muted)]">{study.solution[language]}</p>

          <h3 className="mt-6 mb-2 text-xs tracking-widest text-[var(--color-mist)] uppercase">
            {sectionLabels.results}
          </h3>
          <ul className="list-inside list-disc space-y-1 text-sm text-[var(--color-muted)]">
            {study.results.map((r, i) => (
              <li key={i}>{r[language]}</li>
            ))}
          </ul>

          <h3 className="mt-6 mb-2 text-xs tracking-widest text-[var(--color-mist)] uppercase">
            {sectionLabels.tools}
          </h3>
          <ul className="flex flex-wrap gap-2">
            {study.tools.map((t) => (
              <li
                key={t}
                className="rounded-full border border-[var(--color-glow)] px-2.5 py-0.5 text-xs text-[var(--color-muted)]"
              >
                {t}
              </li>
            ))}
          </ul>

          <h3 className="mt-6 mb-2 text-xs tracking-widest text-[var(--color-mist)] uppercase">
            {sectionLabels.applicableTo}
          </h3>
          <ul className="list-inside list-disc space-y-1 text-sm text-[var(--color-muted)]">
            {study.applicableTo.map((a, i) => (
              <li key={i}>{a[language]}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
