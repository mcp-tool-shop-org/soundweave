// ────────────────────────────────────────────
// Mixer types — mix surface, FX, buses, render
// ────────────────────────────────────────────

/** Available FX types */
export type FxType = "eq" | "delay" | "reverb" | "compressor";

/** Parameters for each FX type */
export interface EqParams {
  type: BiquadFilterType;
  frequency: number;
  gain: number;
  Q: number;
}

export interface DelayParams {
  delayTime: number; // seconds
  feedback: number; // 0..1
  mix: number; // 0..1 dry/wet
}

export interface ReverbParams {
  decayTime: number; // seconds (impulse length)
  mix: number; // 0..1 dry/wet
}

export interface CompressorParams {
  threshold: number; // dB
  ratio: number;
  attack: number; // seconds
  release: number; // seconds
  knee: number; // dB
}

export type FxParams = EqParams | DelayParams | ReverbParams | CompressorParams;

/** A single FX slot on a bus */
export interface FxSlotState {
  type: FxType;
  params: FxParams;
  bypassed: boolean;
}

/** Bus identifier */
export type BusId = "drums" | "music" | "master";

/** Per-stem mixer state */
export interface StemMixState {
  stemId: string;
  gainDb: number;
  pan: number; // -1 (left) to +1 (right)
  muted: boolean;
  solo: boolean;
  bus: BusId;
}

/** Per-bus state */
export interface BusState {
  id: BusId;
  gainDb: number;
  muted: boolean;
  fxSlots: FxSlotState[];
}

/** Full mixer snapshot */
export interface MixerSnapshot {
  stems: StemMixState[];
  buses: BusState[];
  masterGainDb: number;
}

/** Render preset type */
export type RenderPreset = "full-cue" | "loop-only" | "preview-sequence";

/** Options for cue rendering */
export interface RenderOptions {
  preset: RenderPreset;
  sceneId: string;
  /** Duration in seconds (required for loop-only, optional for full-cue) */
  durationSeconds?: number;
  /** Sample rate for output (default 44100) */
  sampleRate?: number;
  /** Number of channels (default 2) */
  channels?: number;
}

/** Result of a cue render */
export interface RenderResult {
  buffer: AudioBuffer;
  durationSeconds: number;
  sampleRate: number;
  channels: number;
}

/** Default FX parameters */
export const DEFAULT_EQ_PARAMS: EqParams = {
  type: "peaking",
  frequency: 1000,
  gain: 0,
  Q: 1,
};

export const DEFAULT_DELAY_PARAMS: DelayParams = {
  delayTime: 0.25,
  feedback: 0.3,
  mix: 0.2,
};

export const DEFAULT_REVERB_PARAMS: ReverbParams = {
  decayTime: 1.5,
  mix: 0.2,
};

export const DEFAULT_COMPRESSOR_PARAMS: CompressorParams = {
  threshold: -24,
  ratio: 4,
  attack: 0.003,
  release: 0.25,
  knee: 30,
};

export function defaultParamsForFx(type: FxType): FxParams {
  switch (type) {
    case "eq":
      return { ...DEFAULT_EQ_PARAMS };
    case "delay":
      return { ...DEFAULT_DELAY_PARAMS };
    case "reverb":
      return { ...DEFAULT_REVERB_PARAMS };
    case "compressor":
      return { ...DEFAULT_COMPRESSOR_PARAMS };
  }
}
