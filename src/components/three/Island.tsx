import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Object3D, Color, BackSide, type Group, type InstancedMesh } from 'three';
import { useAppStore } from '../../lib/store';
import { toonGradient } from '../../lib/toon';

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
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <coneGeometry args={[1, 1, 4]} />
      <meshToonMaterial color="#7fd093" gradientMap={toonGradient(3)} />
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
        color="#ffd479"
        emissive="#ffb259"
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
  const color = useMemo(() => new Color('#b9a48c'), []);
  return (
    <>
      {rocks.map((r, i) => (
        <mesh key={i} position={[r.x, 1.04, r.z]} rotation={[0, r.rot, 0]} castShadow>
          <dodecahedronGeometry args={[r.s, 0]} />
          <meshToonMaterial color={color} gradientMap={toonGradient(3)} />
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
      {/* ink outline around the whole island mass (inverted hull) */}
      <group scale={1.03}>
        <mesh position={[0, 1, 0]}>
          <cylinderGeometry args={[4, 3.8, 0.4, 48]} />
          <meshBasicMaterial color="#05060a" side={BackSide} />
        </mesh>
        <mesh position={[0, -0.4, 0]}>
          <coneGeometry args={[3.8, 3, 12]} />
          <meshBasicMaterial color="#05060a" side={BackSide} />
        </mesh>
      </group>

      {/* grassy top */}
      <mesh position={[0, 1, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[4, 3.8, 0.4, 48]} />
        <meshToonMaterial color="#86d29a" gradientMap={toonGradient(3)} />
      </mesh>
      {/* earthy underside (inverted cone) */}
      <mesh position={[0, -0.4, 0]} castShadow>
        <coneGeometry args={[3.8, 3, 12]} />
        <meshToonMaterial color="#caa57f" gradientMap={toonGradient(3)} />
      </mesh>

      {detail.rocks > 0 && <Rocks count={detail.rocks} />}
      {detail.grass > 0 && <Grass count={detail.grass} />}
      {detail.motes > 0 && <Motes count={detail.motes} />}
    </group>
  );
}
