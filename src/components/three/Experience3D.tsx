import { useRef, type ComponentProps } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { AdaptiveDpr, AdaptiveEvents, Preload, Stars } from '@react-three/drei';
import { ElevatorScene } from './ElevatorScene';
import { Particles } from './Particles';
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
  // Smooth scroll logic lives in GSAP triggers + Lenis. This hook wires
  // scroll position to an active 3D waypoint.
  useSmoothScroll();

  const tier = useAppStore((s) => s.tier);
  const dpr: [number, number] = tier === 'high' ? [1, 2] : [1, 1];

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
          shadows={!useWebGPU}
          dpr={dpr}
          camera={{ position: [0, 0.6, 7], fov: 45 }}
          gl={gl}
        >
          {/* Night sky background */}
          <color attach="background" args={['#1a1e36']} />
          <fog attach="fog" args={['#24294a', 13, 36]} />

          {/* Stars! (radius, depth, count, factor, saturation, fade, speed) */}
          <Stars radius={20} depth={20} count={3000} factor={4} saturation={0.5} fade speed={1} />

          {/* cool, soft moonlight — cozy night lighting. */}
          <ambientLight intensity={0.4} color="#a6bbed" />
          <hemisphereLight args={['#d9e2ff', '#24294a', 0.5]} />
          {/* NOTE: soft shadows only on the WebGL path — three/webgpu's shadow
              node crashes in this version (re-enable for WebGPU when stable). */}
          <directionalLight
            position={[5.5, 19.5, -20]}  // Matching the moon position
            intensity={2.8}
            color="#fff5cc"
            castShadow={!useWebGPU}
            shadow-mapSize={[2048, 2048]}
            shadow-radius={4}
            shadow-camera-near={1}
            shadow-camera-far={40}
            shadow-camera-left={-12}
            shadow-camera-right={12}
            shadow-camera-top={12}
            shadow-camera-bottom={-12}
            shadow-bias={-0.0004}
          />
          <pointLight position={[-5, 1, -3]} intensity={0.5} color="#ffcf8a" />
          {/* Cozy toon look leans on the ink outlines + bands, not PCSS — drei
              SoftShadows is far too heavy for a ~40-mesh diorama (esp. mobile). */}

          <ElevatorScene />
          <Particles />
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
