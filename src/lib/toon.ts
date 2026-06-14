import { DataTexture, RedFormat, NearestFilter, type Texture } from 'three';

/**
 * Builds a tiny gradient map for MeshToonMaterial — the number of steps = the
 * number of flat shading bands. Few steps (3–4) read as cel / illustrated,
 * which is the "hand-drawn" feel we're going for (renderer-agnostic, works on
 * WebGL and WebGPU).
 */
const cache = new Map<number, Texture>();

export function toonGradient(steps = 4): Texture {
  const cached = cache.get(steps);
  if (cached) return cached;

  const data = new Uint8Array(steps);
  for (let i = 0; i < steps; i++) {
    data[i] = Math.round((i / (steps - 1)) * 255);
  }
  const tex = new DataTexture(data, steps, 1, RedFormat);
  tex.minFilter = NearestFilter;
  tex.magFilter = NearestFilter;
  tex.generateMipmaps = false;
  tex.needsUpdate = true;
  cache.set(steps, tex);
  return tex;
}
