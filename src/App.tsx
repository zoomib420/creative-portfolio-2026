import { Suspense, lazy, useEffect } from 'react';
import { useAppStore } from './lib/store';
import { detectCapabilities } from './lib/capabilities';
import { Loader } from './components/ui/Loader';
import { Nav } from './components/ui/Nav';
import { FidelityBadge } from './components/ui/FidelityBadge';
import { ProjectModal } from './components/ui/ProjectModal';
import { AIGuide } from './components/ui/AIGuide';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { ElevatorNav } from './components/ui/ElevatorNav';
import { Grid2D } from './components/fallback/Grid2D';

// Heavy 3D experience is code-split: the basic (2D) tier never downloads it.
const Experience3D = lazy(() => import('./components/three/Experience3D'));

export function App() {
  const capabilities = useAppStore((s) => s.capabilities);
  const tier = useAppStore((s) => s.tier);
  const setCapabilities = useAppStore((s) => s.setCapabilities);
  const markUserGesture = useAppStore((s) => s.markUserGesture);

  // Detect device capabilities once on mount.
  useEffect(() => {
    let cancelled = false;
    detectCapabilities().then((caps) => {
      if (!cancelled) setCapabilities(caps);
      console.info('[capabilities]', caps);
    });
    return () => {
      cancelled = true;
    };
  }, [setCapabilities]);

  // Audio/animation that needs a user gesture (browser autoplay policy).
  useEffect(() => {
    const onFirstGesture = () => markUserGesture();
    window.addEventListener('pointerdown', onFirstGesture, { once: true });
    window.addEventListener('keydown', onFirstGesture, { once: true });
    return () => {
      window.removeEventListener('pointerdown', onFirstGesture);
      window.removeEventListener('keydown', onFirstGesture);
    };
  }, [markUserGesture]);

  if (!capabilities) {
    return <Loader label="กำลังตรวจสอบอุปกรณ์ของคุณ…" />;
  }

  const use3D = tier === 'high' || tier === 'standard';

  return (
    <>
      <a className="skip-link" href="#work">
        ข้ามไปยังเนื้อหา
      </a>
      <Nav />
      <FidelityBadge />

      {use3D ? (
        <ErrorBoundary fallback={<Grid2D />}>
          <Suspense fallback={<Loader label="กำลังโหลดโลก 3D…" />}>
            <Experience3D />
          </Suspense>
        </ErrorBoundary>
      ) : (
        <Grid2D />
      )}

      {use3D && <ElevatorNav />}
      <ProjectModal />
      <AIGuide />
    </>
  );
}
