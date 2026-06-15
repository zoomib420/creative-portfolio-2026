import { useRef } from 'react';
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { Vector3, BackSide, type Group } from 'three';
import { HeroObject } from './HeroObject';
import { floors, floorsById, FLOOR_SPACING } from '../../data/floors';
import { toonGradient } from '../../lib/toon';
import { useAppStore } from '../../lib/store';
import { cameraState } from '../../lib/scroll';

/**
 * The single 3D world: a cozy isometric "dollhouse" — a cutaway building whose
 * floors are the sections (see data/floors.ts). An elevator column on the left
 * runs the full height with a cabin car (+ the audio-reactive lantern) that
 * rides to the active floor. The camera glides up the building via the scroll
 * waypoints (lib/scroll.ts), so navigating sections *is* riding the elevator.
 * Procedural — no external model, so a real Blender building can drop in later
 * without changing this contract. (Concept B, chosen 2026-06-15.)
 */

const WIDTH = 3.6;
const DEPTH = 1.7;
const SP = FLOOR_SPACING;
const TOTAL_H = floors.length * SP;
const ELEV_X = -1.25;
const ROOM_X = 0.5;

function ElevatorCameraRig() {
  const { camera } = useThree();
  const lookTarget = useRef(new Vector3(cameraState.lx, cameraState.ly, cameraState.lz));

  useFrame(() => {
    camera.position.x += (cameraState.px - camera.position.x) * 0.04;
    camera.position.y += (cameraState.py - camera.position.y) * 0.04;
    camera.position.z += (cameraState.pz - camera.position.z) * 0.04;

    lookTarget.current.x += (cameraState.lx - lookTarget.current.x) * 0.04;
    lookTarget.current.y += (cameraState.ly - lookTarget.current.y) * 0.04;
    lookTarget.current.z += (cameraState.lz - lookTarget.current.z) * 0.04;
    camera.lookAt(lookTarget.current);
  });

  return null;
}

/** Shell: outline + back/right walls, one floor plate per level, roof + base. */
function BuildingShell() {
  const grad = toonGradient(3);
  const plates = [];
  for (let i = 0; i <= floors.length; i++) plates.push(i * SP);

  return (
    <group>
      {/* ink outline (inverted hull) hugging the whole mass */}
      <mesh position={[0, TOTAL_H / 2, 0]} scale={[1, 1, 1]}>
        <boxGeometry args={[WIDTH + 0.16, TOTAL_H + 0.3, DEPTH + 0.16]} />
        <meshBasicMaterial color="#3a322b" side={BackSide} />
      </mesh>

      {/* back wall */}
      <mesh position={[0, TOTAL_H / 2, -DEPTH / 2]}>
        <boxGeometry args={[WIDTH, TOTAL_H, 0.12]} />
        <meshToonMaterial color="#f3e2c8" gradientMap={grad} />
      </mesh>
      {/* right side wall (the lit "side face" of the iso block) */}
      <mesh position={[WIDTH / 2, TOTAL_H / 2, 0]}>
        <boxGeometry args={[0.12, TOTAL_H, DEPTH]} />
        <meshToonMaterial color="#efdabd" gradientMap={grad} />
      </mesh>

      {/* floor plates (each is also the ceiling of the room below) */}
      {plates.map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <boxGeometry args={[WIDTH, 0.12, DEPTH]} />
          <meshToonMaterial color="#fff4e0" gradientMap={grad} />
        </mesh>
      ))}

      {/* roof + base plinth */}
      <mesh position={[0, TOTAL_H + 0.1, 0]}>
        <boxGeometry args={[WIDTH + 0.3, 0.2, DEPTH + 0.3]} />
        <meshToonMaterial color="#ffd479" gradientMap={grad} />
      </mesh>
      <mesh position={[0, -0.16, 0]}>
        <boxGeometry args={[WIDTH + 0.3, 0.3, DEPTH + 0.3]} />
        <meshToonMaterial color="#caa57f" gradientMap={grad} />
      </mesh>
    </group>
  );
}

/** Elevator column on the left with a cabin that rides to the active floor. */
function ElevatorColumn() {
  const cabin = useRef<Group>(null);
  const grad = toonGradient(3);
  const activeSection = useAppStore((s) => s.activeSection);
  const floor = floorsById[activeSection] ?? floorsById.hero;
  const targetY = floor.level * SP + 0.5;

  useFrame(() => {
    const g = cabin.current;
    if (!g) return;
    g.position.y += (targetY - g.position.y) * 0.06;
  });

  return (
    <group>
      {/* shaft backing + rails */}
      <mesh position={[ELEV_X, TOTAL_H / 2, -0.45]}>
        <boxGeometry args={[0.58, TOTAL_H, 0.04]} />
        <meshToonMaterial color="#e8d3b3" gradientMap={grad} />
      </mesh>
      {[-0.3, 0.3].map((dx) => (
        <mesh key={dx} position={[ELEV_X + dx, TOTAL_H / 2, -0.18]}>
          <boxGeometry args={[0.07, TOTAL_H, 0.07]} />
          <meshToonMaterial color="#caa57f" gradientMap={grad} />
        </mesh>
      ))}

      {/* cabin car + the audio-reactive lantern passenger */}
      <group ref={cabin} position={[ELEV_X, 0.5, -0.1]}>
        <mesh scale={1.05}>
          <boxGeometry args={[0.5, 0.62, 0.5]} />
          <meshBasicMaterial color="#3a322b" side={BackSide} />
        </mesh>
        <mesh position={[0, -0.3, 0]}>
          <boxGeometry args={[0.46, 0.05, 0.46]} />
          <meshToonMaterial color="#fffaf2" gradientMap={grad} />
        </mesh>
        <mesh position={[0, 0, -0.22]}>
          <boxGeometry args={[0.46, 0.6, 0.05]} />
          <meshToonMaterial color="#ffe9cf" gradientMap={grad} />
        </mesh>
        <mesh position={[0, 0.31, 0]}>
          <boxGeometry args={[0.52, 0.05, 0.52]} />
          <meshToonMaterial color="#ffd479" gradientMap={grad} />
        </mesh>
        <pointLight position={[0, 0.1, 0.15]} intensity={0.5} color="#ffcf8a" distance={2.5} />
        <group scale={0.26} position={[0, -0.35, 0.05]}>
          <HeroObject />
        </group>
      </group>
    </group>
  );
}

function RoomProp({ id, accent, ready, lite }: { id: string; accent: string; ready: boolean; lite: boolean }) {
  const grad = toonGradient(3);
  const openGame = useAppStore((s) => s.openGame);
  
  // Interactivity handlers
  const onPointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    document.body.style.cursor = 'pointer';
  };
  const onPointerOut = () => {
    document.body.style.cursor = 'auto';
  };
  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (id === 'arcade') {
      openGame('rooster-run');
    } else {
      // scroll to section
      const target = document.getElementById(id);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!ready) {
    // scaffolded floor
    return (
      <group position={[ROOM_X, 0, 0]}>
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[0.4, 0.4, 0.4]} />
          <meshToonMaterial color="#d8c7af" gradientMap={grad} />
        </mesh>
        <mesh position={[0.3, 0.12, 0.2]}>
          <boxGeometry args={[0.28, 0.24, 0.28]} />
          <meshToonMaterial color="#cdb94f" gradientMap={grad} />
        </mesh>
        <mesh position={[-0.05, 0.5, 0]}>
          <boxGeometry args={[0.5, 0.04, 0.04]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.3} toneMapped={false} />
        </mesh>
      </group>
    );
  }

  switch (id) {
    case 'hero': // Lobby — rug + potted plant + a warm welcome glow
      return (
        <group position={[ROOM_X, 0, 0]} onPointerOver={onPointerOver} onPointerOut={onPointerOut} onClick={onClick}>
          <mesh position={[0, 0.03, 0.2]}>
            <boxGeometry args={[1.0, 0.04, 0.7]} />
            <meshToonMaterial color="#7fd0c0" gradientMap={grad} />
          </mesh>
          <mesh position={[0.6, 0.14, -0.3]}>
            <cylinderGeometry args={[0.12, 0.14, 0.26, 12]} />
            <meshToonMaterial color="#caa57f" gradientMap={grad} />
          </mesh>
          <mesh position={[0.6, 0.38, -0.3]}>
            <icosahedronGeometry args={[0.2, lite ? 0 : 1]} />
            <meshToonMaterial color="#7fd093" gradientMap={grad} />
          </mesh>
        </group>
      );
    case 'work': // a desk + glowing monitor + a stool + keyboard + mug
      return (
        <group position={[ROOM_X, 0, 0]} onPointerOver={onPointerOver} onPointerOut={onPointerOut} onClick={onClick}>
          {/* Desk surface */}
          <mesh position={[0, 0.46, 0]}>
            <boxGeometry args={[1.0, 0.06, 0.5]} />
            <meshToonMaterial color="#caa57f" gradientMap={grad} />
          </mesh>
          {/* Desk legs */}
          {[-0.45, 0.45].map((dx) => (
            <mesh key={dx} position={[dx, 0.23, 0]}>
              <boxGeometry args={[0.06, 0.46, 0.4]} />
              <meshToonMaterial color="#b9905f" gradientMap={grad} />
            </mesh>
          ))}
          {/* Monitor back */}
          <mesh position={[0, 0.66, -0.12]}>
            <boxGeometry args={[0.5, 0.34, 0.05]} />
            <meshToonMaterial color="#4a3f37" gradientMap={grad} />
          </mesh>
          {/* Monitor screen */}
          <mesh position={[0, 0.66, -0.09]}>
            <planeGeometry args={[0.42, 0.26]} />
            <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.9} toneMapped={false} />
          </mesh>
          {/* Keyboard */}
          <mesh position={[0, 0.50, 0.1]}>
            <boxGeometry args={[0.3, 0.02, 0.1]} />
            <meshToonMaterial color="#ffffff" gradientMap={grad} />
          </mesh>
          {/* Coffee Mug */}
          <mesh position={[-0.3, 0.52, 0.1]}>
            <cylinderGeometry args={[0.03, 0.03, 0.06, 8]} />
            <meshToonMaterial color="#ff4a4a" gradientMap={grad} />
          </mesh>
          {/* Stool */}
          <mesh position={[0, 0.16, 0.42]}>
            <cylinderGeometry args={[0.14, 0.14, 0.08, 12]} />
            <meshToonMaterial color="#ff9a62" gradientMap={grad} />
          </mesh>
        </group>
      );
    case 'arcade': // retro arcade cabinet with glowing buttons and joystick
      return (
        <group position={[ROOM_X, 0, 0]} onPointerOver={onPointerOver} onPointerOut={onPointerOut} onClick={onClick}>
          {/* Base */}
          <mesh position={[0, 0.35, -0.1]}>
            <boxGeometry args={[0.6, 0.7, 0.4]} />
            <meshToonMaterial color="#c7a6e6" gradientMap={grad} />
          </mesh>
          {/* Screen Hood */}
          <mesh position={[0, 0.55, 0.12]} rotation={[-0.2, 0, 0]}>
            <boxGeometry args={[0.5, 0.3, 0.05]} />
            <meshToonMaterial color="#3a322b" gradientMap={grad} />
          </mesh>
          {/* Screen Display */}
          <mesh position={[0, 0.55, 0.15]} rotation={[-0.2, 0, 0]}>
            <planeGeometry args={[0.44, 0.24]} />
            <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.2} toneMapped={false} />
          </mesh>
          {/* Control Panel */}
          <mesh position={[0, 0.32, 0.18]} rotation={[0.2, 0, 0]}>
            <boxGeometry args={[0.6, 0.08, 0.2]} />
            <meshToonMaterial color="#56c2b0" gradientMap={grad} />
          </mesh>
          {/* Joystick Base */}
          <mesh position={[-0.15, 0.38, 0.18]} rotation={[0.2, 0, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.05, 8]} />
            <meshToonMaterial color="#ffffff" gradientMap={grad} />
          </mesh>
          {/* Joystick Knob */}
          <mesh position={[-0.15, 0.42, 0.17]} rotation={[0.2, 0, 0]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshToonMaterial color="#ff4a4a" gradientMap={grad} />
          </mesh>
          {/* Buttons */}
          <mesh position={[0.1, 0.37, 0.16]} rotation={[0.2, 0, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.02, 8]} />
            <meshStandardMaterial color="#ffd479" emissive="#ffd479" emissiveIntensity={0.8} />
          </mesh>
          <mesh position={[0.2, 0.36, 0.20]} rotation={[0.2, 0, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.02, 8]} />
            <meshStandardMaterial color="#ff4a4a" emissive="#ff4a4a" emissiveIntensity={0.8} />
          </mesh>
          {/* Coin Slot Glow */}
          <mesh position={[0, 0.15, 0.11]}>
            <boxGeometry args={[0.08, 0.02, 0.01]} />
            <meshStandardMaterial color="#ff9a62" emissive="#ff9a62" emissiveIntensity={1} />
          </mesh>
        </group>
      );
    case 'about': // a cozy armchair + a little book stack
      return (
        <group position={[ROOM_X, 0, 0]} onPointerOver={onPointerOver} onPointerOut={onPointerOut} onClick={onClick}>
          {/* Seat */}
          <mesh position={[0, 0.22, 0]}>
            <boxGeometry args={[0.62, 0.2, 0.6]} />
            <meshToonMaterial color="#ff9a62" gradientMap={grad} />
          </mesh>
          {/* Backrest */}
          <mesh position={[0, 0.5, -0.26]}>
            <boxGeometry args={[0.62, 0.46, 0.14]} />
            <meshToonMaterial color="#ff9a62" gradientMap={grad} />
          </mesh>
          {/* Armrests */}
          {[-0.3, 0.3].map((dx) => (
            <mesh key={dx} position={[dx, 0.36, 0.02]}>
              <boxGeometry args={[0.12, 0.3, 0.5]} />
              <meshToonMaterial color="#ffb184" gradientMap={grad} />
            </mesh>
          ))}
          {/* Books */}
          {!lite &&
            [0, 0.09, 0.18].map((dy, i) => (
              <mesh key={dy} position={[0.62, 0.05 + dy, 0.2]} rotation={[0, 0.4, 0]}>
                <boxGeometry args={[0.26, 0.07, 0.34]} />
                <meshToonMaterial color={i === 1 ? '#56c2b0' : '#ffd479'} gradientMap={grad} />
              </mesh>
            ))}
        </group>
      );
    case 'contact': // a mailbox on a post with a raised flag and letter
      return (
        <group position={[ROOM_X, 0, 0]} onPointerOver={onPointerOver} onPointerOut={onPointerOut} onClick={onClick}>
          {/* Post */}
          <mesh position={[0, 0.3, 0]}>
            <boxGeometry args={[0.1, 0.6, 0.1]} />
            <meshToonMaterial color="#caa57f" gradientMap={grad} />
          </mesh>
          {/* Box */}
          <mesh position={[0, 0.7, 0]}>
            <boxGeometry args={[0.5, 0.32, 0.34]} />
            <meshToonMaterial color="#56c2b0" gradientMap={grad} />
          </mesh>
          {/* Flag */}
          <mesh position={[0.28, 0.78, 0]}>
            <boxGeometry args={[0.04, 0.16, 0.12]} />
            <meshStandardMaterial color="#ff9a62" emissive="#ff9a62" emissiveIntensity={0.5} toneMapped={false} />
          </mesh>
          {/* Letter sticking out */}
          <mesh position={[-0.15, 0.7, 0.18]} rotation={[0, 0.3, 0]}>
            <boxGeometry args={[0.2, 0.1, 0.02]} />
            <meshToonMaterial color="#ffffff" gradientMap={grad} />
          </mesh>
        </group>
      );
    default:
      return null;
  }
}

function Rooms() {
  const tier = useAppStore((s) => s.tier);
  const lite = tier !== 'high';
  return (
    <group>
      {floors.map((f) => (
        <group key={f.id} position={[0, f.level * SP, 0]}>
          <RoomProp id={f.id} accent={f.accent} ready={f.ready} lite={lite} />
        </group>
      ))}
    </group>
  );
}

export function ElevatorScene() {
  return (
    <>
      <BuildingShell />
      <ElevatorColumn />
      <Rooms />
      <ElevatorCameraRig />
    </>
  );
}
