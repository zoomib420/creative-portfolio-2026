import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { BackSide, type Group, type MeshToonMaterial } from 'three';
import { useAppStore } from '../../lib/store';
import { ambientAudio } from '../../lib/audio';
import { toonGradient } from '../../lib/toon';

/**
 * Super Rooster Avatar in the elevator.
 * Audio-reactive: scales and emissive intensity bop to the music.
 */
export function HeroObject() {
  const group = useRef<Group>(null);
  const bodyMatRef = useRef<MeshToonMaterial>(null);
  const combMatRef = useRef<MeshToonMaterial>(null);
  
  const tier = useAppStore((s) => s.tier);
  const audioEnabled = useAppStore((s) => s.audioEnabled);
  const gradient = toonGradient(4);
  const detail = tier === 'high' ? 32 : 16; // resolution for sphere

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    
    // gentle rotation to show the 3D shape
    g.rotation.y += delta * 0.4;
    g.rotation.x = Math.sin(performance.now() / 1000) * 0.1; // slight tilt

    const level = audioEnabled ? ambientAudio.getLevel() : 0;
    const pulse = 1 + level * 0.4;
    const s = 1.0 + (pulse - 1.0) * 0.2;
    g.scale.set(s, s + level * 0.2, s); // stretch vertically on beat
    
    if (bodyMatRef.current) bodyMatRef.current.emissiveIntensity = 0.2 + level * 1.5;
    if (combMatRef.current) combMatRef.current.emissiveIntensity = 0.4 + level * 2.0;
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5} position={[0, 1.4, 0]}>
      <group ref={group} scale={1.2}>
        
        {/* Ink outline (inverted hull) */}
        <group scale={1.06}>
          {/* Body Outline */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.5, detail, detail]} />
            <meshBasicMaterial color="#05060a" side={BackSide} />
          </mesh>
          {/* Comb Outline */}
          <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[0.2, 0.3, 0.4]} />
            <meshBasicMaterial color="#05060a" side={BackSide} />
          </mesh>
        </group>

        {/* --- Cel-shaded Rooster Parts --- */}
        
        {/* Main Body (White/Cream) */}
        <mesh position={[0, 0, 0]} castShadow>
          <sphereGeometry args={[0.5, detail, detail]} />
          <meshToonMaterial
            ref={bodyMatRef}
            color="#fffaf2"
            emissive="#ffffff"
            emissiveIntensity={0.1}
            gradientMap={gradient}
          />
        </mesh>

        {/* Comb (Red) */}
        <mesh position={[0, 0.45, 0]} castShadow>
          <boxGeometry args={[0.15, 0.25, 0.35]} />
          <meshToonMaterial
            ref={combMatRef}
            color="#ff4a4a"
            emissive="#ff0000"
            emissiveIntensity={0.3}
            gradientMap={gradient}
          />
        </mesh>

        {/* Beak (Yellow) */}
        <mesh position={[0, 0.1, 0.45]} rotation={[0.4, 0, 0]} castShadow>
          <coneGeometry args={[0.15, 0.3, 4]} />
          <meshToonMaterial
            color="#ffd479"
            gradientMap={gradient}
          />
        </mesh>

        {/* Eyes (Black) */}
        <mesh position={[0.2, 0.2, 0.4]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial color="#05060a" />
        </mesh>
        <mesh position={[-0.2, 0.2, 0.4]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial color="#05060a" />
        </mesh>

        {/* Wings (Orange/Cream) */}
        <mesh position={[0.5, -0.1, 0]} rotation={[0, 0, 0.3]} castShadow>
          <capsuleGeometry args={[0.1, 0.3, 4, 8]} />
          <meshToonMaterial color="#ffe9cf" gradientMap={gradient} />
        </mesh>
        <mesh position={[-0.5, -0.1, 0]} rotation={[0, 0, -0.3]} castShadow>
          <capsuleGeometry args={[0.1, 0.3, 4, 8]} />
          <meshToonMaterial color="#ffe9cf" gradientMap={gradient} />
        </mesh>

      </group>
    </Float>
  );
}
