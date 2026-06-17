/**
 * Rooster crow, synthesised with the Web Audio API to sound like a real
 * "เอ้ก-อี-เอ้ก-เอ้กกก" (cock-a-doodle-doo):
 *   - sawtooth + slight detune for a buzzy, throaty timbre
 *   - a band-pass "formant" so it honks like a bird rather than beeping
 *   - per-syllable pitch glides + a vibrato warble on the long final note
 * A faked getLevel() keeps the 3D rooster bopping in time with each syllable.
 */

interface Syllable {
  d: number;   // duration (s)
  f0: number;  // start frequency (Hz)
  f1: number;  // end frequency (Hz)
  g: number;   // peak gain
  vib?: boolean; // warble (vibrato) — used on the long tail
}

class RoosterAudio {
  private isPlaying = false;
  private timer: number | null = null;
  private ctx: AudioContext | null = null;
  private fakeLevel = 0;
  private smoothedLevel = 0;
  private noise: AudioBuffer | null = null;

  /** White-noise buffer (cached) for the raspy breath at each syllable onset. */
  private noiseBuffer(ctx: AudioContext): AudioBuffer {
    if (this.noise) return this.noise;
    const len = Math.floor(ctx.sampleRate * 0.3);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    this.noise = buf;
    return buf;
  }

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
    const total = this.scheduleCrow(this.ctx, this.ctx.currentTime + 0.1);
    // Crow, then a natural pause before the next one.
    this.timer = window.setTimeout(this.playLoop, (total + 2.0) * 1000);
  };

  /** Schedule one full crow on the audio graph. Returns its total length (s). */
  private scheduleCrow(ctx: AudioContext, t0: number): number {
    // Voice chain: oscillators → voiceIn → two parallel vowel formants →
    // low-pass smoother → compressor → master → out. The twin band-passes give
    // a throaty, vowel-like "honk" instead of a plain beep.
    const voiceIn = ctx.createGain();
    const f1 = ctx.createBiquadFilter();
    f1.type = 'bandpass'; f1.frequency.value = 700; f1.Q.value = 5;
    const f2 = ctx.createBiquadFilter();
    f2.type = 'bandpass'; f2.frequency.value = 1180; f2.Q.value = 7;
    voiceIn.connect(f1);
    voiceIn.connect(f2);

    const soften = ctx.createBiquadFilter();
    soften.type = 'lowpass'; soften.frequency.value = 4200;

    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18; comp.ratio.value = 4;

    const master = ctx.createGain();
    master.gain.value = 0.45;

    f1.connect(soften);
    f2.connect(soften);
    soften.connect(comp);
    comp.connect(master);
    master.connect(ctx.destination);

    // "เอ้ก - อี - เอ้ก - เอ้กกกก"  (cock-a-doodle-doo)
    const syllables: Syllable[] = [
      { d: 0.16, f0: 300, f1: 480, g: 0.14 },
      { d: 0.13, f0: 520, f1: 600, g: 0.12 },
      { d: 0.18, f0: 440, f1: 580, g: 0.14 },
      { d: 0.85, f0: 620, f1: 400, g: 0.15, vib: true },
    ];

    let t = t0;
    syllables.forEach((s, i) => {
      // Two detuned saws = a thicker, more "animal" crow.
      [-7, 7].forEach((detune) => {
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.detune.value = detune;
        osc.frequency.setValueAtTime(s.f0, t);
        // glide in from the previous pitch for a connected, vocal contour
        if (i > 0) osc.frequency.setValueAtTime(syllables[i - 1].f1, t - 0.02);
        if (s.vib) {
          // overshoot up, then warble down — the classic dragged-out tail
          osc.frequency.linearRampToValueAtTime(s.f1 + 70, t + s.d * 0.5);
          osc.frequency.linearRampToValueAtTime(s.f1, t + s.d);
        } else {
          osc.frequency.linearRampToValueAtTime(s.f1, t + s.d);
        }

        const g = ctx.createGain();
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(s.g, t + 0.025);
        g.gain.setValueAtTime(s.g, t + s.d * 0.7);
        g.gain.exponentialRampToValueAtTime(0.001, t + s.d);

        osc.connect(g);
        g.connect(voiceIn);
        osc.start(t);
        osc.stop(t + s.d + 0.03);

        // Vibrato LFO modulating pitch — the rattly warble on the long note.
        if (s.vib) {
          const lfo = ctx.createOscillator();
          lfo.type = 'sine';
          lfo.frequency.value = 8;
          const lfoGain = ctx.createGain();
          lfoGain.gain.setValueAtTime(0, t);
          lfoGain.gain.linearRampToValueAtTime(34, t + 0.18);
          lfo.connect(lfoGain);
          lfoGain.connect(osc.frequency);
          lfo.start(t);
          lfo.stop(t + s.d + 0.03);
        }
      });

      // Raspy breath transient at the syllable onset — the "squawk" attack.
      const noiseSrc = ctx.createBufferSource();
      noiseSrc.buffer = this.noiseBuffer(ctx);
      const nbp = ctx.createBiquadFilter();
      nbp.type = 'bandpass'; nbp.frequency.value = 1900; nbp.Q.value = 1.2;
      const ng = ctx.createGain();
      ng.gain.setValueAtTime(0, t);
      ng.gain.linearRampToValueAtTime(0.05, t + 0.01);
      ng.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
      noiseSrc.connect(nbp);
      nbp.connect(ng);
      ng.connect(comp);
      noiseSrc.start(t);
      noiseSrc.stop(t + 0.08);

      // Pulse the 3D rooster's scale/emissive on each syllable.
      const startMs = (t - ctx.currentTime) * 1000;
      setTimeout(() => { if (this.isPlaying) this.fakeLevel = 1.0; }, startMs);
      setTimeout(() => { if (this.isPlaying) this.fakeLevel = 0.0; }, startMs + s.d * 850);

      t += s.d + (i < syllables.length - 1 ? 0.05 : 0);
    });

    return t - t0;
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
