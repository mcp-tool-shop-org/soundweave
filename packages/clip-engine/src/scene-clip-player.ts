// ────────────────────────────────────────────
// SceneClipPlayer — activates all clips for a scene
// ────────────────────────────────────────────

import type { Clip, SceneClipRef, Scene } from "@soundweave/schema";
import type { InstrumentRack } from "@soundweave/instrument-rack";
import { ClipPlayer } from "./clip-player.js";

interface ActiveClipEntry {
  clipId: string;
  player: ClipPlayer;
  gainNode: GainNode;
  muted: boolean;
}

/**
 * Manages clip playback for an entire scene.
 * Creates a ClipPlayer per SceneClipRef, applies per-clip gain,
 * and provides mute/unmute control.
 */
export class SceneClipPlayer {
  private entries: ActiveClipEntry[] = [];
  private playing = false;

  get isPlaying(): boolean {
    return this.playing;
  }

  /**
   * Start playing all clips assigned to a scene.
   *
   * @param ctx AudioContext
   * @param scene The scene (for clipLayers)
   * @param clips All clips available in the pack
   * @param rack InstrumentRack for voice resolution
   * @param output Destination AudioNode
   * @param startTime Optional AudioContext start time
   */
  playScene(
    ctx: AudioContext,
    scene: Scene,
    clips: Clip[],
    rack: InstrumentRack,
    output: AudioNode,
    startTime?: number,
  ): void {
    this.stopAll();

    const layers = scene.clipLayers ?? [];
    if (layers.length === 0) return;

    this.playing = true;

    for (const ref of layers) {
      const clip = clips.find((c) => c.id === ref.clipId);
      if (!clip) continue;

      const gainNode = ctx.createGain();
      const dbGain = ref.gainDb ?? clip.gainDb ?? 0;
      gainNode.gain.value = dbToGain(dbGain);
      gainNode.connect(output);

      const player = new ClipPlayer();
      const muted = ref.mutedByDefault ?? false;

      if (muted) {
        gainNode.gain.value = 0;
      }

      player.play(ctx, clip, rack, gainNode, startTime ?? ctx.currentTime);

      this.entries.push({ clipId: ref.clipId, player, gainNode, muted });
    }
  }

  /** Stop all clip playback */
  stopAll(): void {
    for (const entry of this.entries) {
      entry.player.stop();
      entry.gainNode.disconnect();
    }
    this.entries = [];
    this.playing = false;
  }

  /** Mute/unmute a clip layer by clipId */
  setMuted(clipId: string, muted: boolean): void {
    const entry = this.entries.find((e) => e.clipId === clipId);
    if (!entry) return;
    entry.muted = muted;
    entry.gainNode.gain.value = muted ? 0 : 1;
  }

  /** Set gain on a clip layer */
  setGain(clipId: string, gainDb: number): void {
    const entry = this.entries.find((e) => e.clipId === clipId);
    if (!entry || entry.muted) return;
    entry.gainNode.gain.value = dbToGain(gainDb);
  }

  /** Get active clip IDs */
  getActiveClipIds(): string[] {
    return this.entries.map((e) => e.clipId);
  }

  /** Get mute state for a clip */
  isMuted(clipId: string): boolean {
    return this.entries.find((e) => e.clipId === clipId)?.muted ?? false;
  }
}

function dbToGain(db: number): number {
  return Math.pow(10, db / 20);
}
