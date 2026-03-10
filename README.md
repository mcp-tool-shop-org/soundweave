# Soundweave

Adaptive soundtrack authoring studio for designing, previewing, and exporting trigger-driven music packs for AI RPG worlds.

## What it does

Soundweave lets designers define musical **scenes**, map them to game-state **trigger bindings**, preview adaptive **transitions**, and export structured **runtime packs** consumable by any game engine.

**The loop:** define assets → wrap them as stems → compose scenes with layered stems → bind scenes to game-state conditions → define transitions between scenes → preview with simulated state → export runtime JSON.

## What it is not

A DAW. A waveform editor. A synth. A mastering chain. An "AI writes music for you" button.

## Monorepo layout

### Apps

| App | Description |
|-----|-------------|
| `apps/studio` | Browser-based authoring UI (Next.js 15, Zustand, dark theme) |
| `apps/docs` | Documentation site (Astro) |

### Packages

| Package | Description |
|---------|-------------|
| `packages/schema` | Canonical types and Zod validators for all Soundweave data |
| `packages/asset-index` | Asset reference management and manifest validation |
| `packages/audio-engine` | Scene evaluation, binding resolution, transition modeling |
| `packages/scene-mapper` | Trigger mapping logic |
| `packages/runtime-pack` | Export/import runtime-ready soundtrack packs |
| `packages/review` | Automated summaries, audits, and pack health checks |
| `packages/ui` | Shared UI components |
| `packages/test-kit` | Fixtures, sample packs, and contract tests |

## Quick start

```bash
git clone https://github.com/mcp-tool-shop-org/soundweave.git
cd soundweave
pnpm install
pnpm build
pnpm dev
```

Open `http://localhost:3000` to launch the studio.

### Run tests

```bash
pnpm test
```

### Typecheck

```bash
pnpm typecheck
```

## Studio features

- **Project** — edit pack metadata (name, version, description, author, tags)
- **Assets** — manage audio file references with kind, duration, BPM, key
- **Stems** — wrap assets with role, gain, loop, and mute settings
- **Scenes** — compose layered stems into musical states with categories and fallbacks
- **Bindings** — map game-state conditions to scenes with priority resolution
- **Transitions** — define how scenes flow into each other (crossfade, stinger, bar-sync, etc.)
- **Review** — automated validation, unused entity detection, integrity checks
- **Preview** — simulate runtime state with manual controls or scripted sequences
- **Export** — validate, preview, copy, and download runtime JSON packs

### Example packs

Three built-in packs loadable via the sidebar pack switcher:

- **Minimal Pack** — 1 asset, 1 stem, 1 scene — the smallest valid pack
- **Starter Adventure Pack** — exploration, tension, combat, victory, safe zone with transitions
- **Combat Escalation Pack** — patrol → skirmish → boss → victory with stinger transitions

## Architecture

```
SoundtrackPack (authoring)
├── meta
├── assets[]        → AudioAsset (src, kind, duration, bpm, key)
├── stems[]         → Stem (assetId, role, gain, loop)
├── scenes[]        → Scene (category, layers[], fallback)
├── bindings[]      → TriggerBinding (conditions[], priority)
└── transitions[]   → TransitionRule (from, to, mode, duration)

RuntimeSoundtrackPack (exported)
└── Same shape, editor-only fields stripped
```

## License

MIT
