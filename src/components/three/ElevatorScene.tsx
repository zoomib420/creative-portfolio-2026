import { Suspense, useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RoundedBox, Text } from '@react-three/drei';
import { Vector3, type Group } from 'three';
import { floors, floorsById, type Floor } from '../../data/floors';
import { toonGradient } from '../../lib/toon';
import { useAppStore } from '../../lib/store';
import { Furniture } from './RoomInterior';
import { RoosterModel } from './RoosterModel';
import balooFont from '@fontsource/baloo-2/files/baloo-2-latin-700-normal.woff?url';

/**
 * The single 3D world: a cozy **square cutaway tower**. The outer shape is a
 * normal rectangular box (square footprint + full-height corner posts), so it
 * never looks crooked. Each enclosed floor has one furnished room whose OPEN
 * face points to a different side of the tower (front → right → back → left),
 * and the whole building turns 90° per floor so the active room faces the
 * camera. The very top is the **rooftop = Lobby**: an open terrace with a
 * welcome sign and a real rooster GLB (procedural fallback while it loads).
 *
 * Camera ride, top → bottom: Lobby (rooftop) → about → work → tech → contact →
 * thanks. Lobby and about both face front, so scrolling between them does NOT
 * turn the tower — the rotation only begins at about → work. Clicking a floor
 * zooms into that room. Furniture is shared with RoomInterior.Furniture.
 */

// Enclosed rooms, top → bottom (about at the top, thanks at the ground floor).
const rooms: Floor[] = floors.filter((f) => f.ready && f.id !== 'hero');
const roomIndexOf = (id: string): number => Math.max(0, (floorsById[id]?.level ?? 1) - 1);

const FLOOR_H = 2.6;
const ROOM = 3.4; // SQUARE footprint (width === depth) so 90° turns keep the tower square
const FURN_SCALE = 0.6;
const N = rooms.length;
const TOP = N - 1;
const TOTAL_H = N * FLOOR_H; // top of the tower = the rooftop deck height
const floorY = (idx: number) => (TOP - idx) * FLOOR_H;
/** Which side of the tower a room's open face points to. Alternates 180 degrees per floor. */
const faceAngle = (idx: number) => (idx + 1) * Math.PI;

// Camera stops, top → bottom. Index 0 is the rooftop lobby; 1..N are the rooms.
const STOP_IDS = ['hero', ...rooms.map((r) => r.id)];

type RoomLabel = {
  text: string;
  size: number;
  position: [number, number, number];
};

/** Permanent room signs, tuned per-room so long titles still sit neatly in the cutaway. */
const ROOM_LABELS: Record<string, RoomLabel> = {
  about: { text: 'About me', size: 0.38, position: [0, 2.0, 0] },
  work: { text: 'Work', size: 0.5, position: [0, 2.0, 0] },
  tech: { text: 'Tools & Games', size: 0.32, position: [0, 2.0, 0] },
  contact: { text: 'Contact', size: 0.42, position: [0, 2.0, 0] },
  thanks: { text: 'Thank you', size: 0.37, position: [0, 2.0, 0] },
};

/** Camera framing for an integer stop (0 = rooftop lobby, s>=1 = room s-1). */
function frame(stop: number) {
  if (stop <= 0) {
    // Rooftop lobby: pull back + up so the whole tower and the rooster read.
    return { ly: TOTAL_H + 0.5, cy: TOTAL_H + 1.6, dist: 7.8, px: 2.3 };
  }
  const y = floorY(stop - 1);
  return { ly: y + 0.8, cy: y + 1.2, dist: 6.4, px: 1.9 };
}

/**
 * Chunky hand-lettered sign: a CanvasTexture with layered extrusion shadows,
 * rounded strokes and a soft cream face — cozy sign-painter look. A gentle
 * idle bob keeps it feeling alive.
 */
/**
 * 2.5D SDF Text overlay matching the clean, crisp bubble style from the reference.
 * Scales down to 0 when the user scrolls away or when entering a room.
 */
function FloatingRoomLabel({
  text,
  size = 1.0,
  alwaysVisible = false,
}: {
  text: string;
  size?: number;
  alwaysVisible?: boolean;
}) {
  const groupRef = useRef<Group>(null);
  const vec = new Vector3();

  useFrame(({ camera }) => {
    if (!groupRef.current) return;

    const st = useAppStore.getState();
    const isAnyFocused = st.focusedFloor !== null;

    groupRef.current.getWorldPosition(vec);
    const distY = Math.abs(camera.position.y - vec.y);
    
    let targetScale = 0;

    if (alwaysVisible) {
      targetScale = 1;
    } else if (!isAnyFocused && distY < 3.5) {
      // To decouple physical position from visibility direction, we always use the room's open face [1, 0, 1].
      // Since vec is the global position of the text, we can't easily use it if the text is placed at the back corner.
      // Instead, we just calculate the global direction of the local [1, 0, 1] vector.
      const roomGroup = groupRef.current.parent?.parent;
      let toText = new Vector3(1, 0, 1);
      if (roomGroup) {
        // Transform [1, 0, 1] to global space direction using the room's transform
        const origin = new Vector3(0, 0, 0).applyMatrix4(roomGroup.matrixWorld);
        const forward = new Vector3(1, 0, 1).applyMatrix4(roomGroup.matrixWorld);
        toText = forward.sub(origin);
      }
      toText.y = 0;
      toText.normalize();

      const center = new Vector3(0, vec.y, 0);
      const toCam = camera.position.clone().sub(center);
      toCam.y = 0;
      toCam.normalize();

      const dot = toText.dot(toCam);
      
      // When dot is close to 1, the text is at the front of the building facing the camera.
      // Wait until the room is almost centered before showing (0.5 to 0.8)
      if (dot > 0.8) targetScale = 1;
      else if (dot > 0.5) targetScale = (dot - 0.5) / 0.3;
    }

    // Billboard the text so it is always perfectly straight to the camera
    // lookAt works perfectly regardless of the parent's rotation
    groupRef.current.lookAt(camera.position);
    
    const currentScale = groupRef.current.scale.x || 0;
    let nextScale = currentScale + (targetScale - currentScale) * 0.15;
    if (isNaN(nextScale)) nextScale = 0;
    groupRef.current.scale.set(nextScale, nextScale, nextScale);
  });

  return (
    <group ref={groupRef} scale={0}>
      <Text
        position={[0, 0, -0.01]}
        fontSize={size * 0.6}
        color="#ffffff"
        font={balooFont}
        outlineWidth={size * 0.08}
        outlineColor="#ffffff"
        anchorX="center"
        anchorY="middle"
        textAlign="center"
      >
        {text}
      </Text>
      <Text
        position={[0, 0, 0]}
        fontSize={size * 0.6}
        color="#1a1a1a"
        font={balooFont}
        anchorX="center"
        anchorY="middle"
        textAlign="center"
      >
        {text}
      </Text>
    </group>
  );
}

/** Cute rooster mascot — procedural fallback while the GLB streams in (held still). */
function Rooster() {
  const grad = toonGradient(3);
  return (
    <group scale={1.5}>
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

/**
 * A glowing window, built facing +z. Every part sits at a DISTINCT depth in
 * front of the wall (z > 0), so no two surfaces are coplanar — that's what was
 * causing the flicker (z-fighting between the glass, an accent plane and the
 * wall face). Place/rotate it at the wall's outer face via `p` + `ry`.
 */
const WIN_W = 0.6;
const WIN_H = 0.76;
function Window({ p, ry }: { p: [number, number, number]; ry: number }) {
  const grad = toonGradient(3);
  const frame = (key: string, px: number, py: number, sx: number, sy: number) => (
    <mesh key={key} position={[px, py, 0.08]} castShadow>
      <boxGeometry args={[sx, sy, 0.12]} />
      <meshToonMaterial color="#4a3224" gradientMap={grad} />
    </mesh>
  );
  return (
    <group position={p} rotation={[0, ry, 0]}>
      {/* glowing glass — a thin box set proud of the wall (z>0 = outside) */}
      <mesh position={[0, 0, 0.05]} castShadow>
        <boxGeometry args={[WIN_W - 0.1, WIN_H - 0.1, 0.05]} />
        <meshStandardMaterial color="#fff0b3" emissive="#ffb347" emissiveIntensity={0.6} toneMapped={false} />
      </mesh>
      {/* four-sided frame, proud of the glass */}
      {frame('t', 0, WIN_H / 2 - 0.05, WIN_W, 0.1)}
      {frame('b', 0, -WIN_H / 2 + 0.05, WIN_W, 0.1)}
      {frame('l', -WIN_W / 2 + 0.05, 0, 0.1, WIN_H)}
      {frame('r', WIN_W / 2 - 0.05, 0, 0.1, WIN_H)}
      {/* muntin cross */}
      <mesh position={[0, 0, 0.085]}>
        <boxGeometry args={[WIN_W - 0.12, 0.045, 0.04]} />
        <meshToonMaterial color="#4a3224" gradientMap={grad} />
      </mesh>
      <mesh position={[0, 0, 0.085]}>
        <boxGeometry args={[0.045, WIN_H - 0.12, 0.04]} />
        <meshToonMaterial color="#4a3224" gradientMap={grad} />
      </mesh>
      {/* sill */}
      <mesh position={[0, -WIN_H / 2 - 0.04, 0.07]} castShadow>
        <boxGeometry args={[WIN_W + 0.12, 0.08, 0.18]} />
        <meshToonMaterial color="#3d281c" gradientMap={grad} />
      </mesh>
    </group>
  );
}

/** One open-front furnished room = one storey of the (square) tower. */
function FloorRoom({ room, idx }: { room: Floor; idx: number }) {
  const grad = toonGradient(3);
  const y = floorY(idx);
  const midY = y + FLOOR_H / 2;
  const winY = y + FLOOR_H * 0.55;
  const label = ROOM_LABELS[room.id] ?? {
    text: room.label,
    size: 0.38,
    position: [0, 2.32, ROOM / 2 + 0.24] as [number, number, number],
  };

  // Swing this whole room around the tower's central axis so its open front
  // points to its own side of the building (Y-rotation leaves floor heights be;
  // the square footprint keeps the silhouette identical after every 90° turn).
  return (
    <group rotation={[0, faceAngle(idx), 0]}>
      <mesh position={[0, y, 0]} receiveShadow>
        <boxGeometry args={[ROOM, 0.12, ROOM]} />
        <meshToonMaterial color="#ffbc61" gradientMap={grad} />
      </mesh>
      {/* corner pillars (3 only, leaving the front open corner [1, 1] clear) */}
      {([[-1, -1], [1, -1], [-1, 1]] as const).map(([sx, sz], i) => (
        <RoundedBox
          key={`pillar-${i}`}
          position={[sx * (ROOM / 2), midY, sz * (ROOM / 2)]}
          args={[0.22, FLOOR_H, 0.22]}
          radius={0.08}
          smoothness={3}
          castShadow
        >
          <meshToonMaterial color="#4a3224" gradientMap={grad} />
        </RoundedBox>
      ))}
      {/* accent rug — upgraded to a 12-sided thick rug with an inner rim */}
      <group position={[0, y + 0.06, 0.35]}>
        {/* Main thick rug base */}
        <mesh position={[0, 0.01, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[1.15, 1.15, 0.02, 12]} />
          <meshToonMaterial color={room.accent} gradientMap={grad} />
        </mesh>
        {/* Inner rim for extra dimension */}
        <mesh position={[0, 0.025, 0]} receiveShadow>
          <cylinderGeometry args={[1.0, 1.0, 0.01, 12]} />
          <meshToonMaterial color="#ffffff" opacity={0.3} transparent />
        </mesh>
      </group>
      {/* back wall */}
      <mesh position={[0, midY, -ROOM / 2]} receiveShadow>
        <boxGeometry args={[ROOM - 0.15, FLOOR_H, 0.1]} />
        <meshToonMaterial color="#fff2d9" gradientMap={grad} />
      </mesh>
      {/* side wall (left only) */}
      <mesh position={[-ROOM / 2, midY, 0]}>
        <boxGeometry args={[0.1, FLOOR_H, ROOM - 0.15]} />
        <meshToonMaterial color="#f7eed8" gradientMap={grad} />
      </mesh>
      {/* window grid on the TWO closed walls. Built at each wall's OUTER face. */}
      {[-1.05, 0, 1.05].map((x) => (
        <Window key={`b${x}`} p={[x, winY, -ROOM / 2 - 0.05]} ry={Math.PI} />
      ))}
      {[-0.7, 0.6].map((z) => (
        <Window key={`l${z}`} p={[-ROOM / 2 - 0.05, winY, z]} ry={-Math.PI / 2} />
      ))}
      {/* INNER windows to match outer windows (Left Wall Only) */}
      {[-0.7, 0.6].map((z) => (
        <Window key={`l_in_${z}`} p={[-ROOM / 2 + 0.05, winY, z]} ry={Math.PI / 2} />
      ))}
      {/* accent skirting on the back wall */}
      <mesh position={[0, y + 0.1, -ROOM / 2 + 0.07]}>
        <boxGeometry args={[ROOM - 0.15, 0.14, 0.04]} />
        <meshToonMaterial color={room.accent} gradientMap={grad} />
      </mesh>
      {/* furniture */}
      <group position={[0, y, 0.2]} scale={FURN_SCALE}>
        <Furniture id={room.id} />
      </group>
      <group position={[label.position[0], y + label.position[1], label.position[2]]} rotation={[0, Math.PI / 4, 0]}>
        <FloatingRoomLabel text={label.text} size={label.size} />
      </group>
    </group>
  );
}

/** Open rooftop terrace = the Lobby: deck, railing, welcome sign + rooster. */
function RooftopLobby() {
  const grad = toonGradient(3);
  const deckSize = ROOM + 0.4; // 3.2
  const postDist = ROOM / 2 + 0.1; // 1.5, so it sits 0.1 inside the deck edge (1.6)
  
  return (
    <group position={[0, TOTAL_H, 0]}>
      {/* deck slab with nice beveled edges */}
      <RoundedBox position={[0, 0.08, 0]} args={[deckSize, 0.2, deckSize]} radius={0.04} smoothness={4} receiveShadow>
        <meshToonMaterial color="#ffbc61" gradientMap={grad} />
      </RoundedBox>
      
      {/* railing posts — corners + edge midpoints give an even rhythm */}
      {([[-1, -1], [0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0]] as const).map(
        ([sx, sz], i) => (
          <mesh key={i} position={[sx * postDist, 0.42, sz * postDist]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 0.5, 8]} />
            <meshToonMaterial color="#4a3224" gradientMap={grad} />
          </mesh>
        ),
      )}
      
      {/* top rail bars along each edge */}
      <mesh position={[0, 0.65, postDist]} castShadow>
        <boxGeometry args={[postDist * 2 + 0.12, 0.08, 0.08]} />
        <meshToonMaterial color="#3d281c" gradientMap={grad} />
      </mesh>
      <mesh position={[0, 0.65, -postDist]} castShadow>
        <boxGeometry args={[postDist * 2 + 0.12, 0.08, 0.08]} />
        <meshToonMaterial color="#3d281c" gradientMap={grad} />
      </mesh>
      <mesh position={[postDist, 0.65, 0]} castShadow>
        <boxGeometry args={[0.08, 0.08, postDist * 2 + 0.12]} />
        <meshToonMaterial color="#3d281c" gradientMap={grad} />
      </mesh>
      <mesh position={[-postDist, 0.65, 0]} castShadow>
        <boxGeometry args={[0.08, 0.08, postDist * 2 + 0.12]} />
        <meshToonMaterial color="#3d281c" gradientMap={grad} />
      </mesh>

      {/* bottom rail bars for structural detail */}
      <mesh position={[0, 0.25, postDist]} castShadow>
        <boxGeometry args={[postDist * 2, 0.04, 0.04]} />
        <meshToonMaterial color="#4a3224" gradientMap={grad} />
      </mesh>
      <mesh position={[0, 0.25, -postDist]} castShadow>
        <boxGeometry args={[postDist * 2, 0.04, 0.04]} />
        <meshToonMaterial color="#4a3224" gradientMap={grad} />
      </mesh>
      <mesh position={[postDist, 0.25, 0]} castShadow>
        <boxGeometry args={[0.04, 0.04, postDist * 2]} />
        <meshToonMaterial color="#4a3224" gradientMap={grad} />
      </mesh>
      <mesh position={[-postDist, 0.25, 0]} castShadow>
        <boxGeometry args={[0.04, 0.04, postDist * 2]} />
        <meshToonMaterial color="#4a3224" gradientMap={grad} />
      </mesh>
      {/* warm fill light so the rooster never reads dull */}
      <pointLight position={[0.6, 1.7, 1.4]} intensity={0.7} color="#fff0d6" distance={6} />
      
      {/* Cute round bushes on all 4 corners */}
      {([
        [-1, -1],
        [-1, 1],
        [1, -1],
        [1, 1],
      ] as const).map(([sx, sz], i) => {
        // slightly randomize scale and rotation so they look organic
        const scale = 0.9 + (i % 3) * 0.15;
        const rotY = (i * Math.PI) / 3;
        return (
          <group key={`tree-${i}`} position={[sx * (postDist - 0.5), 0.08, sz * (postDist - 0.5)]} rotation={[0, rotY, 0]}>
            <ToonBush p={[0, 0, 0]} s={scale} />
          </group>
        );
      })}

      {/* Floating Welcome Sign (Removed wooden poles) */}
      <group position={[-0.7, 0, 0.55]} rotation={[0, Math.PI / 4, 0]}>
        <group position={[-0.8, 1.8, 0]}>
          <FloatingRoomLabel text={"Welcome,\nI'm Super Rooster,\nAI powered Builder."} size={0.3} alwaysVisible={true} />
        </group>
      </group>

      {/* real rooster GLB (bigger now), procedural fallback while it loads */}
      <group position={[0.7, 0.18, -0.1]} rotation={[0, Math.PI / 4, 0]}>
        <Suspense fallback={<Rooster />}>
          <RoosterModel />
        </Suspense>
      </group>
    </group>
  );
}

function Rig({ buildingRef }: { buildingRef: { current: Group | null } }) {
  const { camera } = useThree();
  const cur = useRef(0); // eased continuous stop position (0 = rooftop lobby)
  const look = useRef(new Vector3(0, TOTAL_H + 0.5, 0));
  const anchors = useRef<number[]>([]);

  // Measure each section's centre (in document coords) so the tower can turn
  // CONTINUOUSLY with the scroll instead of snapping when a heading goes active.
  useEffect(() => {
    const measure = () => {
      anchors.current = STOP_IDS.map((id) => {
        const el = document.getElementById(id);
        if (!el) return 0;
        const r = el.getBoundingClientRect();
        return r.top + window.scrollY + r.height / 2;
      });
    };
    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('load', measure);
    const t = window.setTimeout(measure, 400);
    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('load', measure);
      window.clearTimeout(t);
    };
  }, []);

  // Continuous stop position: where the viewport centre sits among the section
  // centres (0 = rooftop lobby, fractional = mid-way between two floors).
  const scrollStop = (): number => {
    const a = anchors.current;
    if (a.length < 2) return 0;
    const mid = window.scrollY + window.innerHeight / 2;
    const last = a.length - 1;
    if (mid <= a[0]) return 0;
    if (mid >= a[last]) return last;
    for (let i = 0; i < last; i++) {
      if (mid < a[i + 1]) return i + (mid - a[i]) / (a[i + 1] - a[i] || 1);
    }
    return last;
  };

  useFrame((_, delta) => {
    const st = useAppStore.getState();
    const focused = st.focusedFloor;
    const targetStop = focused ? roomIndexOf(focused) + 1 : scrollStop();

    // Frame-rate independent damping keeps the ride smooth on both desktop and
    // mobile while still tracking the user's scroll closely.
    const stopEase = 1 - Math.exp(-delta * 6.8);
    const camEase = 1 - Math.exp(-delta * 5.2);
    cur.current += (targetStop - cur.current) * stopEase;
    const c = cur.current;

    // Interpolate the camera framing between the two nearest integer stops.
    const lo = Math.max(0, Math.floor(c));
    const hi = Math.min(STOP_IDS.length - 1, lo + 1);
    const f = c - lo;
    const a = frame(lo);
    const b = frame(hi);
    const ly = a.ly + (b.ly - a.ly) * f;
    const cy = a.cy + (b.cy - a.cy) * f;
    const basePx = a.px + (b.px - a.px) * f;

    // settle = 1 when parked on a room, 0 mid-way between two rooms. Zoom IN a
    // touch on arrival, pull OUT while the tower is turning to the next room.
    const settle = 1 - Math.min(1, Math.abs(c - Math.round(c)) * 2);
    const baseDist = a.dist + (b.dist - a.dist) * f;
    
    // Automatically zoom into the room when centered, EXCEPT for the rooftop lobby (index 0).
    // For rooms, target distance is 4.2 and target px is 0.6 when fully settled.
    const isRoom = Math.round(c) > 0;
    const targetDist = focused ? 4.2 : 
                       (isRoom ? baseDist - settle * (baseDist - 4.2) + (1 - settle) * 1.5 
                               : baseDist - settle * 0.7 + (1 - settle) * 1.5);
    
    const targetPx = focused ? 0.6 :
                     (isRoom ? basePx + settle * (0.6 - basePx)
                             : basePx);

    const px = targetPx;
    const dist = targetDist;

    camera.position.x += (px - camera.position.x) * camEase;
    camera.position.y += (cy - camera.position.y) * camEase;
    camera.position.z += (dist - camera.position.z) * camEase;
    look.current.x += (0 - look.current.x) * camEase;
    look.current.y += (ly - look.current.y) * camEase;
    look.current.z += (0 - look.current.z) * camEase;
    camera.lookAt(look.current);

    // Turn the tower so the active room faces the camera. The entire building starts at -45°
    // so the corner always faces the camera. Each floor spins 180 degrees (Math.PI).
    // Lobby is c=0, so it starts rotating immediately on scroll down.
    if (buildingRef.current) {
      buildingRef.current.rotation.y = -Math.PI / 4 - c * Math.PI;
    }
  });

  return null;
}

function ToonCloud({ p, s = 1 }: { p: [number, number, number], s?: number }) {
  const grad = toonGradient(3);
  return (
    <group position={p} scale={s}>
      <mesh position={[-0.8, 0, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.9, 32, 32]} />
        <meshToonMaterial color="#b2c2e6" gradientMap={grad} />
      </mesh>
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshToonMaterial color="#b2c2e6" gradientMap={grad} />
      </mesh>
      <mesh position={[1.0, -0.2, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshToonMaterial color="#b2c2e6" gradientMap={grad} />
      </mesh>
      <mesh position={[0.4, -0.3, 0.5]} castShadow receiveShadow>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshToonMaterial color="#b2c2e6" gradientMap={grad} />
      </mesh>
      <mesh position={[-0.4, -0.2, 0.6]} castShadow receiveShadow>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshToonMaterial color="#b2c2e6" gradientMap={grad} />
      </mesh>
      <mesh position={[0.5, 0.2, -0.5]} castShadow receiveShadow>
        <sphereGeometry args={[0.9, 32, 32]} />
        <meshToonMaterial color="#b2c2e6" gradientMap={grad} />
      </mesh>
    </group>
  );
}

function ToonTree({ p, s = 1 }: { p: [number, number, number], s?: number }) {
  const grad = toonGradient(4);
  return (
    <group position={p} scale={s}>
      {/* Trunk */}
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.08, 0.12, 0.4, 6]} />
        <meshToonMaterial color="#5c3f2d" gradientMap={grad} />
      </mesh>
      {/* Leaves (Sharp Low-poly Pine style) */}
      <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
        <coneGeometry args={[0.5, 0.8, 5]} />
        <meshToonMaterial color="#2a4b3b" gradientMap={grad} />
      </mesh>
      <mesh position={[0, 1.0, 0]} castShadow receiveShadow>
        <coneGeometry args={[0.4, 0.7, 5]} />
        <meshToonMaterial color="#355e4a" gradientMap={grad} />
      </mesh>
      <mesh position={[0, 1.4, 0]} castShadow receiveShadow>
        <coneGeometry args={[0.3, 0.6, 5]} />
        <meshToonMaterial color="#42735b" gradientMap={grad} />
      </mesh>
    </group>
  );
}

function ToonBush({ p, s = 1 }: { p: [number, number, number], s?: number }) {
  const grad = toonGradient(3);
  return (
    <group position={p} scale={s}>
      {/* Little pot */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.12, 0.3, 12]} />
        <meshToonMaterial color="#4a3224" gradientMap={grad} />
      </mesh>
      {/* Round fluffy bush */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <icosahedronGeometry args={[0.32, 1]} />
        <meshToonMaterial color="#7fd093" gradientMap={grad} />
      </mesh>
      <mesh position={[0.15, 0.55, 0.1]} castShadow>
        <icosahedronGeometry args={[0.18, 1]} />
        <meshToonMaterial color="#7fd093" gradientMap={grad} />
      </mesh>
      <mesh position={[-0.15, 0.35, 0.15]} castShadow>
        <icosahedronGeometry args={[0.15, 1]} />
        <meshToonMaterial color="#7fd093" gradientMap={grad} />
      </mesh>
    </group>
  );
}

function ToonMoon({ p, s = 1 }: { p: [number, number, number], s?: number }) {
  return (
    <group position={p} scale={s}>
      {/* 3D Moon Core - glowing brightly! */}
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffc44d" emissiveIntensity={2.5} toneMapped={false} />
      </mesh>
      
      {/* Craters (embedded flat cylinders on the surface) */}
      <mesh position={[0.5, 0.4, 0.82]} rotation={[1.1, -0.5, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.1, 16]} />
        <meshStandardMaterial color="#ffe899" emissive="#e69d00" emissiveIntensity={0.4} toneMapped={false} />
      </mesh>
      <mesh position={[-0.4, 0.3, 0.88]} rotation={[1.2, 0.4, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.1, 16]} />
        <meshStandardMaterial color="#ffe899" emissive="#e69d00" emissiveIntensity={0.4} toneMapped={false} />
      </mesh>
      <mesh position={[0.1, -0.5, 0.85]} rotation={[2.0, -0.1, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
        <meshStandardMaterial color="#ffe899" emissive="#e69d00" emissiveIntensity={0.4} toneMapped={false} />
      </mesh>
      <mesh position={[-0.7, -0.3, 0.65]} rotation={[1.8, 0.8, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.1, 16]} />
        <meshStandardMaterial color="#ffe899" emissive="#e69d00" emissiveIntensity={0.4} toneMapped={false} />
      </mesh>

    </group>
  );
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

        {/* floor cornices — beveled ledges read as the storeys of a real building */}
        {rooms.map((_, idx) => (
          <RoundedBox
            key={`cornice-${idx}`}
            position={[0, floorY(idx) - 0.12, 0]}
            args={[ROOM + 0.26, 0.14, ROOM + 0.26]}
            radius={0.05}
            smoothness={2}
            receiveShadow
          >
            <meshToonMaterial color="#c69f73" gradientMap={grad} />
          </RoundedBox>
        ))}
        {/* base plinth (chunky beveled footing) */}
        <RoundedBox position={[0, -0.18, 0]} args={[ROOM + 0.5, 0.34, ROOM + 0.5]} radius={0.08} smoothness={3} receiveShadow>
          <meshToonMaterial color="#4a3224" gradientMap={grad} />
        </RoundedBox>
        {/* rooftop lobby (deck + welcome sign + rooster) */}
        <RooftopLobby />
      </group>
      
      {/* Grassy ground island, static so it doesn't spin, sized nicely so it doesn't cover the horizon from the top floor */}
      <mesh position={[0, -0.45, 0]} receiveShadow>
        <cylinderGeometry args={[10, 8, 0.3, 48]} />
        <meshToonMaterial color="#2d3b5c" gradientMap={grad} />
      </mesh>
      
      {/* Scattered static rocks on the ground */}
      {([[-4, 2], [5, 4], [3, -5], [-3, -4], [-6, -1], [6, -2]] as const).map(([x, z], i) => (
        <mesh key={`rock-${i}`} position={[x, -0.25, z]} rotation={[Math.random(), Math.random(), Math.random()]} castShadow receiveShadow>
          <dodecahedronGeometry args={[0.3 + Math.random() * 0.3]} />
          <meshToonMaterial color={i % 2 === 0 ? "#5a668a" : "#45506b"} gradientMap={grad} />
        </mesh>
      ))}

      {/* Cute 3D pine trees scattered on the island */}
      <ToonTree p={[-5, -0.3, 3]} s={1.2} />
      <ToonTree p={[6, -0.3, 2]} s={0.9} />
      <ToonTree p={[4, -0.3, -6]} s={1.5} />
      <ToonTree p={[-7, -0.3, -3]} s={1.1} />
      <ToonTree p={[-3, -0.3, -7]} s={1.4} />
      <ToonTree p={[7, -0.3, -4]} s={1.0} />
      <ToonTree p={[-6, -0.3, 5]} s={0.8} />
      <ToonTree p={[3, -0.3, 7]} s={1.3} />

      {/* Moon - placed far in the background */}
      <ToonMoon p={[5.5, 19.5, -20]} s={2.2} />

      {/* Cute fluffy solid clouds scattered everywhere, kept within fog range */}
      {/* Top tier (around hero) */}
      <ToonCloud p={[-18, 19, -12]} s={2.2} />
      <ToonCloud p={[20, 18, -8]} s={2.0} />
      <ToonCloud p={[-8, 15, -15]} s={1.8} />
      <ToonCloud p={[14, 14, -18]} s={2.5} />
      
      {/* Mid tier (around rooms) */}
      <ToonCloud p={[-22, 9, -6]} s={1.5} />
      <ToonCloud p={[25, 7, -10]} s={1.9} />
      <ToonCloud p={[-12, 5, -14]} s={2.2} />
      <ToonCloud p={[10, 2, -15]} s={1.4} />
      
      <Rig buildingRef={buildingRef} />
    </>
  );
}
