# Examples

Example soundtrack packs and starter content for Soundweave.

## Current Fixtures

Example packs currently live as JSON fixtures in `packages/test-kit/fixtures/`. These are used by the test suite and serve as reference packs:

- **minimal-pack.json** — Bare minimum valid pack (2 assets, no optional arrays)
- **starter-pack.json** — Richer pack with stems, scenes, bindings, and transitions
- **integrity-valid-pack.json** — Clean pack that passes all integrity checks

## Planned Examples

Educational example packs demonstrating real workflows:

- **Adaptive Exploration/Combat** — Forest region with exploration, tension, and combat scenes sharing motif families and score profiles
- **Faction Identity** — Two factions with distinct score profiles, palette tags, and cue families
- **Custom Sample Kit** — Imported sounds → trim → slice → kit → instrument → clip → scene
- **Cue Capture** — Live performance captured, thinned, and applied to automation lanes
- **Automation/Macros** — Macro-driven parameters with section envelopes and intensity mappings
- **Motif Family World Scoring** — Complete world map with regions, factions, and derived material

## Adding Examples

Place example packs in this directory as JSON files or subdirectories. Each example should include:

1. A valid `SoundtrackPack` JSON file
2. A brief README explaining what the example demonstrates
3. Enough entities to show the workflow end-to-end
