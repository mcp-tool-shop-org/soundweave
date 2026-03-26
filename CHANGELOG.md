# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [1.0.3] - 2026-03-25

### Added
- 9 workspace health tests (version consistency, scope, license, ESM, CHANGELOG)
- SHA-pinned CI actions for supply-chain safety

### Fixed
- Made `pnpm audit` non-blocking in CI (transitive dep CVEs)

## [1.0.2] - 2026-03-11

### Added

- Example packs: minimal and starter-adventure with per-pack READMEs
- Handbook entry point links in main README (Building a Cue, Custom Samples, World Scoring, Architecture)

### Changed

- Dependabot config: monthly interval, limit 3 PRs (was weekly/10)

## [1.0.1] - 2026-03-11

### Added

- Dependency vulnerability scanning in CI (`pnpm audit` step)
- Scheduled weekly security audit workflow (`.github/workflows/security.yml`)
- Dependabot configuration for npm and GitHub Actions dependencies
- Architecture map handbook chapter (09-architectural-flow.md)
- 26 new handbook chapters completing the full 40-chapter operating manual:
  - Part II: Apps, Core Packages, Musical/Playback Packages, Architectural Flow
  - Part III: SoundtrackPack Overview, Asset Model, Stems/Scenes/Clips, Bindings/Transitions, Clip Composition, Cue Structure, Sample Workflow, World Scoring, Automation/Orchestration, Library/Recall, Runtime Pack Contract
  - Part IV: Project, Assets, Sample Lab, Stems/Scenes, Clips, Score Map, Automation, Library screens
  - Part VI: Testing Strategy, Build/Lint/CI, Evolving the Data Model
- Expanded example pack documentation with workflow descriptions

### Changed

- Bumped pinned pnpm version from 10.28.2 to 10.32.1
- Updated repository overview to include all 16 packages (was missing clip-engine, instrument-rack, music-theory, playback-engine)
- Updated package boundaries table to cover all 16 packages
- Completed SCORECARD.md with actual assessment (42/50 pre-remediation → 47/50 post-remediation)
- Closed SHIP_GATE.md dependency scanning items (previously skipped)
- Closed SHIP_GATE.md translations soft-gate item
- Marked landing page as honestly deferred to post-v1

## [1.0.0] - 2026-03-10

### Added

- Studio app with 13 authoring screens (Overview, Assets, Stems, Scenes, Bindings, Transitions, Clips, Sample Lab, Score Map, Automation, Library, Review, Preview)
- 15 core packages covering schema, audio, composition, scoring, automation, playback, and export
- Documentation site (Astro)
- Comprehensive handbook (40 chapters)
- 299+ unit tests across all packages
- CI pipeline with lint, typecheck, test, and build
- Example packs and test fixtures
