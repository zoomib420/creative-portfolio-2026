import { profile } from '../../data/profile';
import { AudioToggle } from './AudioToggle';

export function Nav() {
  return (
    <header className="content-layer fixed top-0 left-0 z-30 flex w-full items-center justify-between px-6 py-5 md:px-10">
      <a
        href="#top"
        className="font-[var(--font-display)] text-sm font-semibold tracking-[0.2em] text-[var(--color-mist)] uppercase"
      >
        {profile.handle}
      </a>
      <nav className="flex items-center gap-5 text-xs tracking-widest text-[var(--color-muted)] uppercase md:gap-6">
        <a href="#work" className="hidden transition-colors hover:text-[var(--color-accent)] sm:inline">
          Work
        </a>
        <a href="#about" className="hidden transition-colors hover:text-[var(--color-accent)] sm:inline">
          About
        </a>
        <a href="#contact" className="transition-colors hover:text-[var(--color-accent)]">
          Contact
        </a>
        <AudioToggle />
      </nav>
    </header>
  );
}
