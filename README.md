# Soundweave

Adaptive soundtrack studio for authoring loops, stems, scenes, transitions, and trigger-driven music packs for AI RPG worlds.

## Status

Phase 0 — repository foundation.

## What it is

Infrastructure for authored feeling. Soundweave lets designers define musical scenes, map them to runtime triggers, preview adaptive transitions, and export structured soundtrack packs consumable by game engines.

## What it is not

A DAW. A waveform editor. A synth playground. A mastering chain. An "AI writes music for you" button.

## Planned workspaces

### Apps

- `apps/studio` — main authoring UI (Next.js)
- `apps/docs` — documentation site (Astro)

### Packages

- `packages/schema` — types and validators for all Soundweave data
- `packages/asset-index` — asset refs, manifests, validation
- `packages/audio-engine` — playback model, scene switching, transitions, layering
- `packages/scene-mapper` — trigger mapping logic
- `packages/runtime-pack` — export/import soundtrack packs
- `packages/review` — summaries, audits, preview helpers
- `packages/ui` — shared components
- `packages/test-kit` — fixtures, sample packs, contract tests

## Quick start

```bash
pnpm install
pnpm build
pnpm test
pnpm dev
```

## Roadmap

- **Phase 0** — Repository foundation ✓
- **Phase 1** — Schema first
- **Phase 2** — Runtime model
- **Phase 3** — Mapping and review
- **Phase 4** — Studio app
- **Phase 5** — Pack export
- **Phase 6** — Examples and dogfood

## License

MIT
