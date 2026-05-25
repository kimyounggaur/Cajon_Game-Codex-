import { AUDIO_PATHS } from '../assets/assets';
import type { LaneId } from './chart';
import { LANE_META, type Judgement } from './judge';

export type SoundName = 'slap' | 'bass' | 'miss' | 'ui';

export interface PlayOptions {
  velocity?: number;
  pan?: number;
  detuneCents?: number;
  when?: number;
}

type SampleName = 'slap' | 'bass';

interface AudioContextWindow extends Window {
  webkitAudioContext?: typeof AudioContext;
}

export class AudioEngine {
  private context: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private buffers: Partial<Record<SampleName, AudioBuffer>> = {};
  private masterVolume = 0.85;
  private sfxVolume = 0.9;
  private hitVariation = true;
  private fallbackActive = false;

  async init(): Promise<void> {
    if (this.context) return;
    if (typeof window === 'undefined') return;

    const AudioContextCtor =
      window.AudioContext ?? (window as AudioContextWindow).webkitAudioContext;
    if (!AudioContextCtor) {
      this.fallbackActive = true;
      return;
    }

    this.context = new AudioContextCtor();
    this.masterGain = this.context.createGain();
    this.sfxGain = this.context.createGain();
    this.masterGain.gain.value = this.masterVolume;
    this.sfxGain.gain.value = this.sfxVolume;
    this.sfxGain.connect(this.masterGain);
    this.masterGain.connect(this.context.destination);
  }

  async unlock(): Promise<void> {
    await this.init();
    if (!this.context) return;

    if (this.context.state === 'suspended') {
      await this.context.resume();
    }

    const silent = this.context.createBuffer(1, 1, this.context.sampleRate);
    const source = this.context.createBufferSource();
    source.buffer = silent;
    source.connect(this.context.destination);
    source.start();
  }

  async preload(): Promise<void> {
    await this.init();
    if (!this.context) return;

    await Promise.all([
      this.loadSample('slap', AUDIO_PATHS.slap),
      this.loadSample('bass', AUDIO_PATHS.bass)
    ]);
  }

  play(name: SoundName, options: PlayOptions = {}): void {
    if (!this.context || !this.sfxGain) {
      void this.unlock().then(() => this.play(name, options));
      return;
    }

    if (name === 'slap' || name === 'bass') {
      const buffer = this.buffers[name];
      if (buffer) {
        this.playBuffer(buffer, name, options);
        return;
      }
    }

    this.fallbackActive = true;
    this.playSynth(name, options);
  }

  playLane(lane: LaneId, judgement?: Judgement): void {
    const laneMeta = LANE_META[lane];
    const detuneCents = this.hitVariation ? randomBetween(-28, 28) : 0;
    const velocity =
      judgement === 'BAD' ? 0.62 : judgement === 'GOOD' ? 0.75 : judgement === 'MISS' ? 0.35 : 1;

    this.play(laneMeta.sound, {
      pan: laneMeta.pan,
      velocity,
      detuneCents
    });

    if (judgement === 'MISS') {
      this.play('miss', { velocity: 0.55, pan: laneMeta.pan });
    } else if (judgement === 'PERFECT') {
      this.play('ui', { velocity: 0.18, pan: laneMeta.pan });
    }
  }

  setMasterVolume(value: number): void {
    this.masterVolume = clamp(value, 0, 1);
    if (this.masterGain) this.masterGain.gain.value = this.masterVolume;
  }

  setSfxVolume(value: number): void {
    this.sfxVolume = clamp(value, 0, 1);
    if (this.sfxGain) this.sfxGain.gain.value = this.sfxVolume;
  }

  setHitVariation(value: boolean): void {
    this.hitVariation = value;
  }

  getCurrentTimeMs(): number {
    return this.context ? this.context.currentTime * 1000 : performance.now();
  }

  isFallbackActive(): boolean {
    return this.fallbackActive;
  }

  private async loadSample(name: SampleName, path: string): Promise<void> {
    if (!this.context) return;

    try {
      const response = await fetch(path, { cache: 'force-cache' });
      if (!response.ok) throw new Error(`Sample missing: ${path}`);
      const data = await response.arrayBuffer();
      this.buffers[name] = await this.context.decodeAudioData(data);
    } catch {
      this.fallbackActive = true;
    }
  }

  private playBuffer(buffer: AudioBuffer, name: SampleName, options: PlayOptions): void {
    if (!this.context || !this.sfxGain) return;

    const source = this.context.createBufferSource();
    const gain = this.context.createGain();
    const panner = this.createPanner(options.pan ?? 0);
    const velocity = clamp(options.velocity ?? 1, 0, 1);
    const when = options.when ?? this.context.currentTime;

    source.buffer = buffer;
    source.detune.value = options.detuneCents ?? 0;
    gain.gain.value = (name === 'bass' ? 1.05 : 0.82) * velocity;

    source.connect(gain);
    gain.connect(panner);
    panner.connect(this.sfxGain);
    source.start(when);
  }

  private playSynth(name: SoundName, options: PlayOptions): void {
    if (!this.context || !this.sfxGain) return;

    const now = options.when ?? this.context.currentTime;
    if (name === 'bass') {
      this.playBassSynth(now, options);
      return;
    }

    if (name === 'miss') {
      this.playTickSynth(now, options, 0.08);
      return;
    }

    if (name === 'ui') {
      this.playTickSynth(now, options, 0.035);
      return;
    }

    this.playSlapSynth(now, options);
  }

  private playSlapSynth(when: number, options: PlayOptions): void {
    if (!this.context || !this.sfxGain) return;

    const noiseBuffer = this.createNoiseBuffer(0.08);
    const source = this.context.createBufferSource();
    const filter = this.context.createBiquadFilter();
    const gain = this.context.createGain();
    const panner = this.createPanner(options.pan ?? 0);
    const velocity = clamp(options.velocity ?? 1, 0, 1);

    source.buffer = noiseBuffer;
    filter.type = 'bandpass';
    filter.frequency.value = 1800;
    filter.Q.value = 0.85;
    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.exponentialRampToValueAtTime(0.48 * velocity, when + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + 0.11);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(panner);
    panner.connect(this.sfxGain);
    source.start(when);
    source.stop(when + 0.13);
  }

  private playBassSynth(when: number, options: PlayOptions): void {
    if (!this.context || !this.sfxGain) return;

    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    const filter = this.context.createBiquadFilter();
    const panner = this.createPanner(options.pan ?? 0);
    const velocity = clamp(options.velocity ?? 1, 0, 1);

    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(112, when);
    oscillator.frequency.exponentialRampToValueAtTime(58, when + 0.18);
    oscillator.detune.value = options.detuneCents ?? 0;

    filter.type = 'lowpass';
    filter.frequency.value = 520;
    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.exponentialRampToValueAtTime(0.64 * velocity, when + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + 0.32);

    oscillator.connect(filter);
    filter.connect(gain);
    gain.connect(panner);
    panner.connect(this.sfxGain);
    oscillator.start(when);
    oscillator.stop(when + 0.36);

    this.playSlapTransient(when, options);
  }

  private playSlapTransient(when: number, options: PlayOptions): void {
    if (!this.context || !this.sfxGain) return;

    const buffer = this.createNoiseBuffer(0.03);
    const source = this.context.createBufferSource();
    const gain = this.context.createGain();
    const panner = this.createPanner(options.pan ?? 0);

    source.buffer = buffer;
    gain.gain.setValueAtTime(0.16 * clamp(options.velocity ?? 1, 0, 1), when);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + 0.045);
    source.connect(gain);
    gain.connect(panner);
    panner.connect(this.sfxGain);
    source.start(when);
    source.stop(when + 0.05);
  }

  private playTickSynth(when: number, options: PlayOptions, duration: number): void {
    if (!this.context || !this.sfxGain) return;

    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    const panner = this.createPanner(options.pan ?? 0);

    oscillator.type = 'sine';
    oscillator.frequency.value = options.velocity && options.velocity < 0.2 ? 1900 : 580;
    gain.gain.setValueAtTime(0.12 * clamp(options.velocity ?? 1, 0, 1), when);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);
    oscillator.connect(gain);
    gain.connect(panner);
    panner.connect(this.sfxGain);
    oscillator.start(when);
    oscillator.stop(when + duration + 0.01);
  }

  private createPanner(pan: number): AudioNode {
    if (!this.context) throw new Error('AudioContext is not initialized.');

    const panner = this.context.createStereoPanner();
    panner.pan.value = clamp(pan, -1, 1);
    return panner;
  }

  private createNoiseBuffer(durationSeconds: number): AudioBuffer {
    if (!this.context) throw new Error('AudioContext is not initialized.');

    const frameCount = Math.max(1, Math.floor(this.context.sampleRate * durationSeconds));
    const buffer = this.context.createBuffer(1, frameCount, this.context.sampleRate);
    const channel = buffer.getChannelData(0);
    for (let index = 0; index < frameCount; index += 1) {
      channel[index] = Math.random() * 2 - 1;
    }
    return buffer;
  }
}

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
