import { EffectComposer, Bloom, Vignette, Noise, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { Vector2 } from 'three';
import { useMemo, type ReactElement } from 'react';
import { useAppStore } from '../../lib/store';

/**
 * Post-processing stack (WebGL only — @react-three/postprocessing doesn't
 * support WebGPU yet). Gives the scene its cinematic, hand-finished feel:
 *   - Bloom        : emissive crystal / motes / panels glow
 *   - Vignette     : draws the eye in, adds depth
 *   - Noise (grain): organic film texture — kills the "clean digital render" look
 *   - Chromatic    : subtle lens fringing (high tier only)
 *
 * Tiered so the standard (lower-power) tier runs a lighter stack.
 */
export function PostFX() {
  const tier = useAppStore((s) => s.tier);
  const high = tier === 'high';
  const caOffset = useMemo(() => new Vector2(0.0006, 0.0006), []);

  const effects: ReactElement[] = [
    <Bloom
      key="bloom"
      intensity={high ? 0.9 : 0.6}
      luminanceThreshold={0.25}
      luminanceSmoothing={0.9}
      mipmapBlur
    />,
    <Vignette key="vignette" eskil={false} offset={0.25} darkness={high ? 0.85 : 0.7} />,
    <Noise
      key="noise"
      premultiply
      blendFunction={BlendFunction.SOFT_LIGHT}
      opacity={high ? 0.32 : 0.22}
    />,
  ];

  if (high) {
    effects.push(
      <ChromaticAberration
        key="ca"
        blendFunction={BlendFunction.NORMAL}
        offset={caOffset}
        radialModulation={false}
        modulationOffset={0}
      />,
    );
  }

  return (
    <EffectComposer enableNormalPass={false} multisampling={high ? 4 : 0}>
      {effects}
    </EffectComposer>
  );
}
