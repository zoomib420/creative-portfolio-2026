import { useEffect, useState } from 'react';
import { useProgress } from '@react-three/drei';

interface LoaderProps {
  label?: string;
}

export function Loader({ label = 'Loading…' }: LoaderProps) {
  return (
    // Hardcoded dark color to prevent white flashes before CSS variables load
    <div className="content-layer flex h-screen w-screen flex-col items-center justify-center gap-6 bg-[#110d14]">
      <div
        className="h-10 w-10 animate-spin rounded-full border-2 border-[#ffbc61] border-t-[#56c2b0]"
        role="status"
        aria-label={label}
      />
      <p className="text-sm tracking-wide text-[#fffaf2]/70">{label}</p>
    </div>
  );
}

export function ElevatorLoader() {
  const { active, progress } = useProgress();
  const [isOpen, setIsOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [smoothProgress, setSmoothProgress] = useState(0);

  // Smoothly interpolate the displayed progress number
  useEffect(() => {
    let animationFrameId: number;
    let startTime = performance.now();
    let startProgress = smoothProgress;
    // When progress reaches 100, we take 800ms to smoothly tick up to 100
    // Otherwise we tick up to the current progress over 300ms
    const targetProgress = progress;
    const duration = progress >= 100 ? 800 : 300;

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const t = Math.min(1, elapsed / duration);
      // Ease out cubic
      const easeT = 1 - Math.pow(1 - t, 3);
      
      const nextProgress = startProgress + (targetProgress - startProgress) * easeT;
      setSmoothProgress(nextProgress);

      if (t < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setSmoothProgress(targetProgress);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [progress]);

  // Fallback timeout in case Drei's progress gets stuck or never starts
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    
    if (!active && progress === 100) {
      // Deliberate delay (800ms) to let shaders compile and our smoothProgress reach 100
      timeout = setTimeout(() => {
        setIsOpen(true);
        setTimeout(() => setHidden(true), 1200);
      }, 800);
    } else if (!active && progress === 0) {
      timeout = setTimeout(() => {
        setIsOpen(true);
        setTimeout(() => setHidden(true), 1200);
      }, 3000);
    }
    
    return () => clearTimeout(timeout);
  }, [active, progress]);

  if (hidden) return null;

  const displayProgress = Math.min(100, Math.floor(smoothProgress));

  return (
    <div className="fixed top-0 left-0 z-50 w-[100vw] h-[100vh] overflow-hidden pointer-events-none">
      {/* Wrapper */}
      <div className="absolute top-0 left-0 w-[100vw] h-[100vh] flex perspective-[1000px]">
        
        {/* Left Door - 3D Metallic Style */}
        <div 
          className={`relative w-1/2 h-full bg-gradient-to-r from-[#1a1a1a] to-[#2d2d2d] border-r-[4px] border-[#0a0a0a] shadow-[inset_-10px_0_20px_rgba(0,0,0,0.8)] transition-transform duration-1000 ease-in-out flex items-center justify-end ${isOpen ? '-translate-x-full' : 'translate-x-0'}`}
        >
          {/* Beveled edge detail */}
          <div className="absolute top-0 bottom-0 right-1 w-8 bg-gradient-to-l from-white/10 to-transparent" />
          {/* Door panel grooves */}
          <div className="absolute top-10 bottom-10 left-12 w-2 bg-black/40 shadow-[1px_0_1px_rgba(255,255,255,0.1)]" />
          <div className="absolute top-10 bottom-10 left-32 w-2 bg-black/40 shadow-[1px_0_1px_rgba(255,255,255,0.1)]" />
        </div>
        
        {/* Right Door - 3D Metallic Style */}
        <div 
          className={`relative w-1/2 h-full bg-gradient-to-l from-[#1a1a1a] to-[#2d2d2d] border-l-[4px] border-[#0a0a0a] shadow-[inset_10px_0_20px_rgba(0,0,0,0.8)] transition-transform duration-1000 ease-in-out flex items-center justify-start ${isOpen ? 'translate-x-full' : 'translate-x-0'}`}
        >
          {/* Beveled edge detail */}
          <div className="absolute top-0 bottom-0 left-1 w-8 bg-gradient-to-r from-white/10 to-transparent" />
          {/* Door panel grooves */}
          <div className="absolute top-10 bottom-10 right-12 w-2 bg-black/40 shadow-[1px_0_1px_rgba(255,255,255,0.1)]" />
          <div className="absolute top-10 bottom-10 right-32 w-2 bg-black/40 shadow-[1px_0_1px_rgba(255,255,255,0.1)]" />
        </div>

        {/* Center Digital Display (Attached to the doors so it splits or fades) */}
        <div 
          className={`absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#050505] border-[4px] border-[#1f1f1f] rounded-lg p-6 shadow-[0_15px_30px_rgba(0,0,0,0.9),inset_0_0_15px_rgba(0,0,0,1)] transition-opacity duration-300 ${isOpen ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
        >
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-xs tracking-[0.25em] text-[#ff3333] uppercase font-sans font-bold">
              <span className={`w-2 h-2 rounded-full bg-[#ff3333] ${!isOpen ? 'animate-pulse' : ''}`} style={{ boxShadow: '0 0 8px #ff3333' }} />
              Elevator
            </div>
            
            <div className="font-mono text-6xl font-black text-[#00ff88] tabular-nums tracking-widest" style={{ textShadow: '0 0 20px rgba(0,255,136,0.6)' }}>
              {displayProgress}<span className="text-3xl text-[#00ff88]/50">%</span>
            </div>
            
            <div className="w-56 bg-[#1a1a1a] h-2 rounded-full overflow-hidden mx-auto shadow-inner border border-[#333]">
              <div 
                className="h-full bg-[#00ff88] relative overflow-hidden"
                style={{ width: `${displayProgress}%`, boxShadow: '0 0 10px #00ff88' }}
              >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
