// ────────────────────────────────────────────
// @soundweave/clip-engine — barrel exports
// ────────────────────────────────────────────

export { ClipPlayer } from "./clip-player.js";
export { SceneClipPlayer } from "./scene-clip-player.js";
export { scheduleNotes, clipLengthSeconds } from "./scheduler.js";
export type { ScheduledNote } from "./scheduler.js";
export type { ClipPlaybackHandle, ClipPlaybackState } from "./types.js";
export { TICKS_PER_BEAT, TICKS_PER_16TH, TICKS_PER_8TH } from "./types.js";
