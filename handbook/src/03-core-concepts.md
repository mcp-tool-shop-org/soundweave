# Core Concepts

## Audio Asset
A file reference with metadata: kind (loop, oneshot, stinger, ambient), duration, BPM, key, tags.

## Stem
A playable layer within a scene, bound to an audio asset with a role (base, danger, combat, boss, recovery, mystery, faction).

## Scene
A named musical state (exploration, tension, combat, boss, victory, aftermath, stealth, safe-zone) composed of one or more stems.

## Trigger Binding
A rule that maps runtime game state (mode, danger level, boss presence) to a scene, with priority for conflict resolution.

## Transition Rule
Defines how music moves between scenes: immediate cut, crossfade, bar-sync, or stinger-then-switch.

## Soundtrack Pack
The export artifact: a bundle of assets, stems, scenes, bindings, and transitions consumable by a game runtime.
