// ────────────────────────────────────────────
// @soundweave/schema — canonical types v1
// ────────────────────────────────────────────

// ── Pack metadata ──

export interface SoundtrackPackMeta {
  id: string;
  name: string;
  version: string;
  description?: string;
  author?: string;
  tags?: string[];
  schemaVersion: "1";
}

// ── Audio assets ──

export type AudioAssetKind = "loop" | "oneshot" | "stinger" | "ambient";

export interface AudioAsset {
  id: string;
  name: string;
  src: string;
  kind: AudioAssetKind;
  durationMs: number;
  bpm?: number;
  key?: string;
  loopStartMs?: number;
  loopEndMs?: number;
  tags?: string[];
  notes?: string;
}

// ── Stems ──

export type StemRole =
  | "base"
  | "danger"
  | "combat"
  | "boss"
  | "recovery"
  | "mystery"
  | "faction"
  | "accent";

export interface Stem {
  id: string;
  name: string;
  assetId: string;
  role: StemRole;
  gainDb?: number;
  mutedByDefault?: boolean;
  loop: boolean;
  tags?: string[];
}

// ── Scenes ──

export type SceneCategory =
  | "exploration"
  | "tension"
  | "combat"
  | "boss"
  | "victory"
  | "aftermath"
  | "stealth"
  | "safe-zone";

export interface SceneLayerRef {
  stemId: string;
  required?: boolean;
  startMode?: "immediate" | "next-bar" | "after-transition";
  gainDb?: number;
}

export interface Scene {
  id: string;
  name: string;
  category: SceneCategory;
  layers: SceneLayerRef[];
  /** Clips activated in this scene */
  clipLayers?: SceneClipRef[];
  fallbackSceneId?: string;
  tags?: string[];
  notes?: string;
}

// ── Triggers ──

export type TriggerOp = "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "includes";

export interface TriggerCondition {
  field: string;
  op: TriggerOp;
  value: string | number | boolean;
}

export interface TriggerBinding {
  id: string;
  name: string;
  sceneId: string;
  conditions: TriggerCondition[];
  priority: number;
  stopProcessing?: boolean;
}

// ── Transitions ──

export type TransitionMode =
  | "immediate"
  | "crossfade"
  | "bar-sync"
  | "stinger-then-switch"
  | "cooldown-fade";

export interface TransitionRule {
  id: string;
  name: string;
  fromSceneId: string;
  toSceneId: string;
  mode: TransitionMode;
  durationMs?: number;
  stingerAssetId?: string;
  notes?: string;
}

// ── Instruments ──

export type InstrumentCategory =
  | "drums"
  | "bass"
  | "pad"
  | "lead"
  | "pulse";

export interface InstrumentPreset {
  id: string;
  name: string;
  category: InstrumentCategory;
  /** Synth engine parameters (oscillator type, envelope, filter, etc.) */
  params: Record<string, number | string | boolean>;
}

// ── Clips ──

export type ClipLane = "drums" | "bass" | "harmony" | "motif" | "accent";

/** Section role for intro→loop→outro flow */
export type SectionRole = "intro" | "loop" | "outro";

/** Intensity level for scene escalation */
export type IntensityLevel = "low" | "mid" | "high";

/** Quantize mode for clip launch timing */
export type QuantizeMode = "none" | "beat" | "bar";

/** A single note event in a clip */
export interface ClipNote {
  /** MIDI note number (0–127). For drums, maps to kit piece index. */
  pitch: number;
  /** Start time in ticks from clip start (1 beat = 480 ticks) */
  startTick: number;
  /** Duration in ticks */
  durationTicks: number;
  /** Velocity 0–127 */
  velocity: number;
}

/** A named variant of a clip (alternate pattern) */
export interface ClipVariant {
  id: string;
  name: string;
  notes: ClipNote[];
  tags?: string[];
}

export interface Clip {
  id: string;
  name: string;
  lane: ClipLane;
  /** Which instrument preset this clip uses */
  instrumentId: string;
  /** BPM for playback timing */
  bpm: number;
  /** Length of the clip in beats */
  lengthBeats: number;
  /** Time signature numerator (default 4) */
  timeSignature?: number;
  /** Quantize grid: ticks per snap (120 = 16th, 240 = 8th, 480 = quarter) */
  quantize?: number;
  /** The note data (default variant) */
  notes: ClipNote[];
  /** Named variants (A/B patterns) */
  variants?: ClipVariant[];
  /** Loop this clip */
  loop: boolean;
  gainDb?: number;
  tags?: string[];
}

/** Reference to a clip in a scene */
export interface SceneClipRef {
  clipId: string;
  /** Override gain for this clip in this scene */
  gainDb?: number;
  /** Start muted (user can unmute live) */
  mutedByDefault?: boolean;
  /** Playback order within this scene (lower = first) */
  order?: number;
  /** Section role: intro plays once, loop repeats, outro plays on exit */
  sectionRole?: SectionRole;
  /** Intensity tier — clips activate based on current intensity */
  intensity?: IntensityLevel;
  /** Which variant to use (default = main notes) */
  variantId?: string;
}

// ── Pack ──

export interface SoundtrackPack {
  meta: SoundtrackPackMeta;
  assets: AudioAsset[];
  stems: Stem[];
  scenes: Scene[];
  bindings: TriggerBinding[];
  transitions: TransitionRule[];
  /** Built-in instrument presets */
  instruments?: InstrumentPreset[];
  /** Composed clips */
  clips?: Clip[];
}

// ── Runtime state ──

export interface RuntimeMusicState {
  mode?: string;
  danger?: number;
  inCombat?: boolean;
  boss?: boolean;
  safeZone?: boolean;
  victory?: boolean;
  region?: string;
  faction?: string;
  encounterType?: string;
  [key: string]: unknown;
}

// ── Validation ──

export interface ValidationIssue {
  path: string;
  code: string;
  message: string;
}

export interface ValidationResult<T> {
  ok: boolean;
  data?: T;
  issues: ValidationIssue[];
}
