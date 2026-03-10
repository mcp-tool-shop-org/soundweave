"use client";

import { create } from "zustand";
import type {
  SoundtrackPack,
  AudioAsset,
  Stem,
  Scene,
  SceneLayerRef,
  SceneClipRef,
  TriggerBinding,
  TriggerCondition,
  TransitionRule,
  SoundtrackPackMeta,
  Clip,
  ClipNote,
  ClipVariant,
  Cue,
  CueSection,
  PerformanceCapture,
} from "@soundweave/schema";

// ── Section type ──

export type Section =
  | "project"
  | "assets"
  | "stems"
  | "scenes"
  | "clips"
  | "bindings"
  | "transitions"
  | "review"
  | "preview"
  | "performance"
  | "cues"
  | "mixer"
  | "export";

// ── Store shape ──

export interface StudioState {
  pack: SoundtrackPack;
  section: Section;
  selectedId: string | null;

  // Navigation
  setSection: (s: Section) => void;
  setSelectedId: (id: string | null) => void;

  // Pack loading
  loadPack: (pack: SoundtrackPack) => void;

  // Meta editing
  updateMeta: (partial: Partial<SoundtrackPackMeta>) => void;

  // Asset CRUD
  addAsset: (asset: AudioAsset) => void;
  updateAsset: (id: string, partial: Partial<AudioAsset>) => void;
  deleteAsset: (id: string) => void;

  // Stem CRUD
  addStem: (stem: Stem) => void;
  updateStem: (id: string, partial: Partial<Stem>) => void;
  deleteStem: (id: string) => void;

  // Scene CRUD
  addScene: (scene: Scene) => void;
  updateScene: (id: string, partial: Partial<Scene>) => void;
  deleteScene: (id: string) => void;
  addSceneLayer: (sceneId: string, layer: SceneLayerRef) => void;
  updateSceneLayer: (
    sceneId: string,
    layerIndex: number,
    partial: Partial<SceneLayerRef>,
  ) => void;
  removeSceneLayer: (sceneId: string, layerIndex: number) => void;

  // Binding CRUD
  addBinding: (binding: TriggerBinding) => void;
  updateBinding: (id: string, partial: Partial<TriggerBinding>) => void;
  deleteBinding: (id: string) => void;
  addBindingCondition: (
    bindingId: string,
    condition: TriggerCondition,
  ) => void;
  updateBindingCondition: (
    bindingId: string,
    conditionIndex: number,
    partial: Partial<TriggerCondition>,
  ) => void;
  removeBindingCondition: (
    bindingId: string,
    conditionIndex: number,
  ) => void;

  // Transition CRUD
  addTransition: (transition: TransitionRule) => void;
  updateTransition: (id: string, partial: Partial<TransitionRule>) => void;
  deleteTransition: (id: string) => void;

  // Clip CRUD
  addClip: (clip: Clip) => void;
  updateClip: (id: string, partial: Partial<Clip>) => void;
  deleteClip: (id: string) => void;
  addClipNote: (clipId: string, note: ClipNote) => void;
  updateClipNote: (
    clipId: string,
    noteIndex: number,
    partial: Partial<ClipNote>,
  ) => void;
  removeClipNote: (clipId: string, noteIndex: number) => void;

  // Scene clip-layer CRUD
  addSceneClipLayer: (sceneId: string, ref: SceneClipRef) => void;
  updateSceneClipLayer: (
    sceneId: string,
    layerIndex: number,
    partial: Partial<SceneClipRef>,
  ) => void;
  removeSceneClipLayer: (sceneId: string, layerIndex: number) => void;

  // Clip variant CRUD
  addClipVariant: (clipId: string, variant: ClipVariant) => void;
  updateClipVariant: (
    clipId: string,
    variantId: string,
    partial: Partial<ClipVariant>,
  ) => void;
  removeClipVariant: (clipId: string, variantId: string) => void;
  duplicateClipAsVariant: (clipId: string, variantName: string) => void;

  // Cue actions
  addCue: (cue: Cue) => void;
  updateCue: (id: string, partial: Partial<Cue>) => void;
  deleteCue: (id: string) => void;
  addCueSection: (cueId: string, section: CueSection) => void;
  updateCueSection: (cueId: string, sectionId: string, partial: Partial<CueSection>) => void;
  removeCueSection: (cueId: string, sectionId: string) => void;
  reorderCueSections: (cueId: string, sectionIds: string[]) => void;

  // Capture actions
  captures: PerformanceCapture[];
  addCapture: (capture: PerformanceCapture) => void;
  deleteCapture: (id: string) => void;
}

// ── Default empty pack ──

const emptyPack: SoundtrackPack = {
  meta: {
    id: "new-pack",
    name: "New Pack",
    version: "1.0.0",
    schemaVersion: "1",
  },
  assets: [],
  stems: [],
  scenes: [],
  bindings: [],
  transitions: [],
};

// ── Helper: fix selection after delete ──

function fixSelection(
  items: { id: string }[],
  deletedId: string,
  currentSelectedId: string | null,
): string | null {
  if (currentSelectedId !== deletedId) return currentSelectedId;
  if (items.length === 0) return null;
  return items[0].id;
}

// ── Store ──

export const useStudioStore = create<StudioState>((set) => ({
  pack: emptyPack,
  section: "project",
  selectedId: null,

  setSection: (section) => set({ section, selectedId: null }),
  setSelectedId: (selectedId) => set({ selectedId }),

  loadPack: (pack) => set({ pack, section: "project", selectedId: null }),

  // Meta
  updateMeta: (partial) =>
    set((state) => ({
      pack: { ...state.pack, meta: { ...state.pack.meta, ...partial } },
    })),

  // Assets
  addAsset: (asset) =>
    set((state) => ({
      pack: { ...state.pack, assets: [...state.pack.assets, asset] },
      selectedId: asset.id,
    })),
  updateAsset: (id, partial) =>
    set((state) => ({
      pack: {
        ...state.pack,
        assets: state.pack.assets.map((a) =>
          a.id === id ? { ...a, ...partial } : a,
        ),
      },
    })),
  deleteAsset: (id) =>
    set((state) => {
      const assets = state.pack.assets.filter((a) => a.id !== id);
      return {
        pack: { ...state.pack, assets },
        selectedId: fixSelection(assets, id, state.selectedId),
      };
    }),

  // Stems
  addStem: (stem) =>
    set((state) => ({
      pack: { ...state.pack, stems: [...state.pack.stems, stem] },
      selectedId: stem.id,
    })),
  updateStem: (id, partial) =>
    set((state) => ({
      pack: {
        ...state.pack,
        stems: state.pack.stems.map((s) =>
          s.id === id ? { ...s, ...partial } : s,
        ),
      },
    })),
  deleteStem: (id) =>
    set((state) => {
      const stems = state.pack.stems.filter((s) => s.id !== id);
      return {
        pack: { ...state.pack, stems },
        selectedId: fixSelection(stems, id, state.selectedId),
      };
    }),

  // Scenes
  addScene: (scene) =>
    set((state) => ({
      pack: { ...state.pack, scenes: [...state.pack.scenes, scene] },
      selectedId: scene.id,
    })),
  updateScene: (id, partial) =>
    set((state) => ({
      pack: {
        ...state.pack,
        scenes: state.pack.scenes.map((s) =>
          s.id === id ? { ...s, ...partial } : s,
        ),
      },
    })),
  deleteScene: (id) =>
    set((state) => {
      const scenes = state.pack.scenes.filter((s) => s.id !== id);
      return {
        pack: { ...state.pack, scenes },
        selectedId: fixSelection(scenes, id, state.selectedId),
      };
    }),
  addSceneLayer: (sceneId, layer) =>
    set((state) => ({
      pack: {
        ...state.pack,
        scenes: state.pack.scenes.map((s) =>
          s.id === sceneId ? { ...s, layers: [...s.layers, layer] } : s,
        ),
      },
    })),
  updateSceneLayer: (sceneId, layerIndex, partial) =>
    set((state) => ({
      pack: {
        ...state.pack,
        scenes: state.pack.scenes.map((s) =>
          s.id === sceneId
            ? {
                ...s,
                layers: s.layers.map((l, i) =>
                  i === layerIndex ? { ...l, ...partial } : l,
                ),
              }
            : s,
        ),
      },
    })),
  removeSceneLayer: (sceneId, layerIndex) =>
    set((state) => ({
      pack: {
        ...state.pack,
        scenes: state.pack.scenes.map((s) =>
          s.id === sceneId
            ? { ...s, layers: s.layers.filter((_, i) => i !== layerIndex) }
            : s,
        ),
      },
    })),

  // Bindings
  addBinding: (binding) =>
    set((state) => ({
      pack: { ...state.pack, bindings: [...state.pack.bindings, binding] },
      selectedId: binding.id,
    })),
  updateBinding: (id, partial) =>
    set((state) => ({
      pack: {
        ...state.pack,
        bindings: state.pack.bindings.map((b) =>
          b.id === id ? { ...b, ...partial } : b,
        ),
      },
    })),
  deleteBinding: (id) =>
    set((state) => {
      const bindings = state.pack.bindings.filter((b) => b.id !== id);
      return {
        pack: { ...state.pack, bindings },
        selectedId: fixSelection(bindings, id, state.selectedId),
      };
    }),
  addBindingCondition: (bindingId, condition) =>
    set((state) => ({
      pack: {
        ...state.pack,
        bindings: state.pack.bindings.map((b) =>
          b.id === bindingId
            ? { ...b, conditions: [...b.conditions, condition] }
            : b,
        ),
      },
    })),
  updateBindingCondition: (bindingId, conditionIndex, partial) =>
    set((state) => ({
      pack: {
        ...state.pack,
        bindings: state.pack.bindings.map((b) =>
          b.id === bindingId
            ? {
                ...b,
                conditions: b.conditions.map((c, i) =>
                  i === conditionIndex ? { ...c, ...partial } : c,
                ),
              }
            : b,
        ),
      },
    })),
  removeBindingCondition: (bindingId, conditionIndex) =>
    set((state) => ({
      pack: {
        ...state.pack,
        bindings: state.pack.bindings.map((b) =>
          b.id === bindingId
            ? {
                ...b,
                conditions: b.conditions.filter(
                  (_, i) => i !== conditionIndex,
                ),
              }
            : b,
        ),
      },
    })),

  // Transitions
  addTransition: (transition) =>
    set((state) => ({
      pack: {
        ...state.pack,
        transitions: [...state.pack.transitions, transition],
      },
      selectedId: transition.id,
    })),
  updateTransition: (id, partial) =>
    set((state) => ({
      pack: {
        ...state.pack,
        transitions: state.pack.transitions.map((t) =>
          t.id === id ? { ...t, ...partial } : t,
        ),
      },
    })),
  deleteTransition: (id) =>
    set((state) => {
      const transitions = state.pack.transitions.filter((t) => t.id !== id);
      return {
        pack: { ...state.pack, transitions },
        selectedId: fixSelection(transitions, id, state.selectedId),
      };
    }),

  // Clips
  addClip: (clip) =>
    set((state) => ({
      pack: {
        ...state.pack,
        clips: [...(state.pack.clips ?? []), clip],
      },
      selectedId: clip.id,
    })),
  updateClip: (id, partial) =>
    set((state) => ({
      pack: {
        ...state.pack,
        clips: (state.pack.clips ?? []).map((c) =>
          c.id === id ? { ...c, ...partial } : c,
        ),
      },
    })),
  deleteClip: (id) =>
    set((state) => {
      const clips = (state.pack.clips ?? []).filter((c) => c.id !== id);
      return {
        pack: { ...state.pack, clips },
        selectedId: fixSelection(clips, id, state.selectedId),
      };
    }),
  addClipNote: (clipId, note) =>
    set((state) => ({
      pack: {
        ...state.pack,
        clips: (state.pack.clips ?? []).map((c) =>
          c.id === clipId ? { ...c, notes: [...c.notes, note] } : c,
        ),
      },
    })),
  updateClipNote: (clipId, noteIndex, partial) =>
    set((state) => ({
      pack: {
        ...state.pack,
        clips: (state.pack.clips ?? []).map((c) =>
          c.id === clipId
            ? {
                ...c,
                notes: c.notes.map((n, i) =>
                  i === noteIndex ? { ...n, ...partial } : n,
                ),
              }
            : c,
        ),
      },
    })),
  removeClipNote: (clipId, noteIndex) =>
    set((state) => ({
      pack: {
        ...state.pack,
        clips: (state.pack.clips ?? []).map((c) =>
          c.id === clipId
            ? { ...c, notes: c.notes.filter((_, i) => i !== noteIndex) }
            : c,
        ),
      },
    })),

  // Scene clip layers
  addSceneClipLayer: (sceneId, ref) =>
    set((state) => ({
      pack: {
        ...state.pack,
        scenes: state.pack.scenes.map((s) =>
          s.id === sceneId
            ? { ...s, clipLayers: [...(s.clipLayers ?? []), ref] }
            : s,
        ),
      },
    })),
  updateSceneClipLayer: (sceneId, layerIndex, partial) =>
    set((state) => ({
      pack: {
        ...state.pack,
        scenes: state.pack.scenes.map((s) =>
          s.id === sceneId
            ? {
                ...s,
                clipLayers: (s.clipLayers ?? []).map((l, i) =>
                  i === layerIndex ? { ...l, ...partial } : l,
                ),
              }
            : s,
        ),
      },
    })),
  removeSceneClipLayer: (sceneId, layerIndex) =>
    set((state) => ({
      pack: {
        ...state.pack,
        scenes: state.pack.scenes.map((s) =>
          s.id === sceneId
            ? {
                ...s,
                clipLayers: (s.clipLayers ?? []).filter(
                  (_, i) => i !== layerIndex,
                ),
              }
            : s,
        ),
      },
    })),

  // Clip variants
  addClipVariant: (clipId, variant) =>
    set((state) => ({
      pack: {
        ...state.pack,
        clips: (state.pack.clips ?? []).map((c) =>
          c.id === clipId
            ? { ...c, variants: [...(c.variants ?? []), variant] }
            : c,
        ),
      },
    })),
  updateClipVariant: (clipId, variantId, partial) =>
    set((state) => ({
      pack: {
        ...state.pack,
        clips: (state.pack.clips ?? []).map((c) =>
          c.id === clipId
            ? {
                ...c,
                variants: (c.variants ?? []).map((v) =>
                  v.id === variantId ? { ...v, ...partial } : v,
                ),
              }
            : c,
        ),
      },
    })),
  removeClipVariant: (clipId, variantId) =>
    set((state) => ({
      pack: {
        ...state.pack,
        clips: (state.pack.clips ?? []).map((c) =>
          c.id === clipId
            ? {
                ...c,
                variants: (c.variants ?? []).filter((v) => v.id !== variantId),
              }
            : c,
        ),
      },
    })),
  duplicateClipAsVariant: (clipId, variantName) =>
    set((state) => ({
      pack: {
        ...state.pack,
        clips: (state.pack.clips ?? []).map((c) => {
          if (c.id !== clipId) return c;
          const variant: ClipVariant = {
            id: `var-${Date.now()}`,
            name: variantName,
            notes: [...c.notes],
          };
          return { ...c, variants: [...(c.variants ?? []), variant] };
        }),
      },
    })),

  // ── Cue actions ──
  addCue: (cue) => set((state) => ({
    pack: { ...state.pack, cues: [...(state.pack.cues ?? []), cue] },
    selectedId: cue.id,
  })),
  updateCue: (id, partial) => set((state) => ({
    pack: { ...state.pack, cues: (state.pack.cues ?? []).map((c) => c.id === id ? { ...c, ...partial } : c) },
  })),
  deleteCue: (id) => set((state) => {
    const cues = (state.pack.cues ?? []).filter((c) => c.id !== id);
    return { pack: { ...state.pack, cues }, selectedId: fixSelection(cues, id, state.selectedId) };
  }),
  addCueSection: (cueId, section) => set((state) => ({
    pack: { ...state.pack, cues: (state.pack.cues ?? []).map((c) => c.id === cueId ? { ...c, sections: [...c.sections, section] } : c) },
  })),
  updateCueSection: (cueId, sectionId, partial) => set((state) => ({
    pack: { ...state.pack, cues: (state.pack.cues ?? []).map((c) => c.id === cueId ? { ...c, sections: c.sections.map((s) => s.id === sectionId ? { ...s, ...partial } : s) } : c) },
  })),
  removeCueSection: (cueId, sectionId) => set((state) => ({
    pack: { ...state.pack, cues: (state.pack.cues ?? []).map((c) => c.id === cueId ? { ...c, sections: c.sections.filter((s) => s.id !== sectionId) } : c) },
  })),
  reorderCueSections: (cueId, sectionIds) => set((state) => ({
    pack: { ...state.pack, cues: (state.pack.cues ?? []).map((c) => {
      if (c.id !== cueId) return c;
      const byId = new Map(c.sections.map((s) => [s.id, s]));
      const reordered = sectionIds.map((id) => byId.get(id)).filter(Boolean) as CueSection[];
      return { ...c, sections: reordered };
    }) },
  })),

  // ── Capture actions ──
  captures: [],
  addCapture: (capture) => set((state) => ({ captures: [...state.captures, capture] })),
  deleteCapture: (id) => set((state) => ({ captures: state.captures.filter((c) => c.id !== id) })),
}));
