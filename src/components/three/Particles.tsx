import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { InstancedMesh, Object3D } from 'three';

/**
 * A simple particle system to add floating dust motes/fireflies
 * around the elevator scene, enhancing the cozy/dreamy vibe.
 */
export function Particles({ count = 100, height = 30 }) {
  const meshRef = useRef<InstancedMesh>(null);
  
  // Pre-calculate random positions, phases, and speeds
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 6; // spread across width
      const y = Math.random() * height - 2; // spread across building height
      const z = (Math.random() - 0.5) * 4; // spread across depth
      const speed = 0.1 + Math.random() * 0.2;
      const phase = Math.random() * Math.PI * 2;
      temp.push({ x, y, z, speed, phase });
    }
    return temp;
  }, [count, height]);

  const dummy = useMemo(() => new Object3D(), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();

    particles.forEach((p, i) => {
      // Gentle floating animation
      const currentY = p.y + Math.sin(time * p.speed + p.phase) * 0.5;
      const currentX = p.x + Math.cos(time * p.speed * 0.5 + p.phase) * 0.2;
      
      dummy.position.set(currentX, currentY, p.z);
      
      // Pulse scale
      const scale = 0.5 + Math.sin(time * p.speed * 2 + p.phase) * 0.5;
      dummy.scale.set(scale, scale, scale);
      
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.02, 4, 4]} />
      <meshBasicMaterial color="#ffe9cf" transparent opacity={0.6} />
    </instancedMesh>
  );
}
