---
title: Automation and Performance Capture
description: Expressive time-varying control and live performance recording
sidebar:
  order: 3
---

Soundweave's automation system lets creators add expressive, time-varying control to their adaptive scores — and capture live performances of those controls.

## Automation Lanes

An automation lane is a list of timed value points for a specific target parameter. Create lanes with `createLane(id, target, points)` and use `evaluateLane(lane, timeMs)` to get interpolated values at any time.

## Macros

Macros are high-level parameters (intensity, tension, energy) that drive multiple automation targets at once. Game state or performer input changes macro values, which cascade to mapped parameters via `evaluateMacros(mappings, macroState)`.

## Section Envelopes

Envelopes shape dynamics across structural sections of a cue (intro, loop, fill, outro, breakdown, build, drop). They add structural dynamics without manually placing automation points.

## Capture

Live capture records automation values in real time:

1. **Create a capture**: `createCapture(id, name, source)`
2. **Record points**: `recordPoint(capture, timeMs, value)`
3. **Finalize**: `finalizeCapture(capture, laneId?)` — sorts points by time and optionally links to a lane
4. **Apply**: `applyCaptureToLane` or `mergeCaptureIntoLane`
5. **Optimize**: `thinCapture(capture, tolerance)` reduces point density

## The Performance-to-Cue Pipeline

1. Set up automation lanes for key parameters
2. Configure macros for high-level game-state control
3. Perform live — adjust macros, trigger scenes, capture the result
4. Apply captures to lanes — the performance becomes editable automation
5. Add section envelopes — shape intro/outro dynamics
6. Snapshot in Library — preserve this version before further editing
7. Branch if needed — try a different approach without losing the original

This pipeline transforms live musical gestures into structured, deterministic automation data that exports cleanly to the runtime pack.
