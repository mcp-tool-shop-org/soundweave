// ────────────────────────────────────────────
// @soundweave/clip-engine — barrel exports
// ────────────────────────────────────────────

export { ClipPlayer, resolveClipNotes } from "./clip-player.js";
export { SceneClipPlayer, filterByIntensity, sortByOrder } from "./scene-clip-player.js";
export { scheduleNotes, clipLengthSeconds, quantizedLaunchTime } from "./scheduler.js";
export type { ScheduledNote } from "./scheduler.js";
export type { ClipPlaybackHandle, ClipPlaybackState } from "./types.js";
export { TICKS_PER_BEAT, TICKS_PER_16TH, TICKS_PER_8TH } from "./types.js";
