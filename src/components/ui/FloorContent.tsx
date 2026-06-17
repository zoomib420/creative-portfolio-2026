import { profile } from '../../data/profile';
import { projects, projectCategories } from '../../data/projects';
import { games } from '../../data/games';
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

    case 'contact':
      return (
        <div className="space-y-4">
          <a className="inline-block text-lg text-[#ffbc61] hover:text-[#ffd479]" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
          <ul className="flex flex-wrap gap-4 text-xs tracking-widest uppercase">
            {profile.socials.map((s) => (
              <li key={s.url}>
                <a
                  className="text-[#fffaf2]/70 transition-colors hover:text-[#ffbc61]"
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
