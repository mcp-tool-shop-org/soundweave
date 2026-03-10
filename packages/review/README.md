# @soundweave/review

Summary, audit, and rendering utilities for Soundweave soundtrack packs.

## Includes

- top-level pack summaries
- integrity-aware audit findings
- coverage and completeness checks
- markdown and JSON review output

## Main exports

- `summarizePack` — metadata, counts, categories, stem role distribution, unused counts
- `auditPack` — integrity findings + coverage rules (missing scenes, transitions, bindings)
- `renderPackSummaryMarkdown` — stable, human-readable markdown report
- `renderPackSummaryJson` — serializable JSON review object
- `reviewPack` — convenience wrapper: summary + audit in one call

## Scope

This package turns pack structure and integrity information into human-readable review output.
It consumes results from `@soundweave/schema` and `@soundweave/asset-index`.
