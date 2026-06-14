/**
 * Device capability detection -> Fidelity tier.
 *
 * Multi-tier fidelity (from the strategy doc):
 *   - "high"     : WebGPU available            -> full 3D + heavy effects, 120fps target
 *   - "standard" : WebGL2 available (no WebGPU) -> reduced lighting/shadows
 *   - "basic"    : neither / low-power / reduced-motion -> 2D grid fallback
 *
 * This module is intentionally dependency-free and runs before React mounts,
 * so the app can decide whether to even load the heavy 3D bundle.
 */

export type FidelityTier = 'high' | 'standard' | 'basic';

export interface Capabilities {
  tier: FidelityTier;
  hasWebGPU: boolean;
  hasWebGL2: boolean;
  prefersReducedMotion: boolean;
  isCoarsePointer: boolean;
  deviceMemoryGB: number | null;
  hardwareConcurrency: number | null;
  reason: string;
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function isCoarsePointer(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(pointer: coarse)').matches;
}

function detectWebGL2(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!canvas.getContext('webgl2');
  } catch {
    return false;
  }
}

/**
 * WebGPU presence is async (adapter request). Returns false on any failure.
 * Typed loosely to avoid depending on @webgpu/types in the client bundle.
 */
async function detectWebGPU(): Promise<boolean> {
  try {
    const gpu = (navigator as unknown as { gpu?: { requestAdapter(): Promise<unknown> } }).gpu;
    if (!gpu) return false;
    const adapter = await gpu.requestAdapter();
    return !!adapter;
  } catch {
    return false;
  }
}

const VALID_TIERS: FidelityTier[] = ['high', 'standard', 'basic'];

/** Allow forcing a tier via ?tier= or VITE_FORCE_TIER for testing. */
function forcedTier(): FidelityTier | null {
  const fromEnv = import.meta.env.VITE_FORCE_TIER as string | undefined;
  let value = fromEnv?.trim() || '';
  if (typeof window !== 'undefined') {
    const fromQuery = new URLSearchParams(window.location.search).get('tier');
    if (fromQuery) value = fromQuery.trim();
  }
  return VALID_TIERS.includes(value as FidelityTier) ? (value as FidelityTier) : null;
}

export async function detectCapabilities(): Promise<Capabilities> {
  const reducedMotion = prefersReducedMotion();
  const coarse = isCoarsePointer();
  const hasWebGL2 = detectWebGL2();
  const hasWebGPU = await detectWebGPU();

  const nav = navigator as Navigator & {
    deviceMemory?: number;
    hardwareConcurrency?: number;
  };
  const deviceMemoryGB = nav.deviceMemory ?? null;
  const hardwareConcurrency = nav.hardwareConcurrency ?? null;

  const lowPower =
    (deviceMemoryGB !== null && deviceMemoryGB <= 4) ||
    (hardwareConcurrency !== null && hardwareConcurrency <= 4);

  const forced = forcedTier();

  let tier: FidelityTier;
  let reason: string;

  if (forced) {
    tier = forced;
    reason = `forced via ?tier / VITE_FORCE_TIER (${forced})`;
  } else if (reducedMotion) {
    tier = 'basic';
    reason = 'prefers-reduced-motion';
  } else if (hasWebGPU && !lowPower) {
    tier = 'high';
    reason = 'WebGPU available';
  } else if (hasWebGL2 && !lowPower) {
    tier = 'standard';
    reason = hasWebGPU ? 'WebGPU present but low-power device' : 'WebGL2 only';
  } else {
    tier = 'basic';
    reason = lowPower ? 'low-power device' : 'no WebGL2/WebGPU';
  }

  // Mobile / touch devices: cap at 'standard' to save battery and avoid
  // jank from the heaviest effects (unless a tier was explicitly forced).
  if (!forced && coarse && tier === 'high') {
    tier = 'standard';
    reason = 'coarse pointer (mobile) — capped from high';
  }

  // Very small viewports also fall back to the lighter standard path.
  if (!forced && tier === 'high' && typeof window !== 'undefined' && window.innerWidth < 640) {
    tier = 'standard';
    reason = 'small viewport — capped from high';
  }

  return {
    tier,
    hasWebGPU,
    hasWebGL2,
    prefersReducedMotion: reducedMotion,
    isCoarsePointer: coarse,
    deviceMemoryGB,
    hardwareConcurrency,
    reason,
  };
}
