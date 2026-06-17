import { useAppStore } from '../../lib/store';
import type { GameMeta } from '../../data/games';

interface GameCardProps {
  game: GameMeta;
  glass?: boolean;
}

export function GameCard({ game, glass = false }: GameCardProps) {
  const openGame = useAppStore((s) => s.openGame);
  const language = useAppStore((s) => s.language);

  return (
    <button
      onClick={() => openGame(game.id)}
      className={[
        'group block w-full rounded-xl border border-[#ffbc61]/20 p-5 text-left transition-all',
        'hover:-translate-y-0.5 hover:border-[#ffbc61]',
        glass ? 'bg-[#3d281c]/70 backdrop-blur' : 'bg-[#3d281c]',
      ].join(' ')}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] tracking-widest text-[#ffbc61] uppercase">
          Arcade
        </span>
        <div className="flex gap-1">
          {game.keyboard && (
            <span className="text-[10px] text-[#fffaf2]/50" title={language === 'th' ? "รองรับคีย์บอร์ด" : "Keyboard support"}>⌨️</span>
          )}
          {!game.reducedMotionOk && (
            <span className="text-[10px] text-[#fffaf2]/50" title={language === 'th' ? "มีภาพเคลื่อนไหว" : "Contains motion"}>🌀</span>
          )}
        </div>
      </div>
      <h3 className="mt-2 font-[var(--font-display)] text-lg font-semibold text-[#fffaf2]">{game.title}</h3>
      <p className="mt-2 text-sm text-[#fffaf2]/70">{game.tagline[language]}</p>
      
      <span className="mt-4 inline-block text-xs text-[#ffbc61] opacity-0 transition-opacity group-hover:opacity-100">
        {language === 'th' ? 'เล่นเกม →' : 'Play Game →'}
      </span>
    </button>
  );
}
