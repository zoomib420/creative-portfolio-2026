import { useAppStore } from '../../lib/store';

/**
 * Small dev/debug badge that shows the active fidelity tier and why.
 * Helpful while building. Hide in production by gating on import.meta.env.DEV.
 */
export function FidelityBadge() {
  const caps = useAppStore((s) => s.capabilities);
  if (!caps || !import.meta.env.DEV) return null;

  const color =
    caps.tier === 'high'
      ? 'var(--color-accent)'
      : caps.tier === 'standard'
        ? 'var(--color-accent-2)'
        : 'var(--color-muted)';

  return (
    <div className="content-layer fixed bottom-3 left-3 z-50 rounded-md border border-[var(--color-glow)] bg-[var(--color-ink)]/80 px-3 py-1.5 font-mono text-[10px] text-[var(--color-muted)] backdrop-blur">
      <span style={{ color }}>● {caps.tier.toUpperCase()}</span>{' '}
      <span className="opacity-70">{caps.reason}</span>
      <span className="opacity-50">
        {' '}
        · gpu:{caps.hasWebGPU ? '1' : '0'} gl2:{caps.hasWebGL2 ? '1' : '0'}
      </span>
    </div>
  );
}
