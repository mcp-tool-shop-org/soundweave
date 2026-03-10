// ────────────────────────────────────────────
// Transition player — crossfade, stinger-then-switch, immediate
// ────────────────────────────────────────────

import type { SoundtrackPack, TransitionRule } from "@soundweave/schema";
import { findTransitionRule } from "@soundweave/audio-engine";
import type { PlaybackListener, PlaybackEventType } from "./types.js";
import type { ScenePlayer } from "./scene-player.js";
import type { AssetLoader } from "./loader.js";

export class TransitionPlayer {
  private ctx: AudioContext;
  private scenePlayer: ScenePlayer;
  private loader: AssetLoader;
  private listener: PlaybackListener | null = null;
  private transitioning = false;

  constructor(
    ctx: AudioContext,
    scenePlayer: ScenePlayer,
    loader: AssetLoader,
  ) {
    this.ctx = ctx;
    this.scenePlayer = scenePlayer;
    this.loader = loader;
  }

  setListener(listener: PlaybackListener): void {
    this.listener = listener;
  }

  get isTransitioning(): boolean {
    return this.transitioning;
  }

  /**
   * Switch from current scene to target scene, applying the transition rule if one exists.
   * Falls back to immediate switch if no rule or unsupported mode.
   */
  async switchScene(
    pack: SoundtrackPack,
    toSceneId: string,
    options?: { immediate?: boolean },
  ): Promise<void> {
    const fromSceneId = this.scenePlayer.sceneId;

    if (options?.immediate || !fromSceneId || fromSceneId === toSceneId) {
      await this.scenePlayer.playScene(pack, toSceneId);
      return;
    }

    const rule = findTransitionRule(pack, fromSceneId, toSceneId);
    if (!rule) {
      // No rule → immediate hard cut
      await this.scenePlayer.playScene(pack, toSceneId);
      return;
    }

    this.transitioning = true;
    try {
      switch (rule.mode) {
        case "crossfade":
          await this.crossfade(pack, toSceneId, rule);
          break;
        case "stinger-then-switch":
          await this.stingerThenSwitch(pack, toSceneId, rule);
          break;
        case "immediate":
        default:
          await this.scenePlayer.playScene(pack, toSceneId);
          break;
      }
    } finally {
      this.transitioning = false;
    }
  }

  private async crossfade(
    pack: SoundtrackPack,
    toSceneId: string,
    rule: TransitionRule,
  ): Promise<void> {
    const durationMs = rule.durationMs ?? 1000;
    const durationS = durationMs / 1000;
    const now = this.ctx.currentTime;

    // Fade out current scene's master gain
    const masterGain = this.scenePlayer.getMasterGain();
    masterGain.gain.setValueAtTime(masterGain.gain.value, now);
    masterGain.gain.linearRampToValueAtTime(0, now + durationS);

    // Wait half the fade, then start new scene
    await sleep(durationMs / 2);

    // Play new scene (this stops old stems and resets master gain)
    await this.scenePlayer.playScene(pack, toSceneId);

    // Fade in new scene
    const newMasterGain = this.scenePlayer.getMasterGain();
    newMasterGain.gain.setValueAtTime(0, this.ctx.currentTime);
    newMasterGain.gain.linearRampToValueAtTime(1, this.ctx.currentTime + durationS / 2);

    await sleep(durationMs / 2);
  }

  private async stingerThenSwitch(
    pack: SoundtrackPack,
    toSceneId: string,
    rule: TransitionRule,
  ): Promise<void> {
    if (!rule.stingerAssetId) {
      // No stinger → fall back to immediate
      await this.scenePlayer.playScene(pack, toSceneId);
      return;
    }

    const buffer = await this.loader.loadStingerAsset(pack, rule.stingerAssetId);
    if (!buffer) {
      await this.scenePlayer.playScene(pack, toSceneId);
      return;
    }

    // Play stinger through a temporary gain node
    const stingerGain = this.ctx.createGain();
    stingerGain.connect(this.ctx.destination);
    const stingerSource = this.ctx.createBufferSource();
    stingerSource.buffer = buffer;
    stingerSource.connect(stingerGain);
    stingerSource.start(0);

    // Wait for stinger to finish (or use durationMs if shorter)
    const waitMs = rule.durationMs ?? buffer.duration * 1000;
    await sleep(waitMs);

    stingerGain.disconnect();

    // Then switch to new scene
    await this.scenePlayer.playScene(pack, toSceneId);
  }

  private emit(type: string, detail?: unknown): void {
    this.listener?.({ type: type as PlaybackEventType, detail });
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
