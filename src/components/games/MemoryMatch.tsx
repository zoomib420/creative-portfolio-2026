import { useState, useEffect, useRef } from 'react';

const ICONS = ['⚛️', '🟢', '🤖', '🎮', '📱', '🔧', '🌐', '🔒'];
const PAIRS = [...ICONS, ...ICONS];

interface Card {
  id: number;
  icon: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface Props {
  onExit?: () => void;
}

export default function MemoryMatch({ onExit }: Props) {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [bestScore, setBestScore] = useState<number | null>(() => {
    const saved = localStorage.getItem('memory-match-best');
    return saved ? parseInt(saved, 10) : null;
  });

  const timeoutRef = useRef<number | null>(null);

  const shuffle = () => {
    const shuffled = [...PAIRS].sort(() => Math.random() - 0.5);
    setCards(shuffled.map((icon, i) => ({ id: i, icon, isFlipped: false, isMatched: false })));
    setFlippedIndices([]);
    setMoves(0);
    setMatches(0);
    setIsGameOver(false);
    setIsPlaying(true);
  };

  const handleCardClick = (index: number) => {
    if (!isPlaying || isGameOver || flippedIndices.length >= 2 || cards[index].isFlipped || cards[index].isMatched) {
      return;
    }

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlippedIndices = [...flippedIndices, index];
    setFlippedIndices(newFlippedIndices);

    if (newFlippedIndices.length === 2) {
      setMoves((m) => m + 1);
      const [firstIndex, secondIndex] = newFlippedIndices;

      if (cards[firstIndex].icon === cards[secondIndex].icon) {
        newCards[firstIndex].isMatched = true;
        newCards[secondIndex].isMatched = true;
        setCards(newCards);
        setFlippedIndices([]);
        
        if (matches + 1 === ICONS.length) {
          setIsGameOver(true);
          setIsPlaying(false);
          if (!bestScore || moves + 1 < bestScore) {
            setBestScore(moves + 1);
            localStorage.setItem('memory-match-best', (moves + 1).toString());
          }
        } else {
          setMatches((m) => m + 1);
        }
      } else {
        timeoutRef.current = window.setTimeout(() => {
          const revertCards = [...cards];
          revertCards[firstIndex].isFlipped = false;
          revertCards[secondIndex].isFlipped = false;
          setCards(revertCards);
          setFlippedIndices([]);
        }, 800);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  if (!isPlaying && !isGameOver) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center text-[var(--color-mist)]">
        <h2 className="mb-4 font-[var(--font-display)] text-4xl font-bold">Memory Match</h2>
        <p className="mb-8 max-w-sm text-[var(--color-muted)]">จับคู่การ์ดไอคอน 8 คู่ให้ไวที่สุด โดยใช้จำนวนครั้งการเปิดให้น้อยที่สุด</p>
        <button
          onClick={shuffle}
          className="rounded-full bg-[var(--color-accent)] px-8 py-3 font-bold text-[var(--color-ink)] transition-transform hover:scale-105"
        >
          เริ่มเกม
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col p-4 md:p-8">
      <div className="mb-6 flex justify-between text-sm tracking-widest text-[var(--color-muted)] uppercase">
        <div>Moves: <span className="text-[var(--color-accent)]">{moves}</span></div>
        {bestScore && <div>Best: <span className="text-[var(--color-accent)]">{bestScore}</span></div>}
      </div>

      <div className="mx-auto flex flex-1 w-full max-w-2xl items-center justify-center">
        <div className="grid w-full grid-cols-4 gap-2 md:gap-4 lg:gap-6">
          {cards.map((card, i) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(i)}
              className={[
                'relative aspect-square w-full rounded-xl text-3xl transition-all duration-300 md:text-5xl',
                card.isFlipped || card.isMatched ? 'bg-[#fffaf2]' : 'bg-[#4a3f37] hover:bg-[#5a4f47]',
                card.isMatched ? 'border-2 border-[#56c2b0] shadow-[0_0_15px_rgba(86,194,176,0.5)]' : 'border border-[var(--color-glow)]'
              ].join(' ')}
              aria-label={card.isFlipped || card.isMatched ? card.icon : 'Unflipped card'}
              disabled={card.isFlipped || card.isMatched}
            >
              <div
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                  card.isFlipped || card.isMatched ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {card.icon}
              </div>
            </button>
          ))}
        </div>
      </div>

      {isGameOver && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80 p-8 text-center backdrop-blur-sm">
          <h2 className="mb-2 font-[var(--font-display)] text-5xl font-bold text-[var(--color-accent)]">You Win!</h2>
          <p className="mb-8 text-xl text-[var(--color-mist)]">จำนวนการเปิด: {moves} ครั้ง</p>
          <div className="flex gap-4">
            <button
              onClick={shuffle}
              className="rounded-full bg-[var(--color-accent)] px-8 py-3 font-bold text-[var(--color-ink)] transition-transform hover:scale-105"
            >
              เล่นอีกครั้ง
            </button>
            <button
              onClick={onExit}
              className="rounded-full border border-[var(--color-glow)] px-8 py-3 text-[var(--color-muted)] transition-colors hover:bg-[var(--color-glow)] hover:text-white"
            >
              ออก
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
