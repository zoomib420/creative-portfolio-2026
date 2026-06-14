import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import type { Mesh, MeshStandardMaterial } from 'three';
import { useAppStore } from '../../lib/store';
import { ambientAudio } from '../../lib/audio';

/**
 * Central floating crystal above the island. Audio-reactive (Task T-11):
 * scale + emissive pulse follow ambientAudio.getLevel(). Lightweight enough
 * for the "standard" (WebGL) tier; swap for a WebGPU shader on "high" (T-12).
 */
export function HeroObject() {
  const ref = useRef<Mesh>(null);
  const matRef = useRef<MeshStandardMaterial>(null);
  const tier = useAppStore((s) => s.tier);
  const audioEnabled = useAppStore((s) => s.audioEnabled);
  const detail = tier === 'high' ? 3 : 1;

  useFrame((_, delta) => {
    const mesh = ref.current;
    if (!mesh) return;
    mesh.rotation.x += delta * 0.15;
    mesh.rotation.y += delta * 0.2;

    const level = audioEnabled ? ambientAudio.getLevel() : 0;
    const pulse = 1 + level * 0.6;
    const s = mesh.scale.x + (pulse - mesh.scale.x) * 0.15;
    mesh.scale.setScalar(s);
    if (matRef.current) {
      matRef.current.emissiveIntensity = 0.35 + level * 2.5;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.8} position={[0, 1.6, 0]}>
      <mesh ref={ref}>
        <icosahedronGeometry args={[0.8, detail]} />
        <meshStandardMaterial
          ref={matRef}
          color="#6ee7ff"
          emissive="#b78bff"
          emissiveIntensity={0.35}
          roughness={0.15}
          metalness={0.7}
          flatShading
        />
      </mesh>
    </Float>
  );
}
