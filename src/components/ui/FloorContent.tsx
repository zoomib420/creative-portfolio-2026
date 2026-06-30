import { profile } from '../../data/profile';
import { projects, projectCategories } from '../../data/projects';
import { games } from '../../data/games';
import { servicePackages, depositTerms } from '../../data/services';
import { ProjectCard } from './ProjectCard';
import { GameCard } from './GameCard';

import { useAppStore } from '../../lib/store';

/** Unique tools across all projects → tech chips. */
const techChips = [...new Set(projects.flatMap((p) => p.tools))];

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.11.79-.25.79-.56v-2.17c-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.71.08-.71 1.16.08 1.78 1.2 1.78 1.2 1.03 1.76 2.69 1.25 3.35.95.1-.75.4-1.25.73-1.54-2.55-.29-5.23-1.27-5.23-5.67 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.45.11-3.03 0 0 .97-.31 3.17 1.17a10.98 10.98 0 0 1 5.77 0c2.2-1.48 3.17-1.17 3.17-1.17.62 1.58.23 2.74.11 3.03.73.8 1.18 1.82 1.18 3.07 0 4.41-2.69 5.38-5.26 5.66.41.36.78 1.06.78 2.14v3.18c0 .31.21.68.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path d="M4.98 3.5A2.48 2.48 0 1 0 5 8.46 2.48 2.48 0 0 0 4.98 3.5ZM2.75 9.75h4.47V21H2.75V9.75ZM9.86 9.75h4.29v1.54h.06c.6-1.13 2.06-1.97 4.24-1.97 4.53 0 5.36 2.98 5.36 6.86V21h-4.47v-4.27c0-1.02-.02-2.34-1.43-2.34-1.43 0-1.65 1.12-1.65 2.27V21H9.86V9.75Z" />
    </svg>
  );
}

function SocialIconButton({ label, url }: { label: string; url: string }) {
  const icon =
    label === 'GitHub' ? <GitHubIcon /> : label === 'LinkedIn' ? <LinkedInIcon /> : null;
  const tone =
    label === 'GitHub'
      ? 'border-[#f5f5f5]/15 bg-[#181717] text-[#f5f5f5] hover:border-[#f5f5f5]/40 hover:bg-[#24292f] hover:text-white'
      : label === 'LinkedIn'
        ? 'border-[#0a66c2]/35 bg-[#0a66c2] text-white hover:border-[#58a6ff]/55 hover:bg-[#004182] hover:text-white'
        : '';

  if (!icon) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer noopener"
        className="inline-block rounded-full border border-[#ffbc61]/40 bg-[#3d281c] px-4 py-2 text-xs font-bold tracking-widest text-[#ffbc61] uppercase transition-colors hover:bg-[#ffbc61] hover:text-[#2a2233]"
      >
        {label}
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={label}
      title={label}
      className={`group relative flex h-11 w-11 items-center justify-center rounded-full border shadow-[0_10px_20px_rgba(0,0,0,0.22)] transition-all hover:-translate-y-0.5 focus-visible:-translate-y-0.5 ${tone}`}
    >
      <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 rounded-full border border-[#fffaf2]/14 bg-[#241710]/95 px-3 py-1 text-[10px] font-bold tracking-[0.18em] text-[#fffaf2] uppercase opacity-0 shadow-[0_10px_24px_rgba(0,0,0,0.28)] transition-all duration-200 group-hover:-translate-y-1 group-hover:opacity-100 group-focus-visible:-translate-y-1 group-focus-visible:opacity-100">
        {label}
      </span>
      {icon}
    </a>
  );
}

/**
 * Full content for a floor's "room". Shared by the 3D RoomModal (opened on
 * click) and the 2D fallback (rendered inline) so the two never drift apart.
 */
export function FloorContent({ id }: { id: string }) {
  const language = useAppStore((s) => s.language);
  const openCaseStudy = useAppStore((s) => s.openCaseStudy);

  switch (id) {
    case 'about':
      return (
        <div className="space-y-4">
          <div className="mx-auto w-full max-w-[15rem] sm:max-w-[17rem]">
            <div className="overflow-hidden rounded-[1.75rem] border border-[#ffbc61]/25 bg-[#3d281c] p-2 shadow-[0_14px_28px_rgba(0,0,0,0.28)]">
              <img
                src={profile.portraitUrl}
                alt={profile.portraitAlt[language]}
                loading="lazy"
                decoding="async"
                className="aspect-[4/5] w-full rounded-[1.2rem] object-cover object-[center_20%]"
              />
            </div>
            <div className="mt-3 flex items-center justify-between gap-3 rounded-full border border-[#ffbc61]/20 bg-[#3d281c]/80 px-4 py-2 text-xs text-[#fffaf2]/70">
              <span className="font-[var(--font-label)] tracking-[0.24em] text-[#ffbc61] uppercase">
                {profile.handle}
              </span>
              <span>{profile.role[language]}</span>
            </div>
          </div>
          <p className="leading-relaxed whitespace-pre-line text-[#fffaf2]/90">
            {profile.bio[language]}
          </p>
          <p className="text-sm text-[#fffaf2]/70">📍 {profile.location[language]}</p>
        </div>
      );

    case 'work':
      return (
        <div className="space-y-10">
          {projectCategories
            .filter((cat) => cat.id !== 'games')
            .map((cat) => {
              const items = projects.filter((p) => p.category === cat.id);
              if (!items.length) return null;
              return (
                <div key={cat.id}>
                  <h3 className="mb-4 font-[var(--font-label)] text-xs tracking-[0.3em] text-[#ffbc61] uppercase">
                    {cat.label[language]}
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

    case 'work-games':
      return (
        <div className="space-y-4">
          <div className="grid gap-5 sm:grid-cols-2">
            {projects
              .filter((p) => p.category === 'games')
              .map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
          </div>
        </div>
      );

    case 'business': {
      const lineLink = profile.socials.find((s) => s.url.includes('lin.ee'));
      return (
        <div className="space-y-8">
          <p className="max-w-xl text-base leading-relaxed text-[#fffaf2]/90">
            {language === 'th'
              ? 'แพ็กเกจ automation ที่ใช้แก้ปัญหาธุรกิจจริงมาแล้ว — เริ่มต้นเร็ว ขอบเขตชัด ไม่มีค่าใช้จ่ายแอบแฝง'
              : 'Automation packages already proven on a real business problem — quick to start, clearly scoped, no hidden costs.'}
          </p>

          <div className="flex flex-col gap-6">
            {servicePackages.map((pkg) => (
              <div
                key={pkg.id}
                className="flex flex-col rounded-2xl border border-[#ffbc61]/20 bg-[#3d281c] p-6 sm:p-8"
              >
                <h3 className="font-[var(--font-display)] text-2xl font-semibold text-[#fffaf2]">
                  {pkg.title[language]}
                </h3>
                <p className="mt-2 text-base font-medium text-[#ffbc61]">{pkg.outcome[language]}</p>
                <p className="mt-4 text-base leading-relaxed text-[#fffaf2]/70">{pkg.description[language]}</p>

                {pkg.scope.length > 0 && (
                  <ul className="mt-4 list-inside list-disc space-y-1.5 text-sm text-[#fffaf2]/60">
                    {pkg.scope.map((s, i) => (
                      <li key={i}>{s[language]}</li>
                    ))}
                  </ul>
                )}

                <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                  <p className="font-[var(--font-display)] text-2xl font-bold text-[#ffd479]">
                    {pkg.priceRange[language]}
                  </p>

                  {pkg.caseStudyId && (
                    <button
                      onClick={() => openCaseStudy(pkg.caseStudyId!)}
                      className="inline-block text-sm font-bold tracking-widest text-[#ffbc61] uppercase transition-colors hover:text-[#ffd479]"
                    >
                      {language === 'th' ? 'อ่าน Case Study เต็ม →' : 'Read full case study →'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <p className="max-w-xl text-base text-[#fffaf2]/60">{depositTerms[language]}</p>

          {lineLink && (
            <a
              href={lineLink.url}
              target="_blank"
              rel="noreferrer noopener"
              className="group flex w-fit items-center gap-3 rounded-full bg-[#00B900] px-6 py-3 font-[var(--font-display)] text-lg font-bold text-white shadow-lg transition-all hover:-translate-y-1 hover:bg-[#009900] hover:shadow-[#00B900]/40"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                <path d="M24 10.304c0-5.369-5.383-9.738-12-9.738-6.616 0-12 4.369-12 9.738 0 4.814 4.269 8.846 10.036 9.608.391.084.922.258 1.057.592.122.303.079.778.039 1.085l-.171 1.027c-.053.303-.242 1.186 1.039.647 1.281-.54 6.911-4.069 9.428-6.967 1.739-1.907 2.572-3.843 2.572-5.992z" />
              </svg>
              {language === 'th' ? 'คุยกับ Intake Pilot เพื่อเริ่มงาน' : 'Chat with Intake Pilot to get started'}
            </a>
          )}
        </div>
      );
    }

    case 'tech':
      return (
        <div className="space-y-8">
          <div>
            <h3 className="mb-4 font-[var(--font-label)] text-xs tracking-[0.3em] text-[#ffbc61] uppercase">
              {language === 'th' ? 'เครื่องมือ & เทคโนโลยีที่ใช้' : 'Tools & Technologies'}
            </h3>
            <ul className="flex flex-wrap gap-2">
              {techChips.map((t) => (
                <li
                  key={t}
                  className="rounded-full border border-[#ffbc61]/30 bg-[#3d281c] px-3 py-1 text-sm text-[#fffaf2]/90"
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      );

    case 'tech-games':
      return (
        <div className="space-y-4">
          <p className="text-sm text-[#fffaf2]/70">
            {language === 'th' ? 'เลือกเกมที่จะเล่น:' : 'Choose a game to play:'}
          </p>
          <div className="grid gap-5 sm:grid-cols-2">
            {games.map((g) => (
              <GameCard key={g.id} game={g} />
            ))}
          </div>
        </div>
      );

    case 'contact': {
      const lineLink = profile.socials.find((s) => s.url.includes('lin.ee'));
      const otherSocials = profile.socials.filter((s) => s !== lineLink);
      return (
        <div className="space-y-5">
          <p className="max-w-md leading-relaxed text-[#fffaf2]/90">{profile.contactCta[language]}</p>
          <p className="font-[var(--font-label)] text-xs font-bold tracking-[0.16em] text-[#ffd479] uppercase">
            {profile.availability[language]}
          </p>

          {lineLink && (
            <a
              href={lineLink.url}
              target="_blank"
              rel="noreferrer noopener"
              className="group flex w-fit items-center gap-3 rounded-full bg-[#00B900] px-6 py-3 font-[var(--font-display)] text-lg font-bold text-white shadow-lg transition-all hover:-translate-y-1 hover:bg-[#009900] hover:shadow-[#00B900]/40"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                <path d="M24 10.304c0-5.369-5.383-9.738-12-9.738-6.616 0-12 4.369-12 9.738 0 4.814 4.269 8.846 10.036 9.608.391.084.922.258 1.057.592.122.303.079.778.039 1.085l-.171 1.027c-.053.303-.242 1.186 1.039.647 1.281-.54 6.911-4.069 9.428-6.967 1.739-1.907 2.572-3.843 2.572-5.992z" />
              </svg>
              {lineLink.label}
            </a>
          )}

          {otherSocials.length > 0 && (
            <ul className="flex flex-wrap gap-3">
              {otherSocials.map((s) => (
                <li key={s.url}>
                  <SocialIconButton label={s.label} url={s.url} />
                </li>
              ))}
            </ul>
          )}

          <a className="inline-block text-sm text-[#fffaf2]/60 hover:text-[#ffbc61]" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
        </div>
      );
    }

    case 'thanks':
      return (
        <div className="space-y-5">
          <p className="leading-relaxed text-[#fffaf2]/90">
            {language === 'th' 
              ? 'ขอบคุณที่สละเวลาแวะเข้ามาชมพอร์ตของผมนะครับ — ถ้าชอบงานของผม หรืออยากร่วมงานกัน ทักมาได้เลย! 🙏' 
              : 'Thank you for taking the time to visit my portfolio. If you like my work or want to collaborate, feel free to reach out! 🙏'}
          </p>
          <div className="mt-6 flex flex-col items-center space-y-3 rounded-xl bg-[#fffaf2] p-4 text-[#2a2233]">
            <p className="text-center font-bold">
              {language === 'th' ? '♥ เลี้ยงกาแฟผม (PromptPay)' : '♥ Buy me a coffee (PromptPay)'}
            </p>
            {/* The user should save the QR code image as public/promptpay-qr.jpg */}
            <img 
              src="/promptpay-qr.jpg" 
              alt="PromptPay QR Code" 
              className="w-48 max-w-full rounded-lg border-2 border-[#56c2b0]"
            />
            <p className="text-sm">นาย ปวสิทธิ์ ไชยรัตน์</p>
          </div>
        </div>
      );

    default:
      return null;
  }
}
