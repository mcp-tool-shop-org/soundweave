# Soundweave

Adaptive soundtrack studio for composing, arranging, scoring, mixing, automating, performing, and exporting interactive music for games.

## What It Is

Soundweave is a composition-first, adaptation-aware workstation. It combines structured music authoring — clips, cues, scenes, layers, automation — with adaptive logic that responds to game state at runtime. The result: game music that feels intentional, not generated.

## What It Is Not

A DAW. A toy sequencer. An AI music generator. A world-building database with sound attached. Soundweave is a serious creative instrument for adaptive game score authoring.

## What It Can Do

- **Compose** — Clips with notes, instruments, scales, chords, motif transforms, intensity variants
- **Arrange** — Scenes with layered stems, section roles, intensity curves
- **Score a world** — Motif families, score profiles, cue families, world map entries, derivation
- **Automate** — Lanes, macros, envelopes, live capture and merge
- **Recall and reuse** — Templates, snapshots, branches, favorites, collections, compare
- **Sample workflow** — Import, trim, slice, kit builder, sample instruments
- **Adaptive logic** — Trigger bindings, transitions, deterministic scene resolution
- **Validate** — Schema validation, integrity auditing, cross-reference checks
- **Export** — Runtime packs for game engine consumption

## Monorepo Structure

### Apps

| App | Description |
|-----|-------------|
| `apps/studio` | Main authoring UI (Next.js 15, Zustand 5) |
| `apps/docs` | Documentation site (Astro) |

### Core Packages

| Package | Description |
|---------|-------------|
| `@soundweave/schema` | Canonical types, Zod schemas, parse/validate |
| `@soundweave/asset-index` | Pack integrity indexing and auditing |
| `@soundweave/audio-engine` | Sample playback and voice management |
| `@soundweave/test-kit` | Fixtures and test utilities |

### Musical and Playback Packages

| Package | Description |
|---------|-------------|
| `@soundweave/sample-lab` | Trim, slice, kit, instrument helpers |
| `@soundweave/score-map` | Motifs, profiles, cue families, derivation |
| `@soundweave/automation` | Lanes, macros, envelopes, capture |
| `@soundweave/library` | Templates, snapshots, branches, favorites, compare |

### Infrastructure Packages

| Package | Description |
|---------|-------------|
| `@soundweave/scene-mapper` | Trigger mapping logic |
| `@soundweave/runtime-pack` | Runtime export/import |
| `@soundweave/review` | Summaries and audit helpers |
| `@soundweave/ui` | Shared UI components |

## Studio Screens

| Screen | What it does |
|--------|-------------|
| Overview | Pack metadata, entity counts, audit summary |
| Assets | Browse, filter, and manage audio assets |
| Stems | Create and edit stems bound to assets |
| Scenes | Build scenes from stem layers |
| Bindings | Map runtime state to scenes with priority |
| Transitions | Define scene-to-scene transition behavior |
| Clips | Compose clips with notes, instruments, and variants |
| Sample Lab | Import, trim, slice, build kits and instruments |
| Score Map | Profiles, motifs, cue families, world map, derivation |
| Automation | Lanes, macros, envelopes, capture, mixer |
| Library | Templates, snapshots, branches, favorites, collections, compare |

## Quick Start

```bash
pnpm install
pnpm build    # 14 packages
pnpm lint     # 14 packages
pnpm test     # 27 test tasks, 299+ tests
pnpm dev      # Start Studio dev server
```

## Testing

All packages have unit tests. The test suite covers:

- Schema validation (27 tests)
- Pack integrity and auditing (20 tests)
- Sample lab operations (33 tests)
- Score map and world scoring (47 tests)
- Automation lanes, macros, envelopes, capture (55 tests)
- Library templates, snapshots, branches, favorites, compare (49 tests)
- Studio store integration (60 tests)

Run everything: `pnpm test`

## Handbook

The [handbook](handbook/) is the comprehensive operating manual covering product vision, architecture, data model, studio usage, creative workflows, and engineering practices.

Priority chapters:
- [What Soundweave Is](handbook/src/01-vision.md)
- [Design Principles](handbook/src/04-design-principles.md)
- [Repository Overview](handbook/src/05-repository-overview.md)
- [Studio Overview](handbook/src/21-studio-overview.md)
- [Building a Cue from Scratch](handbook/src/30-building-a-cue.md)
- [Working with Custom Samples](handbook/src/31-custom-samples.md)
- [World Scoring](handbook/src/32-world-scoring-workflow.md)
- [Automation and Performance Capture](handbook/src/33-automation-capture.md)
- [Library, Branching, and Reuse](handbook/src/34-library-branching-reuse.md)
- [Rendering and Runtime Export](handbook/src/38-rendering-runtime-export.md)
- [Roadmap](handbook/src/39-roadmap.md)
- [Glossary](handbook/src/40-glossary.md)

## License

MIT
