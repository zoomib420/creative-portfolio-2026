import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { BackSide, type Group, type MeshToonMaterial } from 'three';
import { useAppStore } from '../../lib/store';
import { ambientAudio } from '../../lib/audio';
import { toonGradient } from '../../lib/toon';

/**
 * Central floating crystal above the island. Hand-drawn look: cel-shaded
 * MeshToonMaterial + an inverted-hull ink outline. Audio-reactive (Task T-11):
 * the group's scale + emissive pulse follow ambientAudio.getLevel().
 */
export function HeroObject() {
  const group = useRef<Group>(null);
  const matRef = useRef<MeshToonMaterial>(null);
  const tier = useAppStore((s) => s.tier);
  const audioEnabled = useAppStore((s) => s.audioEnabled);
  const detail = tier === 'high' ? 2 : 1;
  const gradient = toonGradient(4);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    g.rotation.x += delta * 0.12;
    g.rotation.y += delta * 0.18;

    const level = audioEnabled ? ambientAudio.getLevel() : 0;
    const pulse = 1 + level * 0.6;
    const s = g.scale.x + (pulse - g.scale.x) * 0.15;
    g.scale.setScalar(s);
    if (matRef.current) matRef.current.emissiveIntensity = 0.4 + level * 2.5;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.8} position={[0, 1.6, 0]}>
      <group ref={group}>
        {/* ink outline (inverted hull) */}
        <mesh scale={1.06}>
          <icosahedronGeometry args={[0.8, detail]} />
          <meshBasicMaterial color="#05060a" side={BackSide} />
        </mesh>
        {/* cel-shaded body — warm lantern glow */}
        <mesh castShadow>
          <icosahedronGeometry args={[0.8, detail]} />
          <meshToonMaterial
            ref={matRef}
            color="#ffd479"
            emissive="#ff9a62"
            emissiveIntensity={0.4}
            gradientMap={gradient}
          />
        </mesh>
      </group>
    </Float>
  );
}
