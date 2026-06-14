import { useEffect } from 'react';
import Lenis from 'lenis';

/**
 * Smooth scroll (Lenis) + a shared scroll-progress value the 3D camera can
 * read every frame. Disabled when the user prefers reduced motion. (Task T-10)
 *
 * scrollState.progress is 0..1 across the whole document. The camera rig in
 * Experience3D lerps toward a target derived from this without re-rendering React.
 */
export const scrollState = {
  /** 0 at top, 1 at bottom of the page. */
  progress: 0,
  /** Raw velocity from Lenis (useful for motion-reactive effects). */
  velocity: 0,
};

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  );
}

/** Mount-once hook that wires Lenis and keeps scrollState updated. */
export function useSmoothScroll(): void {
  useEffect(() => {
    // Reduced motion: skip Lenis, just track native scroll progress.
    if (prefersReducedMotion()) {
      const onScroll = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        scrollState.progress = max > 0 ? window.scrollY / max : 0;
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => window.removeEventListener('scroll', onScroll);
    }

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
    });

    lenis.on('scroll', (e: { progress: number; velocity: number }) => {
      scrollState.progress = e.progress;
      scrollState.velocity = e.velocity;
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);
}
