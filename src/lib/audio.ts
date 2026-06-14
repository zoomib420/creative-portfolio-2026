/**
 * Lightweight ambient audio using the Web Audio API (no extra deps).
 * Plays a soft Solfeggio-frequency pad. OFF by default; only starts after a
 * user gesture (browser autoplay policy) — see AGENTS.md §3 rule 5.
 *
 * This is intentionally minimal. The richer audio-reactive / Tone.js work
 * (driving shaders from FFT) is task T-11.
 */

class AmbientAudio {
  private ctx: AudioContext | null = null;
  private osc: OscillatorNode | null = null;
  private subOsc: OscillatorNode | null = null;
  private gain: GainNode | null = null;
  private currentHz = 528;

  /** Lazily create the AudioContext (must happen during a user gesture). */
  private ensureContext(): AudioContext {
    if (!this.ctx) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new Ctor();
    }
    return this.ctx;
  }

  get isPlaying(): boolean {
    return this.osc !== null;
  }

  async start(hz = this.currentHz): Promise<void> {
    if (this.isPlaying) {
      this.setFrequency(hz);
      return;
    }
    const ctx = this.ensureContext();
    if (ctx.state === 'suspended') await ctx.resume();

    this.currentHz = hz;
    const now = ctx.currentTime;

    this.gain = ctx.createGain();
    this.gain.gain.setValueAtTime(0.0001, now);
    this.gain.gain.exponentialRampToValueAtTime(0.04, now + 2); // very soft pad
    this.gain.connect(ctx.destination);

    this.osc = ctx.createOscillator();
    this.osc.type = 'sine';
    this.osc.frequency.setValueAtTime(hz, now);
    this.osc.connect(this.gain);
    this.osc.start();

    // gentle sub one octave down for warmth
    this.subOsc = ctx.createOscillator();
    this.subOsc.type = 'sine';
    this.subOsc.frequency.setValueAtTime(hz / 2, now);
    const subGain = ctx.createGain();
    subGain.gain.setValueAtTime(0.5, now);
    this.subOsc.connect(subGain).connect(this.gain);
    this.subOsc.start();
  }

  setFrequency(hz: number): void {
    if (!this.ctx || !this.osc || !this.subOsc) return;
    this.currentHz = hz;
    const t = this.ctx.currentTime + 0.3;
    this.osc.frequency.linearRampToValueAtTime(hz, t);
    this.subOsc.frequency.linearRampToValueAtTime(hz / 2, t);
  }

  stop(): void {
    if (!this.ctx || !this.gain) return;
    const now = this.ctx.currentTime;
    this.gain.gain.cancelScheduledValues(now);
    this.gain.gain.setValueAtTime(this.gain.gain.value, now);
    this.gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
    const osc = this.osc;
    const subOsc = this.subOsc;
    window.setTimeout(() => {
      osc?.stop();
      subOsc?.stop();
    }, 900);
    this.osc = null;
    this.subOsc = null;
  }
}

export const ambientAudio = new AmbientAudio();
