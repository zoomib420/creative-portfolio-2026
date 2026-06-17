import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Box3, Vector3, type Mesh, type Group } from 'three';
import { useAppStore } from '../../lib/store';
import { ambientAudio } from '../../lib/audio';

/**
 * Real rooster GLB sitting on the rooftop. The source model can be any scale /
 * pivot, so we auto-normalise: measure its bounding box, scale it to a target
 * height, and recentre it so its feet rest at y=0. A gentle idle bob keeps it
 * alive. Mounted inside a <Suspense> whose fallback is the procedural rooster
 * (ElevatorScene.Rooster) — the 3D feature must never blank the screen.
 */

const MODEL_URL = '/models/rooster.glb';
const TARGET_HEIGHT = 1.7; // world units — clear on the rooftop without dominating it
const MODEL_YAW = Math.PI + 0.3; // face the camera, turned slightly to its right

export function RoosterModel() {
  const { scene } = useGLTF(MODEL_URL);
  const groupRef = useRef<Group>(null);

  // Clone so repeated mounts / fast-refresh don't mutate the cached scene.
  const model = useMemo(() => scene.clone(true), [scene]);

  // Normalise scale + pivot once, and turn on shadows for the diorama look.
  const { scale, offset } = useMemo(() => {
    const box = new Box3().setFromObject(model);
    const size = new Vector3();
    const center = new Vector3();
    box.getSize(size);
    box.getCenter(center);
    const s = size.y > 0 ? TARGET_HEIGHT / size.y : 1;
    // Recentre on X/Z, drop so the model's base (box.min.y) sits at y=0.
    return {
      scale: s,
      offset: new Vector3(-center.x * s, -box.min.y * s, -center.z * s),
    };
  }, [model]);

  useEffect(() => {
    model.traverse((o) => {
      const m = o as Mesh;
      if (m.isMesh) {
        m.castShadow = true;
        m.receiveShadow = true;
      }
    });
  }, [model]);

  useFrame(() => {
    if (!groupRef.current) return;
    const st = useAppStore.getState();
    const level = st.audioEnabled ? ambientAudio.getLevel() : 0;

    // React to the audio level (Ek-e-ek-ekkkk)
    // Subtle stretch to look natural, not a cartoon squash/stretch
    const pulseY = 1 + level * 0.1;
    const pulseXZ = 1 - level * 0.05;

    groupRef.current.scale.set(pulseXZ, pulseY, pulseXZ);
    // Only hop on beat, stand perfectly still otherwise
    groupRef.current.position.y = level * 0.15;
  });

  return (
    <group ref={groupRef} rotation={[0, MODEL_YAW, 0]}>
      <primitive object={model} scale={scale} position={offset.toArray()} />
    </group>
  );
}

useGLTF.preload(MODEL_URL);
