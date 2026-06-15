import { profile } from '../../data/profile';
import { scrollToSection } from '../../lib/scroll';
import { AudioToggle } from './AudioToggle';

function handleNavClick(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
  e.preventDefault();
  scrollToSection(id);
}

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
        <a
          href="#work"
          onClick={(e) => handleNavClick(e, 'work')}
          className="hidden transition-colors hover:text-[var(--color-accent)] sm:inline"
        >
          Work
        </a>
        <a
          href="#tech"
          onClick={(e) => handleNavClick(e, 'tech')}
          className="hidden transition-colors hover:text-[var(--color-accent)] sm:inline"
        >
          Tech
        </a>
        <a
          href="#about"
          onClick={(e) => handleNavClick(e, 'about')}
          className="hidden transition-colors hover:text-[var(--color-accent)] sm:inline"
        >
          About
        </a>
        <a
          href="#contact"
          onClick={(e) => handleNavClick(e, 'contact')}
          className="transition-colors hover:text-[var(--color-accent)]"
        >
          Contact
        </a>
        <AudioToggle />
      </nav>
    </header>
  );
}
