import { useEffect, Suspense } from 'react';
import { useAppStore } from '../../lib/store';
import { gamesById } from '../../data/games';
import { ambientAudio } from '../../lib/audio';

export function GameModal() {
  const activeId = useAppStore((s) => s.activeGameId);
  const close = useAppStore((s) => s.closeGame);
  const audioEnabled = useAppStore((s) => s.audioEnabled);
  const game = activeId ? gamesById[activeId] : null;

  useEffect(() => {
    if (!game || !audioEnabled) return;
    ambientAudio.setFrequency(432); // specific frequency for games
    return () => ambientAudio.setFrequency(528);
  }, [game, audioEnabled]);

  useEffect(() => {
    if (!game) return;
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
  }, [game, close]);

  if (!game) return null;
  const GameComponent = game.component;

  return (
    <div
      className="content-layer fixed inset-0 z-50 flex items-center justify-center p-0 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={game.title}
    >
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" />

      <div className="relative z-10 flex h-full w-full max-w-5xl flex-col overflow-hidden rounded-none border-[var(--color-glow)] bg-[var(--color-ink)] md:h-[80vh] md:rounded-2xl md:border">
        {/* Header bar */}
        <div className="flex shrink-0 items-center justify-between border-b border-[var(--color-glow)] px-4 py-3">
          <div className="flex items-center gap-3">
            <h2 className="font-[var(--font-display)] text-lg font-semibold text-[var(--color-mist)]">
              {game.title}
            </h2>
            {!game.reducedMotionOk && (
              <span className="rounded bg-[#ff9a62]/20 px-2 py-0.5 text-[10px] text-[#ff9a62]" title="Contains motion">
                MOTION
              </span>
            )}
          </div>
          <button
            className="rounded p-2 text-[var(--color-muted)] transition-colors hover:bg-[var(--color-glow)] hover:text-white"
            onClick={close}
            aria-label="Exit game"
          >
            ✕ Exit
          </button>
        </div>

        {/* Game Container */}
        <div className="relative flex-1 bg-[var(--color-void)]">
          <Suspense fallback={
            <div className="flex h-full items-center justify-center text-[var(--color-muted)]">
              Loading {game.title}...
            </div>
          }>
            <GameComponent onExit={close} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
