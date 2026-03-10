---
title: Rendering and Runtime Export
description: Audio renders and runtime pack export for game engines
sidebar:
  order: 0
---

Soundweave produces two kinds of output: audio renders for listening and review, and runtime packs for game engine consumption.

## Authoring Pack vs Runtime Pack

The **authoring pack** (`SoundtrackPack`) is the full source of truth — all entities, metadata, composition data, library data, and automation. The **runtime pack** is what ships to the game — stripped down to scenes, bindings, transitions, and asset references.

The runtime pack does not contain clip composition data, sample lab data, score map metadata, automation authoring data, or library data. It is a deployment artifact, not an authoring document.

## Deterministic Serialization

Both packs serialize to JSON deterministically. Given the same in-memory state, the same JSON output is produced every time. This means exported packs can be diffed in version control, round-trips produce identical results, and test fixtures are stable.

## What a Game Engine Expects

A game engine consuming a runtime pack needs to:

1. Load the pack JSON and parse it
2. Evaluate trigger bindings against the current game state to determine the active scene
3. Apply transition rules when the active scene changes
4. Load and play audio assets according to the active scene's layer stack
5. Handle priority resolution — highest priority wins, pack order as tie-breaker

The runtime contract is deliberately simple. Soundweave does the hard compositional work at authoring time so the runtime can be a straightforward state machine.

## Audio Rendering

Soundweave can render full cue timelines, loop-only sections, preview sequences, and captured performances as WAV files. Rendering uses `OfflineAudioContext` for deterministic offline processing.

## Round-Trip Verification

Export then import should produce a functionally identical pack. Schema validation and integrity checks run on both sides. This is tested in CI.
