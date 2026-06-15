import { useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3, Color } from 'three';
import { projects } from '../../../data/projects';
import { useAppStore } from '../../../lib/store';
import { scrollState } from '../../../lib/scroll';

/**
 * Presentation model 2: 3D Walk-through (inspired by Hot Dogtor).
 * A corridor of rooms — one per project. The camera dollies forward as the
 * visitor scrolls; each room has a glowing panel you can click to open the
 * project. Details stay in the DOM overlay (no text rendered in 3D).
 */

const SPACING = 7;
const ACCENTS = ['#ff9a62', '#56c2b0', '#ffd479', '#c7a6e6'];

function Room({ index, accent }: { index: number; accent: string }) {
  const z = -index * SPACING;
  const side = index % 2 === 0 ? 1 : -1;
  const openProject = useAppStore((s) => s.openProject);
  const project = projects[index];
  const [hover, setHover] = useState(false);
  const color = useMemo(() => new Color(accent), [accent]);

  return (
    <group position={[0, 0, z]}>
      {/* doorway frame */}
      <mesh position={[side * 2.6, 1.4, 0]} castShadow>
        <boxGeometry args={[0.15, 3, 2.4]} />
        <meshStandardMaterial color="#caa57f" roughness={0.8} />
      </mesh>
      {/* glowing project panel */}
      <mesh
        position={[side * 2.45, 1.4, 0]}
        rotation={[0, side * -Math.PI * 0.5, 0]}
        onClick={(e) => {
          e.stopPropagation();
          if (project) openProject(project.id);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHover(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHover(false);
          document.body.style.cursor = 'auto';
        }}
        scale={hover ? 1.06 : 1}
      >
        <planeGeometry args={[1.8, 2.2]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hover ? 1.6 : 0.8}
          toneMapped={false}
        />
      </mesh>
      <pointLight position={[side * 1.8, 1.8, 0]} intensity={1.2} color={accent} distance={8} />
    </group>
  );
}

function WalkCameraRig() {
  const { camera } = useThree();
  const look = useRef(new Vector3(0, 1.2, -4));
  const length = (projects.length - 1) * SPACING + 4;

  useFrame(() => {
    const p = scrollState.progress;
    const targetZ = 5 - p * length;
    camera.position.x += (0 - camera.position.x) * 0.06;
    camera.position.y += (1.5 - camera.position.y) * 0.06;
    camera.position.z += (targetZ - camera.position.z) * 0.06;

    const lz = targetZ - 5;
    look.current.x += (0 - look.current.x) * 0.06;
    look.current.y += (1.2 - look.current.y) * 0.06;
    look.current.z += (lz - look.current.z) * 0.06;
    camera.lookAt(look.current);
  });

  return null;
}

export function WalkthroughScene() {
  const length = projects.length * SPACING;
  return (
    <>
      {/* floor — warm wood */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -length / 2 + 3]} receiveShadow>
        <planeGeometry args={[8, length + 12]} />
        <meshStandardMaterial color="#e8d3b3" roughness={0.85} />
      </mesh>
      {/* warm ceiling light strip */}
      <mesh position={[0, 3.2, -length / 2 + 3]}>
        <boxGeometry args={[0.4, 0.05, length + 12]} />
        <meshStandardMaterial color="#fff0cf" emissive="#ffdfa0" emissiveIntensity={0.7} />
      </mesh>

      {projects.map((p, i) => (
        <Room key={p.id} index={i} accent={ACCENTS[i % ACCENTS.length]} />
      ))}

      <WalkCameraRig />
    </>
  );
}
