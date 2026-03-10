<p align="center">
  <a href="README.ja.md">日本語</a> | <a href="README.zh.md">中文</a> | <a href="README.es.md">Español</a> | <a href="README.fr.md">Français</a> | <a href="README.hi.md">हिन्दी</a> | <a href="README.it.md">Italiano</a> | <a href="README.pt-BR.md">Português (BR)</a>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/mcp-tool-shop-org/brand/main/logos/soundweave/readme.png" width="400" alt="SoundWeave">
</p>

<p align="center">
  <a href="https://github.com/mcp-tool-shop-org/soundweave/actions/workflows/ci.yml"><img src="https://github.com/mcp-tool-shop-org/soundweave/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="https://codecov.io/gh/mcp-tool-shop-org/soundweave"><img src="https://codecov.io/gh/mcp-tool-shop-org/soundweave/branch/main/graph/badge.svg" alt="Coverage"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue" alt="MIT License"></a>
  <a href="https://mcp-tool-shop-org.github.io/soundweave/"><img src="https://img.shields.io/badge/Landing_Page-live-blue" alt="Landing Page"></a>
</p>

Adaptive soundtrack studio for composing, arranging, scoring, and exporting interactive game music.

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
| [`apps/studio`](apps/studio) | Main authoring UI (Next.js 15, Zustand 5) |
| [`apps/docs`](apps/docs) | Documentation site (Astro) |

### Core Packages

| Package | Description |
|---------|-------------|
| [`@soundweave/schema`](packages/schema) | Canonical types, Zod schemas, parse/validate |
| [`@soundweave/asset-index`](packages/asset-index) | Pack integrity indexing and auditing |
| [`@soundweave/audio-engine`](packages/audio-engine) | Sample playback and voice management |
| [`@soundweave/test-kit`](packages/test-kit) | Fixtures and test utilities |

### Composition and Playback

| Package | Description |
|---------|-------------|
| [`@soundweave/clip-engine`](packages/clip-engine) | Clip sequencing, transforms, cue scheduling |
| [`@soundweave/instrument-rack`](packages/instrument-rack) | Synth and drum voice management with presets |
| [`@soundweave/music-theory`](packages/music-theory) | Scales, chords, motifs, intensity transforms |
| [`@soundweave/playback-engine`](packages/playback-engine) | Real-time playback, mixing, effects, rendering |
| [`@soundweave/sample-lab`](packages/sample-lab) | Trim, slice, kit, instrument helpers |
| [`@soundweave/score-map`](packages/score-map) | Motifs, profiles, cue families, derivation |
| [`@soundweave/automation`](packages/automation) | Lanes, macros, envelopes, capture |
| [`@soundweave/library`](packages/library) | Templates, snapshots, branches, favorites, compare |

### Infrastructure

| Package | Description |
|---------|-------------|
| [`@soundweave/scene-mapper`](packages/scene-mapper) | Trigger mapping and deterministic binding evaluation |
| [`@soundweave/runtime-pack`](packages/runtime-pack) | Runtime export/import with deterministic serialization |
| [`@soundweave/review`](packages/review) | Summaries and audit helpers |
| [`@soundweave/ui`](packages/ui) | Shared UI components |

## Quick Start

```bash
pnpm install
pnpm build
pnpm test       # 299+ tests across all packages
pnpm dev        # Start Studio dev server
```

**Requirements:** Node.js >= 22, pnpm >= 10

## Testing

All packages have unit tests covering schema validation, integrity auditing, sample operations, world scoring, automation, library management, and studio integration.

Run everything: `pnpm test`

## Handbook

The [handbook](handbook/) is the comprehensive operating manual covering product vision, architecture, data model, studio usage, creative workflows, and engineering practices (40 chapters).

## Security and Trust

Soundweave runs **entirely in the browser**. No server, no cloud sync, no telemetry.

- **Data touched:** User-created soundtrack pack files (JSON), audio asset references, browser local storage
- **Data NOT touched:** No server-side storage, no file system access beyond browser sandbox
- **Network:** Zero network egress — all authoring and playback is client-side
- **Secrets:** Does not read, store, or transmit credentials
- **Telemetry:** None collected or sent
- **Permissions:** Standard browser APIs only (Web Audio API)

See [SECURITY.md](SECURITY.md) for vulnerability reporting.

## License

MIT

---

Built by <a href="https://mcp-tool-shop.github.io/">MCP Tool Shop</a>
