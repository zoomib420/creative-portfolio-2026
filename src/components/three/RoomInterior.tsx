import { useRef, useState, useMemo, type ReactNode } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import { Vector3, type Group } from 'three';
import { toonGradient } from '../../lib/toon';
import { floorsById } from '../../data/floors';
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
      {/* Keyboard indent — y offset clears base top face (0.04) to avoid Z-fighting */}
      <B p={[0, 0.043, 0.1]} s={[0.5, 0.006, 0.2]} c="#a0a0a0" cast={false} />
      {/* Trackpad */}
      <B p={[0, 0.043, 0.25]} s={[0.15, 0.006, 0.08]} c="#c0c0c0" cast={false} />
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

/**
 * Cute two-seater toon sofa — crisp sharp-cornered cushions (matches the room's
 * faceted look). Faces +z (toward the camera) by default; pass `ry` to turn it.
 */
function Sofa({ p, ry = 0, c = '#56c2b0', cushion = '#fff2d9', leg = '#4a3224', pillow = '#ff9a62' }: { p: Vec3; ry?: number; c?: string; cushion?: string; leg?: string; pillow?: string }) {
  return (
    <group position={p} rotation={[0, ry, 0]}>
      {/* seat plinth + backrest + arms (frame) */}
      <B p={[0, 0.35, 0]} s={[1.8, 0.3, 0.85]} c={c} />
      <B p={[0, 0.8, -0.34]} s={[1.8, 0.7, 0.22]} c={c} />
      <B p={[-0.82, 0.55, 0.02]} s={[0.22, 0.5, 0.82]} c={c} />
      <B p={[0.82, 0.55, 0.02]} s={[0.22, 0.5, 0.82]} c={c} />
      {/* seat cushions */}
      <B p={[-0.42, 0.57, 0.06]} s={[0.72, 0.16, 0.66]} c={cushion} />
      <B p={[0.42, 0.57, 0.06]} s={[0.72, 0.16, 0.66]} c={cushion} />
      {/* back cushions */}
      <B p={[-0.42, 0.84, -0.26]} s={[0.72, 0.44, 0.16]} c={cushion} cast={false} />
      <B p={[0.42, 0.84, -0.26]} s={[0.72, 0.44, 0.16]} c={cushion} cast={false} />
      {/* little throw pillow for charm */}
      <group position={[-0.42, 0.78, 0.08]} rotation={[0.2, 0, 0.5]}>
        <B p={[0, 0, 0]} s={[0.34, 0.34, 0.12]} c={pillow} cast={false} />
      </group>
      {/* stubby legs */}
      {([[-0.78, 0.34], [0.78, 0.34], [-0.78, -0.34], [0.78, -0.34]] as const).map(([x, z], i) => (
        <B key={i} p={[x, 0.1, z]} s={[0.12, 0.2, 0.12]} c={leg} cast={false} />
      ))}
    </group>
  );
}

/**
 * Slouchy bean bag — reads clearly as a bean bag: saggy faceted base that bulges
 * at the floor, a taller back lump to lean into, a sunken seat, a tie-knot on
 * top and a stitched seam. Low poly counts keep the crisp toon edges.
 */
function BeanBag({ p, c, c2, r = 0.55 }: { p: Vec3; c: string; c2: string; r?: number }) {
  const grad = toonGradient(3);
  return (
    <group position={p}>
      {/* main saggy body */}
      <mesh position={[0, r * 0.5, 0]} scale={[1, 0.62, 1]} castShadow>
        <sphereGeometry args={[r, 11, 8]} />
        <meshToonMaterial color={c} gradientMap={grad} />
      </mesh>
      {/* wider sag where it meets the floor */}
      <mesh position={[0, r * 0.22, 0]} scale={[1.14, 0.42, 1.14]} castShadow>
        <sphereGeometry args={[r, 11, 8]} />
        <meshToonMaterial color={c2} gradientMap={grad} />
      </mesh>
      {/* back lump to lean on */}
      <mesh position={[0, r * 0.72, -r * 0.4]} scale={[0.86, 0.98, 0.7]} castShadow>
        <sphereGeometry args={[r * 0.8, 11, 8]} />
        <meshToonMaterial color={c} gradientMap={grad} />
      </mesh>
      {/* sunken seat dimple */}
      <mesh position={[0, r * 0.62, r * 0.12]} rotation={[-0.32, 0, 0]} scale={[0.68, 0.26, 0.6]}>
        <sphereGeometry args={[r, 11, 8]} />
        <meshToonMaterial color={c2} gradientMap={grad} />
      </mesh>
      {/* stitched seam round the middle */}
      <mesh position={[0, r * 0.34, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[r * 0.96, 0.022, 6, 18]} />
        <meshToonMaterial color={c2} gradientMap={grad} />
      </mesh>
      {/* tie-knot handle */}
      <mesh position={[0, r * 1.02, -r * 0.32]} castShadow>
        <sphereGeometry args={[r * 0.13, 8, 8]} />
        <meshToonMaterial color={c2} gradientMap={grad} />
      </mesh>
    </group>
  );
}

/**
 * Reception desk. Built facing +z (toward the visitor): a tall front facade with
 * an accent panel + a transaction shelf the visitor faces, and a lower work
 * surface + monitor on the far side where the receptionist stands.
 */
function Counter({ p, ry = 0, body = '#caa57f', top = '#8a6240', panel = '#7fd093' }: { p: Vec3; ry?: number; body?: string; top?: string; panel?: string }) {
  return (
    <group position={p} rotation={[0, ry, 0]}>
      {/* lower desk mass */}
      <B p={[0, 0.5, 0]} s={[2.4, 1.0, 0.8]} c={body} />
      {/* tall FRONT facade facing the visitor (+z) + accent panel down its face */}
      <B p={[0, 1.2, 0.36]} s={[2.5, 0.5, 0.1]} c={body} />
      <B p={[0, 0.66, 0.42]} s={[2.2, 1.28, 0.04]} c={panel} cast={false} />
      {/* transaction shelf jutting toward the visitor at the top of the facade */}
      <B p={[0, 1.42, 0.5]} s={[2.5, 0.08, 0.34]} c={top} />
      {/* work surface behind the facade (receptionist side) */}
      <B p={[0, 1.06, -0.12]} s={[2.4, 0.1, 0.54]} c={top} />
      {/* service bell on the visitor's shelf */}
      <mesh position={[0.9, 1.53, 0.5]} castShadow>
        <sphereGeometry args={[0.1, 14, 12]} />
        <meshStandardMaterial color="#ffd479" emissive="#ffd479" emissiveIntensity={0.25} metalness={0.4} roughness={0.4} />
      </mesh>
      <B p={[0.9, 1.48, 0.5]} s={[0.15, 0.03, 0.15]} c="#e0b84a" cast={false} />
      {/* receptionist's monitor — screen faces the receptionist (-z) */}
      <group position={[-0.7, 1.12, -0.16]} rotation={[0, Math.PI, 0]}>
        <B p={[0, 0.2, 0]} s={[0.52, 0.34, 0.05]} c="#2a2233" />
        <Screen p={[0, 0.2, 0.04]} s={[0.44, 0.26]} c="#56c2b0" i={0.8} />
        <B p={[0, 0.0, 0]} s={[0.1, 0.08, 0.1]} c="#2a2233" cast={false} />
      </group>
      {/* keyboard / guest cards on the work surface */}
      <B p={[0.25, 1.13, -0.1]} s={[0.4, 0.04, 0.2]} c="#fffaf2" cast={false} />
    </group>
  );
}

/** A cute toon receptionist (standing). Faces +z by default. */
function Receptionist({ p, ry = 0, scale = 1, skin = '#f1c9a5', hair = '#4a3224', blouse = '#f4a3c0', skirt = '#3a587a' }: { p: Vec3; ry?: number; scale?: number; skin?: string; hair?: string; blouse?: string; skirt?: string }) {
  const grad = toonGradient(3);
  return (
    <group position={p} rotation={[0, ry, 0]} scale={scale}>
      {/* shoes */}
      <B p={[-0.1, 0.04, 0.05]} s={[0.14, 0.08, 0.24]} c="#3d281c" />
      <B p={[0.1, 0.04, 0.05]} s={[0.14, 0.08, 0.24]} c="#3d281c" />
      {/* legs */}
      <mesh position={[-0.1, 0.33, 0]} castShadow><cylinderGeometry args={[0.06, 0.06, 0.5, 10]} /><meshToonMaterial color={skin} gradientMap={grad} /></mesh>
      <mesh position={[0.1, 0.33, 0]} castShadow><cylinderGeometry args={[0.06, 0.06, 0.5, 10]} /><meshToonMaterial color={skin} gradientMap={grad} /></mesh>
      {/* A-line skirt */}
      <mesh position={[0, 0.74, 0]} castShadow><coneGeometry args={[0.34, 0.52, 16]} /><meshToonMaterial color={skirt} gradientMap={grad} /></mesh>
      {/* blouse / torso — wide at the shoulders, nipped in at the waist */}
      <mesh position={[0, 1.12, 0]} castShadow><cylinderGeometry args={[0.235, 0.2, 0.44, 20]} /><meshToonMaterial color={blouse} gradientMap={grad} /></mesh>
      {/* small, low shoulder fillet — rounds the top without swallowing the neck */}
      <mesh position={[0, 1.3, 0]} scale={[1.04, 0.34, 0.82]} castShadow><sphereGeometry args={[0.2, 18, 14]} /><meshToonMaterial color={blouse} gradientMap={grad} /></mesh>
      {/* waistline */}
      <mesh position={[0, 0.9, 0]}><cylinderGeometry args={[0.205, 0.205, 0.06, 20]} /><meshToonMaterial color={skirt} gradientMap={grad} /></mesh>
      {/* name tag */}
      <B p={[0.13, 1.16, 0.2]} s={[0.08, 0.05, 0.02]} c="#ffd479" cast={false} />
      {/* shoulder caps + sleeved arms tucked close to the body (joined, not overhanging) */}
      <mesh position={[-0.2, 1.31, 0.01]}><sphereGeometry args={[0.075, 14, 12]} /><meshToonMaterial color={blouse} gradientMap={grad} /></mesh>
      <mesh position={[0.2, 1.31, 0.01]}><sphereGeometry args={[0.075, 14, 12]} /><meshToonMaterial color={blouse} gradientMap={grad} /></mesh>
      <mesh position={[-0.24, 1.08, 0.02]} rotation={[0, 0, 0.1]} castShadow><cylinderGeometry args={[0.058, 0.052, 0.46, 14]} /><meshToonMaterial color={blouse} gradientMap={grad} /></mesh>
      <mesh position={[0.24, 1.08, 0.02]} rotation={[0, 0, -0.1]} castShadow><cylinderGeometry args={[0.058, 0.052, 0.46, 14]} /><meshToonMaterial color={blouse} gradientMap={grad} /></mesh>
      {/* hands */}
      <mesh position={[-0.265, 0.85, 0.04]} castShadow><sphereGeometry args={[0.056, 12, 12]} /><meshToonMaterial color={skin} gradientMap={grad} /></mesh>
      <mesh position={[0.265, 0.85, 0.04]} castShadow><sphereGeometry args={[0.056, 12, 12]} /><meshToonMaterial color={skin} gradientMap={grad} /></mesh>
      {/* neck (slim + clearly visible) + head, raised so the neck shows */}
      <mesh position={[0, 1.45, 0]} castShadow><cylinderGeometry args={[0.058, 0.064, 0.2, 12]} /><meshToonMaterial color={skin} gradientMap={grad} /></mesh>
      <mesh position={[0, 1.64, 0]} castShadow><sphereGeometry args={[0.16, 18, 16]} /><meshToonMaterial color={skin} gradientMap={grad} /></mesh>
      {/* hair — crown + fringe (หน้าม้า) + shoulder-length side locks (face stays open) */}
      <mesh position={[0, 1.69, -0.04]} scale={[1.08, 1.05, 1.04]} castShadow><sphereGeometry args={[0.18, 16, 14]} /><meshToonMaterial color={hair} gradientMap={grad} /></mesh>
      <B p={[0, 1.72, 0.1]} s={[0.32, 0.13, 0.12]} c={hair} cast={false} />
      <B p={[-0.13, 1.66, 0.12]} s={[0.1, 0.1, 0.08]} c={hair} cast={false} />
      <B p={[0.13, 1.66, 0.12]} s={[0.1, 0.1, 0.08]} c={hair} cast={false} />
      {/* shoulder-length side locks */}
      <B p={[-0.17, 1.44, -0.02]} s={[0.09, 0.46, 0.14]} c={hair} cast={false} />
      <B p={[0.17, 1.44, -0.02]} s={[0.09, 0.46, 0.14]} c={hair} cast={false} />
      {/* eyes + little smile */}
      <mesh position={[-0.06, 1.63, 0.15]}><sphereGeometry args={[0.022, 8, 8]} /><meshBasicMaterial color="#2a2233" /></mesh>
      <mesh position={[0.06, 1.63, 0.15]}><sphereGeometry args={[0.022, 8, 8]} /><meshBasicMaterial color="#2a2233" /></mesh>
      <B p={[0, 1.56, 0.15]} s={[0.07, 0.02, 0.02]} c="#c4607a" cast={false} />
    </group>
  );
}

/** Long dining table with four chunky legs. */
function DiningTable({ p, c = '#caa57f', leg = '#8c613e' }: { p: Vec3; c?: string; leg?: string }) {
  return (
    <group position={p}>
      <B p={[0, 1.0, 0]} s={[2.8, 0.12, 1.1]} c={c} />
      {/* aprons */}
      <B p={[0, 0.9, 0.5]} s={[2.7, 0.12, 0.06]} c={c} cast={false} />
      <B p={[0, 0.9, -0.5]} s={[2.7, 0.12, 0.06]} c={c} cast={false} />
      {/* legs */}
      {([[-1.3, -0.45], [1.3, -0.45], [-1.3, 0.45], [1.3, 0.45]] as const).map(([x, z], i) => (
        <B key={i} p={[x, 0.5, z]} s={[0.12, 1.0, 0.12]} c={leg} />
      ))}
    </group>
  );
}

/** Two-door fridge with handles + a cute magnet note. */
function Fridge({ p }: { p: Vec3 }) {
  return (
    <group position={p}>
      <B p={[0, 1.05, 0]} s={[0.92, 2.1, 0.82]} c="#eef3f0" />
      {/* freezer / fridge door split */}
      <B p={[0, 1.42, 0.42]} s={[0.86, 0.04, 0.04]} c="#c4d2cc" cast={false} />
      {/* inset door panels */}
      <B p={[0, 1.74, 0.42]} s={[0.78, 0.48, 0.03]} c="#f7faf8" cast={false} />
      <B p={[0, 0.9, 0.42]} s={[0.78, 0.92, 0.03]} c="#f7faf8" cast={false} />
      {/* handles */}
      <B p={[-0.34, 1.74, 0.46]} s={[0.05, 0.34, 0.06]} c="#9fb0a8" cast={false} />
      <B p={[-0.34, 0.95, 0.46]} s={[0.05, 0.5, 0.06]} c="#9fb0a8" cast={false} />
      {/* magnet note */}
      <B p={[0.22, 1.82, 0.44]} s={[0.16, 0.2, 0.02]} c="#ffd479" cast={false} />
    </group>
  );
}

/** Mango sticky rice — white rice mound + bright mango slices + a coconut dollop. */
function PlateMango({ p }: { p: Vec3 }) {
  const grad = toonGradient(3);
  return (
    <group position={p}>
      <mesh position={[0, 0, 0]} receiveShadow><cylinderGeometry args={[0.32, 0.28, 0.04, 20]} /><meshToonMaterial color="#fffaf2" gradientMap={grad} /></mesh>
      <mesh position={[-0.08, 0.09, 0]} castShadow><sphereGeometry args={[0.15, 14, 12]} /><meshToonMaterial color="#fbf3df" gradientMap={grad} /></mesh>
      <B p={[0.14, 0.07, 0.07]} s={[0.22, 0.1, 0.1]} c="#ffc24b" />
      <B p={[0.16, 0.07, -0.08]} s={[0.2, 0.1, 0.1]} c="#ffb733" />
      <mesh position={[-0.08, 0.17, 0]}><sphereGeometry args={[0.055, 10, 10]} /><meshToonMaterial color="#ffffff" gradientMap={grad} /></mesh>
    </group>
  );
}

/** Krapao + fried egg — rice mound, basil stir-fry, and an unmistakable fried egg. */
function PlateKrapao({ p }: { p: Vec3 }) {
  const grad = toonGradient(3);
  return (
    <group position={p}>
      <mesh position={[0, 0, 0]} receiveShadow><cylinderGeometry args={[0.34, 0.3, 0.04, 20]} /><meshToonMaterial color="#fffaf2" gradientMap={grad} /></mesh>
      {/* rice */}
      <mesh position={[-0.1, 0.09, 0]} castShadow><sphereGeometry args={[0.16, 14, 12]} /><meshToonMaterial color="#fdfaf2" gradientMap={grad} /></mesh>
      {/* basil stir-fry on the rice */}
      <B p={[-0.1, 0.21, 0]} s={[0.22, 0.08, 0.22]} c="#5a7d34" cast={false} />
      <B p={[-0.04, 0.25, 0.06]} s={[0.07, 0.06, 0.07]} c="#8a3b2a" cast={false} />
      <B p={[-0.16, 0.24, -0.05]} s={[0.06, 0.06, 0.06]} c="#3d5a24" cast={false} />
      {/* fried egg */}
      <mesh position={[0.17, 0.06, 0.02]} scale={[1, 0.4, 1]} castShadow><sphereGeometry args={[0.16, 14, 12]} /><meshToonMaterial color="#fffdf6" gradientMap={grad} /></mesh>
      <mesh position={[0.17, 0.11, 0.02]}><sphereGeometry args={[0.06, 12, 12]} /><meshToonMaterial color="#ffcf33" gradientMap={grad} /></mesh>
    </group>
  );
}

/** Hanging pendant lamp — cord, shade and a warm glowing bulb. */
function Pendant({ p, c = '#ff9a62' }: { p: Vec3; c?: string }) {
  const grad = toonGradient(3);
  return (
    <group position={p}>
      <mesh position={[0, 0.65, 0]}><cylinderGeometry args={[0.02, 0.02, 1.3, 6]} /><meshToonMaterial color="#3d281c" gradientMap={grad} /></mesh>
      <mesh position={[0, 0, 0]} castShadow><coneGeometry args={[0.32, 0.3, 18, 1, true]} /><meshToonMaterial color={c} gradientMap={grad} side={2} /></mesh>
      <mesh position={[0, -0.08, 0]}><sphereGeometry args={[0.1, 12, 12]} /><meshStandardMaterial color="#ffe9b8" emissive="#ffd479" emissiveIntensity={1.2} toneMapped={false} /></mesh>
    </group>
  );
}

/** A wine / champagne bottle standing on its base (origin at the bottom). */
function WineBottle({ p, c = '#3a5a2a', tall = false }: { p: Vec3; c?: string; tall?: boolean }) {
  const grad = toonGradient(3);
  const bh = tall ? 0.5 : 0.4;
  return (
    <group position={p}>
      <mesh position={[0, bh / 2, 0]} castShadow><cylinderGeometry args={[0.06, 0.065, bh, 14]} /><meshToonMaterial color={c} gradientMap={grad} /></mesh>
      <mesh position={[0, bh + 0.07, 0]} castShadow><cylinderGeometry args={[0.022, 0.032, 0.16, 10]} /><meshToonMaterial color={c} gradientMap={grad} /></mesh>
      {tall
        ? <mesh position={[0, bh + 0.17, 0]}><cylinderGeometry args={[0.034, 0.034, 0.07, 10]} /><meshToonMaterial color="#d9b44a" gradientMap={grad} /></mesh>
        : <mesh position={[0, bh + 0.16, 0]}><cylinderGeometry args={[0.022, 0.022, 0.04, 8]} /><meshToonMaterial color="#2a1a12" gradientMap={grad} /></mesh>}
    </group>
  );
}

/** A stemmed wine glass (origin at the base). */
function WineGlass({ p }: { p: Vec3 }) {
  const grad = toonGradient(3);
  return (
    <group position={p}>
      <mesh position={[0, 0.04, 0]}><cylinderGeometry args={[0.055, 0.055, 0.012, 14]} /><meshToonMaterial color="#dff2ff" transparent opacity={0.5} gradientMap={grad} /></mesh>
      <mesh position={[0, 0.13, 0]}><cylinderGeometry args={[0.009, 0.009, 0.18, 8]} /><meshToonMaterial color="#dff2ff" transparent opacity={0.5} gradientMap={grad} /></mesh>
      <mesh position={[0, 0.27, 0]}><cylinderGeometry args={[0.07, 0.025, 0.16, 14]} /><meshToonMaterial color="#dff2ff" transparent opacity={0.45} gradientMap={grad} /></mesh>
    </group>
  );
}

/** Wall-mounted shelf displaying wine + champagne bottles and stemmed glasses. */
function WineShelf({ p }: { p: Vec3 }) {
  return (
    <group position={p}>
      {/* brackets + two shelf planks */}
      <B p={[-1.15, 0.3, -0.02]} s={[0.06, 0.74, 0.28]} c="#6b4e3d" cast={false} />
      <B p={[1.15, 0.3, -0.02]} s={[0.06, 0.74, 0.28]} c="#6b4e3d" cast={false} />
      <B p={[0, 0.0, 0]} s={[2.42, 0.06, 0.32]} c="#8c613e" />
      <B p={[0, 0.62, 0]} s={[2.42, 0.06, 0.32]} c="#8c613e" />
      {/* bottles on the lower shelf */}
      <WineBottle p={[-0.85, 0.03, 0]} c="#3a5a2a" />
      <WineBottle p={[-0.5, 0.03, 0]} c="#5a1a1a" />
      <WineBottle p={[0, 0.03, 0]} c="#2f3b2a" tall />
      <WineBottle p={[0.5, 0.03, 0]} c="#5a1a1a" />
      <WineBottle p={[0.85, 0.03, 0]} c="#3a5a2a" />
      {/* stemmed glasses on the upper shelf */}
      <WineGlass p={[-0.7, 0.65, 0]} />
      <WineGlass p={[-0.35, 0.65, 0]} />
      <WineGlass p={[0.35, 0.65, 0]} />
      <WineGlass p={[0.7, 0.65, 0]} />
    </group>
  );
}

/** Long low sideboard counter (origin centred on the floor). */
function LongCounter({ p, w = 4.0, body = '#caa57f', top = '#8a6240' }: { p: Vec3; w?: number; body?: string; top?: string }) {
  const doors = Math.max(2, Math.round(w / 1.0));
  return (
    <group position={p}>
      <B p={[0, 0.5, 0]} s={[w, 1.0, 0.55]} c={body} />
      <B p={[0, 1.04, 0.02]} s={[w + 0.08, 0.1, 0.62]} c={top} />
      {/* door seams + handles */}
      {Array.from({ length: doors - 1 }).map((_, i) => {
        const x = -w / 2 + (w / doors) * (i + 1);
        return <B key={`s${i}`} p={[x, 0.5, 0.29]} s={[0.02, 0.9, 0.02]} c="#9b7c5a" cast={false} />;
      })}
      {Array.from({ length: doors }).map((_, i) => {
        const x = -w / 2 + (w / doors) * (i + 0.5);
        return <B key={`h${i}`} p={[x, 0.62, 0.31]} s={[0.04, 0.14, 0.03]} c="#6b4e3d" cast={false} />;
      })}
    </group>
  );
}

/** Round wall clock — rim, face, 12/3/6/9 ticks and two hands. */
function WallClock({ p, face = '#fffaf2', rim = '#4a3224' }: { p: Vec3; face?: string; rim?: string }) {
  const grad = toonGradient(3);
  return (
    <group position={p}>
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.34, 0.34, 0.06, 24]} />
        <meshToonMaterial color={rim} gradientMap={grad} />
      </mesh>
      <mesh position={[0, 0, 0.035]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.29, 0.29, 0.02, 24]} />
        <meshToonMaterial color={face} gradientMap={grad} />
      </mesh>
      {/* hour ticks at 12 / 3 / 6 / 9 */}
      {([[0, 0.22], [0.22, 0], [0, -0.22], [-0.22, 0]] as const).map(([x, y], i) => (
        <B key={i} p={[x, y, 0.05]} s={[0.035, 0.035, 0.02]} c={rim} cast={false} />
      ))}
      {/* hands */}
      <B p={[0, 0.07, 0.06]} s={[0.028, 0.18, 0.02]} c="#3d281c" cast={false} />
      <group rotation={[0, 0, -1.1]}>
        <B p={[0.09, 0, 0.06]} s={[0.2, 0.024, 0.02]} c="#3d281c" cast={false} />
      </group>
      <mesh position={[0, 0, 0.07]}><sphereGeometry args={[0.032, 10, 10]} /><meshToonMaterial color="#ff4a4a" gradientMap={grad} /></mesh>
    </group>
  );
}

/** Tall potted plant — a reception "tree" with a chunky pot and layered foliage. */
function FloorPlant({ p, s = 1 }: { p: Vec3; s?: number }) {
  const grad = toonGradient(3);
  return (
    <group position={p} scale={s}>
      {/* pot */}
      <B p={[0, 0.28, 0]} s={[0.44, 0.56, 0.44]} c="#e07a5f" />
      <B p={[0, 0.56, 0]} s={[0.5, 0.08, 0.5]} c="#d4654a" />
      <B p={[0, 0.58, 0]} s={[0.4, 0.02, 0.4]} c="#6b4e3d" cast={false} />
      {/* trunk */}
      <mesh position={[0, 0.95, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.085, 0.72, 8]} />
        <meshToonMaterial color="#6b4e3d" gradientMap={grad} />
      </mesh>
      {/* layered foliage */}
      <B p={[0, 1.3, 0]} s={[0.72, 0.52, 0.72]} c="#52b788" />
      <B p={[-0.24, 1.52, 0.12]} s={[0.46, 0.46, 0.46]} c="#7fd093" />
      <B p={[0.22, 1.56, -0.06]} s={[0.5, 0.5, 0.5]} c="#40916c" />
      <B p={[0.04, 1.78, 0.05]} s={[0.4, 0.4, 0.4]} c="#7fd093" />
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
          {/* Project Shelf — games only */}
          <Hotspot room="work" act={() => useAppStore.getState().openRoomPanel('work-games')} hintOffset={[1.9, 2.0, -2.6]}>
            <ProjectShelf p={[1.9, 0.06, -3.0]} ry={0} />
          </Hotspot>

          {/* Desk + Laptops — all non-game projects */}
          <Hotspot room="work" act={() => useAppStore.getState().openRoomPanel('work')} hintOffset={[-0.75, 2.3, -2.0]}>
            <Desk pos={[-0.8, 0.06, -2.45]} color="#b9905f" />
            <Laptop p={[-1.35, 1.12, -2.45]} ry={0.15} c="#e0e0e0" sc="#ff9a62" />
            <Laptop p={[-0.15, 1.12, -2.45]} ry={-0.15} c="#333333" sc="#56c2b0" />
          </Hotspot>

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
          <Hotspot room="tech" act={() => useAppStore.getState().openRoomPanel('tech')} hintOffset={[-1.0, 3.35, -2.44]}>
           {/* Whole pegboard nudged right (off the window wall) + pressed back against the wall.
               NB: furniture is rendered at scale 0.6 + z-offset 0.2, so reaching the real back
               wall needs local z ≈ -3.08 (hence the big -0.63 z push here). */}
           <group position={[0, 0.1, -0.63]}>
            {/* Board background (widened a touch so no icon overhangs the edge) */}
            <B p={[-0.5, 2.1, -RD / 2 + 0.05]} s={[4.0, 1.6, 0.06]} c="#3d281c" cast={false} />
            {/* Board trim — top + bottom rails */}
            <B p={[-0.5, 2.85, -RD / 2 + 0.06]} s={[4.1, 0.06, 0.08]} c="#ffd479" cast={false} />
            <B p={[-0.5, 1.35, -RD / 2 + 0.06]} s={[4.1, 0.06, 0.08]} c="#ffd479" cast={false} />
            {/* Board trim — left + right edge rails */}
            <B p={[-2.5, 2.1, -RD / 2 + 0.06]} s={[0.08, 1.56, 0.08]} c="#ffd479" cast={false} />
            <B p={[1.5, 2.1, -RD / 2 + 0.06]} s={[0.08, 1.56, 0.08]} c="#ffd479" cast={false} />

            {/* --- React (Atom icon: circle + 3 orbits) --- */}
            <group position={[-2.14, 2.4, -RD / 2 + 0.14]} scale={1.18}>
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
            <group position={[-1.32, 2.4, -RD / 2 + 0.14]} scale={1.18}>
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
            <group position={[-0.5, 2.4, -RD / 2 + 0.14]} scale={1.18}>
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
            <group position={[0.32, 2.4, -RD / 2 + 0.14]} scale={1.18}>
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
            <group position={[1.14, 2.4, -RD / 2 + 0.14]} scale={1.18}>
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
            <group position={[-1.73, 1.65, -RD / 2 + 0.14]} scale={1.18}>
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
            <group position={[-0.5, 1.65, -RD / 2 + 0.14]} scale={1.18}>
              {/* Shield body */}
              <B p={[0, 0.05, 0]} s={[0.35, 0.35, 0.06]} c="#56c2b0" />
              <B p={[0, -0.1, 0]} s={[0.25, 0.15, 0.06]} c="#56c2b0" />
              {/* Lock icon */}
              <B p={[0, 0.06, 0.04]} s={[0.12, 0.12, 0.02]} c="#ffffff" cast={false} />
              <B p={[0, 0.14, 0.04]} s={[0.08, 0.08, 0.02]} c="#ffffff" cast={false} />
              <B p={[0, 0.06, 0.05]} s={[0.04, 0.04, 0.01]} c="#ffd479" cast={false} />
            </group>

            {/* --- Three.js / R3F (3D cube wireframe) --- bottom row */}
            <group position={[0.73, 1.65, -RD / 2 + 0.14]} scale={1.18}>
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
           </group>
          </Hotspot>

          {/* ===== ARCADE CABINET ===== */}
          <Hotspot
            room="tech"
            act={() => useAppStore.getState().openRoomPanel('tech-games')}
            hintOffset={[2.25, 2.6, -2.0]}
          >
            {/* Pushed flush to the real back wall (local z ~-2.70 → body back hits the wall after
                the 0.6 scale + 0.2 z-offset) and over to the right, clear of the board. */}
            <group position={[2.25, 0.06, -2.70]}>
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

          {/* Cute crisp two-seater sofa pressed against the real back wall (local z ~-2.63), facing the camera. */}
          <Sofa p={[-1.0, 0, -2.63]} c="#56c2b0" cushion="#fff2d9" pillow="#ff9a62" />

          {/* Bean bags — now clearly bean-bag shaped (saggy base, lean-back, tie-knot). */}
          {/* Orange one moved to the front-left corner. */}
          <BeanBag p={[-1.7, 0, 0.95]} c="#ff9a62" c2="#e07a45" r={0.6} />
          <BeanBag p={[0.5, 0, 0.8]} c="#7fd093" c2="#5fa874" r={0.52} />

          {/* Dice stack — centred between the two bean bags */}
          <B p={[-0.6, 0.18, 0.875]} s={[0.24, 0.24, 0.24]} c="#ff9a62" />
          <B p={[-0.6, 0.18, 0.875]} s={[0.06, 0.06, 0.25]} c="#ffffff" cast={false} />
          <B p={[-0.58, 0.42, 0.895]} s={[0.2, 0.2, 0.2]} c="#ffd479" />
          <B p={[-0.58, 0.42, 0.895]} s={[0.05, 0.05, 0.21]} c="#ffffff" cast={false} />
        </>
      );

    case 'contact':
      return (
        <>
          {/* ===== RECEPTION ===== counter + receptionist + clock + waiting sofa + a potted tree */}
          {/* Reception counter — warm terracotta panel so it pops off the green rug */}
          <Counter p={[-0.3, 0, -1.9]} panel="#e07a5f" />
          {/* Receptionist standing behind the counter, facing the visitor (taller so her
              head + shoulders clear the counter). She is the click target — talk to her to
              open the contact panel. */}
          <Hotspot room="contact" act={() => useAppStore.getState().openRoomPanel('contact')} hintOffset={[-0.4, 2.55, -2.7]}>
            <Receptionist p={[-0.4, 0, -2.7]} scale={1.25} />
          </Hotspot>
          {/* Wall clock hung high above the counter (flush to the back wall) */}
          <WallClock p={[-0.3, 2.95, -3.0]} />
          {/* Waiting sofa — lavender so it stands out from the green rug, not blends in */}
          <Sofa p={[-2.3, 0, 0.4]} ry={Math.PI / 2} c="#c7a6e6" cushion="#fff2d9" pillow="#ff9a62" />
          {/* Potted tree in the back-right corner */}
          <FloorPlant p={[1.7, 0, -2.3]} />
          {/* Envelope as the counter's logo — flat, centred on the green front panel */}
          <group position={[-0.3, 0.7, -1.43]}>
            <B p={[0, 0, 0]} s={[0.9, 0.56, 0.04]} c="#fffaf2" cast={false} />
            <mesh position={[0, 0.02, 0.03]} rotation={[0, 0, Math.PI / 4]}>
              <planeGeometry args={[0.36, 0.36]} />
              <meshToonMaterial color="#56c2b0" gradientMap={g} side={2} />
            </mesh>
          </group>
        </>
      );

    case 'thanks':
      return (
        <>
          {/* ===== DINING ROOM ===== table (click target), chairs, fridge, back bar */}
          {/* Long sideboard counter running from the window (left) wall to the fridge */}
          <LongCounter p={[-0.65, 0, -2.72]} w={4.1} />
          {/* Wine / champagne shelf on the wall above the counter */}
          <WineShelf p={[-0.65, 1.5, -2.88]} />
          {/* Fridge in the back-right corner (flush to the back wall) */}
          <Fridge p={[1.9, 0, -2.6]} />
          {/* Chairs — a row behind (facing the visitor) + a row in front */}
          {([-1.0, -0.1, 0.8] as const).map((x) => (
            <CuteChair key={`b${x}`} p={[x, 0, -1.4]} ry={Math.PI} c="#ff9a62" />
          ))}
          {([-1.0, -0.1, 0.8] as const).map((x) => (
            <CuteChair key={`f${x}`} p={[x, 0, 0.4]} ry={0} c="#56c2b0" />
          ))}
          {/* Pendant lamp over the table */}
          <Pendant p={[-0.1, 2.4, -0.5]} />
          {/* Dining table + the meal — click the table for the closing note */}
          <Hotspot room="thanks" act={() => useAppStore.getState().openRoomPanel('thanks')} hintOffset={[-0.1, 2.0, -0.5]}>
            <DiningTable p={[-0.1, 0, -0.5]} />
            <PlateMango p={[-0.7, 1.07, -0.5]} />
            <PlateKrapao p={[0.55, 1.07, -0.45]} />
            <mesh position={[-0.05, 1.22, -0.75]} castShadow><cylinderGeometry args={[0.12, 0.14, 0.3, 14]} /><meshToonMaterial color="#7fd093" gradientMap={g} /></mesh>
            {([-0.28, 0.2] as const).map((x) => (
              <mesh key={`gl${x}`} position={[x, 1.13, -0.78]}><cylinderGeometry args={[0.06, 0.05, 0.16, 12]} /><meshToonMaterial color="#bfe6f0" gradientMap={g} /></mesh>
            ))}
          </Hotspot>
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
