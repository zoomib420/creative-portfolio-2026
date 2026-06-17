import { useAppStore } from '../../lib/store';
import { ambientAudio } from '../../lib/audio';

/**
 * Mute/unmute the ambient Solfeggio pad and play a rooster crow!
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
      aria-label={audioEnabled ? 'ปิดเสียง' : 'เปิดเสียงไก่ขันและบรรยากาศ'}
      title={audioEnabled ? 'ปิดเสียง' : 'เปิดเสียงไก่ขันและบรรยากาศ'}
      className={`flex items-center justify-center text-lg transition-transform hover:scale-110 active:scale-95 ${audioEnabled ? '' : 'opacity-50 grayscale'}`}
    >
      <span aria-hidden>🐓</span>
    </button>
  );
}
