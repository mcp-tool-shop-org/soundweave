// ────────────────────────────────────────────
// Scene player — play layered stems for a scene
// ────────────────────────────────────────────

import type { SoundtrackPack } from "@soundweave/schema";
import { resolveActiveLayers } from "@soundweave/audio-engine";
import type { StemHandle, PlaybackListener, PlaybackEventType } from "./types.js";
import type { AssetLoader } from "./loader.js";
import type { Mixer } from "./mixer.js";
import type { BusId } from "./mixer-types.js";

export class ScenePlayer {
  private ctx: AudioContext;
  private loader: AssetLoader;
  private masterGain: GainNode;
  private handles = new Map<string, StemHandle>();
  private currentSceneId: string | null = null;
  private soloActive = false;
  private listener: PlaybackListener | null = null;
  private mixer: Mixer | null = null;

  constructor(ctx: AudioContext, loader: AssetLoader) {
    this.ctx = ctx;
    this.loader = loader;
    this.masterGain = ctx.createGain();
    this.masterGain.connect(ctx.destination);
  }

  /** Attach a mixer for bus routing and pan. Call before playScene. */
  setMixer(mixer: Mixer): void {
    this.mixer = mixer;
    // Rewire masterGain through mixer
    this.masterGain.disconnect();
    // The mixer's getMasterGain already connects to ctx.destination,
    // so we don't need the scene-player's masterGain when mixer is active.
    // Instead, the mixer handles the final routing.
  }

  setListener(listener: PlaybackListener): void {
    this.listener = listener;
  }

  get sceneId(): string | null {
    return this.currentSceneId;
  }

  get stemHandles(): ReadonlyMap<string, StemHandle> {
    return this.handles;
  }

  getMasterGain(): GainNode {
    return this.masterGain;
  }

  /**
   * Play all stems for a scene. Loads assets if needed.
   * Returns the stem IDs that are playing.
   */
  async playScene(
    pack: SoundtrackPack,
    sceneId: string,
  ): Promise<string[]> {
    // Stop current scene
    this.stopAll();

    this.currentSceneId = sceneId;
    const plan = resolveActiveLayers(pack, sceneId);

    // Load required assets
    await this.loader.loadForStems(pack, plan.stemIds);

    const stemsById = new Map(pack.stems.map((s) => [s.id, s]));
    const scene = pack.scenes.find((s) => s.id === sceneId);
    const layersByStEm = new Map(
      scene?.layers.map((l) => [l.stemId, l]) ?? [],
    );

    const playingStemIds: string[] = [];

    for (const stemId of plan.stemIds) {
      const stem = stemsById.get(stemId);
      if (!stem) continue;

      const buffer = this.loader.getBuffer(stem.assetId);
      if (!buffer) continue;

      const gainNode = this.ctx.createGain();
      const layerRef = layersByStEm.get(stemId);
      const stemGainDb = layerRef?.gainDb ?? stem.gainDb ?? 0;

      gainNode.gain.value = stem.mutedByDefault ? 0 : dbToGain(stemGainDb);

      // Route through mixer if available, otherwise direct to masterGain
      if (this.mixer) {
        const bus: BusId = stem.role === "accent" ? "drums" : "music";
        this.mixer.connectStem(stemId, gainNode, bus);
      } else {
        gainNode.connect(this.masterGain);
      }

      const source = this.ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = stem.loop;
      source.connect(gainNode);
      source.start(0);

      const handle: StemHandle = {
        stemId,
        assetId: stem.assetId,
        source,
        gainNode,
        muted: stem.mutedByDefault ?? false,
        solo: false,
        userGainDb: stemGainDb,
        playing: true,
      };

      source.onended = () => {
        if (handle.playing) {
          handle.playing = false;
          handle.source = null;
          this.emit("stem-change");
        }
      };

      this.handles.set(stemId, handle);
      playingStemIds.push(stemId);
    }

    this.soloActive = false;
    this.emit("scene-change", { sceneId });
    this.emit("stem-change");

    return playingStemIds;
  }

  /** Stop all playing stems */
  stopAll(): void {
    for (const handle of this.handles.values()) {
      handle.playing = false;
      try {
        handle.source?.stop();
      } catch {
        // May already be stopped
      }
      handle.gainNode.disconnect();
    }
    // Disconnect mixer stem routes
    if (this.mixer) {
      this.mixer.disconnectAllStems();
    }
    this.handles.clear();
    this.currentSceneId = null;
    this.soloActive = false;
  }

  /** Set mute for a stem */
  setMuted(stemId: string, muted: boolean): void {
    const h = this.handles.get(stemId);
    if (!h) return;
    h.muted = muted;
    this.updateEffectiveGains();
    this.emit("stem-change");
  }

  /** Toggle solo for a stem */
  setSolo(stemId: string, solo: boolean): void {
    const h = this.handles.get(stemId);
    if (!h) return;
    h.solo = solo;
    this.soloActive = [...this.handles.values()].some((s) => s.solo);
    this.updateEffectiveGains();
    this.emit("stem-change");
  }

  /** Set user gain in dB for a stem */
  setGain(stemId: string, gainDb: number): void {
    const h = this.handles.get(stemId);
    if (!h) return;
    h.userGainDb = gainDb;
    this.updateEffectiveGains();
    this.emit("stem-change");
  }

  /** Set pan for a stem (-1 left to +1 right) */
  setPan(stemId: string, pan: number): void {
    if (!this.mixer) return;
    this.mixer.setPan(stemId, pan);
    this.emit("stem-change");
  }

  /** Get pan for a stem */
  getPan(stemId: string): number {
    return this.mixer?.getPan(stemId) ?? 0;
  }

  /** Set bus assignment for a stem */
  setStemBus(stemId: string, bus: BusId): void {
    if (!this.mixer) return;
    this.mixer.setStemBus(stemId, bus);
    this.emit("stem-change");
  }

  private updateEffectiveGains(): void {
    for (const h of this.handles.values()) {
      let effective: number;
      if (h.muted) {
        effective = 0;
      } else if (this.soloActive && !h.solo) {
        effective = 0;
      } else {
        effective = dbToGain(h.userGainDb);
      }
      h.gainNode.gain.setValueAtTime(effective, this.ctx.currentTime);
    }
  }

  private emit(type: string, detail?: unknown): void {
    this.listener?.({ type: type as PlaybackEventType, detail });
  }
}

/** Convert dB to linear gain */
export function dbToGain(db: number): number {
  return Math.pow(10, db / 20);
}
