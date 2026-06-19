import { profile } from '../../data/profile';
import { projects, projectCategories } from '../../data/projects';
import { games } from '../../data/games';
import { servicePackages, depositTerms } from '../../data/services';
import { ProjectCard } from './ProjectCard';
import { GameCard } from './GameCard';

import { useAppStore } from '../../lib/store';

/** Unique tools across all projects → tech chips. */
const techChips = [...new Set(projects.flatMap((p) => p.tools))];

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
                  <a
                    className="inline-block rounded-full border border-[#ffbc61]/40 bg-[#3d281c] px-4 py-2 text-xs font-bold tracking-widest text-[#ffbc61] uppercase transition-colors hover:bg-[#ffbc61] hover:text-[#2a2233]"
                    href={s.url}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {s.label}
                  </a>
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
