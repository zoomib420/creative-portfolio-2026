/**
 * Lightweight ambient audio using the Web Audio API (no extra deps).
 * Plays a soft Solfeggio-frequency pad with a slow LFO so the amplitude
 * "breathes" — which makes the FFT analyser produce motion that the 3D scene
 * reacts to (Task T-11). OFF by default; only starts after a user gesture
 * (browser autoplay policy) — see AGENTS.md §3 rule 5.
 */

class AmbientAudio {
  private ctx: AudioContext | null = null;
  private osc: OscillatorNode | null = null;
  private subOsc: OscillatorNode | null = null;
  private lfo: OscillatorNode | null = null;
  private lfoGain: GainNode | null = null;
  private master: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private freqData: Uint8Array | null = null;
  private currentHz = 528;
  private smoothedLevel = 0;

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

    // master gain (soft) -> analyser -> destination
    this.master = ctx.createGain();
    this.master.gain.setValueAtTime(0.0001, now);
    this.master.gain.exponentialRampToValueAtTime(0.06, now + 2);

    this.analyser = ctx.createAnalyser();
    this.analyser.fftSize = 256;
    this.analyser.smoothingTimeConstant = 0.8;
    this.freqData = new Uint8Array(this.analyser.frequencyBinCount);

    this.master.connect(this.analyser);
    this.analyser.connect(ctx.destination);

    // main tone
    this.osc = ctx.createOscillator();
    this.osc.type = 'sine';
    this.osc.frequency.setValueAtTime(hz, now);
    this.osc.connect(this.master);
    this.osc.start();

    // sub one octave down for warmth
    this.subOsc = ctx.createOscillator();
    this.subOsc.type = 'sine';
    this.subOsc.frequency.setValueAtTime(hz / 2, now);
    const subGain = ctx.createGain();
    subGain.gain.setValueAtTime(0.5, now);
    this.subOsc.connect(subGain).connect(this.master);
    this.subOsc.start();

    // slow LFO modulating master gain → "breathing" amplitude for reactivity
    this.lfo = ctx.createOscillator();
    this.lfo.frequency.setValueAtTime(0.15, now); // ~6.5s cycle
    this.lfoGain = ctx.createGain();
    this.lfoGain.gain.setValueAtTime(0.03, now);
    this.lfo.connect(this.lfoGain).connect(this.master.gain);
    this.lfo.start();
  }

  setFrequency(hz: number): void {
    if (!this.ctx || !this.osc || !this.subOsc) return;
    this.currentHz = hz;
    const t = this.ctx.currentTime + 0.4;
    this.osc.frequency.linearRampToValueAtTime(hz, t);
    this.subOsc.frequency.linearRampToValueAtTime(hz / 2, t);
  }

  /** Smoothed 0..1 audio level for driving visuals. Returns 0 when silent. */
  getLevel(): number {
    if (!this.analyser || !this.freqData) return 0;
    this.analyser.getByteFrequencyData(this.freqData as Uint8Array<ArrayBuffer>);
    let sum = 0;
    for (let i = 0; i < this.freqData.length; i++) sum += this.freqData[i];
    const avg = sum / this.freqData.length / 255; // 0..1
    this.smoothedLevel += (avg - this.smoothedLevel) * 0.1;
    return this.smoothedLevel;
  }

  stop(): void {
    if (!this.ctx || !this.master) return;
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(this.master.gain.value, now);
    this.master.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
    const { osc, subOsc, lfo } = this;
    window.setTimeout(() => {
      osc?.stop();
      subOsc?.stop();
      lfo?.stop();
    }, 900);
    this.osc = null;
    this.subOsc = null;
    this.lfo = null;
  }
}

export const ambientAudio = new AmbientAudio();
