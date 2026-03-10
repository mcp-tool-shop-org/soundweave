"use client";

import { create } from "zustand";
import type {
  SoundtrackPack,
  AudioAsset,
  Stem,
  Scene,
  SceneLayerRef,
  TriggerBinding,
  TriggerCondition,
  TransitionRule,
  SoundtrackPackMeta,
} from "@soundweave/schema";

// ── Section type ──

export type Section =
  | "project"
  | "assets"
  | "stems"
  | "scenes"
  | "bindings"
  | "transitions"
  | "review"
  | "preview"
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
}));
