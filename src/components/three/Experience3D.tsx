import { useRef, type ComponentProps } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { AdaptiveDpr, AdaptiveEvents, Preload } from '@react-three/drei';
import { IslandScene } from './scenes/IslandScene';
import { WalkthroughScene } from './scenes/WalkthroughScene';
import { ScrollstoryScene } from './scenes/ScrollstoryScene';
import { PostFX } from './PostFX';
import { Overlay } from '../ui/Overlay';
import { useAppStore } from '../../lib/store';
import { useSmoothScroll } from '../../lib/scroll';
import { createWebGPURenderer } from '../../lib/renderer';

/**
 * High / Standard fidelity experience.
 *
 * The Canvas sits fixed in the background; scrollable HTML content is layered
 * on top via <Overlay>. CameraRig eases toward the section waypoint set by GSAP
 * ScrollTrigger (see lib/scroll.ts) — "director's cue" navigation (Task T-10).
 * PerfGuard downgrades the tier if the framerate stays low (Task T-13).
 */

function PerfGuard() {
  const tier = useAppStore((s) => s.tier);
  const setTier = useAppStore((s) => s.setTier);
  const acc = useRef({ frames: 0, time: 0, lowStreak: 0 });

  useFrame((_, delta) => {
    const a = acc.current;
    a.frames += 1;
    a.time += delta;
    if (a.time < 1) return; // sample once per second
    const fps = a.frames / a.time;
    a.frames = 0;
    a.time = 0;

    if (fps < 30) a.lowStreak += 1;
    else a.lowStreak = 0;

    // 4s of sustained low fps → step down a tier.
    if (a.lowStreak >= 4) {
      a.lowStreak = 0;
      if (tier === 'high') setTier('standard');
      else if (tier === 'standard') setTier('basic');
    }
  });

  return null;
}

export default function Experience3D() {
  const tier = useAppStore((s) => s.tier);
  const mode = useAppStore((s) => s.presentationMode);
  const dpr: [number, number] = tier === 'high' ? [1, 2] : [1, 1.5];

  useSmoothScroll();

  // WebGPU is opt-in via ?webgpu=1 (post-processing is WebGL-only, and the
  // WebGL path is what delivers the bloom/grain look). The WebGPU renderer
  // stays available for experimentation. See docs/ARCHITECTURE.md.
  const useWebGPU =
    tier === 'high' &&
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('webgpu') === '1';

  const gl: ComponentProps<typeof Canvas>['gl'] = useWebGPU
    ? (props) => createWebGPURenderer(props as never) as never
    : { antialias: true, powerPreference: 'high-performance' };

  return (
    <>
      <div className="canvas-root">
        <Canvas
          dpr={dpr}
          camera={{ position: [0, 0.6, 7], fov: 45 }}
          gl={gl}
        >
          {/* keyed by mode so a scene's runtime colour mutations reset on switch */}
          <color key={`bg-${mode}`} attach="background" args={['#05060a']} />
          <fog key={`fog-${mode}`} attach="fog" args={['#05060a', 8, 26]} />
          <ambientLight intensity={0.5} />
          {/* NOTE: no shadow casting — three's WebGPU shadow path crashes in
              this version (ShadowNode setPipeline). Lighting + emissive carry
              the look; revisit shadows when three/webgpu stabilises (T-12). */}
          <directionalLight position={[5, 8, 5]} intensity={1.3} color="#ffffff" />
          <pointLight position={[-5, -1, -3]} intensity={0.9} color="#b78bff" />

          {mode === 'island' && <IslandScene />}
          {mode === 'walkthrough' && <WalkthroughScene />}
          {mode === 'scrollstory' && <ScrollstoryScene />}
          <PerfGuard />

          {/* post-processing only on the WebGL path */}
          {!useWebGPU && <PostFX />}

          <AdaptiveDpr pixelated />
          <AdaptiveEvents />
          <Preload all />
        </Canvas>
      </div>

      <Overlay />
    </>
  );
}
