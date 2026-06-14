import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Smooth scroll (Lenis) + GSAP ScrollTrigger "director cues" (Task T-10).
 *
 * Each page section maps to a camera waypoint; ScrollTrigger eases `cameraState`
 * toward the active waypoint as the visitor scrolls. The 3D CameraRig reads
 * `cameraState` every frame (no React re-render). Disabled under reduced motion.
 */

export interface CameraWaypoint {
  px: number;
  py: number;
  pz: number;
  lx: number;
  ly: number;
  lz: number;
}

// Default = hero view. CameraRig lerps toward this; GSAP tweens it per section.
export const cameraState: CameraWaypoint = {
  px: 0,
  py: 0.6,
  pz: 7,
  lx: 0,
  ly: 0.2,
  lz: 0,
};

export const scrollState = { progress: 0, velocity: 0 };

const WAYPOINTS: Record<string, CameraWaypoint> = {
  hero: { px: 0, py: 0.6, pz: 7, lx: 0, ly: 0.2, lz: 0 },
  work: { px: 5, py: 2.6, pz: 4, lx: 0, ly: -0.3, lz: 0 },
  about: { px: -5, py: 1.0, pz: 4.5, lx: 0, ly: 0, lz: 0 },
  contact: { px: 0, py: 4, pz: 6, lx: 0, ly: -0.5, lz: 0 },
};

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  );
}

/** Mount-once hook: wires Lenis + ScrollTrigger camera cues and content reveals. */
export function useSmoothScroll(): void {
  useEffect(() => {
    if (prefersReducedMotion()) {
      const onScroll = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        scrollState.progress = max > 0 ? window.scrollY / max : 0;
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => window.removeEventListener('scroll', onScroll);
    }

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    lenis.on('scroll', (e: { progress: number; velocity: number }) => {
      scrollState.progress = e.progress;
      scrollState.velocity = e.velocity;
      ScrollTrigger.update();
    });

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      // Camera director cues: ease cameraState to the active section's waypoint.
      Object.entries(WAYPOINTS).forEach(([id, wp]) => {
        const el = document.getElementById(id);
        if (!el) return;
        ScrollTrigger.create({
          trigger: el,
          start: 'top center',
          end: 'bottom center',
          onToggle: (self) => {
            if (self.isActive) {
              gsap.to(cameraState, {
                ...wp,
                duration: 1.6,
                ease: 'power2.inOut',
                overwrite: true,
              });
            }
          },
        });
      });

      // Content reveal: fade + rise each section's heading/cards on enter.
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 40,
          duration: 0.9,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 80%' },
        });
      });
    });

    // Ensure positions are measured after layout/fonts.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    const refreshTimer = window.setTimeout(refresh, 300);

    return () => {
      window.removeEventListener('load', refresh);
      window.clearTimeout(refreshTimer);
      gsap.ticker.remove(tick);
      ctx.revert();
      lenis.destroy();
    };
  }, []);
}
