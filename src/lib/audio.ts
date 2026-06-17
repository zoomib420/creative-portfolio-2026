/**
 * Rooster Audio: Uses SpeechSynthesis to say "เอ้ก อี เอ้ก เอ้กกกกกกกก"
 * and fakes the getLevel() so the 3D Rooster still bops to the beat!
 */

class RoosterAudio {
  private isPlaying = false;
  private timer: number | null = null;
  private ctx: AudioContext | null = null;
  private fakeLevel = 0;
  private smoothedLevel = 0;

  async start(): Promise<void> {
    if (this.isPlaying) return;
    this.isPlaying = true;
    
    if (!this.ctx) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new Ctor();
    }
    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
    
    this.playLoop();
  }

  private playLoop = () => {
    if (!this.isPlaying || !this.ctx) return;
    
    const ctx = this.ctx;
    let startTime = ctx.currentTime + 0.1;

    // "Ek - e - Ek - Ekkkk" rhythm
    // Using softer triangle waves to avoid hurting ears
    const notes = [
      { f: 400, d: 0.15 }, 
      { f: 300, d: 0.15 }, 
      { f: 400, d: 0.15 }, 
      { f: 500, d: 0.6 },  
    ];

    notes.forEach((note) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle'; // Soft tone!
      osc.frequency.value = note.f;

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.15, startTime + 0.02); // VERY soft volume
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + note.d);

      // Pitch bend for a vocal "chirp" effect
      osc.frequency.setValueAtTime(note.f - 50, startTime);
      osc.frequency.linearRampToValueAtTime(note.f, startTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + note.d);

      // Pulse the 3D rooster's scale/emissive for each syllable
      const startMs = (startTime - ctx.currentTime) * 1000;
      setTimeout(() => { if (this.isPlaying) this.fakeLevel = 1.0; }, startMs);
      setTimeout(() => { if (this.isPlaying) this.fakeLevel = 0.0; }, startMs + note.d * 800);

      startTime += note.d + 0.05; // Gap between syllables
    });

    // Loop every 3 seconds
    this.timer = window.setTimeout(this.playLoop, 3000);
  }

  stop(): void {
    this.isPlaying = false;
    this.fakeLevel = 0;
    if (this.timer !== null) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  getLevel(): number {
    if (!this.isPlaying) return 0;
    // Smooth out the fake level for pleasing visual bops
    this.smoothedLevel = this.smoothedLevel * 0.8 + this.fakeLevel * 0.2;
    return this.smoothedLevel;
  }

  setFrequency(hz: number): void {
    void hz;
  }
}

export const ambientAudio = new RoosterAudio();
export function playSyntheticRooster() {} // Dummy to avoid breaking imports
