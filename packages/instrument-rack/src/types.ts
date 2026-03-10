// ────────────────────────────────────────────
// @soundweave/instrument-rack — types
// ────────────────────────────────────────────

import type { InstrumentCategory } from "@soundweave/schema";

/** Voice instance — a single playing note */
export interface Voice {
  stop: () => void;
}

/** An instrument voice that can play notes */
export interface InstrumentVoice {
  readonly category: InstrumentCategory;

  /**
   * Play a note.
   * @param pitch MIDI note number (0-127)
   * @param velocity 0-127
   * @param startTime AudioContext time to start
   * @param duration duration in seconds
   * @param output AudioNode to connect to
   * @returns Voice handle for early stop
   */
  playNote(
    ctx: AudioContext,
    pitch: number,
    velocity: number,
    startTime: number,
    duration: number,
    output: AudioNode,
  ): Voice;

  /** Dispose any resources */
  dispose(): void;
}

/** Parameters for synth voice creation */
export interface SynthParams {
  oscillatorType?: OscillatorType;
  attack?: number;
  decay?: number;
  sustain?: number;
  release?: number;
  filterFreq?: number;
  filterQ?: number;
  filterType?: BiquadFilterType;
  detune?: number;
  gain?: number;
}

/** MIDI note number → frequency */
export function midiToFreq(note: number): number {
  return 440 * Math.pow(2, (note - 69) / 12);
}
