import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { useAppStore } from '../../lib/store';

/**
 * Post-processing (WebGL only). Tuned soft & cozy — just a gentle glow on the
 * highlights and a whisper of vignette. No heavy grain/chromatic; the cozy
 * look wants to stay bright and clean.
 */
export function PostFX() {
  const tier = useAppStore((s) => s.tier);
  const high = tier === 'high';

  return (
    <EffectComposer enableNormalPass={false} multisampling={high ? 4 : 0}>
      <Bloom
        intensity={high ? 0.5 : 0.35}
        luminanceThreshold={0.6}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
      <Vignette eskil={false} offset={0.35} darkness={0.35} />
    </EffectComposer>
  );
}
