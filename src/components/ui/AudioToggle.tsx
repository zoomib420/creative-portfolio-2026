import { useAppStore } from '../../lib/store';
import { ambientAudio } from '../../lib/audio';

/**
 * Mute/unmute the ambient Solfeggio pad. Off by default. Starting audio counts
 * as the user gesture, so it satisfies the browser autoplay policy.
 */
export function AudioToggle() {
  const audioEnabled = useAppStore((s) => s.audioEnabled);
  const setAudioEnabled = useAppStore((s) => s.setAudioEnabled);
  const markUserGesture = useAppStore((s) => s.markUserGesture);

  const toggle = async () => {
    markUserGesture();
    if (audioEnabled) {
      ambientAudio.stop();
      setAudioEnabled(false);
    } else {
      await ambientAudio.start();
      setAudioEnabled(true);
    }
  };

  return (
    <button
      onClick={toggle}
      aria-pressed={audioEnabled}
      aria-label={audioEnabled ? 'ปิดเสียง' : 'เปิดเสียงบรรยากาศ'}
      title={audioEnabled ? 'ปิดเสียง' : 'เปิดเสียงบรรยากาศ (Solfeggio)'}
      className="flex items-center gap-1.5 text-[var(--color-muted)] transition-colors hover:text-[var(--color-accent)]"
    >
      <span aria-hidden className={audioEnabled ? 'text-[var(--color-accent)]' : ''}>
        {audioEnabled ? '♪' : '♪̸'}
      </span>
    </button>
  );
}
