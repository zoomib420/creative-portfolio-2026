import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Object3D, Color, type Group, type InstancedMesh } from 'three';
import { useAppStore } from '../../lib/store';

/**
 * Procedural Floating Island (Task T-32) — no external assets, so it loads
 * instantly and scales by fidelity tier. Inspired by Jordan Breton's miniature
 * worlds: a floating landmass with swaying grass and drifting light motes.
 */

const TIER_DETAIL = {
  high: { grass: 600, motes: 60, rocks: 7 },
  standard: { grass: 220, motes: 24, rocks: 5 },
  basic: { grass: 0, motes: 0, rocks: 0 },
} as const;

function randomInDisk(radius: number): [number, number] {
  const r = radius * Math.sqrt(Math.random());
  const a = Math.random() * Math.PI * 2;
  return [Math.cos(a) * r, Math.sin(a) * r];
}

function Grass({ count }: { count: number }) {
  const ref = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);
  const blades = useMemo(
    () =>
      Array.from({ length: count }, () => {
        const [x, z] = randomInDisk(3.6);
        return {
          x,
          z,
          h: 0.18 + Math.random() * 0.22,
          phase: Math.random() * Math.PI * 2,
          tilt: (Math.random() - 0.5) * 0.2,
        };
      }),
    [count],
  );

  useFrame((state) => {
    const mesh = ref.current;
    if (!mesh) return;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < blades.length; i++) {
      const b = blades[i];
      dummy.position.set(b.x, 1.02 + b.h / 2, b.z);
      dummy.rotation.z = b.tilt + Math.sin(t * 1.5 + b.phase) * 0.18;
      dummy.scale.set(0.03, b.h, 0.03);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]} castShadow>
      <coneGeometry args={[1, 1, 4]} />
      <meshStandardMaterial color="#3fa66a" roughness={0.8} />
    </instancedMesh>
  );
}

function Motes({ count }: { count: number }) {
  const ref = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);
  const motes = useMemo(
    () =>
      Array.from({ length: count }, () => {
        const [x, z] = randomInDisk(4.2);
        return {
          x,
          z,
          y: 1.2 + Math.random() * 2.4,
          speed: 0.3 + Math.random() * 0.5,
          phase: Math.random() * Math.PI * 2,
          radius: 0.2 + Math.random() * 0.5,
        };
      }),
    [count],
  );

  useFrame((state) => {
    const mesh = ref.current;
    if (!mesh) return;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < motes.length; i++) {
      const m = motes[i];
      dummy.position.set(
        m.x + Math.sin(t * m.speed + m.phase) * m.radius,
        m.y + Math.sin(t * m.speed * 0.7 + m.phase) * 0.3,
        m.z + Math.cos(t * m.speed + m.phase) * m.radius,
      );
      const s = 0.03 + Math.sin(t * 2 + m.phase) * 0.012;
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color="#6ee7ff"
        emissive="#6ee7ff"
        emissiveIntensity={2}
        toneMapped={false}
      />
    </instancedMesh>
  );
}

function Rocks({ count }: { count: number }) {
  const rocks = useMemo(
    () =>
      Array.from({ length: count }, () => {
        const [x, z] = randomInDisk(3.2);
        return {
          x,
          z,
          s: 0.12 + Math.random() * 0.2,
          rot: Math.random() * Math.PI,
        };
      }),
    [count],
  );
  const color = useMemo(() => new Color('#5b6478'), []);
  return (
    <>
      {rocks.map((r, i) => (
        <mesh key={i} position={[r.x, 1.04, r.z]} rotation={[0, r.rot, 0]} castShadow>
          <dodecahedronGeometry args={[r.s, 0]} />
          <meshStandardMaterial color={color} roughness={0.9} flatShading />
        </mesh>
      ))}
    </>
  );
}

export function Island() {
  const tier = useAppStore((s) => s.tier);
  const detail = TIER_DETAIL[tier];
  const groupRef = useRef<Group>(null);

  // slow idle rotation for a "living" feel
  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.04;
  });

  return (
    <group ref={groupRef} position={[0, -1.5, 0]}>
      {/* grassy top */}
      <mesh receiveShadow position={[0, 1, 0]}>
        <cylinderGeometry args={[4, 3.8, 0.4, 48]} />
        <meshStandardMaterial color="#2f8f5b" roughness={0.85} />
      </mesh>
      {/* rocky underside (inverted cone) */}
      <mesh position={[0, -0.4, 0]}>
        <coneGeometry args={[3.8, 3, 12]} />
        <meshStandardMaterial color="#4a3f3a" roughness={0.95} flatShading />
      </mesh>

      {detail.rocks > 0 && <Rocks count={detail.rocks} />}
      {detail.grass > 0 && <Grass count={detail.grass} />}
      {detail.motes > 0 && <Motes count={detail.motes} />}
    </group>
  );
}
