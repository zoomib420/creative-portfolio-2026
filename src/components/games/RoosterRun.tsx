import { useEffect, useRef, useState } from 'react';

interface Props {
  onExit?: () => void;
}

export default function RoosterRun({ onExit }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Use refs for game state to avoid re-renders during the loop
  const gameState = useRef({
    isPlaying: false,
    score: 0,
    speed: 5,
    roosterY: 0,
    roosterVy: 0,
    isJumping: false,
    isDucking: false,
    obstacles: [] as { x: number; type: 'high' | 'low'; w: number; h: number }[],
    collectibles: [] as { x: number; y: number; active: boolean }[],
    frameCount: 0,
    groundY: 300,
    paused: false,
  });

  const startGame = () => {
    gameState.current = {
      isPlaying: true,
      score: 0,
      speed: 5,
      roosterY: 300,
      roosterVy: 0,
      isJumping: false,
      isDucking: false,
      obstacles: [],
      collectibles: [],
      frameCount: 0,
      groundY: 300,
      paused: false,
    };
    setIsPlaying(true);
    setIsGameOver(false);
    setScore(0);
    setIsPaused(false);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const loop = () => {
      const state = gameState.current;
      
      // Clear canvas
      ctx.fillStyle = '#fdf3e7'; // Cream background
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (state.isPlaying && !state.paused) {
        // Physics
        state.frameCount++;
        if (state.frameCount % 600 === 0) state.speed += 0.5;

        // Rooster Y logic
        if (state.isJumping) {
          state.roosterY += state.roosterVy;
          state.roosterVy += 0.8; // Gravity
          if (state.roosterY >= state.groundY) {
            state.roosterY = state.groundY;
            state.isJumping = false;
            state.roosterVy = 0;
          }
        }

        // Spawn obstacles
        if (state.frameCount % 100 === 0 && Math.random() > 0.3) {
          const type = Math.random() > 0.5 ? 'high' : 'low';
          state.obstacles.push({
            x: canvas.width,
            type,
            w: 30,
            h: type === 'high' ? 80 : 40,
          });
        }

        // Spawn collectibles
        if (state.frameCount % 80 === 0 && Math.random() > 0.5) {
          state.collectibles.push({
            x: canvas.width,
            y: state.groundY - 60 - Math.random() * 80,
            active: true,
          });
        }

        // Update score based on distance
        if (state.frameCount % 10 === 0) {
          state.score += 1;
          setScore(state.score);
        }
      }

      // Draw Ground
      ctx.fillStyle = '#4a3f37';
      ctx.fillRect(0, state.groundY, canvas.width, canvas.height - state.groundY);

      // Draw Collectibles
      ctx.fillStyle = '#ffd479';
      for (let i = state.collectibles.length - 1; i >= 0; i--) {
        const c = state.collectibles[i];
        if (state.isPlaying && !state.paused) c.x -= state.speed;
        
        if (c.active) {
          ctx.beginPath();
          ctx.arc(c.x, c.y, 8, 0, Math.PI * 2);
          ctx.fill();
        }

        // Collision logic
        const roosterHitbox = {
          x: 100,
          y: state.roosterY - (state.isDucking ? 30 : 60),
          w: 40,
          h: state.isDucking ? 30 : 60,
        };

        if (
          c.active &&
          state.isPlaying &&
          c.x < roosterHitbox.x + roosterHitbox.w &&
          c.x + 16 > roosterHitbox.x &&
          c.y < roosterHitbox.y + roosterHitbox.h &&
          c.y + 16 > roosterHitbox.y
        ) {
          c.active = false;
          state.score += 10;
          setScore(state.score);
        }

        if (c.x < -20) state.collectibles.splice(i, 1);
      }

      // Draw Obstacles
      ctx.fillStyle = '#ff9a62';
      for (let i = state.obstacles.length - 1; i >= 0; i--) {
        const obs = state.obstacles[i];
        if (state.isPlaying && !state.paused) obs.x -= state.speed;
        
        const obsY = obs.type === 'high' ? state.groundY - obs.h - 50 : state.groundY - obs.h;
        ctx.fillRect(obs.x, obsY, obs.w, obs.h);

        // Collision logic
        const roosterHitbox = {
          x: 100,
          y: state.roosterY - (state.isDucking ? 30 : 60),
          w: 40,
          h: state.isDucking ? 30 : 60,
        };

        if (
          state.isPlaying &&
          obs.x < roosterHitbox.x + roosterHitbox.w &&
          obs.x + obs.w > roosterHitbox.x &&
          obsY < roosterHitbox.y + roosterHitbox.h &&
          obsY + obs.h > roosterHitbox.y
        ) {
          // Game Over
          state.isPlaying = false;
          setIsPlaying(false);
          setIsGameOver(true);
        }

        if (obs.x < -50) state.obstacles.splice(i, 1);
      }

      // Draw Rooster
      const rY = state.roosterY;
      ctx.fillStyle = 'red'; // Comb
      ctx.fillRect(115, rY - (state.isDucking ? 35 : 65), 10, 10);
      
      ctx.fillStyle = '#fff'; // Body
      ctx.fillRect(100, rY - (state.isDucking ? 30 : 60), 40, state.isDucking ? 30 : 60);

      // Eye
      ctx.fillStyle = '#000';
      ctx.fillRect(125, rY - (state.isDucking ? 25 : 55), 5, 5);

      // Beak
      ctx.fillStyle = '#ffd479';
      ctx.beginPath();
      ctx.moveTo(140, rY - (state.isDucking ? 20 : 50));
      ctx.lineTo(150, rY - (state.isDucking ? 15 : 45));
      ctx.lineTo(140, rY - (state.isDucking ? 10 : 40));
      ctx.fill();

      // Legs
      if (!state.isJumping) {
        ctx.strokeStyle = '#ff9a62';
        ctx.lineWidth = 3;
        const legOffset = (Math.sin(state.frameCount * 0.5) * 10) * (state.isPlaying ? 1 : 0);
        
        ctx.beginPath();
        ctx.moveTo(110, rY);
        ctx.lineTo(110 + legOffset, rY + 15);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(130, rY);
        ctx.lineTo(130 - legOffset, rY + 15);
        ctx.stroke();
      }

      animationId = requestAnimationFrame(loop);
    };

    animationId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(animationId);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const state = gameState.current;
      if (!state.isPlaying) return;

      if (e.code === 'Space' || e.code === 'ArrowUp') {
        if (!state.isJumping && !state.isDucking) {
          state.isJumping = true;
          state.roosterVy = -12;
        }
        e.preventDefault();
      } else if (e.code === 'ArrowDown') {
        state.isDucking = true;
        if (state.isJumping) state.roosterVy += 5; // fast fall
        e.preventDefault();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowDown') {
        gameState.current.isDucking = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Pause when the tab/window loses focus, so you don't come back to a dead run.
  useEffect(() => {
    const pause = () => {
      if (gameState.current.isPlaying && !gameState.current.paused) {
        gameState.current.paused = true;
        setIsPaused(true);
      }
    };
    const resume = () => {
      if (gameState.current.paused) {
        gameState.current.paused = false;
        setIsPaused(false);
      }
    };
    const onVisibility = () => (document.hidden ? pause() : resume());
    window.addEventListener('blur', pause);
    window.addEventListener('focus', resume);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('blur', pause);
      window.removeEventListener('focus', resume);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  // Handle touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!gameState.current.isPlaying) return;
    const touchY = e.touches[0].clientY;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const relativeY = touchY - rect.top;
    if (relativeY < rect.height / 2) {
      // Jump
      const state = gameState.current;
      if (!state.isJumping && !state.isDucking) {
        state.isJumping = true;
        state.roosterVy = -12;
      }
    } else {
      // Duck
      gameState.current.isDucking = true;
    }
  };

  const handleTouchEnd = () => {
    gameState.current.isDucking = false;
  };

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center bg-[var(--color-void)]">
      <div className="absolute top-4 left-4 z-10 font-[var(--font-display)] text-2xl font-bold text-[#4a3f37]">
        Score: {score}
      </div>

      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        className="max-w-full rounded-xl border border-[var(--color-glow)] bg-[#fdf3e7] shadow-lg"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      />

      {isPaused && isPlaying && !isGameOver && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#fdf3e7]/80 backdrop-blur-sm">
          <h2 className="font-[var(--font-display)] text-3xl font-bold text-[#4a3f37]">หยุดชั่วคราว</h2>
          <p className="mt-2 text-[var(--color-muted)]">กลับมาที่หน้าต่างนี้เพื่อเล่นต่อ</p>
        </div>
      )}

      {!isPlaying && !isGameOver && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#fdf3e7]/80 backdrop-blur-sm">
          <h2 className="mb-4 font-[var(--font-display)] text-4xl font-bold text-[#4a3f37]">Rooster Run</h2>
          <p className="mb-8 text-[#4a3f37]">กด Spacebar (หรือแตะจอบน) เพื่อกระโดด<br/>กดลูกศรลง (หรือแตะจอล่าง) เพื่อก้ม</p>
          <button
            onClick={startGame}
            className="rounded-full bg-[#ff9a62] px-8 py-3 font-bold text-white transition-transform hover:scale-105"
          >
            เริ่มเกม
          </button>
        </div>
      )}

      {isGameOver && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 text-white backdrop-blur-sm">
          <h2 className="mb-2 font-[var(--font-display)] text-5xl font-bold text-[#ff9a62]">Game Over!</h2>
          <p className="mb-8 text-2xl text-[var(--color-mist)]">Score: {score}</p>
          <div className="flex gap-4">
            <button
              onClick={startGame}
              className="rounded-full bg-[#ff9a62] px-8 py-3 font-bold text-white transition-transform hover:scale-105"
            >
              เล่นอีกครั้ง
            </button>
            {onExit && (
              <button
                onClick={onExit}
                className="rounded-full border border-[var(--color-glow)] px-8 py-3 text-[var(--color-muted)] transition-colors hover:bg-[var(--color-glow)] hover:text-white"
              >
                ออก
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
