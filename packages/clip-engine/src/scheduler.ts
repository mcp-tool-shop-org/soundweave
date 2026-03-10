// ────────────────────────────────────────────
// Clip Scheduler — converts tick positions to AudioContext time
// ────────────────────────────────────────────

import type { ClipNote } from "@soundweave/schema";
import { TICKS_PER_BEAT } from "./types.js";

/** Resolved note with real-time positions (seconds) */
export interface ScheduledNote {
  pitch: number;
  velocity: number;
  /** AudioContext time to start */
  startTime: number;
  /** Duration in seconds */
  duration: number;
}

/**
 * Convert tick-based clip notes to absolute AudioContext times.
 *
 * @param notes Clip notes (tick-based)
 * @param bpm Beats per minute
 * @param startTime AudioContext time corresponding to tick 0
 * @returns Notes with resolved start/duration in seconds
 */
export function scheduleNotes(
  notes: readonly ClipNote[],
  bpm: number,
  startTime: number,
): ScheduledNote[] {
  const secondsPerTick = 60 / (bpm * TICKS_PER_BEAT);
  return notes.map((n) => ({
    pitch: n.pitch,
    velocity: n.velocity,
    startTime: startTime + n.startTick * secondsPerTick,
    duration: n.durationTicks * secondsPerTick,
  }));
}

/**
 * Get the length of a clip in seconds.
 */
export function clipLengthSeconds(bpm: number, lengthBeats: number): number {
  return (lengthBeats / bpm) * 60;
}
