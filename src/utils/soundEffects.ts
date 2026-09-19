// Web Audio API Synthesized Pirate Sound System
class PirateSoundFX {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;
  private oceanGain: GainNode | null = null;
  private isAmbiancePlaying: boolean = false;

  private initCtx() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted && this.oceanGain && this.ctx) {
      this.oceanGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.1);
    } else if (!this.isMuted && this.oceanGain && this.ctx && this.isAmbiancePlaying) {
      this.oceanGain.gain.setTargetAtTime(0.04, this.ctx.currentTime, 0.2);
    }
    return this.isMuted;
  }

  // Wooden roulette peg tick
  public playWheelTick(speedFactor: number = 1.0) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = "bandpass";
      filter.frequency.setValueAtTime(800 + Math.random() * 400, this.ctx.currentTime);
      filter.Q.value = 4;

      osc.type = "triangle";
      osc.frequency.setValueAtTime(140 * speedFactor, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {
      // Audio safety fallback
    }
  }

  // Triumphant Golden Pirate Treasure Fanfare
  public playTriumph() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
      const now = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.5);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.55);
      });
    } catch {
      // Audio safety fallback
    }
  }

  // Pirate Cannon Shot
  public playCannon() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const bufferSize = this.ctx.sampleRate * 0.5;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(250, now);
      filter.frequency.exponentialRampToValueAtTime(40, now + 0.4);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      // Deep rumble sub-oscillator
      const sub = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      sub.type = "sine";
      sub.frequency.setValueAtTime(90, now);
      sub.frequency.exponentialRampToValueAtTime(25, now + 0.35);
      subGain.gain.setValueAtTime(0.5, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      sub.connect(subGain);
      subGain.connect(this.ctx.destination);

      noise.start(now);
      sub.start(now);
      noise.stop(now + 0.5);
      sub.stop(now + 0.5);
    } catch {
      // Audio safety fallback
    }
  }

  // Pirate Coin Clink
  public playCoin() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(1760, now);
      osc.frequency.setValueAtTime(2637, now + 0.05);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.32);
    } catch {
      // Audio safety fallback
    }
  }

  // Error buzzer / penalty sound
  public playBuzzer() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(130, now);
      osc.frequency.setValueAtTime(110, now + 0.15);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.38);
    } catch {
      // Audio safety fallback
    }
  }

  // Toggle Gentle Ocean & Wind Pirate Ambiance
  public toggleAmbiance(): boolean {
    this.initCtx();
    if (!this.ctx) return false;

    if (this.isAmbiancePlaying) {
      if (this.oceanGain) {
        this.oceanGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.4);
      }
      this.isAmbiancePlaying = false;
      return false;
    } else {
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 350;

      // LFO modulation to simulate undulating ocean waves
      const lfo = this.ctx.createOscillator();
      lfo.frequency.value = 0.15; // slow ocean swell
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.value = 200;
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      this.oceanGain = this.ctx.createGain();
      this.oceanGain.gain.setValueAtTime(this.isMuted ? 0 : 0.04, this.ctx.currentTime);

      noise.connect(filter);
      filter.connect(this.oceanGain);
      this.oceanGain.connect(this.ctx.destination);

      noise.start();
      lfo.start();
      this.isAmbiancePlaying = true;
      return true;
    }
  }
}

export const soundFX = typeof window !== "undefined" ? new PirateSoundFX() : ({} as PirateSoundFX);
