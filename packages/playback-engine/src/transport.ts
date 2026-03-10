// ────────────────────────────────────────────
// Transport — top-level orchestrator for playback
// ────────────────────────────────────────────

import type { SoundtrackPack, RuntimeMusicState } from "@soundweave/schema";
import type {
  TransportState,
  PlaybackSnapshot,
  PlaybackListener,
  PlaybackEvent,
  SequencePlaybackState,
} from "./types.js";
import { AssetLoader } from "./loader.js";
import { ScenePlayer } from "./scene-player.js";
import { TransitionPlayer } from "./transition-player.js";
import { SequencePlayer } from "./sequence-player.js";

/**
 * Top-level playback transport.
 *
 * Manages AudioContext lifecycle, coordinates scene/transition/sequence players,
 * and provides a unified event system for UI binding.
 */
export class Transport {
  private ctx: AudioContext | null = null;
  private loader: AssetLoader | null = null;
  private scenePlayer: ScenePlayer | null = null;
  private transitionPlayer: TransitionPlayer | null = null;
  private sequencePlayer: SequencePlayer | null = null;
  private state: TransportState = "stopped";
  private listeners = new Set<PlaybackListener>();
  private errorMessage: string | null = null;

  /** Ensure AudioContext exists (requires user gesture in browsers) */
  ensureContext(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.loader = new AssetLoader(this.ctx);
      this.scenePlayer = new ScenePlayer(this.ctx, this.loader);
      this.transitionPlayer = new TransitionPlayer(
        this.ctx,
        this.scenePlayer,
        this.loader,
      );
      this.sequencePlayer = new SequencePlayer(
        this.scenePlayer,
        this.transitionPlayer,
      );

      // Wire internal events to transport listeners
      const relay = (evt: PlaybackEvent) => this.emit(evt.type, evt.detail);
      this.loader.setListener(relay);
      this.scenePlayer.setListener(relay);
      this.transitionPlayer.setListener(relay);
      this.sequencePlayer.setListener(relay);
    }

    // Resume if suspended (browser autoplay policy)
    if (this.ctx.state === "suspended") {
      void this.ctx.resume();
    }

    return this.ctx;
  }

  /** Play a specific scene */
  async playScene(pack: SoundtrackPack, sceneId: string): Promise<void> {
    try {
      this.ensureContext();
      this.setState("loading");
      this.sequencePlayer!.stop();
      await this.transitionPlayer!.switchScene(pack, sceneId);
      this.setState("playing");
    } catch (err) {
      this.handleError(err);
    }
  }

  /** Play a scene with transition from current */
  async switchScene(
    pack: SoundtrackPack,
    toSceneId: string,
    options?: { immediate?: boolean },
  ): Promise<void> {
    try {
      this.ensureContext();
      this.setState("loading");
      this.sequencePlayer!.stop();
      await this.transitionPlayer!.switchScene(pack, toSceneId, options);
      this.setState("playing");
    } catch (err) {
      this.handleError(err);
    }
  }

  /** Play through a sequence of states */
  async playSequence(
    pack: SoundtrackPack,
    states: RuntimeMusicState[],
    stepDurationMs?: number,
  ): Promise<void> {
    try {
      this.ensureContext();
      this.setState("playing");
      await this.sequencePlayer!.playSequence(pack, states, stepDurationMs);
      this.setState("stopped");
    } catch (err) {
      this.handleError(err);
    }
  }

  /** Stop all playback */
  stop(): void {
    this.sequencePlayer?.stop();
    this.scenePlayer?.stopAll();
    this.setState("stopped");
  }

  /** Mute a stem */
  setMuted(stemId: string, muted: boolean): void {
    this.scenePlayer?.setMuted(stemId, muted);
  }

  /** Solo a stem */
  setSolo(stemId: string, solo: boolean): void {
    this.scenePlayer?.setSolo(stemId, solo);
  }

  /** Set gain on a stem */
  setGain(stemId: string, gainDb: number): void {
    this.scenePlayer?.setGain(stemId, gainDb);
  }

  /** Subscribe to events */
  on(listener: PlaybackListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /** Get current snapshot */
  getSnapshot(): PlaybackSnapshot {
    return {
      transport: this.state,
      currentSceneId: this.scenePlayer?.sceneId ?? null,
      stemHandles: this.scenePlayer?.stemHandles ?? new Map(),
      loadState: this.state === "loading" ? "loading" : this.state === "error" ? "error" : "idle",
      loadProgress: 1,
      errorMessage: this.errorMessage,
    };
  }

  /** Get sequence playback state */
  getSequenceState(): SequencePlaybackState {
    return (
      this.sequencePlayer?.state ?? {
        playing: false,
        currentStepIndex: -1,
        totalSteps: 0,
      }
    );
  }

  /** Dispose all resources */
  dispose(): void {
    this.stop();
    this.loader?.clear();
    if (this.ctx && this.ctx.state !== "closed") {
      void this.ctx.close();
    }
    this.ctx = null;
    this.loader = null;
    this.scenePlayer = null;
    this.transitionPlayer = null;
    this.sequencePlayer = null;
    this.listeners.clear();
  }

  private setState(s: TransportState): void {
    if (s !== "error") this.errorMessage = null;
    this.state = s;
    this.emit("transport-change", { state: s });
  }

  private handleError(err: unknown): void {
    const msg = err instanceof Error ? err.message : String(err);
    this.errorMessage = msg;
    this.setState("error");
  }

  private emit(type: string, detail?: unknown): void {
    const event: PlaybackEvent = {
      type: type as PlaybackEvent["type"],
      detail,
    };
    for (const listener of this.listeners) {
      listener(event);
    }
  }
}
