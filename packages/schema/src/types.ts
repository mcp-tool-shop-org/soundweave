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

// ── Pack ──

export interface SoundtrackPack {
  meta: SoundtrackPackMeta;
  assets: AudioAsset[];
  stems: Stem[];
  scenes: Scene[];
  bindings: TriggerBinding[];
  transitions: TransitionRule[];
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
