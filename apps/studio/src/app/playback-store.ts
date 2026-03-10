"use client";

import { create } from "zustand";
import {
  Transport,
  type TransportState,
  type StemHandle,
  type SequencePlaybackState,
  type MixerSnapshot,
  type BusId,
  type FxType,
  type FxParams,
  type RenderOptions,
  type RenderResult,
} from "@soundweave/playback-engine";
import type { SoundtrackPack, RuntimeMusicState } from "@soundweave/schema";

// ── Singleton transport ──

let transport: Transport | null = null;

function getTransport(): Transport {
  if (!transport) {
    transport = new Transport();
  }
  return transport;
}

// ── Store shape ──

export interface PlaybackState {
  transportState: TransportState;
  currentSceneId: string | null;
  stemStates: Map<string, StemHandle>;
  sequenceState: SequencePlaybackState;
  mixerSnapshot: MixerSnapshot | null;
  renderStatus: "idle" | "rendering" | "done" | "error";
  lastRenderResult: RenderResult | null;
  errorMessage: string | null;

  // Playback actions
  playScene: (pack: SoundtrackPack, sceneId: string) => Promise<void>;
  switchScene: (
    pack: SoundtrackPack,
    sceneId: string,
    options?: { immediate?: boolean },
  ) => Promise<void>;
  playSequence: (
    pack: SoundtrackPack,
    states: RuntimeMusicState[],
    stepDurationMs?: number,
  ) => Promise<void>;
  stop: () => void;
  setMuted: (stemId: string, muted: boolean) => void;
  setSolo: (stemId: string, solo: boolean) => void;
  setGain: (stemId: string, gainDb: number) => void;

  // Mixer actions
  setPan: (stemId: string, pan: number) => void;
  setStemBus: (stemId: string, bus: BusId) => void;
  setMasterGain: (gainDb: number) => void;
  setBusGain: (busId: BusId, gainDb: number) => void;
  setBusMuted: (busId: BusId, muted: boolean) => void;
  addFxSlot: (busId: BusId, type: FxType) => void;
  removeFxSlot: (busId: BusId, slotIndex: number) => void;
  updateFxSlot: (busId: BusId, slotIndex: number, params: FxParams) => void;
  setFxBypassed: (busId: BusId, slotIndex: number, bypassed: boolean) => void;

  // Render actions
  renderScene: (pack: SoundtrackPack, options: RenderOptions) => Promise<void>;

  dispose: () => void;
}

export const usePlaybackStore = create<PlaybackState>((set) => {
  // Subscribe to transport events to keep store in sync
  const syncFromTransport = () => {
    const t = getTransport();
    const snap = t.getSnapshot();
    const seqState = t.getSequenceState();
    const mixSnap = t.getMixerSnapshot();
    set({
      transportState: snap.transport,
      currentSceneId: snap.currentSceneId,
      stemStates: new Map(snap.stemHandles),
      sequenceState: seqState,
      mixerSnapshot: mixSnap,
      errorMessage: snap.errorMessage,
    });
  };

  // Attach listener on first use
  const t = getTransport();
  t.on(() => syncFromTransport());

  return {
    transportState: "stopped",
    currentSceneId: null,
    stemStates: new Map(),
    sequenceState: { playing: false, currentStepIndex: -1, totalSteps: 0 },
    mixerSnapshot: null,
    renderStatus: "idle",
    lastRenderResult: null,
    errorMessage: null,

    playScene: async (pack, sceneId) => {
      const t = getTransport();
      await t.playScene(pack, sceneId);
      syncFromTransport();
    },

    switchScene: async (pack, sceneId, options) => {
      const t = getTransport();
      await t.switchScene(pack, sceneId, options);
      syncFromTransport();
    },

    playSequence: async (pack, states, stepDurationMs) => {
      const t = getTransport();
      await t.playSequence(pack, states, stepDurationMs);
      syncFromTransport();
    },

    stop: () => {
      const t = getTransport();
      t.stop();
      syncFromTransport();
    },

    setMuted: (stemId, muted) => {
      const t = getTransport();
      t.setMuted(stemId, muted);
      syncFromTransport();
    },

    setSolo: (stemId, solo) => {
      const t = getTransport();
      t.setSolo(stemId, solo);
      syncFromTransport();
    },

    setGain: (stemId, gainDb) => {
      const t = getTransport();
      t.setGain(stemId, gainDb);
      syncFromTransport();
    },

    // Mixer actions
    setPan: (stemId, pan) => {
      const t = getTransport();
      t.setPan(stemId, pan);
      syncFromTransport();
    },

    setStemBus: (stemId, bus) => {
      const t = getTransport();
      t.setStemBus(stemId, bus);
      syncFromTransport();
    },

    setMasterGain: (gainDb) => {
      const t = getTransport();
      t.setMasterGain(gainDb);
      syncFromTransport();
    },

    setBusGain: (busId, gainDb) => {
      const t = getTransport();
      t.setBusGain(busId, gainDb);
      syncFromTransport();
    },

    setBusMuted: (busId, muted) => {
      const t = getTransport();
      t.setBusMuted(busId, muted);
      syncFromTransport();
    },

    addFxSlot: (busId, type) => {
      const t = getTransport();
      t.addFxSlot(busId, type);
      syncFromTransport();
    },

    removeFxSlot: (busId, slotIndex) => {
      const t = getTransport();
      t.removeFxSlot(busId, slotIndex);
      syncFromTransport();
    },

    updateFxSlot: (busId, slotIndex, params) => {
      const t = getTransport();
      t.updateFxSlot(busId, slotIndex, params);
      syncFromTransport();
    },

    setFxBypassed: (busId, slotIndex, bypassed) => {
      const t = getTransport();
      t.setFxBypassed(busId, slotIndex, bypassed);
      syncFromTransport();
    },

    // Render actions
    renderScene: async (pack, options) => {
      const t = getTransport();
      set({ renderStatus: "rendering", lastRenderResult: null });
      try {
        const result = await t.renderScene(pack, options);
        set({ renderStatus: "done", lastRenderResult: result });
      } catch {
        set({ renderStatus: "error", lastRenderResult: null });
      }
    },

    dispose: () => {
      const t = getTransport();
      t.dispose();
      transport = null;
      set({
        transportState: "stopped",
        currentSceneId: null,
        stemStates: new Map(),
        sequenceState: { playing: false, currentStepIndex: -1, totalSteps: 0 },
        mixerSnapshot: null,
        renderStatus: "idle",
        lastRenderResult: null,
        errorMessage: null,
      });
    },
  };
});
