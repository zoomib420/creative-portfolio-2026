import { useAppStore } from '../../lib/store';
import type { GameMeta } from '../../data/games';

interface GameCardProps {
  game: GameMeta;
  glass?: boolean;
}

export function GameCard({ game, glass = false }: GameCardProps) {
  const openGame = useAppStore((s) => s.openGame);

  return (
    <button
      onClick={() => openGame(game.id)}
      className={[
        'group block w-full rounded-xl border border-[var(--color-glow)] p-5 text-left transition-all',
        'hover:-translate-y-0.5 hover:border-[#c7a6e6]',
        glass ? 'bg-[var(--color-ink)]/70 backdrop-blur' : 'bg-[var(--color-ink)]',
      ].join(' ')}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] tracking-widest text-[#c7a6e6] uppercase">
          Arcade
        </span>
        <div className="flex gap-1">
          {game.keyboard && (
            <span className="text-[10px] text-[var(--color-muted)]" title="Keyboard support">⌨️</span>
          )}
          {!game.reducedMotionOk && (
            <span className="text-[10px] text-[var(--color-muted)]" title="Contains motion">🌀</span>
          )}
        </div>
      </div>
      <h3 className="mt-2 font-[var(--font-display)] text-lg font-semibold">{game.title}</h3>
      <p className="mt-2 text-sm text-[var(--color-muted)]">{game.tagline}</p>
      
      <span className="mt-4 inline-block text-xs text-[#c7a6e6] opacity-0 transition-opacity group-hover:opacity-100">
        Play Game →
      </span>
    </button>
  );
}
