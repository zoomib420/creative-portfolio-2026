import { useRef, useState, useMemo, type ReactNode } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import { Vector3, type Group } from 'three';
import { toonGradient } from '../../lib/toon';
import { floorsById } from '../../data/floors';
import { games } from '../../data/games';
import { useAppStore } from '../../lib/store';

/**
 * The furnished 3D room you "enter" when a floor is opened (store.focusedFloor).
 * An open-front dollhouse room with themed furniture per floor; the camera looks
 * in from the front with a gentle sway. Swapped in for the exterior tower by
 * Experience3D. Procedural toon props — a Blender set can replace these later.
 */

const RW = 6;
const RH = 3.8;
const RD = 5;

type Vec3 = [number, number, number];

/** Chubby toon box helper — rounded corners give that soft toy-box look, now slightly sharper. */
function B({ p, s, c, cast = true }: { p: Vec3; s: Vec3; c: string; cast?: boolean }) {
  // Reduced radius for a sharper, more defined look
  const radius = Math.min(0.04, Math.min(s[0], s[1], s[2]) * 0.2);
  return (
    <RoundedBox position={p} args={s} radius={radius} smoothness={3} castShadow={cast}>
      <meshToonMaterial color={c} gradientMap={toonGradient(3)} />
    </RoundedBox>
  );
}

/** Emissive screen / glow panel. */
function Screen({ p, s, c, rot = [0, 0, 0], i = 1.1 }: { p: Vec3; s: [number, number]; c: string; rot?: Vec3; i?: number }) {
  return (
    <mesh position={p} rotation={rot}>
      <planeGeometry args={s} />
      <meshStandardMaterial color={c} emissive={c} emissiveIntensity={i} toneMapped={false} />
    </mesh>
  );
}

/**
 * Wraps a hero prop so it's clickable. First click ENTERS the room (camera
 * zooms in); once inside, clicking does the object's specific thing (open its
 * content panel, launch a game…). Gentle lift on hover signals it's tappable.
 * Includes a little floating arrow hint that fades out when hovered.
 */
function Hotspot({ room, act, children, hintOffset = [0, 1.2, 0] }: { room: string; act: () => void; children: ReactNode; hintOffset?: Vec3 }) {
  const ref = useRef<Group>(null);
  const hintRef = useRef<Group>(null);
  const [hov, setHov] = useState(false);
  const st = useAppStore();
  
  // Show hint only if we are inside the room, but haven't clicked the hotspot yet
  // Or maybe always show it softly when focused on the floor.

  useFrame(({ clock }) => {
    if (ref.current) ref.current.position.y += ((hov ? 0.08 : 0) - ref.current.position.y) * 0.2;
    if (hintRef.current) {
      const t = clock.elapsedTime;
      // Bouncing arrow
      hintRef.current.position.y = hintOffset[1] + Math.sin(t * 3) * 0.08;
      // Fade out arrow only when the room panel is open
      const targetScale = st.roomPanel === room ? 0 : 1;
      hintRef.current.scale.setScalar(hintRef.current.scale.x + (targetScale - hintRef.current.scale.x) * 0.15);
    }
  });

  return (
    <group
      ref={ref}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHov(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHov(false);
        document.body.style.cursor = '';
      }}
      onClick={(e) => {
        e.stopPropagation();
        act(); // directly trigger action (opens modal and locks scroll)
      }}
    >
      {children}
      {/* Floating arrow hint */}
      <group ref={hintRef} position={hintOffset} scale={0}>
        <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[0.08, 0.2, 4]} />
          <meshBasicMaterial color="#ff4a4a" />
        </mesh>
      </group>
    </group>
  );
}

/** Tiny cute mug — a little prop to warm up a desktop. Built with sharp B blocks! */
function Mug({ p, c }: { p: Vec3; c: string }) {
  return (
    <group position={p}>
      {/* Mug Body */}
      <B p={[0, 0, 0]} s={[0.16, 0.18, 0.16]} c={c} />
      {/* Coffee inside (dark brown) */}
      <B p={[0, 0.08, 0]} s={[0.14, 0.04, 0.14]} c="#3a322b" cast={false} />
      {/* Handle (Loop made of 3 tiny blocks) */}
      <B p={[0.09, 0.04, 0]} s={[0.04, 0.02, 0.04]} c={c} cast={false} />
      <B p={[0.09, -0.04, 0]} s={[0.04, 0.02, 0.04]} c={c} cast={false} />
      <B p={[0.1, 0, 0]} s={[0.02, 0.1, 0.04]} c={c} cast={false} />
    </group>
  );
}

function Desk({ pos = [0, 0, -1.3] as Vec3, color = '#caa57f' }: { pos?: Vec3; color?: string }) {
  return (
    <group position={pos}>
      {/* chunky sharper top */}
      <B p={[0, 1.0, 0]} s={[2.1, 0.12, 0.95]} c={color} />
      {/* fat little legs */}
      {([[-0.9, 0.36], [0.9, 0.36], [-0.9, -0.36], [0.9, -0.36]] as const).map(([x, z], idx) => (
        <B key={idx} p={[x, 0.53, z]} s={[0.12, 0.94, 0.12]} c="#4a3224" />
      ))}
    </group>
  );
}

function InteriorCameraRig() {
  const { camera } = useThree();
  const look = useRef(new Vector3(0, 1.35, 0));
  const tgt = useRef(new Vector3(0, 1.9, 4.3));
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    tgt.current.set(Math.sin(t * 0.16) * 0.85, 1.9, 4.3);
    camera.position.lerp(tgt.current, 0.05);
    camera.lookAt(look.current);
  });
  return null;
}

function Shell({ accent }: { accent: string }) {
  const g = toonGradient(3);
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[RW, RD]} />
        <meshToonMaterial color="#ffbc61" gradientMap={g} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0.5]}>
        <circleGeometry args={[1.8, 40]} />
        <meshToonMaterial color={accent} gradientMap={g} />
      </mesh>
      {/* side wall (left only) */}
      <mesh position={[-RW / 2, RH / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[RD, RH]} />
        <meshToonMaterial color="#f7eed8" gradientMap={g} />
      </mesh>
      
      {/* INNER windows to match outer windows (Left Wall Only) */}
      {[-1.0, 1.0].map((z) => (
        <group key={`l_in_${z}`} position={[-RW / 2 + 0.05, 1.8, z]} rotation={[0, Math.PI / 2, 0]}>
          <mesh position={[0, 0, 0.05]} castShadow>
            <boxGeometry args={[0.8, 1.0, 0.05]} />
            <meshStandardMaterial color="#fff0b3" emissive="#ffb347" emissiveIntensity={0.6} toneMapped={false} />
          </mesh>
          <mesh position={[0, 0, 0.08]} castShadow>
            <boxGeometry args={[0.9, 0.1, 0.05]} />
            <meshToonMaterial color="#4a3224" gradientMap={g} />
          </mesh>
          <mesh position={[0, 0, 0.08]} castShadow>
            <boxGeometry args={[0.1, 1.1, 0.05]} />
            <meshToonMaterial color="#4a3224" gradientMap={g} />
          </mesh>
          <mesh position={[0, -0.55, 0.08]} castShadow>
            <boxGeometry args={[1.0, 0.1, 0.15]} />
            <meshToonMaterial color="#3d281c" gradientMap={g} />
          </mesh>
        </group>
      ))}
      {/* ceiling/top (removed, since it's an open dollhouse, wait, 
          the floor above acts as ceiling in the tower, but here it's an open set. 
          Actually there was a top wall at 173. I'll leave the ceiling) */}
      <mesh position={[0, RH, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[RW, RD]} />
        <meshToonMaterial color="#fff2d9" gradientMap={g} />
      </mesh>
      {/* skirting accent */}
      <mesh position={[0, 0.09, -RD / 2 + 0.03]}>
        <boxGeometry args={[RW, 0.18, 0.06]} />
        <meshToonMaterial color={accent} gradientMap={g} />
      </mesh>
      {/* ceiling lamp */}
      <mesh position={[0, RH - 0.25, 0]}>
        <sphereGeometry args={[0.24, 18, 18]} />
        <meshStandardMaterial color="#ffe9b8" emissive="#ffd479" emissiveIntensity={1.3} toneMapped={false} />
      </mesh>
      <pointLight position={[0, RH - 0.5, 0.6]} intensity={1.0} color="#ffcf8a" distance={11} />
    </group>
  );
}

function CuteCat({ p, ry = 0 }: { p: Vec3; ry?: number }) {
  const orange = "#f08f3a";
  const darkOrange = "#d46b1c"; // for stripes
  const white = "#ffffff";
  const pink = "#ff94b8";
  
  return (
    <group position={p} rotation={[0, ry, 0]}>
      {/* Body (Orange) */}
      <B p={[0, 0.25, 0]} s={[0.3, 0.25, 0.4]} c={orange} />
      {/* White Belly */}
      <B p={[0, 0.2, 0.05]} s={[0.22, 0.15, 0.36]} c={white} cast={false} />
      {/* Stripes (Dark Orange) */}
      <B p={[0, 0.32, -0.05]} s={[0.32, 0.05, 0.05]} c={darkOrange} cast={false} />
      <B p={[0, 0.32, -0.15]} s={[0.32, 0.05, 0.05]} c={darkOrange} cast={false} />
      
      {/* Head */}
      <group position={[0, 0.45, 0.15]}>
        {/* Face */}
        <B p={[0, 0, 0]} s={[0.3, 0.25, 0.25]} c={orange} />
        {/* White muzzle/chin */}
        <B p={[0, -0.05, 0.05]} s={[0.2, 0.1, 0.22]} c={white} cast={false} />
        {/* Ears */}
        <B p={[-0.1, 0.15, -0.05]} s={[0.08, 0.15, 0.08]} c={orange} />
        <B p={[0.1, 0.15, -0.05]} s={[0.08, 0.15, 0.08]} c={orange} />
        {/* Inner Ears */}
        <B p={[-0.1, 0.15, 0]} s={[0.04, 0.1, 0.08]} c={pink} cast={false} />
        <B p={[0.1, 0.15, 0]} s={[0.04, 0.1, 0.08]} c={pink} cast={false} />
        {/* Eyes (Closed/Happy) */}
        <B p={[-0.08, 0.05, 0.13]} s={[0.05, 0.02, 0.02]} c="#333" cast={false} />
        <B p={[0.08, 0.05, 0.13]} s={[0.05, 0.02, 0.02]} c="#333" cast={false} />
        {/* Nose */}
        <B p={[0, 0, 0.16]} s={[0.04, 0.03, 0.02]} c={pink} cast={false} />
        {/* Whiskers (Left) */}
        <group position={[-0.10, -0.02, 0.14]}>
          <mesh position={[-0.05, 0.03, 0]} rotation={[0, 0.2, -0.2]}><boxGeometry args={[0.1, 0.008, 0.008]} /><meshBasicMaterial color="#444" /></mesh>
          <mesh position={[-0.06, 0, 0]} rotation={[0, 0.2, 0]}><boxGeometry args={[0.1, 0.008, 0.008]} /><meshBasicMaterial color="#444" /></mesh>
          <mesh position={[-0.05, -0.03, 0]} rotation={[0, 0.2, 0.2]}><boxGeometry args={[0.1, 0.008, 0.008]} /><meshBasicMaterial color="#444" /></mesh>
        </group>
        {/* Whiskers (Right) */}
        <group position={[0.10, -0.02, 0.14]}>
          <mesh position={[0.05, 0.03, 0]} rotation={[0, -0.2, 0.2]}><boxGeometry args={[0.1, 0.008, 0.008]} /><meshBasicMaterial color="#444" /></mesh>
          <mesh position={[0.06, 0, 0]} rotation={[0, -0.2, 0]}><boxGeometry args={[0.1, 0.008, 0.008]} /><meshBasicMaterial color="#444" /></mesh>
          <mesh position={[0.05, -0.03, 0]} rotation={[0, -0.2, -0.2]}><boxGeometry args={[0.1, 0.008, 0.008]} /><meshBasicMaterial color="#444" /></mesh>
        </group>
      </group>

      {/* Tail (Curved and sticking backwards) */}
      {/* Base joint at the back of the body (z=-0.2) */}
      <group position={[0, 0.22, -0.20]} rotation={[-0.4, 0, 0]}>
        {/* First segment (anchored at bottom) */}
        <B p={[0, 0.08, 0]} s={[0.06, 0.16, 0.06]} c={orange} />
        <B p={[0, 0.08, 0]} s={[0.07, 0.06, 0.07]} c={darkOrange} cast={false} />
        {/* Second segment (anchored at top of first segment) */}
        <group position={[0, 0.16, 0]} rotation={[-0.4, 0, 0]}>
          <B p={[0, 0.08, 0]} s={[0.06, 0.16, 0.06]} c={orange} />
          <B p={[0, 0.10, 0]} s={[0.07, 0.08, 0.07]} c={darkOrange} cast={false} />
        </group>
      </group>

      {/* Legs & White Socks */}
      {/* Front Left */}
      <group position={[-0.1, 0.1, 0.15]}>
        <B p={[0, 0.05, 0]} s={[0.08, 0.15, 0.08]} c={orange} />
        <B p={[0, -0.05, 0]} s={[0.085, 0.08, 0.085]} c={white} />
      </group>
      {/* Front Right */}
      <group position={[0.1, 0.1, 0.15]}>
        <B p={[0, 0.05, 0]} s={[0.08, 0.15, 0.08]} c={orange} />
        <B p={[0, -0.05, 0]} s={[0.085, 0.08, 0.085]} c={white} />
      </group>
      {/* Back Left */}
      <group position={[-0.1, 0.1, -0.15]}>
        <B p={[0, 0.05, 0]} s={[0.08, 0.15, 0.08]} c={orange} />
        <B p={[0, -0.05, 0]} s={[0.085, 0.08, 0.085]} c={white} />
      </group>
      {/* Back Right */}
      <group position={[0.1, 0.1, -0.15]}>
        <B p={[0, 0.05, 0]} s={[0.08, 0.15, 0.08]} c={orange} />
        <B p={[0, -0.05, 0]} s={[0.085, 0.08, 0.085]} c={white} />
      </group>
    </group>
  );
}

function CuteChair({ p, ry = 0, c = "#ff9a62" }: { p: Vec3; ry?: number; c?: string }) {
  // A properly structured chair using sharp B components
  return (
    <group position={p} rotation={[0, ry, 0]}>
      {/* Seat */}
      <B p={[0, 0.45, 0]} s={[0.5, 0.08, 0.5]} c={c} />
      {/* Legs */}
      <B p={[-0.2, 0.26, -0.2]} s={[0.08, 0.45, 0.08]} c="#8c613e" />
      <B p={[0.2, 0.26, -0.2]} s={[0.08, 0.45, 0.08]} c="#8c613e" />
      <B p={[-0.2, 0.26, 0.2]} s={[0.08, 0.45, 0.08]} c="#8c613e" />
      <B p={[0.2, 0.26, 0.2]} s={[0.08, 0.45, 0.08]} c="#8c613e" />
      {/* Backrest (placed at +z, meaning the person faces -z) */}
      <B p={[0, 0.85, 0.2]} s={[0.5, 0.35, 0.08]} c={c} />
      <B p={[-0.15, 0.6, 0.2]} s={[0.06, 0.3, 0.06]} c="#8c613e" />
      <B p={[0.15, 0.6, 0.2]} s={[0.06, 0.3, 0.06]} c="#8c613e" />
    </group>
  );
}

import { Shape } from 'three';

function ClaudeLogo({ p, scale = 1 }: { p: Vec3; scale?: number }) {
  const shape = useMemo(() => {
    const s = new Shape();
    const points = 12;
    const outerRadius = 1;
    const innerRadius = 0.15;
    for (let i = 0; i < points * 2; i++) {
      const angle = (i * Math.PI) / points;
      const r = i % 2 === 0 ? outerRadius : innerRadius;
      const x = Math.sin(angle) * r;
      const y = Math.cos(angle) * r;
      if (i === 0) s.moveTo(x, y);
      else s.lineTo(x, y);
    }
    s.closePath();
    return s;
  }, []);

  return (
    <group position={p} scale={scale}>
      <mesh castShadow={false}>
        <extrudeGeometry args={[shape, { depth: 0.05, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 4, curveSegments: 24 }]} />
        <meshToonMaterial color="#d97757" gradientMap={toonGradient(3)} />
      </mesh>
    </group>
  );
}

function Laptop({ p, ry = 0, c = "#e0e0e0", sc = "#ff9a62" }: { p: Vec3; ry?: number; c?: string; sc?: string }) {
  return (
    <group position={p} rotation={[0, ry, 0]}>
      {/* Base */}
      <B p={[0, 0.02, 0.1]} s={[0.6, 0.04, 0.4]} c={c} />
      {/* Keyboard indent */}
      <B p={[0, 0.03, 0.1]} s={[0.5, 0.02, 0.2]} c="#a0a0a0" cast={false} />
      {/* Trackpad */}
      <B p={[0, 0.03, 0.25]} s={[0.15, 0.02, 0.08]} c="#c0c0c0" cast={false} />
      {/* Screen (tilted back slightly) */}
      <group position={[0, 0.04, -0.08]} rotation={[-0.2, 0, 0]}>
        <B p={[0, 0.2, 0]} s={[0.6, 0.4, 0.04]} c={c} />
        {/* Glow Screen */}
        <Screen p={[0, 0.2, 0.03]} s={[0.55, 0.35]} c={sc} />
      </group>
    </group>
  );
}

function GamingChair({ p, ry = 0, c1 = "#1a1a1a", c2 = "#ff4a4a" }: { p: Vec3; ry?: number; c1?: string; c2?: string }) {
  return (
    <group position={p} rotation={[0, ry, 0]}>
      <B p={[0, 0.1, 0]} s={[0.4, 0.05, 0.4]} c="#333" />
      <B p={[0, 0.25, 0]} s={[0.06, 0.3, 0.06]} c="#555" />
      <B p={[0, 0.45, 0]} s={[0.45, 0.1, 0.45]} c={c1} />
      <B p={[-0.2, 0.48, 0]} s={[0.08, 0.1, 0.45]} c={c2} />
      <B p={[0.2, 0.48, 0]} s={[0.08, 0.1, 0.45]} c={c2} />
      <B p={[0, 0.9, 0.2]} s={[0.4, 0.8, 0.1]} c={c1} />
      <B p={[-0.15, 0.9, 0.22]} s={[0.08, 0.7, 0.05]} c={c2} />
      <B p={[0.15, 0.9, 0.22]} s={[0.08, 0.7, 0.05]} c={c2} />
      <B p={[0, 1.25, 0.24]} s={[0.25, 0.12, 0.08]} c={c2} />
      <B p={[-0.25, 0.65, 0]} s={[0.05, 0.05, 0.25]} c="#333" />
      <B p={[-0.25, 0.55, 0.05]} s={[0.03, 0.2, 0.03]} c="#555" />
      <B p={[0.25, 0.65, 0]} s={[0.05, 0.05, 0.25]} c="#333" />
      <B p={[0.25, 0.55, 0.05]} s={[0.03, 0.2, 0.03]} c="#555" />
    </group>
  );
}

function Trophy({ p, s = 1 }: { p: Vec3; s?: number }) {
  return (
    <group position={p} scale={s}>
      {/* Wide pedestal base — marble dark */}
      <B p={[0, 0.02, 0]} s={[0.26, 0.04, 0.18]} c="#2a2a2a" />
      {/* Pedestal top — gold trim */}
      <B p={[0, 0.06, 0]} s={[0.22, 0.02, 0.15]} c="#ffd700" />
      {/* Stem */}
      <B p={[0, 0.15, 0]} s={[0.05, 0.14, 0.05]} c="#ffd700" />
      {/* Cup body */}
      <B p={[0, 0.28, 0]} s={[0.22, 0.18, 0.16]} c="#ffd700" />
      {/* Cup inner */}
      <B p={[0, 0.32, 0]} s={[0.17, 0.12, 0.11]} c="#ffec80" cast={false} />
      {/* Left handle */}
      <B p={[-0.14, 0.28, 0]} s={[0.05, 0.12, 0.04]} c="#e6c200" />
      {/* Right handle */}
      <B p={[0.14, 0.28, 0]} s={[0.05, 0.12, 0.04]} c="#e6c200" />
      {/* Star on the front */}
      <B p={[0, 0.28, 0.09]} s={[0.06, 0.06, 0.01]} c="#ffffff" cast={false} />
    </group>
  );
}

function StarAward({ p, s = 1 }: { p: Vec3; s?: number }) {
  return (
    <group position={p} scale={s}>
      {/* Base plate */}
      <B p={[0, 0.02, 0]} s={[0.18, 0.04, 0.12]} c="#333" />
      {/* Pillar */}
      <B p={[0, 0.12, 0]} s={[0.04, 0.14, 0.04]} c="#c0c0c0" />
      {/* Star body (made of crossed boxes) */}
      <B p={[0, 0.26, 0]} s={[0.18, 0.06, 0.06]} c="#ffd700" />
      <B p={[0, 0.26, 0]} s={[0.06, 0.18, 0.06]} c="#ffd700" />
      {/* Star center gem */}
      <B p={[0, 0.26, 0.04]} s={[0.04, 0.04, 0.02]} c="#ff4a4a" cast={false} />
    </group>
  );
}

function StackOfCash({ p, s = 1 }: { p: Vec3; s?: number }) {
  return (
    <group position={p} scale={s}>
      {/* Bottom bill */}
      <B p={[0, 0.02, 0]} s={[0.28, 0.04, 0.16]} c="#6aaa55" />
      <B p={[0, 0.02, 0]} s={[0.06, 0.045, 0.165]} c="#ffffff" cast={false} />
      {/* Middle bill (slight offset) */}
      <B p={[0.02, 0.06, 0.01]} s={[0.28, 0.04, 0.16]} c="#7cc368" />
      <B p={[0.02, 0.06, 0.01]} s={[0.06, 0.045, 0.165]} c="#ffffff" cast={false} />
      {/* Top bill */}
      <B p={[-0.01, 0.10, -0.01]} s={[0.28, 0.04, 0.16]} c="#85bb65" />
      <B p={[-0.01, 0.10, -0.01]} s={[0.06, 0.045, 0.165]} c="#ffffff" cast={false} />
      {/* Gold coin on top */}
      <B p={[0.08, 0.15, 0.02]} s={[0.08, 0.08, 0.02]} c="#ffd700" />
      <B p={[0.08, 0.15, 0.03]} s={[0.05, 0.05, 0.01]} c="#e6c200" cast={false} />
    </group>
  );
}

function Gamepad({ p, s = 1 }: { p: Vec3; s?: number }) {
  return (
    <group position={p} scale={s} rotation={[0.35, 0.15, 0]}>
      {/* Controller body */}
      <B p={[0, 0, 0]} s={[0.32, 0.06, 0.18]} c="#2d2d2d" />
      {/* Left grip */}
      <B p={[-0.17, -0.01, 0.06]} s={[0.1, 0.08, 0.16]} c="#2d2d2d" />
      {/* Right grip */}
      <B p={[0.17, -0.01, 0.06]} s={[0.1, 0.08, 0.16]} c="#2d2d2d" />
      {/* D-pad (cross) */}
      <B p={[-0.1, 0.035, -0.02]} s={[0.07, 0.02, 0.02]} c="#555" cast={false} />
      <B p={[-0.1, 0.035, -0.02]} s={[0.02, 0.02, 0.07]} c="#555" cast={false} />
      {/* Face buttons — coloured */}
      <B p={[0.12, 0.035, -0.05]} s={[0.025, 0.025, 0.025]} c="#ff4a4a" cast={false} />
      <B p={[0.08, 0.035, -0.03]} s={[0.025, 0.025, 0.025]} c="#56c2b0" cast={false} />
      <B p={[0.16, 0.035, -0.03]} s={[0.025, 0.025, 0.025]} c="#ffd479" cast={false} />
      <B p={[0.12, 0.035, -0.01]} s={[0.025, 0.025, 0.025]} c="#8ab4f8" cast={false} />
      {/* Center light bar */}
      <B p={[0, 0.035, -0.03]} s={[0.06, 0.015, 0.015]} c="#56c2b0" cast={false} />
    </group>
  );
}

function GoldMedal({ p, s = 1 }: { p: Vec3; s?: number }) {
  return (
    <group position={p} scale={s}>
      {/* Ribbon (V-shape made of two strips) */}
      <B p={[-0.03, 0.2, 0]} s={[0.06, 0.12, 0.02]} c="#ff4a4a" />
      <B p={[0.03, 0.2, 0]} s={[0.06, 0.12, 0.02]} c="#ff4a4a" />
      {/* Medal disc */}
      <B p={[0, 0.08, 0]} s={[0.14, 0.14, 0.03]} c="#ffd700" />
      {/* Medal inner circle */}
      <B p={[0, 0.08, 0.02]} s={[0.1, 0.1, 0.01]} c="#ffec80" cast={false} />
      {/* Number 1 on medal */}
      <B p={[0, 0.08, 0.025]} s={[0.02, 0.06, 0.01]} c="#e6c200" cast={false} />
    </group>
  );
}

function CodeBook({ p, s = 1 }: { p: Vec3; s?: number }) {
  return (
    <group position={p} scale={s} rotation={[0, -0.15, 0.05]}>
      {/* Book spine + cover */}
      <B p={[0, 0.07, 0]} s={[0.22, 0.14, 0.28]} c="#56c2b0" />
      {/* Pages */}
      <B p={[0.02, 0.07, 0]} s={[0.2, 0.12, 0.27]} c="#fffaf2" cast={false} />
      {/* Cover label */}
      <B p={[-0.02, 0.07, 0]} s={[0.01, 0.08, 0.18]} c="#ffffff" cast={false} />
      {/* Spine accent */}
      <B p={[-0.115, 0.07, 0]} s={[0.01, 0.14, 0.28]} c="#3aa08e" cast={false} />
    </group>
  );
}

function PlantPot({ p, s = 1 }: { p: Vec3; s?: number }) {
  return (
    <group position={p} scale={s}>
      {/* Terracotta pot */}
      <B p={[0, 0.06, 0]} s={[0.16, 0.12, 0.16]} c="#e07a5f" />
      {/* Pot rim */}
      <B p={[0, 0.13, 0]} s={[0.18, 0.02, 0.18]} c="#d4654a" />
      {/* Dirt */}
      <B p={[0, 0.14, 0]} s={[0.13, 0.01, 0.13]} c="#6b4e3d" cast={false} />
      {/* Main leaves */}
      <B p={[0, 0.22, 0]} s={[0.14, 0.14, 0.14]} c="#7fd093" />
      <B p={[-0.06, 0.18, 0.06]} s={[0.1, 0.1, 0.1]} c="#52b788" />
      <B p={[0.06, 0.2, -0.04]} s={[0.1, 0.12, 0.1]} c="#40916c" />
    </group>
  );
}

function CrystalBall({ p, s = 1 }: { p: Vec3; s?: number }) {
  return (
    <group position={p} scale={s}>
      {/* Base */}
      <B p={[0, 0.02, 0]} s={[0.14, 0.04, 0.14]} c="#4a3224" />
      {/* Crystal ball */}
      <B p={[0, 0.12, 0]} s={[0.12, 0.12, 0.12]} c="#c7a6e6" />
      {/* Inner glow */}
      <B p={[0, 0.13, 0.02]} s={[0.06, 0.06, 0.06]} c="#e0d0f0" cast={false} />
    </group>
  );
}

function ProjectShelf({ p, ry = 0, scale = 1 }: { p: Vec3; ry?: number; scale?: number }) {
  return (
    <group position={p} rotation={[0, ry, 0]} scale={scale}>
      {/* Back panel — z=0 is flush against the wall */}
      <B p={[0, 0.85, 0]} s={[1.5, 1.7, 0.08]} c="#704e33" />
      {/* Left side panel */}
      <B p={[-0.72, 0.85, 0.18]} s={[0.08, 1.7, 0.4]} c="#8c613e" />
      {/* Right side panel */}
      <B p={[0.72, 0.85, 0.18]} s={[0.08, 1.7, 0.4]} c="#8c613e" />
      {/* Top panel */}
      <B p={[0, 1.65, 0.18]} s={[1.5, 0.08, 0.4]} c="#8c613e" />
      {/* Bottom panel */}
      <B p={[0, 0.04, 0.18]} s={[1.5, 0.08, 0.4]} c="#8c613e" />
      {/* Middle shelf */}
      <B p={[0, 0.56, 0.18]} s={[1.36, 0.06, 0.38]} c="#a67b51" />
      {/* Upper shelf */}
      <B p={[0, 1.12, 0.18]} s={[1.36, 0.06, 0.38]} c="#a67b51" />
      
      {/* === Top shelf items (y=1.15 to sit on upper shelf) === */}
      <Trophy p={[-0.4, 1.15, 0.15]} s={0.9} />
      <StarAward p={[0.1, 1.15, 0.18]} s={0.85} />
      <CodeBook p={[0.5, 1.15, 0.15]} s={0.9} />

      {/* === Middle shelf items (y=0.59 to sit on middle shelf) === */}
      <GoldMedal p={[-0.4, 0.59, 0.18]} s={1.0} />
      <StackOfCash p={[0.05, 0.59, 0.15]} s={0.85} />
      <Gamepad p={[0.5, 0.59, 0.15]} s={0.85} />

      {/* === Bottom shelf items (y=0.08 to sit on bottom panel) === */}
      <PlantPot p={[-0.4, 0.08, 0.15]} s={1.0} />
      <CrystalBall p={[0.1, 0.08, 0.18]} s={1.1} />
      <StackOfCash p={[0.5, 0.08, 0.15]} s={0.7} />
    </group>
  );
}

function HangingHeadphones({ p, ry = 0 }: { p: Vec3; ry?: number }) {
  return (
    <group position={p} rotation={[0, ry, 0]}>
      <B p={[0, 0, 0]} s={[0.1, 0.05, 0.15]} c="#fffaf2" />
      <group position={[0, -0.1, 0.05]}>
        <B p={[0, 0.1, 0]} s={[0.2, 0.04, 0.06]} c="#333" />
        <B p={[-0.1, 0, 0]} s={[0.04, 0.2, 0.06]} c="#333" />
        <B p={[0.1, 0, 0]} s={[0.04, 0.2, 0.06]} c="#333" />
        <B p={[-0.12, -0.15, 0]} s={[0.08, 0.15, 0.12]} c="#ff4a4a" />
        <B p={[0.12, -0.15, 0]} s={[0.08, 0.15, 0.12]} c="#ff4a4a" />
        <B p={[-0.08, -0.15, 0]} s={[0.04, 0.14, 0.1]} c="#111" />
        <B p={[0.08, -0.15, 0]} s={[0.04, 0.14, 0.1]} c="#111" />
      </group>
    </group>
  );
}

export function Furniture({ id }: { id: string }) {
  const g = toonGradient(3);
  switch (id) {
    case 'about':
      return (
        <>
          <Desk pos={[-0.4, 0.06, -2.45]} />
          {/* chair (facing the desk, tucked in close to the desk) */}
          <CuteChair p={[-0.4, 0.06, -1.65]} ry={0.15} c="#ff9a62" />

          {/* bookshelf — click to read "About me" */}
          <Hotspot room="about" act={() => useAppStore.getState().openRoomPanel('about')} hintOffset={[2.0, 2.8, -2.8]}>
            {/* Bookshelf structure (Back board, Side panels, Top/Bottom) */}
            {/* Shifted up by 0.04 to clear the floor rounding */}
            <B p={[2.0, 1.30, -3.03]} s={[1.4, 2.4, 0.1]} c="#704e33" />
            <B p={[1.35, 1.30, -2.88]} s={[0.1, 2.4, 0.3]} c="#8c613e" />
            <B p={[2.65, 1.30, -2.88]} s={[0.1, 2.4, 0.3]} c="#8c613e" />
            <B p={[2.0, 2.45, -2.88]} s={[1.4, 0.1, 0.3]} c="#8c613e" />
            <B p={[2.0, 0.15, -2.88]} s={[1.4, 0.1, 0.3]} c="#8c613e" />
            {/* 2 inner Shelves */}
            <B p={[2.0, 0.90, -2.88]} s={[1.2, 0.08, 0.28]} c="#a67b51" />
            <B p={[2.0, 1.70, -2.88]} s={[1.2, 0.08, 0.28]} c="#a67b51" />
            
            {/* Books on the shelves */}
            {([
              // Bottom shelf
              ['#56c2b0', -0.4, 0.38], ['#ff9a62', -0.25, 0.38], ['#c7a6e6', -0.1, 0.38],
              // Middle shelf
              ['#ffd479', 0.2, 1.12], ['#7fd093', 0.35, 1.12], ['#ff6b6b', 0.5, 1.12],
              // Top shelf
              ['#8ab4f8', -0.3, 1.92], ['#f7eed8', -0.15, 1.92]
            ] as const).map(
              ([c, x, y], i) => (
                <mesh key={`book-${i}`} position={[2.0 + (x as number), y as number, -2.83]} castShadow>
                  <boxGeometry args={[0.12, 0.36, 0.22]} />
                  <meshToonMaterial color={c as string} gradientMap={g} />
                </mesh>
              ),
            )}
            
            {/* little "About me" name plate leaning on the middle shelf */}
            <B p={[1.7, 1.06, -2.73]} s={[0.6, 0.2, 0.05]} c="#56c2b0" cast={false} />
          </Hotspot>

          {/* White floating shelf with Certificates above the bookshelf */}
          <group position={[2.0, 2.9, -2.98]}>
            {/* The white shelf */}
            <B p={[0, 0, 0]} s={[1.2, 0.06, 0.2]} c="#ffffff" />
            
            {/* Certificate 1 (left) */}
            <group position={[-0.25, 0.25, -0.05]} rotation={[-0.1, 0, -0.05]}>
              <B p={[0, 0, 0]} s={[0.35, 0.45, 0.03]} c="#e6bb7c" /> {/* Frame */}
              <B p={[0, 0, 0.02]} s={[0.28, 0.38, 0.01]} c="#ffffff" /> {/* Paper */}
              {/* Little gold seal */}
              <mesh position={[0.08, -0.12, 0.03]}>
                <cylinderGeometry args={[0.04, 0.04, 0.01, 16]} />
                <meshToonMaterial color="#ff4a4a" />
              </mesh>
            </group>

            {/* Certificate 2 (right) */}
            <group position={[0.25, 0.28, -0.05]} rotation={[-0.15, 0, 0.08]}>
              <B p={[0, 0, 0]} s={[0.45, 0.35, 0.03]} c="#8b6540" /> {/* Frame (landscape) */}
              <B p={[0, 0, 0.02]} s={[0.38, 0.28, 0.01]} c="#ffffff" /> {/* Paper */}
              {/* Little ribbon */}
              <mesh position={[-0.12, -0.08, 0.03]}>
                <cylinderGeometry args={[0.03, 0.03, 0.01, 16]} />
                <meshToonMaterial color="#56c2b0" />
              </mesh>
            </group>
          </group>

          {/* plant (moved to the corner next to the desk) */}
          <group position={[-2.1, 0.06, -2.6]}>
            <B p={[0, 0.15, 0]} s={[0.3, 0.3, 0.3]} c="#caa57f" /> {/* Pot */}
            <B p={[0, 0.5, 0]} s={[0.5, 0.5, 0.5]} c="#7fd093" /> {/* Leaves */}
            <B p={[0.15, 0.7, 0.1]} s={[0.3, 0.3, 0.3]} c="#7fd093" /> {/* Extra Leaves */}
            <B p={[-0.15, 0.65, -0.1]} s={[0.25, 0.25, 0.25]} c="#7fd093" />
          </group>

          {/* framed picture (Claude Icon) */}
          <group position={[-0.4, 2.0, -3.02]}>
            {/* Frame & Dark Background */}
            <B p={[0, 0, 0]} s={[0.95, 0.95, 0.06]} c="#ffd479" cast={false} />
            <B p={[0, 0, 0.02]} s={[0.85, 0.85, 0.04]} c="#1b1a19" cast={false} />
            {/* Claude Sparkle Logo (Precision Shape) */}
            <ClaudeLogo p={[0, 0, 0.02]} scale={0.32} />
          </group>
          
          {/* small props: mug */}
          <Mug p={[-1.0, 1.21, -2.68]} c="#ff9a62" />

          {/* Cat Area (Moved away from the desk to the open space front-right) */}
          <group position={[1.5, 0, 0.5]}>
            {/* The Cat (ry=0.78 perfectly faces the camera at the open [1,1] corner) */}
            <CuteCat p={[0, 0.06, 0]} ry={0.78} />
            
            {/* Toy Ball (Spread out to the left front) */}
            <B p={[0.2, 0.16, 0.6]} s={[0.12, 0.12, 0.12]} c="#ff4a4a" cast={true} />
            
            {/* Toy Mouse (Spread out to the right front, rotation=-2.35 to face the cat/camera) */}
            <group position={[0.6, 0.15, 0.2]} rotation={[0, -2.35, 0]}>
              <B p={[0, 0, 0]} s={[0.15, 0.08, 0.08]} c="#c2d1f0" /> {/* Mouse Body */}
              <B p={[-0.05, 0.05, -0.04]} s={[0.04, 0.04, 0.02]} c="#ff94b8" cast={false} /> {/* Ear */}
              <B p={[-0.05, 0.05, 0.04]} s={[0.04, 0.04, 0.02]} c="#ff94b8" cast={false} /> {/* Ear */}
              <B p={[0.1, 0, 0]} s={[0.12, 0.02, 0.02]} c="#8c7b6c" cast={false} /> {/* Tail */}
            </group>
          </group>

          {/* Litter Box (Moved up slightly to clear floor rounding) */}
          <group position={[-2.2, 0.10, 1.2]} rotation={[0, 0.4, 0]}>
            <B p={[0, 0.1, 0]} s={[0.8, 0.2, 0.6]} c="#56c2b0" /> {/* Box outer */}
            <B p={[0, 0.15, 0]} s={[0.7, 0.12, 0.5]} c="#fdf3e7" cast={false} /> {/* Sand */}
            {/* Little poop scoop stuck in the sand */}
            <group position={[0.2, 0.27, 0]} rotation={[0.2, 0.5, -0.3]}>
              <B p={[0, 0, 0]} s={[0.02, 0.25, 0.05]} c="#ff9a62" />
              <B p={[0, -0.1, 0]} s={[0.1, 0.15, 0.1]} c="#ff9a62" />
            </group>
          </group>
        </>
      );

    case 'work':
      return (
        <>
          {/* Project Shelf — pushed deep to match About Me bookshelf visual flush (z=-2.85, back panel reaches building wall) */}
          <Hotspot room="work" act={() => useAppStore.getState().openRoomPanel('work')} hintOffset={[1.9, 2.0, -2.6]}>
            <ProjectShelf p={[1.9, 0.06, -3.0]} ry={0} />
          </Hotspot>

          {/* Desk — flush to back wall z=-2.45 (same as About Me desk), on floor y=0.06 */}
          <Desk pos={[-0.8, 0.06, -2.45]} color="#b9905f" />
          
          {/* Laptops on the desk */}
          <Laptop p={[-1.35, 1.12, -2.45]} ry={0.15} c="#e0e0e0" sc="#ff9a62" />
          <Laptop p={[-0.15, 1.12, -2.45]} ry={-0.15} c="#333333" sc="#56c2b0" />

          {/* Gaming Chair facing desk */}
          <GamingChair p={[-0.8, 0.06, -1.45]} ry={0} c1="#1a1a1a" c2="#56c2b0" />

          {/* Hanging Headphones on the back wall */}
          <HangingHeadphones p={[-0.8, 2.2, -2.98]} ry={0} />
        </>
      );

    case 'tech':
      return (
        <>
          {/* ===== TECH PEGBOARD — recognizable tool icons ===== */}
          <Hotspot room="tech" act={() => useAppStore.getState().openRoomPanel('tech')} hintOffset={[-0.5, 3.2, -2.44]}>
            {/* Board background */}
            <B p={[-0.5, 2.1, -RD / 2 + 0.05]} s={[3.8, 1.6, 0.06]} c="#3d281c" cast={false} />
            {/* Board trim */}
            <B p={[-0.5, 2.85, -RD / 2 + 0.06]} s={[3.9, 0.06, 0.08]} c="#ffd479" cast={false} />
            <B p={[-0.5, 1.35, -RD / 2 + 0.06]} s={[3.9, 0.06, 0.08]} c="#ffd479" cast={false} />

            {/* --- React (Atom icon: circle + 3 orbits) --- */}
            <group position={[-2.0, 2.4, -RD / 2 + 0.14]}>
              {/* Nucleus */}
              <mesh><sphereGeometry args={[0.08, 12, 12]} /><meshStandardMaterial color="#61dafb" emissive="#61dafb" emissiveIntensity={0.8} toneMapped={false} /></mesh>
              {/* Orbit rings (3 crossed ellipses) */}
              <B p={[0, 0, 0]} s={[0.5, 0.04, 0.04]} c="#61dafb" cast={false} />
              <group rotation={[0, 0, Math.PI / 3]}><B p={[0, 0, 0]} s={[0.5, 0.04, 0.04]} c="#61dafb" cast={false} /></group>
              <group rotation={[0, 0, -Math.PI / 3]}><B p={[0, 0, 0]} s={[0.5, 0.04, 0.04]} c="#61dafb" cast={false} /></group>
              {/* Label plate */}
              <B p={[0, -0.35, -0.04]} s={[0.5, 0.14, 0.03]} c="#1a1a2e" cast={false} />
            </group>

            {/* --- Node.js (Green hexagon shape) --- */}
            <group position={[-1.0, 2.4, -RD / 2 + 0.14]}>
              {/* Hexagon approximation */}
              <B p={[0, 0, 0]} s={[0.4, 0.45, 0.06]} c="#68a063" />
              <B p={[0, 0, 0.01]} s={[0.35, 0.4, 0.04]} c="#3c873a" cast={false} />
              {/* N letter */}
              <B p={[-0.06, 0, 0.04]} s={[0.04, 0.22, 0.02]} c="#ffffff" cast={false} />
              <B p={[0.06, 0, 0.04]} s={[0.04, 0.22, 0.02]} c="#ffffff" cast={false} />
              <group rotation={[0, 0, 0.35]}><B p={[0, 0, 0.04]} s={[0.04, 0.25, 0.02]} c="#ffffff" cast={false} /></group>
              {/* Label */}
              <B p={[0, -0.35, -0.04]} s={[0.5, 0.14, 0.03]} c="#1a1a2e" cast={false} />
            </group>

            {/* --- AI / Brain icon --- */}
            <group position={[0, 2.4, -RD / 2 + 0.14]}>
              {/* Brain shape (two rounded halves) */}
              <B p={[-0.08, 0.05, 0]} s={[0.2, 0.3, 0.1]} c="#c7a6e6" />
              <B p={[0.08, 0.05, 0]} s={[0.2, 0.3, 0.1]} c="#c7a6e6" />
              <B p={[-0.1, 0.15, 0.02]} s={[0.15, 0.15, 0.08]} c="#d4b8f0" cast={false} />
              <B p={[0.1, 0.15, 0.02]} s={[0.15, 0.15, 0.08]} c="#d4b8f0" cast={false} />
              {/* Neural connections */}
              <B p={[0, 0, 0.06]} s={[0.04, 0.25, 0.02]} c="#ff9a62" cast={false} />
              <B p={[0, 0.05, 0.06]} s={[0.25, 0.04, 0.02]} c="#ff9a62" cast={false} />
              {/* Spark */}
              <mesh position={[0, 0.25, 0.06]}><sphereGeometry args={[0.04, 10, 10]} /><meshStandardMaterial color="#ffd479" emissive="#ffd479" emissiveIntensity={1.2} toneMapped={false} /></mesh>
              {/* Label */}
              <B p={[0, -0.35, -0.04]} s={[0.5, 0.14, 0.03]} c="#1a1a2e" cast={false} />
            </group>

            {/* --- Roblox (Tilted cube with O) --- */}
            <group position={[1.0, 2.4, -RD / 2 + 0.14]}>
              <group rotation={[0.3, 0.5, 0.2]}>
                <B p={[0, 0, 0]} s={[0.3, 0.3, 0.3]} c="#e2231a" />
                {/* O hole */}
                <B p={[0, 0, 0.16]} s={[0.12, 0.12, 0.02]} c="#ffffff" cast={false} />
                <B p={[0, 0, 0.17]} s={[0.06, 0.06, 0.02]} c="#e2231a" cast={false} />
              </group>
              {/* Label */}
              <B p={[0, -0.35, -0.04]} s={[0.5, 0.14, 0.03]} c="#1a1a2e" cast={false} />
            </group>

            {/* --- Tailwind (Wind swooshes) --- */}
            <group position={[2.0, 2.4, -RD / 2 + 0.14]}>
              <B p={[0, 0.1, 0]} s={[0.45, 0.06, 0.06]} c="#38bdf8" />
              <B p={[0.08, 0, 0]} s={[0.35, 0.06, 0.06]} c="#38bdf8" />
              <B p={[-0.04, -0.1, 0]} s={[0.4, 0.06, 0.06]} c="#38bdf8" />
              {/* Rounded ends */}
              <mesh position={[0.23, 0.1, 0]}><sphereGeometry args={[0.035, 10, 10]} /><meshToonMaterial color="#38bdf8" gradientMap={g} /></mesh>
              <mesh position={[0.26, 0, 0]}><sphereGeometry args={[0.035, 10, 10]} /><meshToonMaterial color="#38bdf8" gradientMap={g} /></mesh>
              <mesh position={[0.2, -0.1, 0]}><sphereGeometry args={[0.035, 10, 10]} /><meshToonMaterial color="#38bdf8" gradientMap={g} /></mesh>
              {/* Label */}
              <B p={[0, -0.35, -0.04]} s={[0.5, 0.14, 0.03]} c="#1a1a2e" cast={false} />
            </group>

            {/* --- Google Apps Script (Gear) --- bottom row */}
            <group position={[-1.5, 1.65, -RD / 2 + 0.14]}>
              <B p={[0, 0, 0]} s={[0.3, 0.3, 0.06]} c="#4285f4" />
              <B p={[0, 0, 0]} s={[0.35, 0.1, 0.06]} c="#4285f4" />
              <B p={[0, 0, 0]} s={[0.1, 0.35, 0.06]} c="#4285f4" />
              <group rotation={[0, 0, Math.PI / 4]}>
                <B p={[0, 0, 0]} s={[0.35, 0.1, 0.06]} c="#4285f4" />
                <B p={[0, 0, 0]} s={[0.1, 0.35, 0.06]} c="#4285f4" />
              </group>
              {/* Center hole */}
              <mesh position={[0, 0, 0.04]}><sphereGeometry args={[0.08, 12, 12]} /><meshToonMaterial color="#ffffff" gradientMap={g} /></mesh>
            </group>

            {/* --- Cybersecurity (Shield) --- bottom row */}
            <group position={[0, 1.65, -RD / 2 + 0.14]}>
              {/* Shield body */}
              <B p={[0, 0.05, 0]} s={[0.35, 0.35, 0.06]} c="#56c2b0" />
              <B p={[0, -0.1, 0]} s={[0.25, 0.15, 0.06]} c="#56c2b0" />
              {/* Lock icon */}
              <B p={[0, 0.06, 0.04]} s={[0.12, 0.12, 0.02]} c="#ffffff" cast={false} />
              <B p={[0, 0.14, 0.04]} s={[0.08, 0.08, 0.02]} c="#ffffff" cast={false} />
              <B p={[0, 0.06, 0.05]} s={[0.04, 0.04, 0.01]} c="#ffd479" cast={false} />
            </group>

            {/* --- Three.js / R3F (3D cube wireframe) --- bottom row */}
            <group position={[1.5, 1.65, -RD / 2 + 0.14]}>
              {/* Wireframe cube edges */}
              <B p={[0, 0.15, 0.15]} s={[0.3, 0.02, 0.02]} c="#ffffff" />
              <B p={[0, -0.15, 0.15]} s={[0.3, 0.02, 0.02]} c="#ffffff" />
              <B p={[0, 0.15, -0.15]} s={[0.3, 0.02, 0.02]} c="#cccccc" />
              <B p={[0, -0.15, -0.15]} s={[0.3, 0.02, 0.02]} c="#cccccc" />
              <B p={[0.15, 0, 0.15]} s={[0.02, 0.3, 0.02]} c="#ffffff" />
              <B p={[-0.15, 0, 0.15]} s={[0.02, 0.3, 0.02]} c="#ffffff" />
              <B p={[0.15, 0, -0.15]} s={[0.02, 0.3, 0.02]} c="#cccccc" />
              <B p={[-0.15, 0, -0.15]} s={[0.02, 0.3, 0.02]} c="#cccccc" />
              <B p={[0.15, 0.15, 0]} s={[0.02, 0.02, 0.3]} c="#ffffff" />
              <B p={[-0.15, 0.15, 0]} s={[0.02, 0.02, 0.3]} c="#ffffff" />
              <B p={[0.15, -0.15, 0]} s={[0.02, 0.02, 0.3]} c="#cccccc" />
              <B p={[-0.15, -0.15, 0]} s={[0.02, 0.02, 0.3]} c="#cccccc" />
            </group>
          </Hotspot>

          {/* ===== ARCADE CABINET ===== */}
          <Hotspot
            room="tech"
            act={() => {
              const first = games[0]?.id;
              if (first) useAppStore.getState().openGame(first);
            }}
            hintOffset={[1.7, 2.6, -2.15]}
          >
            <group position={[1.7, 0.06, -2.15]}>
              <B p={[0, 0.08, 0.05]} s={[1.1, 0.16, 0.85]} c="#2a2233" />
              <B p={[0, 0.95, 0]} s={[1.0, 1.6, 0.75]} c="#c7a6e6" />
              <B p={[-0.48, 0.95, 0]} s={[0.06, 1.5, 0.7]} c="#9b7cc4" cast={false} />
              <B p={[0.48, 0.95, 0]} s={[0.06, 1.5, 0.7]} c="#9b7cc4" cast={false} />
              <mesh position={[0, 1.5, 0.3]} rotation={[-0.3, 0, 0]} castShadow>
                <boxGeometry args={[0.88, 0.7, 0.1]} />
                <meshToonMaterial color="#1a1520" gradientMap={g} />
              </mesh>
              <Screen p={[0, 1.52, 0.36]} s={[0.76, 0.55]} c="#56c2b0" rot={[-0.3, 0, 0]} i={1.6} />
              <mesh position={[0, 1.05, 0.4]} rotation={[-0.5, 0, 0]} castShadow>
                <boxGeometry args={[0.9, 0.35, 0.08]} />
                <meshToonMaterial color="#2a2233" gradientMap={g} />
              </mesh>
              <B p={[-0.2, 1.1, 0.45]} s={[0.1, 0.04, 0.1]} c="#333" />
              <B p={[-0.2, 1.2, 0.44]} s={[0.04, 0.16, 0.04]} c="#555" />
              <mesh position={[-0.2, 1.3, 0.43]}><sphereGeometry args={[0.04, 12, 12]} /><meshToonMaterial color="#ff4a4a" gradientMap={g} /></mesh>
              <mesh position={[0.06, 1.12, 0.46]}><sphereGeometry args={[0.05, 14, 14]} /><meshStandardMaterial color="#ff4a4a" emissive="#ff4a4a" emissiveIntensity={1.2} toneMapped={false} /></mesh>
              <mesh position={[0.18, 1.12, 0.46]}><sphereGeometry args={[0.05, 14, 14]} /><meshStandardMaterial color="#ffd479" emissive="#ffd479" emissiveIntensity={1.2} toneMapped={false} /></mesh>
              <mesh position={[0.30, 1.12, 0.46]}><sphereGeometry args={[0.05, 14, 14]} /><meshStandardMaterial color="#56c2b0" emissive="#56c2b0" emissiveIntensity={1.2} toneMapped={false} /></mesh>
              <mesh position={[0.42, 1.12, 0.46]}><sphereGeometry args={[0.05, 14, 14]} /><meshStandardMaterial color="#8ab4f8" emissive="#8ab4f8" emissiveIntensity={1.2} toneMapped={false} /></mesh>
              <B p={[0, 1.92, 0.12]} s={[0.95, 0.25, 0.12]} c="#2a2233" />
              <mesh position={[0, 1.92, 0.19]}><boxGeometry args={[0.85, 0.2, 0.02]} /><meshStandardMaterial color="#ff9a62" emissive="#ff9a62" emissiveIntensity={1.0} toneMapped={false} /></mesh>
              <B p={[0, 0.5, 0.38]} s={[0.25, 0.15, 0.04]} c="#2a2233" />
              <B p={[0, 0.5, 0.41]} s={[0.1, 0.04, 0.02]} c="#ffd700" cast={false} />
              <B p={[-0.51, 0.95, 0.38]} s={[0.02, 1.6, 0.02]} c="#ffd479" cast={false} />
              <B p={[0.51, 0.95, 0.38]} s={[0.02, 1.6, 0.02]} c="#ffd479" cast={false} />
            </group>
          </Hotspot>

          {/* Bean bag (left side, where desk was) */}
          <mesh position={[-1.3, 0.35, -0.8]} castShadow>
            <sphereGeometry args={[0.55, 18, 14]} />
            <meshToonMaterial color="#ff9a62" gradientMap={g} />
          </mesh>
          <mesh position={[-1.3, 0.08, -0.8]} castShadow>
            <cylinderGeometry args={[0.58, 0.6, 0.16, 20]} />
            <meshToonMaterial color="#e88a55" gradientMap={g} />
          </mesh>

          {/* Bean bag (right side) */}
          <mesh position={[0.2, 0.28, 0.7]} castShadow>
            <sphereGeometry args={[0.45, 18, 14]} />
            <meshToonMaterial color="#7fd093" gradientMap={g} />
          </mesh>
          <mesh position={[0.2, 0.08, 0.7]} castShadow>
            <cylinderGeometry args={[0.48, 0.5, 0.16, 20]} />
            <meshToonMaterial color="#6ab882" gradientMap={g} />
          </mesh>

          {/* Dice stack */}
          <B p={[-1.0, 0.18, 0.6]} s={[0.24, 0.24, 0.24]} c="#ff9a62" />
          <B p={[-1.0, 0.18, 0.6]} s={[0.06, 0.06, 0.25]} c="#ffffff" cast={false} />
          <B p={[-0.98, 0.42, 0.62]} s={[0.2, 0.2, 0.2]} c="#ffd479" />
          <B p={[-0.98, 0.42, 0.62]} s={[0.05, 0.05, 0.21]} c="#ffffff" cast={false} />
        </>
      );

    case 'contact':
      return (
        <>
          <Desk pos={[0, 0, -1.4]} />
          {/* big envelope — click to get in touch */}
          <Hotspot room="contact" act={() => useAppStore.getState().openRoomPanel('contact')} hintOffset={[0, 2.0, -1.3]}>
            <B p={[0, 1.35, -1.4]} s={[1.1, 0.75, 0.06]} c="#fffaf2" />
            <mesh position={[0, 1.45, -1.36]} rotation={[0, 0, Math.PI / 4]}>
              <planeGeometry args={[0.55, 0.55]} />
              <meshToonMaterial color="#56c2b0" gradientMap={g} side={2} />
            </mesh>
          </Hotspot>
          {/* desk lamp */}
          <mesh position={[0.7, 1.18, -1.4]}>
            <cylinderGeometry args={[0.07, 0.09, 0.32, 12]} />
            <meshToonMaterial color="#caa57f" gradientMap={g} />
          </mesh>
          <mesh position={[0.7, 1.4, -1.4]}>
            <sphereGeometry args={[0.16, 14, 14]} />
            <meshStandardMaterial color="#ffe9b8" emissive="#ffd479" emissiveIntensity={1.3} toneMapped={false} />
          </mesh>
          {/* stool */}
          <mesh position={[0, 0.25, 0.2]} castShadow>
            <cylinderGeometry args={[0.26, 0.26, 0.5, 16]} />
            <meshToonMaterial color="#ff9a62" gradientMap={g} />
          </mesh>
          {/* little paper plane + a pen for that "drop me a line" charm */}
          <mesh position={[-0.85, 1.35, -1.1]} rotation={[0, 0.5, 0.3]} castShadow>
            <coneGeometry args={[0.12, 0.32, 4]} />
            <meshToonMaterial color="#fffaf2" gradientMap={g} />
          </mesh>
          <mesh position={[-0.3, 1.12, -1.0]} rotation={[0, 0, Math.PI / 2.2]}>
            <cylinderGeometry args={[0.02, 0.02, 0.34, 8]} />
            <meshToonMaterial color="#56c2b0" gradientMap={g} />
          </mesh>
        </>
      );

    case 'thanks':
      return (
        <>
          {/* armchair (solid block touching floor) */}
          <B p={[0, 0.35, -0.6]} s={[1.3, 0.7, 1.0]} c="#ff9a62" />
          <B p={[0, 1.0, -1.05]} s={[1.3, 0.7, 0.2]} c="#ff9a62" />
          <B p={[-0.65, 0.85, -0.6]} s={[0.2, 0.5, 1.0]} c="#ffb184" />
          <B p={[0.65, 0.85, -0.6]} s={[0.2, 0.5, 1.0]} c="#ffb184" />
          {/* "thank you" banner — click for the closing note */}
          <Hotspot room="thanks" act={() => useAppStore.getState().openRoomPanel('thanks')} hintOffset={[0, 3.0, -1.2]}>
            <B p={[0, 2.4, -RD / 2 + 0.06]} s={[2.4, 0.7, 0.06]} c="#f4a3c0" cast={false} />
            <Screen p={[0, 2.4, -RD / 2 + 0.1]} s={[2.2, 0.5]} c="#ffd479" i={0.5} />
          </Hotspot>
          {/* gift box */}
          <group position={[-1.9, 0, -0.5]}>
            <B p={[0, 0.3, 0]} s={[0.6, 0.6, 0.6]} c="#56c2b0" />
            <B p={[0, 0.62, 0]} s={[0.66, 0.12, 0.66]} c="#ffd479" />
            <B p={[0, 0.4, 0]} s={[0.1, 0.62, 0.62]} c="#ff9a62" cast={false} />
            {/* floating shelves */}
            <B p={[2.2, 1.6, -2.25]} s={[1.1, 0.08, 0.5]} c="#4a3224" cast={false} />
            <B p={[2.2, 0.8, -2.25]} s={[1.1, 0.08, 0.5]} c="#4a3224" cast={false} />
            <B p={[1.5, 0.2, -2.25]} s={[2.2, 0.4, 0.5]} c="#4a3224" cast={false} />
          </group>
          {/* a little celebration cupcake */}
          <group position={[1.9, 0.55, -0.4]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.2, 0.16, 0.22, 16]} />
              <meshToonMaterial color="#4a3224" gradientMap={g} />
            </mesh>
            <mesh position={[0, 0.18, 0]} castShadow>
              <sphereGeometry args={[0.22, 16, 12]} />
              <meshToonMaterial color="#f4a3c0" gradientMap={g} />
            </mesh>
            <mesh position={[0, 0.4, 0]}>
              <sphereGeometry args={[0.05, 10, 10]} />
              <meshStandardMaterial color="#ff4a4a" emissive="#ff4a4a" emissiveIntensity={0.5} toneMapped={false} />
            </mesh>
          </group>
          {/* balloons */}
          {([['#ff9a62', 1.7], ['#c7a6e6', 2.05]] as const).map(([c, x], i) => (
            <group key={i} position={[x, 0, -0.8]}>
              <mesh position={[0, 2.0, 0]} castShadow>
                <sphereGeometry args={[0.28, 16, 16]} />
                <meshToonMaterial color={c} gradientMap={g} />
              </mesh>
              <mesh position={[0, 1.2, 0]}>
                <cylinderGeometry args={[0.03, 0.03, 1.4, 8]} />
                <meshToonMaterial color="#9b8b7b" gradientMap={g} />
              </mesh>
            </group>
          ))}
        </>
      );

    default:
      return null;
  }
}

export function RoomInterior({ id }: { id: string }) {
  const accent = floorsById[id]?.accent ?? '#ff9a62';
  return (
    <group rotation={[0, -Math.PI / 4, 0]}>
      <Shell accent={accent} />
      <Furniture id={id} />
      <InteriorCameraRig />
    </group>
  );
}
