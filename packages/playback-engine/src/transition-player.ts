// ────────────────────────────────────────────
// Transition player — crossfade, stinger-then-switch, immediate
// Supports exponential + linear fade curves and stinger level control
// ────────────────────────────────────────────

import type { SoundtrackPack, TransitionRule } from "@soundweave/schema";
import { findTransitionRule } from "@soundweave/audio-engine";
import type { PlaybackListener, PlaybackEventType } from "./types.js";
import type { ScenePlayer } from "./scene-player.js";
import type { AssetLoader } from "./loader.js";
import type { Mixer } from "./mixer.js";

/** Fade curve style */
export type FadeCurve = "linear" | "exponential";

/** Options for transition polish */
export interface TransitionOptions {
  immediate?: boolean;
  fadeCurve?: FadeCurve;
  stingerGainDb?: number;
}

export class TransitionPlayer {
  private ctx: AudioContext;
  private scenePlayer: ScenePlayer;
  private loader: AssetLoader;
  private listener: PlaybackListener | null = null;
  private transitioning = false;
  private mixer: Mixer | null = null;

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

  /** Attach a mixer (for routing stingers through the master bus) */
  setMixer(mixer: Mixer): void {
    this.mixer = mixer;
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
    options?: TransitionOptions,
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
      const fadeCurve = options?.fadeCurve ?? "exponential";
      switch (rule.mode) {
        case "crossfade":
          await this.crossfade(pack, toSceneId, rule, fadeCurve);
          break;
        case "stinger-then-switch":
          await this.stingerThenSwitch(
            pack,
            toSceneId,
            rule,
            options?.stingerGainDb ?? 0,
          );
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
    fadeCurve: FadeCurve,
  ): Promise<void> {
    const durationMs = rule.durationMs ?? 1000;
    const durationS = durationMs / 1000;
    const now = this.ctx.currentTime;

    // Get the gain node to ramp: mixer master or scene-player master
    const masterGain = this.mixer
      ? this.mixer.getMasterGain()
      : this.scenePlayer.getMasterGain();

    // Fade out using selected curve
    masterGain.gain.setValueAtTime(masterGain.gain.value, now);
    if (fadeCurve === "exponential") {
      // exponentialRamp needs a non-zero target; use near-zero
      masterGain.gain.exponentialRampToValueAtTime(0.0001, now + durationS);
    } else {
      masterGain.gain.linearRampToValueAtTime(0, now + durationS);
    }

    // Wait half the fade, then start new scene
    await sleep(durationMs / 2);

    // Play new scene (this stops old stems and resets master gain)
    await this.scenePlayer.playScene(pack, toSceneId);

    // Fade in new scene
    const newMasterGain = this.mixer
      ? this.mixer.getMasterGain()
      : this.scenePlayer.getMasterGain();
    const fadeInStart = this.ctx.currentTime;
    newMasterGain.gain.setValueAtTime(0.0001, fadeInStart);
    if (fadeCurve === "exponential") {
      newMasterGain.gain.exponentialRampToValueAtTime(
        1,
        fadeInStart + durationS / 2,
      );
    } else {
      newMasterGain.gain.linearRampToValueAtTime(
        1,
        fadeInStart + durationS / 2,
      );
    }

    await sleep(durationMs / 2);
  }

  private async stingerThenSwitch(
    pack: SoundtrackPack,
    toSceneId: string,
    rule: TransitionRule,
    stingerGainDb: number,
  ): Promise<void> {
    if (!rule.stingerAssetId) {
      await this.scenePlayer.playScene(pack, toSceneId);
      return;
    }

    const buffer = await this.loader.loadStingerAsset(
      pack,
      rule.stingerAssetId,
    );
    if (!buffer) {
      await this.scenePlayer.playScene(pack, toSceneId);
      return;
    }

    // Play stinger through the mixer's master bus if available, else destination
    const stingerGain = this.ctx.createGain();
    stingerGain.gain.value = dbToLinear(stingerGainDb);
    if (this.mixer) {
      stingerGain.connect(this.mixer.getMasterGain());
    } else {
      stingerGain.connect(this.ctx.destination);
    }

    const stingerSource = this.ctx.createBufferSource();
    stingerSource.buffer = buffer;
    stingerSource.connect(stingerGain);
    stingerSource.start(0);

    const waitMs = rule.durationMs ?? buffer.duration * 1000;
    await sleep(waitMs);

    stingerGain.disconnect();

    await this.scenePlayer.playScene(pack, toSceneId);
  }

  private emit(type: string, detail?: unknown): void {
    this.listener?.({ type: type as PlaybackEventType, detail });
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function dbToLinear(db: number): number {
  return Math.pow(10, db / 20);
}
