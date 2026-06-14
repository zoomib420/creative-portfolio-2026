import { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { AdaptiveDpr, AdaptiveEvents, Preload } from '@react-three/drei';
import { Vector3 } from 'three';
import { HeroObject } from './HeroObject';
import { Island } from './Island';
import { Overlay } from '../ui/Overlay';
import { useAppStore } from '../../lib/store';
import { useSmoothScroll, cameraState } from '../../lib/scroll';

/**
 * High / Standard fidelity experience.
 *
 * The Canvas sits fixed in the background; scrollable HTML content is layered
 * on top via <Overlay>. CameraRig eases toward the section waypoint set by GSAP
 * ScrollTrigger (see lib/scroll.ts) — "director's cue" navigation (Task T-10).
 * PerfGuard downgrades the tier if the framerate stays low (Task T-13).
 */

function CameraRig() {
  const { camera } = useThree();
  const lookTarget = useRef(new Vector3(cameraState.lx, cameraState.ly, cameraState.lz));

  useFrame(() => {
    camera.position.x += (cameraState.px - camera.position.x) * 0.04;
    camera.position.y += (cameraState.py - camera.position.y) * 0.04;
    camera.position.z += (cameraState.pz - camera.position.z) * 0.04;

    lookTarget.current.x += (cameraState.lx - lookTarget.current.x) * 0.04;
    lookTarget.current.y += (cameraState.ly - lookTarget.current.y) * 0.04;
    lookTarget.current.z += (cameraState.lz - lookTarget.current.z) * 0.04;
    camera.lookAt(lookTarget.current);
  });

  return null;
}

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
  const dpr: [number, number] = tier === 'high' ? [1, 2] : [1, 1.5];

  useSmoothScroll();

  return (
    <>
      <div className="canvas-root">
        <Canvas
          shadows={tier === 'high'}
          dpr={dpr}
          camera={{ position: [0, 0.6, 7], fov: 45 }}
          gl={{ antialias: tier === 'high', powerPreference: 'high-performance' }}
        >
          <color attach="background" args={['#05060a']} />
          <fog attach="fog" args={['#05060a', 8, 22]} />
          <ambientLight intensity={0.45} />
          <directionalLight
            position={[5, 8, 5]}
            intensity={1.3}
            color="#ffffff"
            castShadow={tier === 'high'}
          />
          <pointLight position={[-5, -1, -3]} intensity={0.9} color="#b78bff" />

          <Island />
          <HeroObject />
          <CameraRig />
          <PerfGuard />

          <AdaptiveDpr pixelated />
          <AdaptiveEvents />
          <Preload all />
        </Canvas>
      </div>

      <Overlay />
    </>
  );
}
