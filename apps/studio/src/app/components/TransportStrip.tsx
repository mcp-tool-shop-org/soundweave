"use client";

import { usePlaybackStore } from "../playback-store";

export function TransportStrip() {
  const transportState = usePlaybackStore((s) => s.transportState);
  const currentSceneId = usePlaybackStore((s) => s.currentSceneId);
  const sequenceState = usePlaybackStore((s) => s.sequenceState);
  const stop = usePlaybackStore((s) => s.stop);
  const errorMessage = usePlaybackStore((s) => s.errorMessage);

  const isPlaying = transportState === "playing";
  const isLoading = transportState === "loading";

  return (
    <div className="transport-strip" role="toolbar" aria-label="Playback transport">
      <div className="transport-status">
        <span
          className={`transport-indicator ${transportState}`}
          title={transportState}
        />
        <span className="transport-label">
          {isLoading && "Loading…"}
          {isPlaying && currentSceneId && `Playing: ${currentSceneId}`}
          {transportState === "stopped" && "Stopped"}
          {transportState === "error" && `Error: ${errorMessage ?? "unknown"}`}
        </span>
      </div>

      {sequenceState.playing && (
        <span className="transport-sequence-info">
          Step {sequenceState.currentStepIndex + 1} / {sequenceState.totalSteps}
        </span>
      )}

      <div className="transport-actions">
        <button
          className="btn btn-sm"
          onClick={stop}
          disabled={transportState === "stopped"}
          title="Stop playback"
        >
          ■ Stop
        </button>
      </div>
    </div>
  );
}
