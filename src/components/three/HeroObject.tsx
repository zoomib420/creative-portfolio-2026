import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import type { Mesh } from 'three';
import { useAppStore } from '../../lib/store';

/**
 * Centerpiece object for the hero scene. Kept deliberately lightweight so it
 * runs on the "standard" (WebGL) tier too. Swap for a GLB / WebGPU shader on
 * the "high" tier later (see docs/AI_TASKS.md -> T-12).
 */
export function HeroObject() {
  const ref = useRef<Mesh>(null);
  const tier = useAppStore((s) => s.tier);
  const detail = tier === 'high' ? 4 : 2;

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += delta * 0.15;
    ref.current.rotation.y += delta * 0.2;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.8}>
      <mesh ref={ref}>
        <icosahedronGeometry args={[1.4, detail]} />
        <meshStandardMaterial
          color="#6ee7ff"
          emissive="#b78bff"
          emissiveIntensity={0.35}
          roughness={0.25}
          metalness={0.6}
          flatShading
          wireframe={tier === 'standard'}
        />
      </mesh>
    </Float>
  );
}
