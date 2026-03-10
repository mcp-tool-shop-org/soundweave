# @soundweave/runtime-pack

Runtime export, parsing, and serialization utilities for Soundweave soundtrack packs.

## Includes

- runtime pack types
- export from authoring packs
- runtime pack parsing and validation
- deterministic JSON serialization

## Main exports

- `exportRuntimePack` — transform authoring pack into runtime contract
- `parseRuntimePack` — parse unknown input, throws on invalid
- `safeParseRuntimePack` — parse without throwing, returns structured issues
- `validateRuntimePack` — validation with ok/issues result
- `serializeRuntimePack` — deterministic JSON output
- `roundTripRuntimePack` — export → serialize → parse in one call

## Scope

This package defines the stable runtime contract for downstream soundtrack consumers.

It strips editor-only fields (notes, display names on bindings/transitions) and preserves only runtime-relevant data.

Round-trip stability is guaranteed: export → serialize → parse yields an equivalent runtime pack.
