import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAppStore } from './store';

gsap.registerPlugin(ScrollTrigger);

// Module-level Lenis handle so the elevator panel can drive smooth scroll.
let lenisInstance: Lenis | null = null;

/** Smooth-scroll to a section by id (used by the elevator nav). */
export function scrollToSection(id: string): void {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenisInstance) lenisInstance.scrollTo(el, { offset: 0 });
  else el.scrollIntoView({ behavior: 'smooth' });
}

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

// Elevator ride: an isometric 3/4 view of the cutaway building (ElevatorScene).
// The camera climbs to the active floor's room as the visitor scrolls. Each
// room sits at its floor height (data/floors.ts: level * FLOOR_SPACING). Floors
// without a section yet (Gallery, Arcade) get their waypoint in Phase B.
export const cameraState: CameraWaypoint = {
  px: 4.2,
  py: 1.7,
  pz: 6.2,
  lx: 0,
  ly: 0.4,
  lz: 0,
};

export const scrollState = { progress: 0, velocity: 0 };

const WAYPOINTS: Record<string, CameraWaypoint> = {
  hero: { px: 4.2, py: 1.7, pz: 6.2, lx: 0, ly: 0.4, lz: 0 },
  work: { px: 4.2, py: 3.3, pz: 6.2, lx: 0, ly: 2.0, lz: 0 },
  arcade: { px: 4.2, py: 4.9, pz: 6.2, lx: 0, ly: 3.6, lz: 0 },
  about: { px: 4.2, py: 6.5, pz: 6.2, lx: 0, ly: 5.2, lz: 0 },
  contact: { px: 4.2, py: 8.1, pz: 6.2, lx: 0, ly: 6.8, lz: 0 },
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
    lenisInstance = lenis;
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
              useAppStore.getState().setActiveSection(id);
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
      lenisInstance = null;
    };
  }, []);
}
