import { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { AdaptiveDpr, AdaptiveEvents, Preload } from '@react-three/drei';
import { HeroObject } from './HeroObject';
import { Overlay } from '../ui/Overlay';
import { useAppStore } from '../../lib/store';
import { useSmoothScroll, scrollState } from '../../lib/scroll';

/**
 * High / Standard fidelity experience.
 *
 * The Canvas sits fixed in the background; scrollable HTML content is layered
 * on top via <Overlay>. CameraRig translates scroll progress into a "director's
 * cue" camera move (Task T-10) without re-rendering React each frame.
 *
 * Render-loop management: AdaptiveDpr keeps the GPU cool; AdaptiveEvents
 * throttles raycasting under load (target ~30fps for picking).
 */

function CameraRig() {
  const { camera } = useThree();
  const target = useRef({ x: 0, y: 0, z: 5 });

  useFrame(() => {
    const p = scrollState.progress; // 0..1
    // Gentle orbit + dolly as the visitor scrolls through the story.
    target.current.x = Math.sin(p * Math.PI * 2) * 1.5;
    target.current.y = -p * 1.2;
    target.current.z = 5 - p * 1.5;

    camera.position.x += (target.current.x - camera.position.x) * 0.05;
    camera.position.y += (target.current.y - camera.position.y) * 0.05;
    camera.position.z += (target.current.z - camera.position.z) * 0.05;
    camera.lookAt(0, 0, 0);
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
          dpr={dpr}
          camera={{ position: [0, 0, 5], fov: 45 }}
          gl={{ antialias: tier === 'high', powerPreference: 'high-performance' }}
        >
          <color attach="background" args={['#05060a']} />
          <ambientLight intensity={0.4} />
          <directionalLight position={[3, 4, 5]} intensity={1.2} color="#ffffff" />
          <pointLight position={[-4, -2, -3]} intensity={0.8} color="#b78bff" />

          <HeroObject />
          <CameraRig />

          <AdaptiveDpr pixelated />
          <AdaptiveEvents />
          <Preload all />
        </Canvas>
      </div>

      <Overlay />
    </>
  );
}
