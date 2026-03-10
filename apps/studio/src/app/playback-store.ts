"use client";

import { create } from "zustand";
import {
  Transport,
  type TransportState,
  type StemHandle,
  type SequencePlaybackState,
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
  errorMessage: string | null;

  // Actions
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
  dispose: () => void;
}

export const usePlaybackStore = create<PlaybackState>((set) => {
  // Subscribe to transport events to keep store in sync
  const syncFromTransport = () => {
    const t = getTransport();
    const snap = t.getSnapshot();
    const seqState = t.getSequenceState();
    set({
      transportState: snap.transport,
      currentSceneId: snap.currentSceneId,
      stemStates: new Map(snap.stemHandles),
      sequenceState: seqState,
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

    dispose: () => {
      const t = getTransport();
      t.dispose();
      transport = null;
      set({
        transportState: "stopped",
        currentSceneId: null,
        stemStates: new Map(),
        sequenceState: { playing: false, currentStepIndex: -1, totalSteps: 0 },
        errorMessage: null,
      });
    },
  };
});
