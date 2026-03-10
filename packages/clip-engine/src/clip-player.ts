// ────────────────────────────────────────────
// ClipPlayer — plays a single clip through the instrument rack
// ────────────────────────────────────────────

import type { Clip } from "@soundweave/schema";
import type { InstrumentRack } from "@soundweave/instrument-rack";
import type { Voice } from "@soundweave/instrument-rack";
import { scheduleNotes, clipLengthSeconds } from "./scheduler.js";
import type { ClipPlaybackState } from "./types.js";

/**
 * Plays a single clip at a scheduled AudioContext time,
 * routing notes through the InstrumentRack voice resolved from the clip's instrumentId.
 * Handles looping by re-scheduling the clip when each iteration ends.
 */
export class ClipPlayer {
  private activeVoices: Voice[] = [];
  private loopTimer: ReturnType<typeof setTimeout> | null = null;
  private _state: ClipPlaybackState = "stopped";

  get state(): ClipPlaybackState {
    return this._state;
  }

  /**
   * Play the clip starting at `startTime` (AudioContext time).
   * If clip.loop is true, re-schedules automatically.
   */
  play(
    ctx: AudioContext,
    clip: Clip,
    rack: InstrumentRack,
    output: AudioNode,
    startTime?: number,
  ): void {
    this.stop();

    const voice = rack.getVoice(clip.instrumentId);
    if (!voice) return;

    const now = startTime ?? ctx.currentTime;
    this._state = "playing";

    this.scheduleClipNotes(ctx, clip, voice, output, now);

    if (clip.loop) {
      this.scheduleLoop(ctx, clip, rack, output, now);
    }
  }

  /** Stop playback and cancel any pending loop */
  stop(): void {
    for (const v of this.activeVoices) {
      try {
        v.stop();
      } catch {
        // Voice may already be stopped
      }
    }
    this.activeVoices = [];

    if (this.loopTimer !== null) {
      clearTimeout(this.loopTimer);
      this.loopTimer = null;
    }
    this._state = "stopped";
  }

  private scheduleClipNotes(
    ctx: AudioContext,
    clip: Clip,
    instrumentVoice: { playNote: (ctx: AudioContext, pitch: number, velocity: number, startTime: number, duration: number, output: AudioNode) => Voice },
    output: AudioNode,
    startTime: number,
  ): void {
    const scheduled = scheduleNotes(clip.notes, clip.bpm, startTime);

    for (const note of scheduled) {
      const v = instrumentVoice.playNote(
        ctx,
        note.pitch,
        note.velocity,
        note.startTime,
        note.duration,
        output,
      );
      this.activeVoices.push(v);
    }
  }

  private scheduleLoop(
    ctx: AudioContext,
    clip: Clip,
    rack: InstrumentRack,
    output: AudioNode,
    loopStartTime: number,
  ): void {
    const clipDuration = clipLengthSeconds(clip.bpm, clip.lengthBeats);
    // Schedule next iteration slightly before it's needed
    const msUntilNextLoop = (loopStartTime + clipDuration - ctx.currentTime) * 1000;

    // Don't schedule if it's in the past (shouldn't happen but be safe)
    if (msUntilNextLoop < 0) return;

    this.loopTimer = setTimeout(() => {
      if (this._state !== "playing") return;

      const voice = rack.getVoice(clip.instrumentId);
      if (!voice) return;

      const nextStartTime = loopStartTime + clipDuration;
      this.scheduleClipNotes(ctx, clip, voice, output, nextStartTime);
      this.scheduleLoop(ctx, clip, rack, output, nextStartTime);
    }, Math.max(0, msUntilNextLoop - 100)); // 100ms lookahead
  }
}
