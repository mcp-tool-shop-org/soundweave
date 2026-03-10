// ────────────────────────────────────────────
// Synth voice — melodic instrument engine
// Covers: bass, pad, lead/pluck, pulse/arp
// ────────────────────────────────────────────

import type { InstrumentCategory } from "@soundweave/schema";
import type { InstrumentVoice, Voice, SynthParams } from "./types.js";
import { midiToFreq } from "./types.js";

const DEFAULTS: SynthParams = {
  oscillatorType: "sawtooth",
  attack: 0.01,
  decay: 0.2,
  sustain: 0.6,
  release: 0.3,
  filterFreq: 2000,
  filterQ: 1,
  filterType: "lowpass",
  detune: 0,
  gain: 0.7,
};

export class SynthVoice implements InstrumentVoice {
  readonly category: InstrumentCategory;
  private params: Required<SynthParams>;

  constructor(category: InstrumentCategory, params?: SynthParams) {
    this.category = category;
    this.params = { ...DEFAULTS, ...params } as Required<SynthParams>;
  }

  playNote(
    ctx: AudioContext,
    pitch: number,
    velocity: number,
    startTime: number,
    duration: number,
    output: AudioNode,
  ): Voice {
    const p = this.params;
    const freq = midiToFreq(pitch);
    const velGain = (velocity / 127) * p.gain;
    const endTime = startTime + duration;

    // Oscillator
    const osc = ctx.createOscillator();
    osc.type = p.oscillatorType;
    osc.frequency.setValueAtTime(freq, startTime);
    if (p.detune !== 0) {
      osc.detune.setValueAtTime(p.detune, startTime);
    }

    // Filter
    const filter = ctx.createBiquadFilter();
    filter.type = p.filterType;
    filter.frequency.setValueAtTime(p.filterFreq, startTime);
    filter.Q.setValueAtTime(p.filterQ, startTime);

    // Gain envelope (ADSR)
    const env = ctx.createGain();
    env.gain.setValueAtTime(0, startTime);
    // Attack
    env.gain.linearRampToValueAtTime(velGain, startTime + p.attack);
    // Decay → sustain
    env.gain.linearRampToValueAtTime(
      velGain * p.sustain,
      startTime + p.attack + p.decay,
    );
    // Sustain holds until note end
    env.gain.setValueAtTime(velGain * p.sustain, endTime);
    // Release
    env.gain.linearRampToValueAtTime(0, endTime + p.release);

    // Connect chain: osc → filter → envelope → output
    osc.connect(filter);
    filter.connect(env);
    env.connect(output);

    osc.start(startTime);
    osc.stop(endTime + p.release + 0.01);

    let stopped = false;
    return {
      stop: () => {
        if (stopped) return;
        stopped = true;
        try {
          const now = ctx.currentTime;
          env.gain.cancelScheduledValues(now);
          env.gain.setValueAtTime(env.gain.value, now);
          env.gain.linearRampToValueAtTime(0, now + 0.05);
          osc.stop(now + 0.06);
        } catch {
          // Already stopped
        }
      },
    };
  }

  dispose(): void {
    // No persistent resources
  }
}
