import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3, BackSide, type Group, type MeshStandardMaterial } from 'three';
import { floors, floorsById, FLOOR_SPACING } from '../../data/floors';
import { toonGradient } from '../../lib/toon';
import { useAppStore } from '../../lib/store';
import { scrollState } from '../../lib/scroll';

/**
 * The single 3D world: a cozy "toy building" with a rooster mascot on the roof.
 * The camera + the building's rotation are SCROLL-DRIVEN (prozilla-style): while
 * you scroll between sections the camera zooms OUT and the tower rotates; when
 * you settle on a section it zooms IN on that floor (its window band lit). The
 * lobby (top floor) frames the rooftop rooster up close; scrolling descends the
 * tower top→bottom. Solid exterior so it reads from any angle — interiors later.
 */

const W = 2.4;
const D = 2.4;
const SP = FLOOR_SPACING;
const COUNT = floors.length;
const TOTAL_H = COUNT * SP;

// top → bottom: the first section (hero) sits at the TOP slot, last at ground.
const slotOf = (level: number) => COUNT - 1 - level;
const floorCenterY = (level: number) => slotOf(level) * SP + SP / 2;

/** Cute low-poly rooster mascot on the rooftop (gentle idle bob). */
function Rooster() {
  const ref = useRef<Group>(null);
  const grad = toonGradient(3);
  useFrame((s) => {
    if (ref.current) ref.current.position.y = Math.sin(s.clock.elapsedTime * 1.6) * 0.04;
  });
  return (
    <group ref={ref}>
      <mesh>
        <sphereGeometry args={[0.32, 16, 12]} />
        <meshToonMaterial color="#fffaf2" gradientMap={grad} />
      </mesh>
      <mesh position={[0.22, 0.3, 0]}>
        <sphereGeometry args={[0.18, 16, 12]} />
        <meshToonMaterial color="#fffaf2" gradientMap={grad} />
      </mesh>
      {/* comb + wattle */}
      <mesh position={[0.24, 0.5, 0]}>
        <boxGeometry args={[0.16, 0.12, 0.05]} />
        <meshToonMaterial color="#ff4a4a" gradientMap={grad} />
      </mesh>
      <mesh position={[0.4, 0.18, 0]}>
        <boxGeometry args={[0.05, 0.1, 0.04]} />
        <meshToonMaterial color="#ff4a4a" gradientMap={grad} />
      </mesh>
      {/* beak */}
      <mesh position={[0.44, 0.3, 0]} rotation={[0, 0, -0.35]}>
        <coneGeometry args={[0.07, 0.16, 4]} />
        <meshToonMaterial color="#ffb13b" gradientMap={grad} />
      </mesh>
      {/* eye */}
      <mesh position={[0.34, 0.36, 0.11]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial color="#3a322b" />
      </mesh>
      {/* tail */}
      <mesh position={[-0.3, 0.2, 0]} rotation={[0, 0, 0.7]}>
        <coneGeometry args={[0.18, 0.44, 4]} />
        <meshToonMaterial color="#56c2b0" gradientMap={grad} />
      </mesh>
      {/* legs */}
      {[-0.09, 0.09].map((z) => (
        <mesh key={z} position={[0.06, -0.42, z]}>
          <cylinderGeometry args={[0.03, 0.03, 0.34, 6]} />
          <meshToonMaterial color="#ffb13b" gradientMap={grad} />
        </mesh>
      ))}
    </group>
  );
}

/** A glowing window band for one floor, on all four faces (so it's lit while
 *  the tower rotates). Brighter when this floor is the active section. */
function FloorWindows({ level, accent }: { level: number; accent: string }) {
  const activeSection = useAppStore((s) => s.activeSection);
  const active = floorsById[activeSection]?.level === level;
  const materials = useRef<(MeshStandardMaterial | null)[]>([]);
  const y = floorCenterY(level);
  const intensity = active ? 1.7 : 0.4;
  const w = W * 0.55;
  const h = SP * 0.5;
  const faces: { pos: [number, number, number]; rot: [number, number, number] }[] = [
    { pos: [0, y, D / 2 + 0.02], rot: [0, 0, 0] },
    { pos: [0, y, -D / 2 - 0.02], rot: [0, Math.PI, 0] },
    { pos: [W / 2 + 0.02, y, 0], rot: [0, Math.PI / 2, 0] },
    { pos: [-W / 2 - 0.02, y, 0], rot: [0, -Math.PI / 2, 0] },
  ];

  useFrame((s) => {
    const pulse = active ? 0.25 + Math.sin(s.clock.elapsedTime * 2.4) * 0.18 : 0;
    const nextIntensity = intensity + pulse;
    materials.current.forEach((mat) => {
      if (mat) mat.emissiveIntensity += (nextIntensity - mat.emissiveIntensity) * 0.12;
    });
  });

  return (
    <>
      {faces.map((f, i) => (
        <mesh key={i} position={f.pos} rotation={f.rot}>
          <planeGeometry args={[w, h]} />
          <meshStandardMaterial
            ref={(mat) => {
              materials.current[i] = mat;
            }}
            color={accent}
            emissive={accent}
            emissiveIntensity={intensity}
            toneMapped={false}
          />
        </mesh>
      ))}
    </>
  );
}

function Tower() {
  const grad = toonGradient(3);
  const trims = Array.from({ length: COUNT - 1 }, (_, i) => (i + 1) * SP);
  return (
    <group>
      {/* ink outline (inverted hull) */}
      <mesh position={[0, TOTAL_H / 2, 0]} scale={1.04}>
        <boxGeometry args={[W, TOTAL_H, D]} />
        <meshBasicMaterial color="#3a322b" side={BackSide} />
      </mesh>
      {/* solid body */}
      <mesh position={[0, TOTAL_H / 2, 0]} castShadow>
        <boxGeometry args={[W, TOTAL_H, D]} />
        <meshToonMaterial color="#f3e2c8" gradientMap={grad} />
      </mesh>
      {/* floor trim lines */}
      {trims.map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <boxGeometry args={[W + 0.06, 0.06, D + 0.06]} />
          <meshToonMaterial color="#caa57f" gradientMap={grad} />
        </mesh>
      ))}
      {/* glowing window bands per floor */}
      {floors.map((f) => (
        <FloorWindows key={f.id} level={f.level} accent={f.accent} />
      ))}
      {/* base plinth */}
      <mesh position={[0, -0.15, 0]}>
        <boxGeometry args={[W + 0.3, 0.3, D + 0.3]} />
        <meshToonMaterial color="#caa57f" gradientMap={grad} />
      </mesh>
      {/* roof slab + rooster on the rooftop */}
      <mesh position={[0, TOTAL_H + 0.08, 0]} castShadow>
        <boxGeometry args={[W + 0.2, 0.16, D + 0.2]} />
        <meshToonMaterial color="#ffd479" gradientMap={grad} />
      </mesh>
      <group position={[0, TOTAL_H + 0.5, 0]}>
        <Rooster />
      </group>
    </group>
  );
}

/**
 * Drives the camera + tower rotation from scroll progress. Active section still
 * controls the lit window, but the camera follows the actual scroll position
 * continuously so the ride feels like one smooth elevator trip instead of
 * snapping between section triggers. Reads the store imperatively to avoid
 * re-renders.
 */
function ScrollDirector({ buildingRef }: { buildingRef: { current: Group | null } }) {
  const { camera } = useThree();
  const cur = useRef(0);
  const look = useRef(new Vector3(0, floorCenterY(0) + 1.2, 0));
  const AZ = 0.5; // fixed camera azimuth — the tower rotates, not the camera
  const NEAR = 6.2; // pulled back a bit (was too close)
  const FAR = 11;

  useFrame(() => {
    const st = useAppStore.getState();
    const focused = st.focusedFloor;
    const focusedLevel = focused ? floorsById[focused]?.level : undefined;
    const scrollLevel = scrollState.progress * (COUNT - 1);
    const target = focusedLevel ?? scrollLevel;
    cur.current += (target - cur.current) * 0.045;
    const f = cur.current;

    const lag = Math.min(Math.abs(target - f), 1);
    const velocity = Math.min(Math.abs(scrollState.velocity) / 2.5, 1);
    const motion = Math.max(lag, velocity);
    const zoom = motion * motion * (3 - 2 * motion); // smoothstep: 0 settled → 1 moving
    let dist = NEAR + (FAR - NEAR) * zoom;
    if (focused) dist = Math.min(dist, 5.2); // zoom right into the opened room

    const cy = floorCenterY(f);
    const topBias = Math.max(0, 1 - f) * 1.1; // look up toward the rooster at the top
    const lookY = cy + 0.3 + topBias;

    const px = Math.sin(AZ) * dist;
    const pz = Math.cos(AZ) * dist;
    const py = lookY + 1.0 + zoom * 1.8;

    camera.position.x += (px - camera.position.x) * 0.06;
    camera.position.y += (py - camera.position.y) * 0.06;
    camera.position.z += (pz - camera.position.z) * 0.06;

    look.current.x += (0 - look.current.x) * 0.06;
    look.current.y += (lookY - look.current.y) * 0.06;
    look.current.z += (0 - look.current.z) * 0.06;
    camera.lookAt(look.current);

    // rotation follows the scroll position directly (mouse wheel / finger drag)
    if (buildingRef.current) buildingRef.current.rotation.y = scrollState.progress * Math.PI * 2;
  });

  return null;
}

export function ElevatorScene() {
  const buildingRef = useRef<Group>(null);
  return (
    <>
      <group ref={buildingRef}>
        <Tower />
      </group>
      <ScrollDirector buildingRef={buildingRef} />
    </>
  );
}
