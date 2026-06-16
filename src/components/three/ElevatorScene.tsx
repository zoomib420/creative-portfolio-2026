import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Vector3, BackSide, type Group } from 'three';
import { floors, floorsById, type Floor } from '../../data/floors';
import { toonGradient } from '../../lib/toon';
import { useAppStore } from '../../lib/store';
import { scrollState } from '../../lib/scroll';
import { Furniture } from './RoomInterior';

/**
 * The single 3D world: a cozy 4-sided "cutaway building". Each side is an OPEN
 * furnished room for one section, so you see the rooms from outside the whole
 * time. Scrolling rotates the building 90° per section to bring each room to the
 * front (prozilla-style); after a full turn the front side swaps to the 5th
 * room. Click a floor → the camera zooms into that room. A rooster sits on the
 * roof. Furniture is shared with the standalone rooms (RoomInterior.Furniture).
 */

// Section rooms in face order (about, work, tech, contact, thanks).
const rooms: Floor[] = floors.filter((f) => f.ready && f.id !== 'hero');
const roomIndexOf = (id: string): number => Math.max(0, (floorsById[id]?.level ?? 1) - 1);

const CORE_W = 3.0;
const CORE_H = 3.4;
const CORE_D = 3.0;
const FACE = CORE_D / 2; // outer face plane
const FURN_SCALE = 0.5;

// Shared, written by the rig each frame, read by the swappable faces.
const buildingState = { cur: 0 };

function smoothstep(x: number, a: number, b: number): number {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
}

/** Cute rooster mascot on the rooftop (gentle idle bob). */
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
      <mesh position={[-0.22, 0.3, 0]}>
        <sphereGeometry args={[0.18, 16, 12]} />
        <meshToonMaterial color="#fffaf2" gradientMap={grad} />
      </mesh>
      <mesh position={[-0.24, 0.5, 0]}>
        <boxGeometry args={[0.16, 0.12, 0.05]} />
        <meshToonMaterial color="#ff4a4a" gradientMap={grad} />
      </mesh>
      <mesh position={[-0.44, 0.3, 0]} rotation={[0, 0, 0.35]}>
        <coneGeometry args={[0.07, 0.16, 4]} />
        <meshToonMaterial color="#ffb13b" gradientMap={grad} />
      </mesh>
      <mesh position={[-0.32, 0.36, 0.11]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial color="#3a322b" />
      </mesh>
      <mesh position={[0.3, 0.2, 0]} rotation={[0, 0, -0.7]}>
        <coneGeometry args={[0.18, 0.44, 4]} />
        <meshToonMaterial color="#56c2b0" gradientMap={grad} />
      </mesh>
    </group>
  );
}

/** The solid box core + base + roof + rooster (the building mass). */
function Core() {
  const grad = toonGradient(3);
  return (
    <group>
      <mesh position={[0, CORE_H / 2, 0]} scale={1.04}>
        <boxGeometry args={[CORE_W, CORE_H, CORE_D]} />
        <meshBasicMaterial color="#3a322b" side={BackSide} />
      </mesh>
      <mesh position={[0, CORE_H / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[CORE_W, CORE_H, CORE_D]} />
        <meshToonMaterial color="#f3e2c8" gradientMap={grad} />
      </mesh>
      <mesh position={[0, -0.15, 0]} receiveShadow>
        <boxGeometry args={[CORE_W + 1.8, 0.3, CORE_D + 1.8]} />
        <meshToonMaterial color="#caa57f" gradientMap={grad} />
      </mesh>
      <mesh position={[0, CORE_H + 0.1, 0]} castShadow>
        <boxGeometry args={[CORE_W + 0.3, 0.2, CORE_D + 0.3]} />
        <meshToonMaterial color="#ffd479" gradientMap={grad} />
      </mesh>
      <group position={[0, CORE_H + 0.55, 0]}>
        <Rooster />
      </group>
    </group>
  );
}

/**
 * One open room set on a building face. `vis` returns 0..1 from the current
 * (eased) section index — used to swap the two rooms that share the front face.
 */
function FaceSet({ room, angle, vis }: { room: Floor; angle: number; vis: (cur: number) => number }) {
  const ref = useRef<Group>(null);
  useFrame(() => {
    const g = ref.current;
    if (!g) return;
    const v = vis(buildingState.cur);
    g.visible = v > 0.01;
    g.scale.setScalar(Math.max(v, 0.001));
  });
  return (
    <group rotation={[0, angle, 0]}>
      <group ref={ref} position={[0, 0, FACE]}>
        {/* floor ledge the furniture sits on */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0.95]} receiveShadow>
          <planeGeometry args={[CORE_W, 2.0]} />
          <meshToonMaterial color="#e8d3b3" gradientMap={toonGradient(3)} />
        </mesh>
        <group scale={FURN_SCALE} position={[0, 0, 1.35]}>
          <Furniture id={room.id} />
        </group>
        {/* short exterior label (hidden when the face turns to the back) */}
        <Html position={[0, CORE_H + 0.15, 0.2]} center occlude className="pointer-events-none select-none">
          <div className="flex flex-col items-center gap-1 text-center">
            <span className="rounded-full bg-[var(--color-ink)] px-3 py-1 font-[var(--font-display)] text-sm font-bold tracking-wide text-[var(--color-mist)] shadow">
              {room.label}
            </span>
            {room.teaser && (
              <span className="max-w-[180px] text-[11px] leading-tight text-[var(--color-muted)]">
                {room.teaser}
              </span>
            )}
          </div>
        </Html>
      </group>
    </group>
  );
}

function Rig({ buildingRef }: { buildingRef: { current: Group | null } }) {
  const { camera } = useThree();
  const cur = useRef(0);
  const look = useRef(new Vector3(0, 1.6, 0));

  useFrame(() => {
    const st = useAppStore.getState();
    const focused = st.focusedFloor;
    const last = rooms.length - 1;
    const target = focused ? roomIndexOf(focused) : scrollState.progress * last;
    cur.current += (target - cur.current) * 0.05;
    buildingState.cur = cur.current;

    if (buildingRef.current) buildingRef.current.rotation.y = -cur.current * (Math.PI / 2);

    const dist = focused ? 4.4 : 6.6;
    const px = focused ? 0.4 : 1.1;
    const py = focused ? 1.7 : 2.4;
    camera.position.x += (px - camera.position.x) * 0.06;
    camera.position.y += (py - camera.position.y) * 0.06;
    camera.position.z += (dist - camera.position.z) * 0.06;
    look.current.y += (1.6 - look.current.y) * 0.06;
    camera.lookAt(look.current);
  });

  return null;
}

// the two rooms that share the front face crossfade by scroll index
const aboutVis = (cur: number) => 1 - smoothstep(cur, 2.9, 3.6);
const thanksVis = (cur: number) => smoothstep(cur, 3.3, 4.0);
const always = () => 1;

export function ElevatorScene() {
  const buildingRef = useRef<Group>(null);
  return (
    <>
      <group ref={buildingRef}>
        <Core />
        {rooms.map((room) => {
          const idx = roomIndexOf(room.id);
          const angle = (idx % 4) * (Math.PI / 2);
          const vis = room.id === 'about' ? aboutVis : room.id === 'thanks' ? thanksVis : always;
          return <FaceSet key={room.id} room={room} angle={angle} vis={vis} />;
        })}
      </group>
      <Rig buildingRef={buildingRef} />
    </>
  );
}
