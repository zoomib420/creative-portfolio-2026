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
  else {
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  }
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

// Elevator ride: an isometric view of the rotating tower (ElevatorScene). The
// camera DESCENDS the building top→bottom as the visitor scrolls — hero is the
// top floor, contact the ground. Each waypoint frames that floor's window band
// (height = ElevatorScene.floorCenterY); px/pz fixed for a steady 3/4 angle.
export const cameraState: CameraWaypoint = {
  px: 6,
  py: 5.6,
  pz: 9.5,
  lx: 0,
  ly: 4.6,
  lz: 0,
};

export const scrollState = { progress: 0, velocity: 0 };

// Only the KEYS matter now: ScrollTrigger uses them to set `activeSection` as
// each section scrolls past. ElevatorScene derives the camera + rotation from
// activeSection + scroll progress, so these waypoint values are unused legacy.
const WAYPOINTS: Record<string, CameraWaypoint> = {
  hero: { px: 6, py: 5.6, pz: 9.5, lx: 0, ly: 4.6, lz: 0 },
  about: { px: 6, py: 5.0, pz: 9.5, lx: 0, ly: 4.0, lz: 0 },
  work: { px: 6, py: 4.3, pz: 9.5, lx: 0, ly: 3.3, lz: 0 },
  tech: { px: 6, py: 3.6, pz: 9.5, lx: 0, ly: 2.6, lz: 0 },
  contact: { px: 6, py: 2.9, pz: 9.5, lx: 0, ly: 1.9, lz: 0 },
  thanks: { px: 6, py: 2.2, pz: 9.5, lx: 0, ly: 1.2, lz: 0 },
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
