# @soundweave/audio-engine

Scene-layer resolution, transition lookup, and simulation utilities for Soundweave packs.

## Includes

- active stem resolution for scenes (with de-dupe and required/optional separation)
- exact transition lookup between scenes (first pack-order match wins)
- deterministic simulation of soundtrack behavior across runtime state sequences
- structured per-step warnings for preview and debugging

## Main exports

- `resolveActiveLayers(pack, sceneId)` — resolve which stems are active for a scene
- `findTransitionRule(pack, fromSceneId, toSceneId)` — find exact transition rule
- `simulateStateSequence(pack, states)` — simulate behavior across a state sequence

## Scope

This package provides decision and simulation logic for adaptive soundtrack behavior.
It does **not** perform real audio playback.

## Behavior notes

- Missing scenes and stems produce warnings, never throws
- Same-scene transitions return `undefined` (no drama)
- Transition lookup is exact match only; first pack-order rule wins
- Layer de-dupe preserves first occurrence order
- Simulation emits one step per input state with accumulated warnings
