import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import { Island } from '../Island';
import { HeroObject } from '../HeroObject';
import { cameraState } from '../../../lib/scroll';

/**
 * Presentation model 1: Floating Island (inspired by Jordan Breton).
 * Camera follows GSAP ScrollTrigger waypoints (see lib/scroll.ts) — a
 * "director's cue" orbit around the island per section.
 */

function IslandCameraRig() {
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

export function IslandScene() {
  return (
    <>
      <Island />
      <HeroObject />
      <IslandCameraRig />
    </>
  );
}
