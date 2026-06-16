import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import { toonGradient } from '../../lib/toon';
import { floorsById } from '../../data/floors';

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

/** Toon box helper. */
function B({ p, s, c, cast = true }: { p: Vec3; s: Vec3; c: string; cast?: boolean }) {
  return (
    <mesh position={p} castShadow={cast}>
      <boxGeometry args={s} />
      <meshToonMaterial color={c} gradientMap={toonGradient(3)} />
    </mesh>
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

function Desk({ pos = [0, 0, -1.3] as Vec3, color = '#caa57f' }: { pos?: Vec3; color?: string }) {
  const g = toonGradient(3);
  return (
    <group position={pos}>
      <mesh position={[0, 1.0, 0]} castShadow>
        <boxGeometry args={[2, 0.1, 0.85]} />
        <meshToonMaterial color={color} gradientMap={g} />
      </mesh>
      {([[-0.9, 0.36], [0.9, 0.36], [-0.9, -0.36], [0.9, -0.36]] as const).map(([x, z], idx) => (
        <mesh key={idx} position={[x, 0.5, z]}>
          <boxGeometry args={[0.09, 1.0, 0.09]} />
          <meshToonMaterial color="#a9824f" gradientMap={g} />
        </mesh>
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
        <meshToonMaterial color="#e8d3b3" gradientMap={g} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0.5]}>
        <circleGeometry args={[1.8, 40]} />
        <meshToonMaterial color={accent} gradientMap={g} />
      </mesh>
      <mesh position={[0, RH / 2, -RD / 2]} receiveShadow>
        <planeGeometry args={[RW, RH]} />
        <meshToonMaterial color="#fff4e0" gradientMap={g} />
      </mesh>
      <mesh position={[-RW / 2, RH / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[RD, RH]} />
        <meshToonMaterial color="#f5e8d4" gradientMap={g} />
      </mesh>
      <mesh position={[RW / 2, RH / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[RD, RH]} />
        <meshToonMaterial color="#f5e8d4" gradientMap={g} />
      </mesh>
      <mesh position={[0, RH, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[RW, RD]} />
        <meshToonMaterial color="#fff4e0" gradientMap={g} />
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

export function Furniture({ id }: { id: string }) {
  const g = toonGradient(3);
  switch (id) {
    case 'about':
      return (
        <>
          <Desk pos={[-0.4, 0, -1.4]} />
          {/* chair */}
          <B p={[-0.4, 0.55, -0.2]} s={[0.6, 0.1, 0.6]} c="#ff9a62" />
          <B p={[-0.4, 0.95, -0.48]} s={[0.6, 0.7, 0.1]} c="#ff9a62" />
          {/* bookshelf */}
          <B p={[2.1, 1.1, -1.7]} s={[1.0, 2.2, 0.4]} c="#b9905f" />
          {([['#56c2b0', -0.28, 0.6], ['#ff9a62', -0.08, 0.6], ['#c7a6e6', 0.12, 0.6], ['#ffd479', -0.18, 1.15], ['#7fd093', 0.06, 1.15]] as const).map(
            ([c, x, y], i) => (
              <mesh key={i} position={[2.1 + x, y, -1.52]} castShadow>
                <boxGeometry args={[0.13, 0.36, 0.24]} />
                <meshToonMaterial color={c} gradientMap={g} />
              </mesh>
            ),
          )}
          {/* plant */}
          <mesh position={[-2.2, 0.28, -1.4]}>
            <cylinderGeometry args={[0.22, 0.26, 0.55, 14]} />
            <meshToonMaterial color="#caa57f" gradientMap={g} />
          </mesh>
          <mesh position={[-2.2, 0.78, -1.4]} castShadow>
            <icosahedronGeometry args={[0.42, 1]} />
            <meshToonMaterial color="#7fd093" gradientMap={g} />
          </mesh>
          {/* framed picture */}
          <B p={[-0.4, 2.0, -RD / 2 + 0.06]} s={[0.95, 0.65, 0.06]} c="#ffd479" cast={false} />
          <Screen p={[-0.4, 2.0, -RD / 2 + 0.1]} s={[0.76, 0.48]} c="#56c2b0" i={0.5} />
        </>
      );

    case 'work':
      return (
        <>
          <Desk pos={[0, 0, -1.4]} color="#b9905f" />
          {/* twin monitors */}
          <B p={[-0.55, 1.45, -1.55]} s={[0.7, 0.5, 0.06]} c="#4a3f37" />
          <Screen p={[-0.55, 1.45, -1.51]} s={[0.6, 0.4]} c="#ff9a62" />
          <B p={[0.55, 1.45, -1.55]} s={[0.7, 0.5, 0.06]} c="#4a3f37" />
          <Screen p={[0.55, 1.45, -1.51]} s={[0.6, 0.4]} c="#56c2b0" />
          {/* keyboard + stool */}
          <B p={[0, 1.07, -1.15]} s={[0.5, 0.04, 0.18]} c="#fffaf2" />
          <mesh position={[0, 0.45, 0.1]} castShadow>
            <cylinderGeometry args={[0.26, 0.26, 0.12, 16]} />
            <meshToonMaterial color="#ff9a62" gradientMap={g} />
          </mesh>
          {/* shelf of project boxes */}
          <B p={[2.2, 1.6, -1.8]} s={[1.1, 0.08, 0.5]} c="#a9824f" cast={false} />
          {([['#ffd479', -0.32], ['#c7a6e6', 0], ['#7fd093', 0.32]] as const).map(([c, x], i) => (
            <B key={i} p={[2.2 + x, 1.85, -1.8]} s={[0.26, 0.34, 0.3]} c={c} />
          ))}
        </>
      );

    case 'tech':
      return (
        <>
          <Desk pos={[-1.1, 0, -1.5]} color="#b9905f" />
          {/* tools on pegboard */}
          <B p={[-1.1, 2.3, -RD / 2 + 0.06]} s={[1.5, 1.0, 0.06]} c="#caa57f" cast={false} />
          <B p={[-1.5, 2.3, -RD / 2 + 0.12]} s={[0.1, 0.5, 0.06]} c="#56c2b0" />
          <B p={[-1.1, 2.4, -RD / 2 + 0.12]} s={[0.45, 0.12, 0.06]} c="#ff9a62" />
          <B p={[-0.7, 2.25, -RD / 2 + 0.12]} s={[0.1, 0.4, 0.06]} c="#c7a6e6" />
          {/* arcade cabinet */}
          <group position={[1.7, 0, -1.4]}>
            <B p={[0, 0.9, 0]} s={[1.0, 1.8, 0.7]} c="#c7a6e6" />
            <mesh position={[0, 1.45, 0.33]} rotation={[-0.25, 0, 0]} castShadow>
              <boxGeometry args={[0.8, 0.55, 0.08]} />
              <meshToonMaterial color="#3a322b" gradientMap={g} />
            </mesh>
            <Screen p={[0, 1.46, 0.38]} s={[0.66, 0.4]} c="#ffd479" rot={[-0.25, 0, 0]} i={1.4} />
            <B p={[0, 1.02, 0.36]} s={[0.8, 0.12, 0.25]} c="#56c2b0" />
            <mesh position={[-0.18, 1.12, 0.42]}>
              <sphereGeometry args={[0.06, 12, 12]} />
              <meshStandardMaterial color="#ff4a4a" emissive="#ff4a4a" emissiveIntensity={0.8} toneMapped={false} />
            </mesh>
          </group>
        </>
      );

    case 'contact':
      return (
        <>
          <Desk pos={[0, 0, -1.4]} />
          {/* big envelope */}
          <B p={[0, 1.35, -1.4]} s={[1.1, 0.75, 0.06]} c="#fffaf2" />
          <mesh position={[0, 1.45, -1.36]} rotation={[0, 0, Math.PI / 4]}>
            <planeGeometry args={[0.55, 0.55]} />
            <meshToonMaterial color="#56c2b0" gradientMap={g} side={2} />
          </mesh>
          {/* desk lamp */}
          <mesh position={[0.7, 1.18, -1.4]}>
            <cylinderGeometry args={[0.04, 0.04, 0.32, 10]} />
            <meshToonMaterial color="#caa57f" gradientMap={g} />
          </mesh>
          <mesh position={[0.7, 1.4, -1.4]}>
            <sphereGeometry args={[0.16, 14, 14]} />
            <meshStandardMaterial color="#ffe9b8" emissive="#ffd479" emissiveIntensity={1.3} toneMapped={false} />
          </mesh>
          {/* stool */}
          <mesh position={[0, 0.45, 0.2]} castShadow>
            <cylinderGeometry args={[0.26, 0.26, 0.12, 16]} />
            <meshToonMaterial color="#ff9a62" gradientMap={g} />
          </mesh>
        </>
      );

    case 'thanks':
      return (
        <>
          {/* armchair */}
          <B p={[0, 0.5, -0.6]} s={[1.3, 0.4, 1.0]} c="#ff9a62" />
          <B p={[0, 1.0, -1.05]} s={[1.3, 0.7, 0.2]} c="#ff9a62" />
          <B p={[-0.65, 0.85, -0.6]} s={[0.2, 0.5, 1.0]} c="#ffb184" />
          <B p={[0.65, 0.85, -0.6]} s={[0.2, 0.5, 1.0]} c="#ffb184" />
          {/* "thank you" banner */}
          <B p={[0, 2.4, -RD / 2 + 0.06]} s={[2.4, 0.7, 0.06]} c="#f4a3c0" cast={false} />
          <Screen p={[0, 2.4, -RD / 2 + 0.1]} s={[2.2, 0.5]} c="#ffd479" i={0.5} />
          {/* gift box */}
          <group position={[-1.9, 0, -0.5]}>
            <B p={[0, 0.3, 0]} s={[0.6, 0.6, 0.6]} c="#56c2b0" />
            <B p={[0, 0.62, 0]} s={[0.66, 0.12, 0.66]} c="#ffd479" />
            <B p={[0, 0.4, 0]} s={[0.1, 0.62, 0.62]} c="#ff9a62" cast={false} />
          </group>
          {/* balloons */}
          {([['#ff9a62', 1.7], ['#c7a6e6', 2.05]] as const).map(([c, x], i) => (
            <group key={i} position={[x, 0, -0.8]}>
              <mesh position={[0, 2.0, 0]} castShadow>
                <sphereGeometry args={[0.28, 16, 16]} />
                <meshToonMaterial color={c} gradientMap={g} />
              </mesh>
              <mesh position={[0, 1.2, 0]}>
                <cylinderGeometry args={[0.012, 0.012, 1.4, 6]} />
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
    <>
      <Shell accent={accent} />
      <Furniture id={id} />
      <InteriorCameraRig />
    </>
  );
}
