import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Color, Vector3, type Mesh, type Group } from 'three';
import { useAppStore } from '../../../lib/store';
import { scrollState } from '../../../lib/scroll';

/**
 * Presentation model 3: Scroll-driven storytelling (inspired by Bilal El
 * Moussaoui). A glowing character orb travels forward along a path as you
 * scroll; the environment colour and lighting shift through the journey while
 * the camera follows behind. Project details live in the DOM overlay.
 */

const PATH_LENGTH = 60;
const MOOD_START = new Color('#ffe6c9'); // warm peach dawn
const MOOD_END = new Color('#d9ece2'); // soft mint dusk

function FloatingShapes({ count }: { count: number }) {
  const ref = useRef<Group>(null);
  const shapes = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        x: (Math.random() - 0.5) * 14,
        y: 1 + Math.random() * 6,
        z: -(i / count) * PATH_LENGTH - Math.random() * 4,
        s: 0.3 + Math.random() * 0.8,
        phase: Math.random() * Math.PI * 2,
        accent: Math.random() > 0.5 ? '#ff9a62' : '#56c2b0',
      })),
    [count],
  );

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.children.forEach((child, i) => {
      child.position.y = shapes[i].y + Math.sin(t * 0.5 + shapes[i].phase) * 0.4;
      child.rotation.y += 0.003;
    });
  });

  return (
    <group ref={ref}>
      {shapes.map((s, i) => (
        <mesh key={i} position={[s.x, s.y, s.z]} scale={s.s} castShadow>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color={s.accent}
            emissive={s.accent}
            emissiveIntensity={0.5}
            flatShading
            roughness={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

function StoryRig() {
  const { camera, scene } = useThree();
  const orbRef = useRef<Mesh>(null);
  const orbLight = useRef<Group>(null);
  const audioEnabled = useAppStore((s) => s.audioEnabled);
  const look = useRef(new Vector3(0, 1, -4));
  const moodColor = useMemo(() => new Color(), []);

  useFrame((state) => {
    const p = scrollState.progress;
    const t = state.clock.elapsedTime;
    const orbZ = 2 - p * PATH_LENGTH;
    const bob = Math.sin(t * 1.5) * 0.25;

    if (orbRef.current) {
      orbRef.current.position.set(Math.sin(t * 0.6) * 0.8, 1.2 + bob, orbZ);
      orbRef.current.rotation.y += 0.01;
    }
    if (orbLight.current) {
      orbLight.current.position.set(0, 1.4 + bob, orbZ);
    }

    // camera follows behind the orb
    camera.position.x += (Math.sin(t * 0.3) * 1.2 - camera.position.x) * 0.04;
    camera.position.y += (2 - camera.position.y) * 0.04;
    camera.position.z += (orbZ + 5 - camera.position.z) * 0.06;
    look.current.x += (0 - look.current.x) * 0.05;
    look.current.y += (1.2 - look.current.y) * 0.05;
    look.current.z += (orbZ - look.current.z) * 0.06;
    camera.lookAt(look.current);

    // environment mood shifts along the journey
    moodColor.copy(MOOD_START).lerp(MOOD_END, p);
    if (scene.background instanceof Color) scene.background.copy(moodColor);
    if (scene.fog) (scene.fog as { color: Color }).color.copy(moodColor);
  });

  const level = audioEnabled ? 1 : 0;

  return (
    <>
      {/* ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -PATH_LENGTH / 2]} receiveShadow>
        <planeGeometry args={[40, PATH_LENGTH + 20]} />
        <meshStandardMaterial color="#ecd9bb" roughness={0.95} />
      </mesh>

      {/* the character orb — warm firefly */}
      <mesh ref={orbRef} position={[0, 1.2, 2]} castShadow>
        <icosahedronGeometry args={[0.4, 2]} />
        <meshStandardMaterial
          color="#ffd479"
          emissive="#ff9a62"
          emissiveIntensity={1.4 + level * 0.6}
          toneMapped={false}
        />
      </mesh>
      <group ref={orbLight}>
        <pointLight intensity={2.2} color="#ffb866" distance={12} />
      </group>

      <StoryRigShapesAnchor />
    </>
  );
}

// kept separate so shape count can read the tier without re-rendering the rig
function StoryRigShapesAnchor() {
  const tier = useAppStore((s) => s.tier);
  return <FloatingShapes count={tier === 'high' ? 40 : 18} />;
}

export function ScrollstoryScene() {
  return <StoryRig />;
}
