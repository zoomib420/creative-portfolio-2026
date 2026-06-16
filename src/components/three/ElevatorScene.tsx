import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Vector3, type Group } from 'three';
import { floors, floorsById, type Floor } from '../../data/floors';
import { toonGradient } from '../../lib/toon';
import { useAppStore } from '../../lib/store';
import { scrollState } from '../../lib/scroll';
import { Furniture } from './RoomInterior';

/**
 * The single 3D world: a cozy multi-storey "cutaway dollhouse" — one furnished
 * OPEN room per floor, stacked vertically, so you see every room from outside.
 * Scrolling rides the camera down the floors (top → bottom) while the building
 * turns gently; clicking a floor zooms into that room. A rooster sits on the
 * roof. Furniture is shared with RoomInterior.Furniture.
 */

// Section rooms, top → bottom (about at the top, thanks at the ground floor).
const rooms: Floor[] = floors.filter((f) => f.ready && f.id !== 'hero');
const roomIndexOf = (id: string): number => Math.max(0, (floorsById[id]?.level ?? 1) - 1);

const FLOOR_H = 2.6;
const ROOM_W = 3.8;
const ROOM_D = 2.8;
const FURN_SCALE = 0.6;
const N = rooms.length;
const TOP = N - 1;
const TOTAL_H = N * FLOOR_H;
const floorY = (idx: number) => (TOP - idx) * FLOOR_H;

/** Cute rooster mascot on the rooftop (gentle idle bob). */
function Rooster() {
  const ref = useRef<Group>(null);
  const grad = toonGradient(3);
  useFrame((s) => {
    if (ref.current) ref.current.position.y = Math.sin(s.clock.elapsedTime * 1.6) * 0.05;
  });
  return (
    <group ref={ref}>
      <mesh>
        <sphereGeometry args={[0.34, 16, 12]} />
        <meshToonMaterial color="#fffaf2" gradientMap={grad} />
      </mesh>
      <mesh position={[0.24, 0.32, 0]}>
        <sphereGeometry args={[0.2, 16, 12]} />
        <meshToonMaterial color="#fffaf2" gradientMap={grad} />
      </mesh>
      <mesh position={[0.26, 0.54, 0]}>
        <boxGeometry args={[0.17, 0.13, 0.05]} />
        <meshToonMaterial color="#ff4a4a" gradientMap={grad} />
      </mesh>
      <mesh position={[0.48, 0.32, 0]} rotation={[0, 0, -0.35]}>
        <coneGeometry args={[0.08, 0.18, 4]} />
        <meshToonMaterial color="#ffb13b" gradientMap={grad} />
      </mesh>
      <mesh position={[0.36, 0.38, 0.12]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshBasicMaterial color="#3a322b" />
      </mesh>
      <mesh position={[-0.32, 0.22, 0]} rotation={[0, 0, 0.7]}>
        <coneGeometry args={[0.2, 0.48, 4]} />
        <meshToonMaterial color="#56c2b0" gradientMap={grad} />
      </mesh>
    </group>
  );
}

/** One open-front furnished room = one storey of the building. */
function FloorRoom({ room, idx }: { room: Floor; idx: number }) {
  const grad = toonGradient(3);
  const y = floorY(idx);
  const midY = y + FLOOR_H / 2;
  return (
    <group>
      {/* floor slab */}
      <mesh position={[0, y, 0]} receiveShadow>
        <boxGeometry args={[ROOM_W, 0.12, ROOM_D]} />
        <meshToonMaterial color="#e8d3b3" gradientMap={grad} />
      </mesh>
      {/* back wall */}
      <mesh position={[0, midY, -ROOM_D / 2]} receiveShadow>
        <boxGeometry args={[ROOM_W, FLOOR_H, 0.1]} />
        <meshToonMaterial color="#fff4e0" gradientMap={grad} />
      </mesh>
      {/* side walls */}
      <mesh position={[-ROOM_W / 2, midY, 0]}>
        <boxGeometry args={[0.1, FLOOR_H, ROOM_D]} />
        <meshToonMaterial color="#f5e8d4" gradientMap={grad} />
      </mesh>
      <mesh position={[ROOM_W / 2, midY, 0]}>
        <boxGeometry args={[0.1, FLOOR_H, ROOM_D]} />
        <meshToonMaterial color="#f5e8d4" gradientMap={grad} />
      </mesh>
      {/* accent skirting on the back wall */}
      <mesh position={[0, y + 0.1, -ROOM_D / 2 + 0.08]}>
        <boxGeometry args={[ROOM_W, 0.14, 0.06]} />
        <meshToonMaterial color={room.accent} gradientMap={grad} />
      </mesh>
      {/* furniture */}
      <group position={[0, y, 0.2]} scale={FURN_SCALE}>
        <Furniture id={room.id} />
      </group>
      {/* exterior label (occluded when a wall turns toward the camera) */}
      <Html
        position={[ROOM_W / 2 + 0.15, midY, ROOM_D / 2 - 0.1]}
        center
        occlude
        className="pointer-events-none select-none"
      >
        <div className="flex w-32 flex-col gap-0.5">
          <span className="rounded-full bg-[var(--color-ink)] px-2.5 py-0.5 text-center font-[var(--font-display)] text-xs font-bold text-[var(--color-mist)] shadow">
            {room.label}
          </span>
          {room.teaser && (
            <span className="text-[10px] leading-tight text-[var(--color-muted)]">{room.teaser}</span>
          )}
        </div>
      </Html>
    </group>
  );
}

function Rig({ buildingRef }: { buildingRef: { current: Group | null } }) {
  const { camera } = useThree();
  const cur = useRef(0);
  const look = useRef(new Vector3(0, floorY(0), 0));

  useFrame(() => {
    const st = useAppStore.getState();
    const focused = st.focusedFloor;
    const target = focused ? roomIndexOf(focused) : scrollState.progress * TOP;
    cur.current += (target - cur.current) * 0.05;
    const cy = floorY(cur.current);

    const dist = focused ? 4.2 : 6.4;
    const px = focused ? 0.6 : 1.9;
    camera.position.x += (px - camera.position.x) * 0.06;
    camera.position.y += (cy + 1.2 - camera.position.y) * 0.06;
    camera.position.z += (dist - camera.position.z) * 0.06;
    look.current.x += (0 - look.current.x) * 0.06;
    look.current.y += (cy + 0.8 - look.current.y) * 0.06;
    look.current.z += (0 - look.current.z) * 0.06;
    camera.lookAt(look.current);

    // gentle scroll-driven turn (keeps the open fronts mostly facing the camera)
    if (buildingRef.current) buildingRef.current.rotation.y = scrollState.progress * (Math.PI * 0.5);
  });

  return null;
}

export function ElevatorScene() {
  const buildingRef = useRef<Group>(null);
  const grad = toonGradient(3);
  return (
    <>
      <group ref={buildingRef}>
        {rooms.map((room) => (
          <FloorRoom key={room.id} room={room} idx={roomIndexOf(room.id)} />
        ))}
        {/* base plinth */}
        <mesh position={[0, -0.18, 0]} receiveShadow>
          <boxGeometry args={[ROOM_W + 0.5, 0.3, ROOM_D + 0.5]} />
          <meshToonMaterial color="#caa57f" gradientMap={grad} />
        </mesh>
        {/* roof + rooster */}
        <mesh position={[0, TOTAL_H + 0.02, 0]} castShadow>
          <boxGeometry args={[ROOM_W + 0.3, 0.2, ROOM_D + 0.3]} />
          <meshToonMaterial color="#ffd479" gradientMap={grad} />
        </mesh>
        <group position={[0, TOTAL_H + 0.5, 0]}>
          <Rooster />
        </group>
      </group>
      <Rig buildingRef={buildingRef} />
    </>
  );
}
