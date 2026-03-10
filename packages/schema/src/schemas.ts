import { z } from "zod";

// ── Enums ──

export const AudioAssetKindSchema = z.enum(["loop", "oneshot", "stinger", "ambient"]);

export const StemRoleSchema = z.enum([
  "base",
  "danger",
  "combat",
  "boss",
  "recovery",
  "mystery",
  "faction",
  "accent",
]);

export const SceneCategorySchema = z.enum([
  "exploration",
  "tension",
  "combat",
  "boss",
  "victory",
  "aftermath",
  "stealth",
  "safe-zone",
]);

export const TriggerOpSchema = z.enum(["eq", "neq", "gt", "gte", "lt", "lte", "includes"]);

export const TransitionModeSchema = z.enum([
  "immediate",
  "crossfade",
  "bar-sync",
  "stinger-then-switch",
  "cooldown-fade",
]);

export const LayerStartModeSchema = z.enum(["immediate", "next-bar", "after-transition"]);

// ── Pack metadata ──

export const SoundtrackPackMetaSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  version: z.string().min(1),
  description: z.string().optional(),
  author: z.string().optional(),
  tags: z.array(z.string()).optional(),
  schemaVersion: z.literal("1"),
});

// ── Audio asset ──

export const AudioAssetSchema = z
  .object({
    id: z.string().min(1),
    name: z.string().min(1),
    src: z.string().min(1),
    kind: AudioAssetKindSchema,
    durationMs: z.number().gt(0, "durationMs must be greater than 0"),
    bpm: z.number().positive().optional(),
    key: z.string().optional(),
    loopStartMs: z.number().gte(0, "loopStartMs must be >= 0").optional(),
    loopEndMs: z.number().positive().optional(),
    tags: z.array(z.string()).optional(),
    notes: z.string().optional(),
  })
  .refine(
    (a) => {
      if (a.loopStartMs != null && a.loopEndMs != null) {
        return a.loopEndMs > a.loopStartMs;
      }
      return true;
    },
    {
      message: "loopEndMs must be greater than loopStartMs",
      path: ["loopEndMs"],
    },
  );

// ── Stem ──

export const StemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  assetId: z.string().min(1),
  role: StemRoleSchema,
  gainDb: z.number().optional(),
  mutedByDefault: z.boolean().optional(),
  loop: z.boolean(),
  tags: z.array(z.string()).optional(),
});

// ── Scene ──

export const SceneLayerRefSchema = z.object({
  stemId: z.string().min(1),
  required: z.boolean().optional(),
  startMode: LayerStartModeSchema.optional(),
  gainDb: z.number().optional(),
});

export const SceneSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  category: SceneCategorySchema,
  layers: z.array(SceneLayerRefSchema).min(1, "Scene must have at least one layer"),
  fallbackSceneId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

// ── Triggers ──

export const TriggerConditionSchema = z.object({
  field: z.string().min(1),
  op: TriggerOpSchema,
  value: z.union([z.string(), z.number(), z.boolean()]),
});

export const TriggerBindingSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  sceneId: z.string().min(1),
  conditions: z
    .array(TriggerConditionSchema)
    .min(1, "Binding must have at least one condition"),
  priority: z.number().int("priority must be an integer"),
  stopProcessing: z.boolean().optional(),
});

// ── Transitions ──

export const TransitionRuleSchema = z
  .object({
    id: z.string().min(1),
    name: z.string().min(1),
    fromSceneId: z.string().min(1),
    toSceneId: z.string().min(1),
    mode: TransitionModeSchema,
    durationMs: z.number().positive().optional(),
    stingerAssetId: z.string().min(1).optional(),
    notes: z.string().optional(),
  })
  .refine(
    (t) => {
      if (t.mode === "crossfade" || t.mode === "cooldown-fade") {
        return t.durationMs != null;
      }
      return true;
    },
    {
      message: "durationMs is required for crossfade and cooldown-fade transitions",
      path: ["durationMs"],
    },
  );

// ── Pack ──

export const SoundtrackPackSchema = z.object({
  meta: SoundtrackPackMetaSchema,
  assets: z.array(AudioAssetSchema),
  stems: z.array(StemSchema),
  scenes: z.array(SceneSchema),
  bindings: z.array(TriggerBindingSchema),
  transitions: z.array(TransitionRuleSchema),
});

// ── Runtime state ──

export const RuntimeMusicStateSchema = z
  .object({
    mode: z.string().optional(),
    danger: z.number().optional(),
    inCombat: z.boolean().optional(),
    boss: z.boolean().optional(),
    safeZone: z.boolean().optional(),
    victory: z.boolean().optional(),
    region: z.string().optional(),
    faction: z.string().optional(),
    encounterType: z.string().optional(),
  })
  .passthrough();
