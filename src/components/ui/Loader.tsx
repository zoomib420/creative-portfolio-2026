interface LoaderProps {
  label?: string;
}

export function Loader({ label = 'Loading…' }: LoaderProps) {
  return (
    <div className="content-layer flex h-screen w-screen flex-col items-center justify-center gap-6 bg-[var(--color-void)]">
      <div
        className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--color-glow)] border-t-[var(--color-accent)]"
        role="status"
        aria-label={label}
      />
      <p className="text-sm tracking-wide text-[var(--color-muted)]">{label}</p>
    </div>
  );
}
